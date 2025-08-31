
import React, { useState } from 'react';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useAnimateIn } from '@/lib/animations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from '@/contexts/ThemeContext';
import { Save, RefreshCw, Brain, Key, Zap, Globe, Download } from 'lucide-react';

const Settings = () => {
  const showContent = useAnimateIn(false, 300);
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    aiSuggestions: true,
    animations: true,
    compactView: false,
    googleDrive: false,
    notion: false,
    github: false
  });

  // AI Model configuration
  const [aiConfig, setAiConfig] = useState({
    selectedProvider: 'anthropic' as 'anthropic' | 'openai' | 'perplexity' | 'local',
    selectedModel: 'claude-sonnet-4-20250514',
    apiKeys: {
      anthropic: '',
      openai: '',
      perplexity: ''
    },
    localModels: {
      enabled: false,
      useWebGPU: true,
      selectedEmbeddingModel: 'mixedbread-ai/mxbai-embed-xsmall-v1',
      selectedWhisperModel: 'onnx-community/whisper-tiny.en'
    }
  });

  // Top AI Models by provider
  const aiModels = {
    anthropic: [
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: 'Most capable and intelligent', badge: 'Latest' },
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'High performance with exceptional reasoning', badge: 'Recommended' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fastest model for quick responses', badge: 'Fast' },
      { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', description: 'Extended thinking capabilities', badge: 'Extended' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Previous intelligent model', badge: 'Previous' }
    ],
    openai: [
      { id: 'gpt-5-2025-08-07', name: 'GPT-5', description: 'Flagship model with best performance', badge: 'Flagship' },
      { id: 'gpt-5-mini-2025-08-07', name: 'GPT-5 Mini', description: 'Faster, cost-efficient GPT-5', badge: 'Fast' },
      { id: 'gpt-5-nano-2025-08-07', name: 'GPT-5 Nano', description: 'Fastest, cheapest GPT-5', badge: 'Fastest' },
      { id: 'o3-2025-04-16', name: 'O3', description: 'Powerful reasoning model', badge: 'Reasoning' },
      { id: 'o4-mini-2025-04-16', name: 'O4 Mini', description: 'Fast reasoning model', badge: 'Fast Reasoning' },
      { id: 'gpt-4.1-2025-04-14', name: 'GPT-4.1', description: 'Reliable GPT-4 flagship', badge: 'Reliable' },
      { id: 'gpt-4.1-mini-2025-04-14', name: 'GPT-4.1 Mini', description: 'Efficient with vision', badge: 'Vision' }
    ],
    perplexity: [
      { id: 'llama-3.1-sonar-small-128k-online', name: 'Llama 3.1 Sonar Small', description: '8B parameters, real-time search', badge: 'Online' },
      { id: 'llama-3.1-sonar-large-128k-online', name: 'Llama 3.1 Sonar Large', description: '70B parameters, advanced search', badge: 'Large' },
      { id: 'llama-3.1-sonar-huge-128k-online', name: 'Llama 3.1 Sonar Huge', description: '405B parameters, most powerful', badge: 'Huge' }
    ],
    local: [
      { id: 'whisper-tiny', name: 'Whisper Tiny', description: 'Speech recognition in browser', badge: 'Speech' },
      { id: 'mxbai-embed', name: 'MxBai Embeddings', description: 'Text embeddings on WebGPU', badge: 'Embeddings' },
      { id: 'mobilenet', name: 'MobileNet V4', description: 'Image classification', badge: 'Vision' }
    ]
  };
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateAiConfig = (updates: Partial<typeof aiConfig>) => {
    setAiConfig(prev => ({ ...prev, ...updates }));
  };

  const updateApiKey = (provider: keyof typeof aiConfig.apiKeys, key: string) => {
    setAiConfig(prev => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, [provider]: key }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Settings saved:', settings);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      autoSave: true,
      notifications: true,
      aiSuggestions: true,
      animations: true,
      compactView: false,
      googleDrive: false,
      notion: false,
      github: false
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
      <AnimatedTransition show={showContent} animation="slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize your digital second brain
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="ai-models">AI Models</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-save" className="text-base">Auto-save</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save changes as you work
                      </p>
                    </div>
                    <Switch 
                      id="auto-save" 
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="text-base">Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about updates and activity
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={settings.notifications}
                      onCheckedChange={(checked) => updateSetting('notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ai-suggestions" className="text-base">AI Suggestions</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to provide content suggestions
                      </p>
                    </div>
                    <Switch 
                      id="ai-suggestions" 
                      checked={settings.aiSuggestions}
                      onCheckedChange={(checked) => updateSetting('aiSuggestions', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how your second brain looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations" className="text-base">Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch 
                      id="animations" 
                      checked={settings.animations}
                      onCheckedChange={(checked) => updateSetting('animations', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-view" className="text-base">Compact View</Label>
                      <p className="text-sm text-muted-foreground">
                        Display more content with less spacing
                      </p>
                    </div>
                    <Switch 
                      id="compact-view" 
                      checked={settings.compactView}
                      onCheckedChange={(checked) => updateSetting('compactView', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-models">
              <div className="space-y-6">
                {/* Provider Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Provider
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred AI provider and model
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {(['anthropic', 'openai', 'perplexity', 'local'] as const).map((provider) => (
                        <Card 
                          key={provider}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            aiConfig.selectedProvider === provider 
                              ? 'ring-2 ring-primary shadow-sm' 
                              : 'hover:border-primary/20'
                          }`}
                          onClick={() => updateAiConfig({ 
                            selectedProvider: provider,
                            selectedModel: aiModels[provider][0]?.id || ''
                          })}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {provider === 'anthropic' && <Brain className="h-8 w-8 text-purple-500" />}
                              {provider === 'openai' && <Zap className="h-8 w-8 text-green-500" />}
                              {provider === 'perplexity' && <Globe className="h-8 w-8 text-blue-500" />}
                              {provider === 'local' && <Download className="h-8 w-8 text-orange-500" />}
                              <span className="font-medium capitalize">{provider}</span>
                              <Badge variant={aiConfig.selectedProvider === provider ? 'default' : 'secondary'}>
                                {aiModels[provider].length} models
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Model Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Models</CardTitle>
                    <CardDescription>
                      Select from {aiConfig.selectedProvider} models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiModels[aiConfig.selectedProvider].map((model) => (
                        <Card 
                          key={model.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                            aiConfig.selectedModel === model.id 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:border-primary/20'
                          }`}
                          onClick={() => updateAiConfig({ selectedModel: model.id })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{model.name}</h4>
                                  <Badge variant="secondary">{model.badge}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{model.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* API Keys */}
                {aiConfig.selectedProvider !== 'local' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure your API keys for {aiConfig.selectedProvider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${aiConfig.selectedProvider}-key`}>
                          {aiConfig.selectedProvider.charAt(0).toUpperCase() + aiConfig.selectedProvider.slice(1)} API Key
                        </Label>
                        <Input
                          id={`${aiConfig.selectedProvider}-key`}
                          type="password"
                          placeholder="Enter your API key..."
                          value={aiConfig.apiKeys[aiConfig.selectedProvider as keyof typeof aiConfig.apiKeys]}
                          onChange={(e) => updateApiKey(aiConfig.selectedProvider as keyof typeof aiConfig.apiKeys, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Your API key is stored securely and never shared
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Local Models Configuration */}
                {aiConfig.selectedProvider === 'local' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Local Models Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure browser-based AI models using WebGPU
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="local-enabled" className="text-base">Enable Local Models</Label>
                          <p className="text-sm text-muted-foreground">
                            Run AI models directly in your browser
                          </p>
                        </div>
                        <Switch 
                          id="local-enabled"
                          checked={aiConfig.localModels.enabled}
                          onCheckedChange={(checked) => 
                            updateAiConfig({ 
                              localModels: { ...aiConfig.localModels, enabled: checked }
                            })
                          }
                        />
                      </div>

                      {aiConfig.localModels.enabled && (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="webgpu" className="text-base">Use WebGPU</Label>
                              <p className="text-sm text-muted-foreground">
                                Enable GPU acceleration for faster inference
                              </p>
                            </div>
                            <Switch 
                              id="webgpu"
                              checked={aiConfig.localModels.useWebGPU}
                              onCheckedChange={(checked) => 
                                updateAiConfig({ 
                                  localModels: { ...aiConfig.localModels, useWebGPU: checked }
                                })
                              }
                            />
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label>Text Embedding Model</Label>
                              <Select 
                                value={aiConfig.localModels.selectedEmbeddingModel}
                                onValueChange={(value) => 
                                  updateAiConfig({ 
                                    localModels: { ...aiConfig.localModels, selectedEmbeddingModel: value }
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mixedbread-ai/mxbai-embed-xsmall-v1">MxBai Embed XSmall</SelectItem>
                                  <SelectItem value="sentence-transformers/all-MiniLM-L6-v2">All MiniLM L6 V2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Speech Recognition Model</Label>
                              <Select 
                                value={aiConfig.localModels.selectedWhisperModel}
                                onValueChange={(value) => 
                                  updateAiConfig({ 
                                    localModels: { ...aiConfig.localModels, selectedWhisperModel: value }
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="onnx-community/whisper-tiny.en">Whisper Tiny EN</SelectItem>
                                  <SelectItem value="onnx-community/whisper-small.en">Whisper Small EN</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect your second brain with external services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="google-drive" className="text-base">Google Drive</Label>
                      <p className="text-sm text-muted-foreground">
                        Import and sync files from Google Drive
                      </p>
                    </div>
                    <Switch 
                      id="google-drive" 
                      checked={settings.googleDrive}
                      onCheckedChange={(checked) => updateSetting('googleDrive', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notion" className="text-base">Notion</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync with your Notion workspaces
                      </p>
                    </div>
                    <Switch 
                      id="notion" 
                      checked={settings.notion}
                      onCheckedChange={(checked) => updateSetting('notion', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="github" className="text-base">GitHub</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect to your GitHub repositories
                      </p>
                    </div>
                    <Switch 
                      id="github" 
                      checked={settings.github}
                      onCheckedChange={(checked) => updateSetting('github', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Save/Reset Actions */}
          <div className="flex justify-end gap-3 mt-8 p-4 bg-muted/30 rounded-lg">
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
              disabled={isSaving}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className={isSaving ? 'animate-pulse' : ''}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default Settings;
