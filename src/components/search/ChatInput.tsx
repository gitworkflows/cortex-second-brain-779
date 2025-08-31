
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, SendIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  searchQuery,
  setSearchQuery,
  handleSubmit,
  isFocused,
  setIsFocused,
  isLoading = false,
  disabled = false
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchQuery) {
      setIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(typingTimeoutRef.current);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };
  return (
    <div className="p-4 border-t">
      <form 
        onSubmit={handleSubmit}
        className="relative"
      >
        <div className={cn(
          "w-full glass-panel flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
          isFocused ? "ring-2 ring-primary/30" : ""
        )}>
          <SearchIcon 
            size={20} 
            className={cn(
              "text-muted-foreground transition-all duration-300",
              isFocused ? "text-primary" : ""
            )} 
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? "Processing..." : "Ask your second brain anything..."}
            className="w-full bg-transparent border-none outline-none focus:outline-none text-foreground placeholder:transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
          />
          
          {isTyping && !isLoading && (
            <div className="text-xs text-muted-foreground animate-pulse">
              Typing...
            </div>
          )}
          <Button 
            type="submit"
            size="icon"
            variant="ghost"
            className={cn(
              "text-muted-foreground transition-all duration-300 hover:bg-primary/10",
              searchQuery.trim() && !isLoading ? "opacity-100 hover:text-primary" : "opacity-50",
              isFocused && searchQuery.trim() && !isLoading ? "text-primary" : "",
              isLoading && "animate-pulse"
            )}
            disabled={!searchQuery.trim() || isLoading || disabled}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <SendIcon size={18} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
