import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { PengajuanStatus } from '@/types';
import { Clock, CheckCircle2, XCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatusBadgeProps {
  status: PengajuanStatus | string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({
  status,
  className,
  showIcon = true,
}) => {
  const normalized = status?.toLowerCase() as PengajuanStatus;

  switch (normalized) {
    case 'pending':
      return (
        <Badge
          className={cn(
            'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1 font-medium',
            className
          )}
          variant="outline"
        >
          {showIcon && <Clock className="w-3 h-3 text-amber-600" />}
          <span>Pending</span>
        </Badge>
      );
    case 'diterima':
      return (
        <Badge
          className={cn(
            'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 gap-1 font-medium',
            className
          )}
          variant="outline"
        >
          {showIcon && <CheckCircle2 className="w-3 h-3 text-sky-600" />}
          <span>Diterima</span>
        </Badge>
      );
    case 'ditolak':
      return (
        <Badge
          className={cn(
            'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 gap-1 font-medium',
            className
          )}
          variant="outline"
        >
          {showIcon && <XCircle className="w-3 h-3 text-rose-600" />}
          <span>Ditolak</span>
        </Badge>
      );
    case 'selesai':
      return (
        <Badge
          className={cn(
            'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 gap-1 font-medium',
            className
          )}
          variant="outline"
        >
          {showIcon && <Award className="w-3 h-3 text-emerald-600" />}
          <span>Selesai</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
});

export default StatusBadge;
