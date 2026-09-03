import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  trend?: string;
  iconClassName?: string;
  cardClassName?: string;
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(({
  title,
  value,
  icon: Icon,
  description,
  trend,
  iconClassName = 'text-primary bg-primary/10',
  cardClassName,
}) => {
  return (
    <Card className={cn('overflow-hidden shadow-soft-sm transition-all hover:shadow-soft-md', cardClassName)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn('p-3 rounded-2xl flex items-center justify-center shrink-0 transition-colors', iconClassName)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-medium text-slate-600 dark:text-slate-400">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default StatsCard;
