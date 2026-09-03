import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LoadingSpinnerProps {
  variant?: 'center' | 'inline' | 'page';
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'center',
  text,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && <span>{text}</span>}
      </span>
    );
  }

  if (variant === 'page') {
    return (
      <div className={cn('min-h-[70vh] flex flex-col items-center justify-center p-8 text-center', className)}>
        <Loader2 className={cn('animate-spin text-primary mb-3', sizeClasses[size])} />
        <p className="text-sm font-medium text-slate-700">{text || 'Memuat halaman...'}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Harap tunggu sebentar</p>
      </div>
    );
  }

  return (
    <div className={cn('p-8 flex flex-col items-center justify-center text-center', className)}>
      <Loader2 className={cn('animate-spin text-primary mb-2', sizeClasses[size])} />
      {text && <p className="text-xs text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
