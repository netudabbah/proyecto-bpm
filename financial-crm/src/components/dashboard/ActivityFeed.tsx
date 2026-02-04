import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, X, AlertTriangle, Edit, MessageSquare, Plus, Printer, Package, Truck } from 'lucide-react';
import { ActivityLogEntry } from '../../types';
import { Card, CardHeader } from '../ui';

interface ActivityFeedProps {
  activities: ActivityLogEntry[];
}

const actionIcons: Record<ActivityLogEntry['action'], React.ReactNode> = {
  created: <Plus size={14} />,
  validated: <Check size={14} />,
  rejected: <X size={14} />,
  edited: <Edit size={14} />,
  duplicate_flagged: <AlertTriangle size={14} />,
  whatsapp_sent: <MessageSquare size={14} />,
  printed: <Printer size={14} />,
  packed: <Package size={14} />,
  shipped: <Truck size={14} />,
};

const actionColors: Record<ActivityLogEntry['action'], string> = {
  created: 'bg-neutral-100 text-neutral-600',
  validated: 'bg-emerald-100 text-emerald-600',
  rejected: 'bg-red-100 text-red-600',
  edited: 'bg-blue-100 text-blue-600',
  duplicate_flagged: 'bg-amber-100 text-amber-600',
  whatsapp_sent: 'bg-green-100 text-green-600',
  printed: 'bg-violet-100 text-violet-600',
  packed: 'bg-cyan-100 text-cyan-600',
  shipped: 'bg-orange-100 text-orange-600',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card padding="none" className="h-full">
      <div className="p-5 border-b border-neutral-100">
        <CardHeader title="Actividad Reciente" description="Últimas operaciones de pago" />
      </div>
      <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="px-5 py-4 hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-start gap-3">
              <div
                className={clsx(
                  'flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0',
                  actionColors[activity.action]
                )}
              >
                {actionIcons[activity.action]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {activity.orderNumber}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: es })}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-neutral-600">{activity.description}</p>
                <p className="mt-1 text-xs text-neutral-400">por {activity.performedBy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
