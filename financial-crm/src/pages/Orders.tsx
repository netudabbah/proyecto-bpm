import { useState, useMemo } from 'react';
import { Plus, Printer } from 'lucide-react';
import { Header } from '../components/layout';
import { OrdersTable, OrderFilters } from '../components/orders';
import { Button } from '../components/ui';
import { mockOrders } from '../data/mockData';
import { PaymentStatus, OrderStatus } from '../types';

export function Orders() {
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      const matchesOrderStatus = orderStatusFilter === 'all' || order.orderStatus === orderStatusFilter;

      return matchesPayment && matchesOrderStatus;
    });
  }, [paymentFilter, orderStatusFilter]);

  const statusCounts = useMemo(() => {
    return mockOrders.reduce(
      (acc, order) => {
        acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0 } as Record<string, number>
    );
  }, []);

  // Contar pedidos pendientes de imprimir (solo si ya tienen comprobante subido: a_confirmar, parcial, total)
  const printableStatuses = ['a_confirmar', 'parcial', 'total'];

  const pendingPrintCount = useMemo(() => {
    return mockOrders.filter(
      (order) =>
        order.printedAt === null &&
        printableStatuses.includes(order.paymentStatus)
    ).length;
  }, []);

  const handlePrintAllPending = () => {
    const ordersToPrint = mockOrders.filter(
      (order) =>
        order.printedAt === null &&
        printableStatuses.includes(order.paymentStatus)
    );

    // Aquí iría la lógica real de impresión
    console.log('Imprimiendo pedidos:', ordersToPrint.map(o => o.orderNumber));
    alert(`Imprimiendo ${ordersToPrint.length} pedidos pendientes:\n${ordersToPrint.map(o => o.orderNumber).join(', ')}`);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Pedidos"
        subtitle={`${statusCounts.total} pedidos en total · ${statusCounts.pendiente || 0} pendientes de pago`}
        actions={
          <div className="flex items-center gap-2">
            {pendingPrintCount > 0 && (
              <Button
                variant="secondary"
                leftIcon={<Printer size={16} />}
                onClick={handlePrintAllPending}
              >
                Imprimir Pendientes ({pendingPrintCount})
              </Button>
            )}
            <Button leftIcon={<Plus size={16} />}>
              Nuevo Pedido
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        <OrderFilters
          paymentFilter={paymentFilter}
          onPaymentFilterChange={setPaymentFilter}
          orderStatusFilter={orderStatusFilter}
          onOrderStatusFilterChange={setOrderStatusFilter}
        />

        <OrdersTable orders={filteredOrders} />

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Mostrando {filteredOrders.length} de {mockOrders.length} pedidos
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled>
              Anterior
            </Button>
            <span className="px-3 py-1.5 text-sm text-neutral-600">Página 1 de 1</span>
            <Button variant="secondary" size="sm" disabled>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
