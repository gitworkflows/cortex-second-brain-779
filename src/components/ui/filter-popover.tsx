import React, { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Filter, Check, X } from 'lucide-react';
import { Badge } from './badge';
import { Separator } from './separator';
import { Checkbox } from './checkbox';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterPopoverProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  onClearAll: () => void;
}

export const FilterPopover = ({ 
  filters, 
  selectedFilters, 
  onFiltersChange, 
  onClearAll 
}: FilterPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const totalSelected = Object.values(selectedFilters).flat().length;
  
  const handleFilterToggle = (groupId: string, optionId: string) => {
    const currentGroup = selectedFilters[groupId] || [];
    const newGroup = currentGroup.includes(optionId)
      ? currentGroup.filter(id => id !== optionId)
      : [...currentGroup, optionId];
    
    onFiltersChange({
      ...selectedFilters,
      [groupId]: newGroup
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative hover:shadow-sm transition-all duration-200"
        >
          <Filter size={16} className="mr-2" />
          Filter
          {totalSelected > 0 && (
            <Badge 
              variant="destructive" 
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce-in"
            >
              {totalSelected}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filters</h4>
            <div className="flex items-center gap-2">
              {totalSelected > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {filters.map((group, groupIndex) => (
            <div key={group.id}>
              <div className="p-3">
                <h5 className="font-medium text-sm mb-3">{group.label}</h5>
                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isChecked = (selectedFilters[group.id] || []).includes(option.id);
                    
                    return (
                      <div 
                        key={option.id} 
                        className="flex items-center space-x-2 cursor-pointer group hover:bg-muted/30 p-1 rounded transition-colors duration-150"
                        onClick={() => handleFilterToggle(group.id, option.id)}
                      >
                        <Checkbox 
                          checked={isChecked}
                          onChange={() => {}} // Handled by onClick above
                          className="transition-all duration-200"
                        />
                        <label className="text-sm flex-1 cursor-pointer group-hover:text-foreground transition-colors">
                          {option.label}
                        </label>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {option.count}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {groupIndex < filters.length - 1 && <Separator />}
            </div>
          ))}
        </div>
        
        {totalSelected > 0 && (
          <div className="p-3 border-t bg-muted/30">
            <div className="flex flex-wrap gap-1">
              {Object.entries(selectedFilters).map(([groupId, options]) =>
                options.map((optionId) => {
                  const group = filters.find(g => g.id === groupId);
                  const option = group?.options.find(o => o.id === optionId);
                  
                  return option ? (
                    <Badge 
                      key={`${groupId}-${optionId}`} 
                      variant="secondary" 
                      className="text-xs animate-fade-in"
                    >
                      {option.label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 ml-1 hover:bg-destructive/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterToggle(groupId, optionId);
                        }}
                      >
                        <X size={8} />
                      </Button>
                    </Badge>
                  ) : null;
                })
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};