import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Receipt, RotateCcw } from 'lucide-react';
import { Order } from '../../types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  PaymentStatusBadge,
  OrderStatusBadge,
  Button,
} from '../ui';

interface OrdersTableProps {
  orders: Order[];
  onReprint?: (order: Order) => void;
}

export function OrdersTable({ orders, onReprint }: OrdersTableProps) {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleReprint = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (onReprint) {
      onReprint(order);
    } else {
      console.log('Re-imprimiendo pedido:', order.orderNumber);
      alert(`Re-imprimiendo pedido ${order.orderNumber}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-soft overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Pedido</TableHead>
            <TableHead className="min-w-[140px]">Cliente</TableHead>
            <TableHead className="text-right w-[90px]">Total</TableHead>
            <TableHead className="text-right w-[90px]">Pagado</TableHead>
            <TableHead className="text-center w-[85px]">Pago</TableHead>
            <TableHead className="text-center w-[95px]">Estado</TableHead>
            <TableHead className="text-center w-[45px]">Comp</TableHead>
            <TableHead className="w-[80px]">Fecha</TableHead>
            <TableHead className="text-right w-[140px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              isClickable
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <TableCell>
                <span className="font-mono text-xs font-medium text-neutral-900">
                  {order.orderNumber}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-neutral-900 truncate max-w-[160px]">
                    {order.customer.name}
                  </span>
                  <span className="text-xs text-neutral-500 truncate max-w-[160px]">
                    {order.customer.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono text-xs">{formatCurrency(order.totalAmount)}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono text-xs">{formatCurrency(order.amountPaid)}</span>
              </TableCell>
              <TableCell className="text-center">
                <PaymentStatusBadge status={order.paymentStatus} size="sm" />
              </TableCell>
              <TableCell className="text-center">
                <OrderStatusBadge status={order.orderStatus} size="sm" />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Receipt size={12} className="text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-600">
                    {order.receipts.length}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-neutral-500">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: es })}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-0.5">
                  {order.printedAt && (
                    <button
                      onClick={(e) => handleReprint(e, order)}
                      className="p-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-colors"
                      title="Re-imprimir"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${order.id}`);
                    }}
                    leftIcon={<Eye size={14} />}
                  >
                    Ver
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
