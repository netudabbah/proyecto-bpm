import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, AlertTriangle } from 'lucide-react';
import { Receipt } from '../../types';
import { PaymentStatusBadge, Button } from '../ui';
import { clsx } from 'clsx';

interface ReceiptCardProps {
  receipt: Receipt;
  onClick: () => void;
}

export function ReceiptCard({ receipt, onClick }: ReceiptCardProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/D';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  return (
    <div
      className={clsx(
        'group relative bg-white rounded-2xl border border-neutral-200/60 overflow-hidden',
        'hover:shadow-medium hover:border-neutral-300/60 transition-all duration-200 cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
        <img
          src={receipt.imageUrl}
          alt="Comprobante"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Eye size={14} />}
            className="w-full bg-white/90 backdrop-blur-sm"
          >
            Ver Detalle
          </Button>
        </div>
        {receipt.isDuplicate && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500 text-white rounded-lg text-xs font-medium">
              <AlertTriangle size={12} />
              Duplicado
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-900">
            {formatCurrency(receipt.detectedAmount)}
          </span>
          <PaymentStatusBadge status={receipt.paymentStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(receipt.uploadedAt), { addSuffix: true, locale: es })}
          </span>
          <span className="text-xs font-mono text-neutral-400">
            #{receipt.id.slice(-6)}
          </span>
        </div>
      </div>
    </div>
  );
}
