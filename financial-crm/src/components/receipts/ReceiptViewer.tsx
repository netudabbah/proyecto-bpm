import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, AlertTriangle, Copy } from 'lucide-react';
import { Receipt } from '../../types';
import { Modal, Button, PaymentStatusBadge, Card } from '../ui';
import { clsx } from 'clsx';

interface ReceiptViewerProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptViewer({ receipt, isOpen, onClose }: ReceiptViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!receipt) return null;

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'No detectado';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const copyOcrText = () => {
    navigator.clipboard.writeText(receipt.ocrText);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Detalle del Comprobante">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleZoomOut}>
              <ZoomOut size={16} />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleZoomIn}>
              <ZoomIn size={16} />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleRotate}>
              <RotateCw size={16} />
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={16} />
            </Button>
            <span className="ml-2 text-sm text-neutral-500">{Math.round(zoom * 100)}%</span>
          </div>

          <div className="bg-neutral-100 rounded-xl overflow-hidden h-[400px] flex items-center justify-center">
            <img
              src={receipt.imageUrl}
              alt="Comprobante"
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          </div>

          {receipt.isDuplicate && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle size={18} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Este comprobante ha sido marcado como posible duplicado
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Estado</span>
                <PaymentStatusBadge status={receipt.paymentStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Monto Detectado</span>
                <span className={clsx(
                  'text-sm font-semibold',
                  receipt.detectedAmount ? 'text-neutral-900' : 'text-neutral-400'
                )}>
                  {formatCurrency(receipt.detectedAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">ID Comprobante</span>
                <span className="text-sm font-mono text-neutral-600">{receipt.id}</span>
              </div>
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">Texto Extraído (OCR)</span>
              <Button variant="ghost" size="sm" onClick={copyOcrText} leftIcon={<Copy size={14} />}>
                Copiar
              </Button>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 max-h-[200px] overflow-y-auto">
              <pre className="text-xs text-neutral-600 whitespace-pre-wrap font-mono">
                {receipt.ocrText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
