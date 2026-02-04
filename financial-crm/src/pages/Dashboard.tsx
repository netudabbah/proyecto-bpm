import {
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Timer,
  Printer,
  Package,
} from 'lucide-react';
import { Header } from '../components/layout';
import { KPICard, ActivityFeed, PaymentTrendChart, StatusDistributionChart } from '../components/dashboard';
import { mockKPIData, mockActivityLog, mockDailyStats } from '../data/mockData';

export function Dashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Panel"
        subtitle="Resumen de operaciones financieras"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Pedidos Hoy"
            value={mockKPIData.totalOrdersToday}
            change={12}
            changeLabel="vs ayer"
            icon={<ShoppingCart size={20} />}
            iconColor="neutral"
          />
          <KPICard
            title="Pagados"
            value={mockKPIData.paidToday}
            change={8}
            changeLabel="vs ayer"
            icon={<CheckCircle size={20} />}
            iconColor="green"
          />
          <KPICard
            title="Pendientes"
            value={mockKPIData.pendingToday}
            change={-15}
            changeLabel="vs ayer"
            icon={<Clock size={20} />}
            iconColor="yellow"
          />
          <KPICard
            title="Rechazados"
            value={mockKPIData.rejectedToday}
            change={0}
            changeLabel="vs ayer"
            icon={<XCircle size={20} />}
            iconColor="red"
          />
          <KPICard
            title="Recaudado"
            value={formatCurrency(mockKPIData.moneyCollected)}
            change={23}
            changeLabel="vs ayer"
            icon={<DollarSign size={20} />}
            iconColor="green"
          />
          <KPICard
            title="Tiempo Prom."
            value={`${mockKPIData.avgValidationTime} min`}
            change={-10}
            changeLabel="más rápido"
            icon={<Timer size={20} />}
            iconColor="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PaymentTrendChart data={mockDailyStats} />
          </div>
          <div>
            <StatusDistributionChart data={mockDailyStats} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed activities={mockActivityLog} />
          <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 shadow-soft">
            <h3 className="text-base font-semibold text-neutral-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
                <Clock size={24} className="text-amber-600 mb-2" />
                <span className="text-sm font-medium text-neutral-700">Revisar Pendientes</span>
                <span className="text-xs text-neutral-500 mt-0.5">5 pedidos</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
                <Printer size={24} className="text-violet-600 mb-2" />
                <span className="text-sm font-medium text-neutral-700">Para Imprimir</span>
                <span className="text-xs text-neutral-500 mt-0.5">3 pedidos</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
                <Package size={24} className="text-cyan-600 mb-2" />
                <span className="text-sm font-medium text-neutral-700">Para Armar</span>
                <span className="text-xs text-neutral-500 mt-0.5">2 pedidos</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
                <DollarSign size={24} className="text-emerald-600 mb-2" />
                <span className="text-sm font-medium text-neutral-700">Exportar Reporte</span>
                <span className="text-xs text-neutral-500 mt-0.5">Resumen diario</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
