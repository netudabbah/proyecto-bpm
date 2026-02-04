import { Header } from '../components/layout';
import { Card, CardHeader, Select } from '../components/ui';
import { PaymentTrendChart, StatusDistributionChart, ValidationTimeChart } from '../components/dashboard';
import { mockDailyStats } from '../data/mockData';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const validationTimeData = [
  { hour: '9am', time: 3.2 },
  { hour: '10am', time: 4.1 },
  { hour: '11am', time: 5.5 },
  { hour: '12pm', time: 4.8 },
  { hour: '1pm', time: 3.9 },
  { hour: '2pm', time: 4.2 },
  { hour: '3pm', time: 5.1 },
  { hour: '4pm', time: 4.6 },
  { hour: '5pm', time: 3.8 },
];

export function Analytics() {
  const periodOptions = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Estadísticas"
        subtitle="Rendimiento y análisis de validación de pagos"
      />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select
              options={periodOptions}
              defaultValue="7d"
              className="w-40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Tasa de Validación</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">87.5%</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600">
                  <TrendingUp size={14} />
                  <span className="text-xs font-medium">+5.2% vs semana pasada</span>
                </div>
              </div>
              <div className="p-2 bg-emerald-100 rounded-xl">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">4.2 min</p>
                <div className="flex items-center gap-1 mt-2 text-amber-600">
                  <TrendingDown size={14} />
                  <span className="text-xs font-medium">-1.3 min vs semana pasada</span>
                </div>
              </div>
              <div className="p-2 bg-amber-100 rounded-xl">
                <TrendingDown size={20} className="text-amber-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Tasa de Rechazo</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">6.8%</p>
                <div className="flex items-center gap-1 mt-2 text-blue-600">
                  <ArrowRight size={14} />
                  <span className="text-xs font-medium">Sin cambios vs semana pasada</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-xl">
                <ArrowRight size={20} className="text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentTrendChart data={mockDailyStats} />
          <ValidationTimeChart data={validationTimeData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusDistributionChart data={mockDailyStats} />

          <Card>
            <CardHeader title="Top Operadores" description="Por volumen de validaciones esta semana" />
            <div className="mt-4 space-y-3">
              {[
                { name: 'Ana García', count: 156, percentage: 35 },
                { name: 'Carlos López', count: 134, percentage: 30 },
                { name: 'María Rodríguez', count: 98, percentage: 22 },
                { name: 'Juan Martínez', count: 58, percentage: 13 },
              ].map((operator, index) => (
                <div key={operator.name} className="flex items-center gap-4">
                  <span className="w-6 text-sm font-medium text-neutral-400">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900">
                        {operator.name}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {operator.count} validaciones
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                        style={{ width: `${operator.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Resumen Diario"
            description="Desglose del procesamiento de pedidos por día"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Fecha
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase">
                    Total
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase">
                    Pagados
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase">
                    Pendientes
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase">
                    Rechazados
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-500 uppercase">
                    Tasa de Éxito
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockDailyStats.map((day) => (
                  <tr key={day.date} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                    <td className="py-3 px-4 text-sm font-medium text-neutral-900">
                      {new Date(day.date).toLocaleDateString('es-AR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-700 text-right">
                      {day.total}
                    </td>
                    <td className="py-3 px-4 text-sm text-emerald-600 text-right font-medium">
                      {day.paid}
                    </td>
                    <td className="py-3 px-4 text-sm text-amber-600 text-right">
                      {day.pending}
                    </td>
                    <td className="py-3 px-4 text-sm text-red-600 text-right">
                      {day.rejected}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-900 text-right font-medium">
                      {((day.paid / day.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
