import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, FileText, Code, Play } from 'lucide-react';
import { Workflow, WorkflowArgument } from '@/types/workflow';
import { parseWorkflowYaml, workflowToYaml, validateWorkflow, extractArguments } from '@/utils/workflowUtils';
import { toast } from 'sonner';

interface WorkflowEditorProps {
  workflow?: Workflow;
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}

const SHELL_OPTIONS = ['zsh', 'bash', 'fish'] as const;

export function WorkflowEditor({ workflow, onSave, onCancel }: WorkflowEditorProps) {
  const [activeTab, setActiveTab] = useState('form');
  const [yamlContent, setYamlContent] = useState('');
  const [formData, setFormData] = useState<Workflow>({
    name: '',
    command: '',
    tags: [],
    description: '',
    source_url: '',
    author: '',
    author_url: '',
    shells: [],
    arguments: []
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (workflow) {
      setFormData(workflow);
      setYamlContent(workflowToYaml(workflow));
    }
  }, [workflow]);

  useEffect(() => {
    const validationErrors = validateWorkflow(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleFormChange = (field: keyof Workflow, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setYamlContent(workflowToYaml(newData));
  };

  const handleYamlChange = (value: string) => {
    setYamlContent(value);
    try {
      const parsed = parseWorkflowYaml(value);
      setFormData(parsed);
      setErrors([]);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Invalid YAML']);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      handleFormChange('tags', [...(formData.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFormChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  const addArgument = () => {
    const newArg: WorkflowArgument = { name: '', description: '' };
    handleFormChange('arguments', [...(formData.arguments || []), newArg]);
  };

  const updateArgument = (index: number, field: keyof WorkflowArgument, value: string) => {
    const newArgs = [...(formData.arguments || [])];
    newArgs[index] = { ...newArgs[index], [field]: value };
    handleFormChange('arguments', newArgs);
  };

  const removeArgument = (index: number) => {
    const newArgs = formData.arguments?.filter((_, i) => i !== index) || [];
    handleFormChange('arguments', newArgs);
  };

  const handleShellChange = (shell: string, checked: boolean) => {
    const currentShells = formData.shells || [];
    if (checked) {
      handleFormChange('shells', [...currentShells, shell]);
    } else {
      handleFormChange('shells', currentShells.filter(s => s !== shell));
    }
  };

  const handleSave = () => {
    if (errors.length > 0) {
      toast.error('Please fix validation errors before saving');
      return;
    }
    onSave(formData);
  };

  const commandArguments = extractArguments(formData.command);
  const definedArguments = formData.arguments?.map(arg => arg.name) || [];
  const missingArguments = commandArguments.filter(arg => !definedArguments.includes(arg));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {workflow ? 'Edit Workflow' : 'Create New Workflow'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={errors.length > 0}>
            Save Workflow
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Validation Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-destructive">{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Form Editor
          </TabsTrigger>
          <TabsTrigger value="yaml" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            YAML Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Describe what this workflow does"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author || ''}
                  onChange={(e) => handleFormChange('author', e.target.value)}
                  placeholder="Author name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_url">Author URL</Label>
                <Input
                  id="author_url"
                  type="url"
                  value={formData.author_url || ''}
                  onChange={(e) => handleFormChange('author_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source_url">Source URL</Label>
                <Input
                  id="source_url"
                  type="url"
                  value={formData.source_url || ''}
                  onChange={(e) => handleFormChange('source_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Compatible Shells</Label>
                <div className="space-y-2">
                  {SHELL_OPTIONS.map((shell) => (
                    <div key={shell} className="flex items-center space-x-2">
                      <Checkbox
                        id={shell}
                        checked={formData.shells?.includes(shell) || false}
                        onCheckedChange={(checked) => handleShellChange(shell, checked as boolean)}
                      />
                      <Label htmlFor={shell}>{shell}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="command">Command *</Label>
            <Textarea
              id="command"
              value={formData.command}
              onChange={(e) => handleFormChange('command', e.target.value)}
              placeholder="Enter the command with {{argument}} placeholders"
              rows={6}
              className="font-mono"
            />
            {commandArguments.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Detected arguments: {commandArguments.map(arg => `{{${arg}}}`).join(', ')}
              </div>
            )}
            {missingArguments.length > 0 && (
              <div className="text-sm text-destructive">
                Missing argument definitions: {missingArguments.join(', ')}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Arguments</Label>
              <Button type="button" size="sm" onClick={addArgument}>
                <Plus className="h-4 w-4 mr-2" />
                Add Argument
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.arguments?.map((arg, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`arg-name-${index}`}>Name</Label>
                        <Input
                          id={`arg-name-${index}`}
                          value={arg.name}
                          onChange={(e) => updateArgument(index, 'name', e.target.value)}
                          placeholder="Argument name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`arg-desc-${index}`}>Description</Label>
                        <Input
                          id={`arg-desc-${index}`}
                          value={arg.description || ''}
                          onChange={(e) => updateArgument(index, 'description', e.target.value)}
                          placeholder="Argument description"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`arg-default-${index}`}>Default Value</Label>
                          <Input
                            id={`arg-default-${index}`}
                            value={arg.default_value || ''}
                            onChange={(e) => updateArgument(index, 'default_value', e.target.value)}
                            placeholder="Default value"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeArgument(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="yaml" className="space-y-4">
          <div>
            <Label htmlFor="yaml-editor">YAML Content</Label>
            <Textarea
              id="yaml-editor"
              value={yamlContent}
              onChange={(e) => handleYamlChange(e.target.value)}
              rows={20}
              className="font-mono text-sm"
              placeholder="Enter YAML workflow definition..."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}