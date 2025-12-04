import { Badge } from '@/components/ui';
import { SystemStatus } from '@/types/database';

interface StatusBadgeProps {
  status: SystemStatus;
}

const statusConfig: Record<
  SystemStatus,
  { variant: 'success' | 'warning' | 'default'; label: string }
> = {
  live: { variant: 'success', label: 'Live' },
  draft: { variant: 'warning', label: 'Draft' },
  hidden: { variant: 'default', label: 'Hidden' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}
