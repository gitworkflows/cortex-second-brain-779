
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CortexItem } from '../cortex-data';
import { Check, Square, ExternalLink, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GridViewProps {
  items: CortexItem[];
  selectedItems?: string[];
  onSelectItem?: (id: string) => void;
}

const GridView = ({ 
  items, 
  selectedItems = [], 
  onSelectItem = () => {} 
}: GridViewProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item.id);
        const isHovered = hoveredCard === item.id;
        
        return (
          <Card 
            key={item.id} 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out relative group cursor-pointer",
              "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]",
              isSelected && "ring-2 ring-primary shadow-lg",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Header with selection and actions */}
            <div className="absolute right-2 top-2 z-10 flex gap-1">
              <div 
                className={cn(
                  "transition-all duration-200 hover:scale-110",
                  isSelected ? "animate-bounce-in" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
              >
                {isSelected ? (
                  <div className="rounded-md bg-primary text-primary-foreground p-1 shadow-sm">
                    <Check size={14} />
                  </div>
                ) : (
                  <div className="rounded-md border border-border/50 p-1 bg-background/80 backdrop-blur-sm hover:bg-muted/50">
                    <Square size={14} />
                  </div>
                )}
              </div>
              
              {/* Action menu - shows on hover */}
              <div className={cn(
                "transition-all duration-200",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-muted/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={12} />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Content type indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200",
                  item.type === 'article' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                  item.type === 'video' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                  item.type === 'podcast' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                  item.type === 'book' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                )}>
                  {item.type}
                </span>
                <span className="text-xs text-muted-foreground">{item.createdDate}</span>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {item.title}
              </h3>
              
              {/* Source */}
              <div className="text-sm text-muted-foreground mb-2">
                {item.source} • {item.writer}
              </div>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.pitch}
              </p>
              
              {/* Keywords */}
              <div className="flex flex-wrap gap-1 mb-3">
                {item.keywords.slice(0, 3).map((keyword, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 rounded-full bg-secondary/30 text-xs transition-colors duration-200 hover:bg-secondary/50"
                  >
                    {keyword}
                  </span>
                ))}
                {item.keywords.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                    +{item.keywords.length - 3}
                  </span>
                )}
              </div>
              
              {/* URL with external link */}
              <div className="flex items-center justify-between">
                <a 
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate flex-1 mr-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.url}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 transition-all duration-200",
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(item.url, '_blank');
                  }}
                >
                  <ExternalLink size={12} />
                </Button>
              </div>
            </div>
            
            {/* Hover overlay */}
            <div className={cn(
              "absolute inset-0 bg-primary/5 transition-opacity duration-300 pointer-events-none",
              isHovered ? "opacity-100" : "opacity-0"
            )} />
          </Card>
        );
      })}
    </div>
  );
};

export default GridView;
