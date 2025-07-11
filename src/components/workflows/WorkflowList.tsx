import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, X } from 'lucide-react';
import { ParsedWorkflow } from '@/types/workflow';
import { WorkflowCard } from './WorkflowCard';

interface WorkflowListProps {
  workflows: ParsedWorkflow[];
  onCreateNew: () => void;
  onEditWorkflow: (workflow: ParsedWorkflow) => void;
}

export function WorkflowList({ workflows, onCreateNew, onEditWorkflow }: WorkflowListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedShell, setSelectedShell] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created'>('updated');

  // Extract all unique tags from workflows
  const allTags = Array.from(new Set(workflows.flatMap(w => w.tags || [])));
  const allShells = Array.from(new Set(workflows.flatMap(w => w.shells || [])));

  const filteredWorkflows = workflows
    .filter(workflow => {
      // Search in name, description, command, and tags
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        workflow.name.toLowerCase().includes(searchLower) ||
        workflow.description?.toLowerCase().includes(searchLower) ||
        workflow.command.toLowerCase().includes(searchLower) ||
        workflow.tags?.some(tag => tag.toLowerCase().includes(searchLower));

      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => workflow.tags?.includes(tag));

      // Filter by shell
      const matchesShell = selectedShell === 'all' || 
        !workflow.shells || 
        workflow.shells.length === 0 || 
        workflow.shells.includes(selectedShell as any);

      return matchesSearch && matchesTags && matchesShell;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return b.created_at.getTime() - a.created_at.getTime();
        case 'updated':
        default:
          return b.updated_at.getTime() - a.updated_at.getTime();
      }
    });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedShell('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search and Sort */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedShell} onValueChange={setSelectedShell}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Shell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shells</SelectItem>
                  {allShells.map(shell => (
                    <SelectItem key={shell} value={shell}>
                      {shell}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tag filters */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter by tags:</span>
                  {(selectedTags.length > 0 || searchQuery || selectedShell !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-auto p-1"
                    >
                      <X className="h-3 w-3" />
                      Clear filters
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer transition-colors hover:bg-primary/10"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredWorkflows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {workflows.length === 0 
                  ? "No workflows yet. Create your first workflow to get started!"
                  : "No workflows match your current filters."
                }
              </p>
              {workflows.length === 0 && (
                <Button className="mt-4" onClick={onCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Workflow
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredWorkflows.map(workflow => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onEdit={onEditWorkflow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}