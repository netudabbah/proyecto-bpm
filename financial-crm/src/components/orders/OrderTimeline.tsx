import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, X, AlertTriangle, Edit, MessageSquare, Plus, Printer, Package, Truck } from 'lucide-react';
import { ActivityLogEntry } from '../../types';

interface OrderTimelineProps {
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
  created: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  validated: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  rejected: 'bg-red-100 text-red-600 border-red-200',
  edited: 'bg-blue-100 text-blue-600 border-blue-200',
  duplicate_flagged: 'bg-amber-100 text-amber-600 border-amber-200',
  whatsapp_sent: 'bg-green-100 text-green-600 border-green-200',
  printed: 'bg-violet-100 text-violet-600 border-violet-200',
  packed: 'bg-cyan-100 text-cyan-600 border-cyan-200',
  shipped: 'bg-orange-100 text-orange-600 border-orange-200',
};

export function OrderTimeline({ activities }: OrderTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        Aún no hay actividad registrada
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-neutral-200" />
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex gap-4">
            <div
              className={clsx(
                'relative z-10 flex items-center justify-center w-7 h-7 rounded-full border-2 bg-white',
                actionColors[activity.action]
              )}
            >
              {actionIcons[activity.action]}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900">
                  {activity.description}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-neutral-500">{activity.performedBy}</span>
                <span className="text-xs text-neutral-300">•</span>
                <span className="text-xs text-neutral-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
