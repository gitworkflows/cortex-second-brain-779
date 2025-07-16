import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Search, X } from 'lucide-react';
import { Button } from './button';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClearButton?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, onClear, showClearButton = true, icon, isLoading, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value && String(props.value).length > 0;

    return (
      <div className={cn(
        'relative transition-all duration-200',
        isFocused && 'scale-[1.02]',
        className
      )}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <Input
          ref={ref}
          className={cn(
            'transition-all duration-200',
            icon && 'pl-10',
            (showClearButton && hasValue) && 'pr-10',
            isFocused && 'ring-2 ring-primary/20 border-primary/50'
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {showClearButton && hasValue && !isLoading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted/50"
            onClick={() => {
              onClear?.();
              if (props.onChange) {
                props.onChange({ target: { value: '' } } as any);
              }
            }}
          >
            <X size={14} />
          </Button>
        )}
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';