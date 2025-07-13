import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MindMapNode as MindMapNodeComponent } from './MindMapNode';
import { MindMapNode, MindMapData, MindMapColors } from '@/types/mindmap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Palette, Download, Upload, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const colors: MindMapColors[] = ['blue', 'purple', 'green', 'amber', 'rose', 'cyan', 'orange', 'indigo'];

const colorPreview = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
  orange: 'bg-orange-500',
  indigo: 'bg-indigo-500',
};

export const MindMapCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mindMap, setMindMap] = useState<MindMapData>({
    id: '1',
    title: 'My Mind Map',
    nodes: {
      'root': {
        id: 'root',
        title: 'Main Idea',
        x: 400,
        y: 300,
        level: 0,
        children: [],
        color: 'blue',
        isExpanded: true
      }
    },
    rootNodeId: 'root',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [selectedColor, setSelectedColor] = useState<MindMapColors>('purple');
  const [zoom, setZoom] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const calculateChildPosition = (parentNode: MindMapNode, childIndex: number, totalChildren: number) => {
    const radius = 150 + (parentNode.level * 50);
    const angleStep = (2 * Math.PI) / Math.max(totalChildren, 3);
    const angle = angleStep * childIndex - Math.PI / 2;
    
    return {
      x: parentNode.x + Math.cos(angle) * radius,
      y: parentNode.y + Math.sin(angle) * radius
    };
  };

  const addChildNode = useCallback((parentId: string) => {
    const parentNode = mindMap.nodes[parentId];
    if (!parentNode) return;

    const childId = generateNodeId();
    const childIndex = parentNode.children.length;
    const position = calculateChildPosition(parentNode, childIndex, parentNode.children.length + 1);

    const newNode: MindMapNode = {
      id: childId,
      title: 'New Idea',
      x: position.x,
      y: position.y,
      parentId: parentId,
      children: [],
      level: parentNode.level + 1,
      color: selectedColor,
      isEditing: true,
      isExpanded: true
    };

    setMindMap(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [childId]: newNode,
        [parentId]: {
          ...parentNode,
          children: [...parentNode.children, childId],
          isExpanded: true
        }
      },
      updatedAt: new Date()
    }));
  }, [mindMap.nodes, selectedColor]);

  const updateNode = useCallback((nodeId: string, updates: Partial<MindMapNode>) => {
    setMindMap(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: {
          ...prev.nodes[nodeId],
          ...updates
        }
      },
      updatedAt: new Date()
    }));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = mindMap.nodes[nodeId];
    if (!nodeToDelete || nodeId === mindMap.rootNodeId) return;

    // Recursively collect all descendant nodes
    const collectDescendants = (id: string): string[] => {
      const node = mindMap.nodes[id];
      if (!node) return [];
      
      let descendants = [id];
      node.children.forEach(childId => {
        descendants = descendants.concat(collectDescendants(childId));
      });
      return descendants;
    };

    const nodesToDelete = collectDescendants(nodeId);
    
    setMindMap(prev => {
      const newNodes = { ...prev.nodes };
      
      // Remove all descendant nodes
      nodesToDelete.forEach(id => {
        delete newNodes[id];
      });

      // Remove reference from parent
      if (nodeToDelete.parentId) {
        const parent = newNodes[nodeToDelete.parentId];
        if (parent) {
          parent.children = parent.children.filter(id => id !== nodeId);
        }
      }

      return {
        ...prev,
        nodes: newNodes,
        updatedAt: new Date()
      };
    });
  }, [mindMap.nodes, mindMap.rootNodeId]);

  const toggleNodeExpanded = useCallback((nodeId: string) => {
    updateNode(nodeId, { isExpanded: !mindMap.nodes[nodeId]?.isExpanded });
  }, [mindMap.nodes, updateNode]);

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    Object.values(mindMap.nodes).forEach(node => {
      if (!node.parentId || !node.isExpanded) return;
      
      const parent = mindMap.nodes[node.parentId];
      if (!parent || !parent.isExpanded) return;

      const key = `${parent.id}-${node.id}`;
      connections.push(
        <svg
          key={key}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ 
            width: '100%', 
            height: '100%',
            zIndex: 0
          }}
        >
          <line
            x1={parent.x + 100}
            y1={parent.y + 40}
            x2={node.x + 75}
            y2={node.y + 30}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            opacity="0.6"
            className="transition-all duration-300"
          />
        </svg>
      );
    });
    
    return connections;
  };

  const resetView = () => {
    setZoom(1);
    if (canvasRef.current) {
      canvasRef.current.scrollTo({
        left: 200,
        top: 100,
        behavior: 'smooth'
      });
    }
  };

  const exportMindMap = () => {
    const dataStr = JSON.stringify(mindMap, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mindmap-${mindMap.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="w-full h-full relative bg-background">
      {/* Toolbar */}
      <Card className="absolute top-4 left-4 z-10 p-3">
        <div className="flex items-center gap-3">
          <Input
            value={mindMap.title}
            onChange={(e) => setMindMap(prev => ({ ...prev, title: e.target.value }))}
            className="w-32 h-8 text-sm"
            placeholder="Mind Map Title"
          />
          
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="gap-2"
            >
              <Palette className="w-4 h-4" />
              <div className={cn("w-3 h-3 rounded-full", colorPreview[selectedColor])} />
            </Button>
            
            {showColorPicker && (
              <Card className="absolute top-full left-0 mt-1 p-2 z-20">
                <div className="grid grid-cols-4 gap-1">
                  {colors.map(color => (
                    <Button
                      key={color}
                      size="sm"
                      variant={selectedColor === color ? "default" : "ghost"}
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        setSelectedColor(color);
                        setShowColorPicker(false);
                      }}
                    >
                      <div className={cn("w-4 h-4 rounded-full", colorPreview[color])} />
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          <Button size="sm" variant="outline" onClick={resetView}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.min(z + 0.1, 2))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <Button size="sm" variant="outline" onClick={exportMindMap}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <Card className="absolute top-4 right-4 z-10 p-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">
            {Object.keys(mindMap.nodes).length} nodes
          </Badge>
          <Badge variant="secondary">
            Zoom: {Math.round(zoom * 100)}%
          </Badge>
        </div>
      </Card>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full overflow-auto"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          width: `${100 / zoom}%`,
          height: `${100 / zoom}%`
        }}
      >
        <div className="relative" style={{ width: '2000px', height: '1500px' }}>
          {/* Connections */}
          {renderConnections()}
          
          {/* Nodes */}
          {Object.values(mindMap.nodes).map(node => {
            // Only render if node is expanded or is root, and parent is expanded
            const shouldRender = node.id === mindMap.rootNodeId || 
              (node.parentId && mindMap.nodes[node.parentId]?.isExpanded);
            
            if (!shouldRender) return null;
            
            return (
              <MindMapNodeComponent
                key={node.id}
                node={node}
                isRoot={node.id === mindMap.rootNodeId}
                onUpdate={updateNode}
                onAddChild={addChildNode}
                onDelete={deleteNode}
                onToggleExpanded={toggleNodeExpanded}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};