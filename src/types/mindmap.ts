export interface MindMapNode {
  id: string;
  title: string;
  content?: string;
  x: number;
  y: number;
  parentId?: string;
  children: string[];
  level: number;
  color: string;
  isEditing?: boolean;
  isExpanded?: boolean;
}

export interface MindMapData {
  id: string;
  title: string;
  nodes: { [key: string]: MindMapNode };
  rootNodeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MindMapColors = 
  | 'blue' 
  | 'purple' 
  | 'green' 
  | 'amber' 
  | 'rose' 
  | 'cyan' 
  | 'orange' 
  | 'indigo';