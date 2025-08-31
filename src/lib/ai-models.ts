export interface AIModel {
  id: string;
  name: string;
  description: string;
  badge: string;
  provider: 'anthropic' | 'openai' | 'perplexity' | 'local';
  contextWindow?: number;
  pricing?: {
    input: number;
    output: number;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  requiresApiKey: boolean;
  models: AIModel[];
}

export const AI_PROVIDERS: Record<string, AIProvider> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models with exceptional reasoning capabilities',
    baseUrl: 'https://api.anthropic.com/v1',
    requiresApiKey: true,
    models: [
      {
        id: 'claude-opus-4-20250514',
        name: 'Claude Opus 4',
        description: 'Most capable and intelligent model with superior reasoning',
        badge: 'Latest',
        provider: 'anthropic',
        contextWindow: 200000,
        pricing: { input: 15, output: 75 }
      },
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        description: 'High-performance model with exceptional reasoning and efficiency',
        badge: 'Recommended',
        provider: 'anthropic',
        contextWindow: 200000,
        pricing: { input: 3, output: 15 }
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: 'Fastest model for quick responses',
        badge: 'Fast',
        provider: 'anthropic',
        contextWindow: 200000,
        pricing: { input: 0.25, output: 1.25 }
      }
    ]
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT models including latest GPT-5 and reasoning models',
    baseUrl: 'https://api.openai.com/v1',
    requiresApiKey: true,
    models: [
      {
        id: 'gpt-5-2025-08-07',
        name: 'GPT-5',
        description: 'Flagship model with best performance',
        badge: 'Flagship',
        provider: 'openai',
        contextWindow: 128000,
        pricing: { input: 10, output: 30 }
      },
      {
        id: 'gpt-5-mini-2025-08-07',
        name: 'GPT-5 Mini',
        description: 'Faster, cost-efficient version of GPT-5',
        badge: 'Fast',
        provider: 'openai',
        contextWindow: 128000,
        pricing: { input: 2, output: 10 }
      },
      {
        id: 'o3-2025-04-16',
        name: 'O3',
        description: 'Very powerful reasoning model for complex analysis',
        badge: 'Reasoning',
        provider: 'openai',
        contextWindow: 128000,
        pricing: { input: 15, output: 60 }
      }
    ]
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Online models with real-time search capabilities',
    baseUrl: 'https://api.perplexity.ai',
    requiresApiKey: true,
    models: [
      {
        id: 'llama-3.1-sonar-small-128k-online',
        name: 'Llama 3.1 Sonar Small',
        description: '8B parameters with real-time search',
        badge: 'Online',
        provider: 'perplexity',
        contextWindow: 127072,
        pricing: { input: 0.2, output: 0.2 }
      },
      {
        id: 'llama-3.1-sonar-large-128k-online',
        name: 'Llama 3.1 Sonar Large',
        description: '70B parameters with advanced search',
        badge: 'Large',
        provider: 'perplexity',
        contextWindow: 127072,
        pricing: { input: 1, output: 1 }
      },
      {
        id: 'llama-3.1-sonar-huge-128k-online',
        name: 'Llama 3.1 Sonar Huge',
        description: '405B parameters, most powerful with search',
        badge: 'Huge',
        provider: 'perplexity',
        contextWindow: 127072,
        pricing: { input: 5, output: 5 }
      }
    ]
  },
  local: {
    id: 'local',
    name: 'Local Models',
    description: 'Browser-based models using WebGPU/WebAssembly',
    baseUrl: '',
    requiresApiKey: false,
    models: [
      {
        id: 'whisper-tiny-en',
        name: 'Whisper Tiny EN',
        description: 'Speech recognition in browser',
        badge: 'Speech',
        provider: 'local'
      },
      {
        id: 'mxbai-embed-xsmall',
        name: 'MxBai Embeddings XSmall',
        description: 'Text embeddings on WebGPU',
        badge: 'Embeddings',
        provider: 'local'
      },
      {
        id: 'mobilenet-v4',
        name: 'MobileNet V4',
        description: 'Image classification in browser',
        badge: 'Vision',
        provider: 'local'
      }
    ]
  }
};

export const getModelsByProvider = (providerId: string): AIModel[] => {
  return AI_PROVIDERS[providerId]?.models || [];
};

export const getProviderById = (providerId: string): AIProvider | undefined => {
  return AI_PROVIDERS[providerId];
};

export const getAllModels = (): AIModel[] => {
  return Object.values(AI_PROVIDERS).flatMap(provider => provider.models);
};

export const getModelById = (modelId: string): AIModel | undefined => {
  return getAllModels().find(model => model.id === modelId);
};

// Helper for API calls
export const createApiHeaders = (provider: string, apiKey: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  switch (provider) {
    case 'anthropic':
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      break;
    case 'openai':
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    case 'perplexity':
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
  }

  return headers;
};