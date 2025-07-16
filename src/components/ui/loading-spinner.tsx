import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn(
      'animate-spin rounded-full border-2 border-current border-t-transparent',
      sizeClasses[size],
      className
    )} />
  );
};

export const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-shimmer bg-muted rounded', className)} />
);

export const LoadingCard = () => (
  <div className="p-4 border rounded-lg space-y-3">
    <LoadingSkeleton className="h-4 w-3/4" />
    <LoadingSkeleton className="h-3 w-full" />
    <LoadingSkeleton className="h-3 w-2/3" />
    <div className="flex gap-2">
      <LoadingSkeleton className="h-6 w-16 rounded-full" />
      <LoadingSkeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);