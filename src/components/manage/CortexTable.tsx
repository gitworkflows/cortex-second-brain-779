import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Move, Trash2, Archive, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { FilterPopover } from '@/components/ui/filter-popover';
import { LoadingSkeleton, LoadingCard } from '@/components/ui/loading-spinner';
import TableView from './views/TableView';
import GridView from './views/GridView';
import ListView from './views/ListView';
import KanbanView from './views/KanbanView';
import { cortexItems } from './cortex-data';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface CortexTableProps {
  viewType?: 'table' | 'grid' | 'list' | 'kanban';
  categoryId?: string;
  cortexId?: string | null;
}

const CortexTable = ({ viewType = 'table', categoryId = 'private', cortexId = 'overview' }: CortexTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [targetCortex, setTargetCortex] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'createdDate', direction: 'desc' });
  
  const getActiveCortexName = () => {
    const categories = [
      {
        id: 'shared',
        items: [
          { id: 'shared-1', name: 'Second Brain' },
          { id: 'shared-2', name: 'OSS' },
          { id: 'shared-3', name: 'Artificial Intelligence' },
        ]
      },
      {
        id: 'team',
        items: [
          { id: 'team-1', name: 'Brainboard Competitors' },
          { id: 'team-2', name: 'Visualize Terraform' },
          { id: 'team-3', name: 'CI/CD Engine' },
        ]
      },
      {
        id: 'private',
        items: [
          { id: 'overview', name: 'Overview' },
          { id: 'private-1', name: 'UXUI' },
          { id: 'private-2', name: 'Space' },
          { id: 'private-3', name: 'Cloud Computing' },
        ]
      }
    ];
    
    if (cortexId === null) {
      return "All";
    }
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return "Unknown";
    
    const item = category.items.find(i => i.id === cortexId);
    return item ? item.name : "Unknown";
  };

  // Enhanced search with debouncing
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    setIsSearching(false);
  }, [searchQuery]);

  // Filter options based on current data
  const filterOptions = useMemo(() => [
    {
      id: 'type',
      label: 'Content Type',
      options: [
        { id: 'article', label: 'Article', count: cortexItems.filter(i => i.type === 'article').length },
        { id: 'video', label: 'Video', count: cortexItems.filter(i => i.type === 'video').length },
        { id: 'podcast', label: 'Podcast', count: cortexItems.filter(i => i.type === 'podcast').length },
        { id: 'book', label: 'Book', count: cortexItems.filter(i => i.type === 'book').length },
      ]
    },
    {
      id: 'source',
      label: 'Source',
      options: Array.from(new Set(cortexItems.map(i => i.source))).map(source => ({
        id: source,
        label: source,
        count: cortexItems.filter(i => i.source === source).length
      }))
    }
  ], []);
  
  const getFilteredItems = () => {
    const activeCortexName = getActiveCortexName().toLowerCase();
    
    let items = cortexId === 'overview' ? cortexItems : cortexItems.filter(item => 
      item.keywords.some(keyword => 
        keyword.toLowerCase() === activeCortexName.toLowerCase() ||
        keyword.toLowerCase().includes(activeCortexName.toLowerCase())
      ) || item.title.toLowerCase().includes(activeCortexName.toLowerCase())
    );

    // Apply filters
    Object.entries(selectedFilters).forEach(([filterType, values]) => {
      if (values.length > 0) {
        items = items.filter(item => {
          if (filterType === 'type') return values.includes(item.type);
          if (filterType === 'source') return values.includes(item.source);
          return true;
        });
      }
    });

    // Apply search
    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.writer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pitch.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    items.sort((a, b) => {
      const aValue = a[sortBy.field as keyof typeof a];
      const bValue = b[sortBy.field as keyof typeof b];
      
      if (sortBy.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return items;
  };
  
  const filteredItems = getFilteredItems();

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleMoveItems = async () => {
    if (!targetCortex) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Moved ${selectedItems.length} items to ${targetCortex}`);
    setSelectedItems([]);
    setMoveDialogOpen(false);
    setTargetCortex('');
    setIsLoading(false);
  };

  const handleDeleteItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success(`Deleted ${selectedItems.length} items`);
    setSelectedItems([]);
    setIsLoading(false);
  };

  const handleArchiveItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    toast.success(`Archived ${selectedItems.length} items`);
    setSelectedItems([]);
    setIsLoading(false);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    toast.info('Filters cleared');
  };

  const cortexOptions = [
    { id: 'shared-1', name: 'Second Brain' },
    { id: 'shared-2', name: 'OSS' },
    { id: 'shared-3', name: 'Artificial Intelligence' },
    { id: 'team-1', name: 'Brainboard Competitors' },
    { id: 'team-2', name: 'Visualize Terraform' },
    { id: 'team-3', name: 'CI/CD Engine' },
    { id: 'private-1', name: 'UXUI' },
    { id: 'private-2', name: 'Space' },
    { id: 'private-3', name: 'Cloud Computing' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-4">
          <EnhancedInput
            placeholder="Search cortexes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            icon={<Search size={18} />}
            isLoading={isSearching}
            className="w-80"
          />
          
          {selectedItems.length > 0 && (
            <div className="text-sm text-muted-foreground animate-fade-in">
              {selectedItems.length} selected
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <div className="flex gap-1 mr-2 animate-slide-up">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMoveDialogOpen(true)}
                disabled={isLoading}
                className="hover:shadow-sm"
              >
                <Move size={16} className="mr-2" />
                Move ({selectedItems.length})
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleArchiveItems}
                disabled={isLoading}
                className="hover:shadow-sm"
              >
                <Archive size={16} className="mr-2" />
                Archive
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDeleteItems} className="text-destructive">
                    <Trash2 size={16} className="mr-2" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          <FilterPopover
            filters={filterOptions}
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
            onClearAll={handleClearFilters}
          />
          
          <Button size="sm" className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <Plus size={16} className="mr-2" />
            New Cortex
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              viewType === 'grid' ? <LoadingCard key={i} /> : 
              <LoadingSkeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <div className="w-16 h-16 mb-4 bg-muted/50 rounded-full flex items-center justify-center">
              <Search size={24} className="text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium mb-2">No cortex items found</p>
            <p className="text-sm text-center max-w-md">
              {searchQuery || Object.values(selectedFilters).flat().length > 0
                ? 'Try adjusting your search query or filters to find what you\'re looking for.'
                : 'This section doesn\'t contain any items yet. Create your first cortex item to get started.'
              }
            </p>
            {(searchQuery || Object.values(selectedFilters).flat().length > 0) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilters({});
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {viewType === 'table' && (
              <TableView 
                items={filteredItems} 
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            )}
            {viewType === 'grid' && (
              <GridView 
                items={filteredItems}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
              />
            )}
            {viewType === 'list' && (
              <ListView 
                items={filteredItems}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
              />
            )}
            {viewType === 'kanban' && <KanbanView items={filteredItems} />}
          </div>
        )}
      </div>

      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move to Cortex</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={setTargetCortex} value={targetCortex}>
              <SelectTrigger>
                <SelectValue placeholder="Select target cortex" />
              </SelectTrigger>
              <SelectContent>
                {cortexOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveItems} disabled={!targetCortex || isLoading}>
              {isLoading ? 'Moving...' : 'Move Items'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CortexTable;
