import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MindMapNode as MindMapNodeType } from '@/types/mindmap';
import { Plus, Edit3, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MindMapNodeProps {
  node: MindMapNodeType;
  isRoot?: boolean;
  onUpdate: (nodeId: string, updates: Partial<MindMapNodeType>) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (nodeId: string) => void;
  onToggleExpanded: (nodeId: string) => void;
}

const colorClasses = {
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-700 dark:text-green-300',
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
  rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300',
  orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-700 dark:text-orange-300',
  indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300',
};

export const MindMapNode: React.FC<MindMapNodeProps> = ({
  node,
  isRoot = false,
  onUpdate,
  onAddChild,
  onDelete,
  onToggleExpanded
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [editText, setEditText] = useState(node.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (node.isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [node.isEditing]);

  const handleEdit = () => {
    onUpdate(node.id, { isEditing: true });
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(node.id, { title: editText.trim(), isEditing: false });
    } else {
      setEditText(node.title);
      onUpdate(node.id, { isEditing: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(node.title);
      onUpdate(node.id, { isEditing: false });
    }
  };

  const nodeSize = isRoot ? 'min-w-[200px] min-h-[80px]' : 'min-w-[150px] min-h-[60px]';
  const fontSize = isRoot ? 'text-lg font-bold' : node.level === 1 ? 'text-base font-semibold' : 'text-sm';

  return (
    <div
      className="absolute"
      style={{ left: node.x, top: node.y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative rounded-xl border-2 backdrop-blur-sm transition-all duration-300 flex items-center justify-center p-4 cursor-pointer",
          "bg-gradient-to-br shadow-lg hover:shadow-xl",
          nodeSize,
          colorClasses[node.color as keyof typeof colorClasses],
          isHovered && "scale-105",
          node.isEditing && "ring-2 ring-primary/50"
        )}
      >
        {/* Expand/Collapse button for nodes with children */}
        {node.children.length > 0 && !isRoot && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full p-0 bg-background border border-border hover:bg-muted"
            onClick={() => onToggleExpanded(node.id)}
          >
            {node.isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </Button>
        )}

        {/* Node content */}
        {node.isEditing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="bg-transparent border-none outline-none text-center w-full font-inherit"
          />
        ) : (
          <span className={cn("text-center", fontSize)}>
            {node.title}
          </span>
        )}

        {/* Action buttons */}
        {isHovered && !node.isEditing && (
          <div className="absolute -top-2 -right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="w-6 h-6 rounded-full p-0"
              onClick={() => onAddChild(node.id)}
            >
              <Plus className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-6 h-6 rounded-full p-0"
              onClick={handleEdit}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            {!isRoot && (
              <Button
                size="sm"
                variant="destructive"
                className="w-6 h-6 rounded-full p-0"
                onClick={() => onDelete(node.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};