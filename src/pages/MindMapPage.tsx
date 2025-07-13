import React from 'react';
import { MindMapCanvas } from '@/components/mindmap/MindMapCanvas';

const MindMapPage: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <MindMapCanvas />
    </div>
  );
};

export default MindMapPage;