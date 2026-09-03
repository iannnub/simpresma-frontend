import React from 'react';
import { Button } from '@/components/ui/button';
import { Inbox, FileText, AlertCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {(actionText && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Button size="sm" asChild className="text-xs shadow-sm">
              <Link to={actionHref}>{actionText}</Link>
            </Button>
          ) : (
            <Button size="sm" onClick={onAction} className="text-xs shadow-sm">
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
