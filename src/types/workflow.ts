export interface WorkflowArgument {
  name: string;
  description?: string;
  default_value?: string;
}

export interface Workflow {
  name: string;
  command: string;
  tags?: string[];
  description?: string;
  source_url?: string;
  author?: string;
  author_url?: string;
  shells?: ('zsh' | 'bash' | 'fish')[];
  arguments?: WorkflowArgument[];
}

export interface ParsedWorkflow extends Workflow {
  id: string;
  created_at: Date;
  updated_at: Date;
}