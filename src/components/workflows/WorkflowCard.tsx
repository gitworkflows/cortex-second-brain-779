import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Play, Edit, ExternalLink, User, Terminal } from 'lucide-react';
import { ParsedWorkflow } from '@/types/workflow';
import { extractArguments, replaceArguments } from '@/utils/workflowUtils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WorkflowCardProps {
  workflow: ParsedWorkflow;
  onEdit?: (workflow: ParsedWorkflow) => void;
}

export function WorkflowCard({ workflow, onEdit }: WorkflowCardProps) {
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [argumentValues, setArgumentValues] = useState<Record<string, string>>({});
  const [finalCommand, setFinalCommand] = useState('');

  const commandArguments = extractArguments(workflow.command);

  const handleExecute = () => {
    // Initialize argument values with defaults
    const initialValues: Record<string, string> = {};
    workflow.arguments?.forEach(arg => {
      if (arg.default_value) {
        initialValues[arg.name] = arg.default_value;
      }
    });
    setArgumentValues(initialValues);
    setFinalCommand(workflow.command);
    setShowExecuteDialog(true);
  };

  const handleArgumentChange = (argName: string, value: string) => {
    const newValues = { ...argumentValues, [argName]: value };
    setArgumentValues(newValues);
    setFinalCommand(replaceArguments(workflow.command, newValues));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const executeCommand = () => {
    const command = replaceArguments(workflow.command, argumentValues);
    copyToClipboard(command);
    setShowExecuteDialog(false);
    toast.success('Command copied to clipboard - paste in your terminal');
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg">{workflow.name}</CardTitle>
              {workflow.description && (
                <CardDescription>{workflow.description}</CardDescription>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="outline" onClick={handleExecute}>
                <Play className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => copyToClipboard(workflow.command)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(workflow)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm font-mono break-all">{workflow.command}</code>
          </div>
          
          {workflow.tags && workflow.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workflow.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {workflow.shells && workflow.shells.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Terminal className="h-4 w-4" />
              <span>Compatible: {workflow.shells.join(', ')}</span>
            </div>
          )}
          
          {workflow.arguments && workflow.arguments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Arguments:</h4>
              <div className="space-y-1">
                {workflow.arguments.map((arg, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-mono text-primary">{`{{${arg.name}}}`}</span>
                    {arg.description && (
                      <span className="text-muted-foreground ml-2">- {arg.description}</span>
                    )}
                    {arg.default_value && (
                      <span className="text-xs text-muted-foreground ml-2">(default: {arg.default_value})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-4">
              {workflow.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {workflow.author_url ? (
                    <a 
                      href={workflow.author_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      {workflow.author}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span>{workflow.author}</span>
                  )}
                </div>
              )}
              {workflow.source_url && (
                <a 
                  href={workflow.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  Source
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <span>Updated {workflow.updated_at.toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execute Workflow</DialogTitle>
            <DialogDescription>
              Fill in the required arguments for "{workflow.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {commandArguments.map((argName) => {
              const argDef = workflow.arguments?.find(a => a.name === argName);
              return (
                <div key={argName} className="space-y-2">
                  <Label htmlFor={argName}>
                    {argName}
                    {argDef?.description && (
                      <span className="text-sm text-muted-foreground ml-2">
                        - {argDef.description}
                      </span>
                    )}
                  </Label>
                  <Input
                    id={argName}
                    value={argumentValues[argName] || ''}
                    onChange={(e) => handleArgumentChange(argName, e.target.value)}
                    placeholder={argDef?.default_value || `Enter ${argName}`}
                  />
                </div>
              );
            })}
            
            <div className="space-y-2">
              <Label>Final Command</Label>
              <Textarea
                value={finalCommand}
                readOnly
                className="font-mono text-sm bg-muted"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExecuteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={executeCommand}>
                <Copy className="h-4 w-4 mr-2" />
                Copy & Execute
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}