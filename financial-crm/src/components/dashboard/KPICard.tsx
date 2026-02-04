import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor?: 'green' | 'yellow' | 'red' | 'blue' | 'neutral';
}

const iconColors = {
  green: 'bg-emerald-50 text-emerald-600',
  yellow: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
  neutral: 'bg-neutral-100 text-neutral-600',
};

export function KPICard({ title, value, change, changeLabel, icon, iconColor = 'neutral' }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/60 p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-500">{title}</span>
          <span className="mt-1 text-2xl font-semibold text-neutral-900">{value}</span>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp size={14} className="text-emerald-500" />}
              {isNegative && <TrendingDown size={14} className="text-red-500" />}
              <span
                className={clsx(
                  'text-xs font-medium',
                  isPositive && 'text-emerald-600',
                  isNegative && 'text-red-600',
                  !isPositive && !isNegative && 'text-neutral-500'
                )}
              >
                {isPositive && '+'}{change}%
              </span>
              {changeLabel && (
                <span className="text-xs text-neutral-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={clsx('p-2.5 rounded-xl', iconColors[iconColor])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
