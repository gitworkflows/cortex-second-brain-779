import { useState, useCallback } from 'react';
import { 
  pipeline, 
  Pipeline, 
  FeatureExtractionPipeline,
  AutomaticSpeechRecognitionPipeline, 
  ImageClassificationPipeline,
  PipelineType
} from '@huggingface/transformers';

interface UseAIConfig {
  provider: 'anthropic' | 'openai' | 'perplexity' | 'local';
  model: string;
  apiKey?: string;
  useWebGPU?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPipelines, setLocalPipelines] = useState<Record<string, any>>({});

  // Initialize local pipeline
  const initializeLocalPipeline = useCallback(async (
    task: PipelineType, 
    model: string, 
    useWebGPU: boolean = true
  ) => {
    try {
      if (localPipelines[model]) {
        return localPipelines[model];
      }

      const pipe = await pipeline(task, model, {
        device: useWebGPU ? 'webgpu' : 'cpu'
      });

      setLocalPipelines(prev => ({ ...prev, [model]: pipe }));
      return pipe;
    } catch (error) {
      console.error('Failed to initialize local pipeline:', error);
      throw new Error(`Failed to load model: ${model}`);
    }
  }, [localPipelines]);

  // Chat completion for cloud providers
  const chatCompletion = useCallback(async (
    config: UseAIConfig,
    messages: ChatMessage[],
    options: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    } = {}
  ): Promise<AIResponse> => {
    if (config.provider === 'local') {
      throw new Error('Use local methods for local models');
    }

    if (!config.apiKey) {
      throw new Error(`API key required for ${config.provider}`);
    }

    setIsLoading(true);
    setError(null);

    try {
      let url: string;
      let headers: Record<string, string>;
      let body: any;

      switch (config.provider) {
        case 'anthropic':
          url = 'https://api.anthropic.com/v1/messages';
          headers = {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
          };
          body = {
            model: config.model,
            messages: messages.filter(m => m.role !== 'system'),
            system: messages.find(m => m.role === 'system')?.content,
            max_tokens: options.maxTokens || 4000,
            temperature: options.temperature || 0.7
          };
          break;

        case 'openai':
          url = 'https://api.openai.com/v1/chat/completions';
          headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          };
          body = {
            model: config.model,
            messages,
            max_tokens: options.maxTokens || 4000,
            temperature: options.temperature || 0.7,
            top_p: options.topP || 1
          };
          break;

        case 'perplexity':
          url = 'https://api.perplexity.ai/chat/completions';
          headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          };
          body = {
            model: config.model,
            messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.2,
            top_p: options.topP || 0.9,
            return_images: false,
            return_related_questions: false,
            search_recency_filter: 'month',
            frequency_penalty: 1,
            presence_penalty: 0
          };
          break;

        default:
          throw new Error(`Unsupported provider: ${config.provider}`);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      let content: string;
      let usage: AIResponse['usage'];

      switch (config.provider) {
        case 'anthropic':
          content = data.content?.[0]?.text || '';
          usage = data.usage ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens
          } : undefined;
          break;

        case 'openai':
        case 'perplexity':
          content = data.choices?.[0]?.message?.content || '';
          usage = data.usage ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens
          } : undefined;
          break;

        default:
          content = '';
      }

      return { content, usage };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Text embeddings using local models
  const generateEmbeddings = useCallback(async (
    texts: string[],
    model: string = 'mixedbread-ai/mxbai-embed-xsmall-v1',
    useWebGPU: boolean = true
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const extractor = await initializeLocalPipeline('feature-extraction', model, useWebGPU) as FeatureExtractionPipeline;
      const embeddings = await extractor(texts, { 
        pooling: 'mean', 
        normalize: true 
      });
      
      return embeddings.tolist();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate embeddings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [initializeLocalPipeline]);

  // Speech recognition using Whisper
  const transcribeAudio = useCallback(async (
    audioUrl: string,
    model: string = 'onnx-community/whisper-tiny.en',
    useWebGPU: boolean = true
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const transcriber = await initializeLocalPipeline('automatic-speech-recognition', model, useWebGPU) as AutomaticSpeechRecognitionPipeline;
      const result = await transcriber(audioUrl);
      
      // Handle both single result and array of results
      const text = Array.isArray(result) ? result[0]?.text : result.text;
      return text || '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transcribe audio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [initializeLocalPipeline]);

  // Image classification
  const classifyImage = useCallback(async (
    imageUrl: string,
    model: string = 'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
    useWebGPU: boolean = true
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const classifier = await initializeLocalPipeline('image-classification', model, useWebGPU) as ImageClassificationPipeline;
      const results = await classifier(imageUrl);
      
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to classify image';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [initializeLocalPipeline]);

  return {
    isLoading,
    error,
    chatCompletion,
    generateEmbeddings,
    transcribeAudio,
    classifyImage,
    clearError: () => setError(null)
  };
};

export default useAI;