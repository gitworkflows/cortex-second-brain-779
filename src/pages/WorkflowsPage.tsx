import React, { useState } from 'react';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useAnimateIn } from '@/lib/animations';
import { WorkflowList } from '@/components/workflows/WorkflowList';
import { WorkflowEditor } from '@/components/workflows/WorkflowEditor';
import { ParsedWorkflow, Workflow } from '@/types/workflow';
import { mockWorkflows } from '@/utils/workflowUtils';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

type ViewMode = 'list' | 'create' | 'edit';

const WorkflowsPage = () => {
  const showContent = useAnimateIn(false, 300);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [workflows, setWorkflows] = useState<ParsedWorkflow[]>(mockWorkflows);
  const [editingWorkflow, setEditingWorkflow] = useState<ParsedWorkflow | null>(null);

  const handleCreateNew = () => {
    setEditingWorkflow(null);
    setViewMode('create');
  };

  const handleEditWorkflow = (workflow: ParsedWorkflow) => {
    setEditingWorkflow(workflow);
    setViewMode('edit');
  };

  const handleSaveWorkflow = (workflowData: Workflow) => {
    if (editingWorkflow) {
      // Update existing workflow
      const updatedWorkflow: ParsedWorkflow = {
        ...workflowData,
        id: editingWorkflow.id,
        created_at: editingWorkflow.created_at,
        updated_at: new Date()
      };
      setWorkflows(prev => prev.map(w => w.id === editingWorkflow.id ? updatedWorkflow : w));
      toast.success('Workflow updated successfully');
    } else {
      // Create new workflow
      const newWorkflow: ParsedWorkflow = {
        ...workflowData,
        id: Date.now().toString(),
        created_at: new Date(),
        updated_at: new Date()
      };
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast.success('Workflow created successfully');
    }
    setViewMode('list');
    setEditingWorkflow(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingWorkflow(null);
  };

  return (
    <div className="max-w-7xl mx-auto h-screen pt-24 pb-6 px-4">
      <Toaster position="top-right" />
      <AnimatedTransition show={showContent} animation="slide-up">
        {viewMode === 'list' ? (
          <WorkflowList
            workflows={workflows}
            onCreateNew={handleCreateNew}
            onEditWorkflow={handleEditWorkflow}
          />
        ) : (
          <WorkflowEditor
            workflow={editingWorkflow || undefined}
            onSave={handleSaveWorkflow}
            onCancel={handleCancel}
          />
        )}
      </AnimatedTransition>
    </div>
  );
};

export default WorkflowsPage;