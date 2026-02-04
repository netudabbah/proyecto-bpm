import { PaymentStatus, OrderStatus } from '../../types';
import { clsx } from 'clsx';

interface OrderFiltersProps {
  paymentFilter: PaymentStatus | 'all';
  onPaymentFilterChange: (value: PaymentStatus | 'all') => void;
  orderStatusFilter: OrderStatus | 'all';
  onOrderStatusFilterChange: (value: OrderStatus | 'all') => void;
}

const paymentButtons: { value: PaymentStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'Todos', color: 'bg-neutral-100 text-neutral-700' },
  { value: 'pendiente', label: 'Pendiente', color: 'bg-amber-50 text-amber-700' },
  { value: 'a_confirmar', label: 'A confirmar', color: 'bg-blue-50 text-blue-700' },
  { value: 'parcial', label: 'Parcial', color: 'bg-violet-50 text-violet-700' },
  { value: 'total', label: 'Total', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'rechazado', label: 'Rechazado', color: 'bg-red-50 text-red-700' },
];

const orderStatusButtons: { value: OrderStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'Todos', color: 'bg-neutral-100 text-neutral-700' },
  { value: 'pendiente_pago', label: 'Pend. Pago', color: 'bg-amber-50 text-amber-700' },
  { value: 'a_imprimir', label: 'A Imprimir', color: 'bg-blue-50 text-blue-700' },
  { value: 'armado', label: 'Armado', color: 'bg-cyan-50 text-cyan-700' },
  { value: 'enviado', label: 'Enviado', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'en_calle', label: 'En Calle', color: 'bg-orange-50 text-orange-700' },
];

export function OrderFilters({
  paymentFilter,
  onPaymentFilterChange,
  orderStatusFilter,
  onOrderStatusFilterChange,
}: OrderFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Filtros de estado de pago */}
      <div>
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Estado de Pago</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {paymentButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onPaymentFilterChange(btn.value)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap',
                paymentFilter === btn.value
                  ? clsx(btn.color, 'ring-2 ring-neutral-900/10')
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros de estado del pedido */}
      <div>
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Estado del Pedido</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {orderStatusButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onOrderStatusFilterChange(btn.value)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap',
                orderStatusFilter === btn.value
                  ? clsx(btn.color, 'ring-2 ring-neutral-900/10')
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
