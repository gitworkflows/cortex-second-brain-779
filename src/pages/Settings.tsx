
import React, { useState } from 'react';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useAnimateIn } from '@/lib/animations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';
import { Save, RefreshCw } from 'lucide-react';

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
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
