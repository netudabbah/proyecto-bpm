import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle, Eye, Banknote, FileText, Download } from 'lucide-react';
import { Header } from '../components/layout';
import { Button, Card } from '../components/ui';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui';
import { fetchComprobantes, ApiComprobanteList } from '../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx } from 'clsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Función para descargar imágenes de comprobantes pendientes como ZIP
async function downloadPendingAsZip(
  comprobantes: ApiComprobanteList[],
  setDownloading: (v: boolean) => void
) {
  const pendientes = comprobantes.filter(c => c.estado === 'pendiente' && c.file_url);

  if (pendientes.length === 0) {
    alert('No hay comprobantes pendientes con imagen para descargar');
    return;
  }

  setDownloading(true);

  try {
    const zip = new JSZip();
    const folder = zip.folder('comprobantes_pendientes');

    // Descargar cada imagen y agregarla al ZIP
    const downloadPromises = pendientes.map(async (comp) => {
      if (!comp.file_url) return;

      try {
        const response = await fetch(comp.file_url);
        if (!response.ok) {
          console.error(`Error descargando imagen ${comp.id}:`, response.statusText);
          return;
        }

        const blob = await response.blob();

        // Determinar extensión del archivo
        const contentType = response.headers.get('content-type') || '';
        let extension = 'jpg';
        if (contentType.includes('png')) extension = 'png';
        else if (contentType.includes('webp')) extension = 'webp';
        else if (contentType.includes('gif')) extension = 'gif';

        // Nombre del archivo: pedido_id_monto.jpg
        const fileName = `pedido_${comp.order_number}_comp${comp.id}_$${comp.monto}.${extension}`;

        folder?.file(fileName, blob);
      } catch (err) {
        console.error(`Error descargando imagen ${comp.id}:`, err);
      }
    });

    await Promise.all(downloadPromises);

    // Generar y descargar el ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `comprobantes_pendientes_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.zip`);
  } catch (err) {
    console.error('Error creando ZIP:', err);
    alert('Error al crear el archivo ZIP');
  } finally {
    setDownloading(false);
  }
}

type ComprobanteEstado = 'pendiente' | 'confirmado' | 'rechazado';

const estadoButtons: { value: ComprobanteEstado | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'Todos', color: 'bg-neutral-100 text-neutral-700' },
  { value: 'pendiente', label: 'Pendiente', color: 'bg-amber-50 text-amber-700' },
  { value: 'confirmado', label: 'Confirmado', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'rechazado', label: 'Rechazado', color: 'bg-red-50 text-red-700' },
];

const tipoButtons: { value: string | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'efectivo', label: 'Efectivo' },
];

function EstadoBadge({ estado }: { estado: string | null }) {
  const estadoMap: Record<string, { label: string; className: string }> = {
    pendiente: { label: 'Pendiente', className: 'bg-amber-50 text-amber-700' },
    confirmado: { label: 'Confirmado', className: 'bg-emerald-50 text-emerald-700' },
    rechazado: { label: 'Rechazado', className: 'bg-red-50 text-red-700' },
  };

  const info = estadoMap[estado || 'pendiente'] || estadoMap.pendiente;

  return (
    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', info.className)}>
      {info.label}
    </span>
  );
}

export function RealReceipts() {
  const navigate = useNavigate();
  const [comprobantes, setComprobantes] = useState<ApiComprobanteList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<ComprobanteEstado | 'all'>('all');
  const [tipoFilter, setTipoFilter] = useState<string | 'all'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const loadComprobantes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComprobantes();
      setComprobantes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar comprobantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComprobantes();
  }, []);

  const filteredComprobantes = useMemo(() => {
    return comprobantes.filter((comp) => {
      const matchesEstado = estadoFilter === 'all' || comp.estado === estadoFilter;
      const matchesTipo = tipoFilter === 'all' ||
        (tipoFilter === 'efectivo' && comp.tipo === 'efectivo') ||
        (tipoFilter === 'transferencia' && comp.tipo !== 'efectivo');

      return matchesEstado && matchesTipo;
    });
  }, [comprobantes, estadoFilter, tipoFilter]);

  const estadoCounts = useMemo(() => {
    return comprobantes.reduce(
      (acc, comp) => {
        acc[comp.estado] = (acc[comp.estado] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0 } as Record<string, number>
    );
  }, [comprobantes]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Comprobantes"
        subtitle={`${estadoCounts.total} comprobantes · ${estadoCounts.pendiente || 0} pendientes de revisión`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<Download size={16} className={downloading ? 'animate-bounce' : ''} />}
              onClick={() => downloadPendingAsZip(comprobantes, setDownloading)}
              disabled={loading || downloading || (estadoCounts.pendiente || 0) === 0}
            >
              {downloading ? 'Descargando...' : `Descargar Imágenes (${estadoCounts.pendiente || 0})`}
            </Button>
            <Button
              variant="secondary"
              leftIcon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
              onClick={loadComprobantes}
              disabled={loading}
            >
              Actualizar
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Filtros */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Estado</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {estadoButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setEstadoFilter(btn.value)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap',
                    estadoFilter === btn.value
                      ? clsx(btn.color, 'ring-2 ring-neutral-900/10')
                      : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Tipo</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {tipoButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setTipoFilter(btn.value)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap',
                    tipoFilter === btn.value
                      ? 'bg-neutral-100 text-neutral-700 ring-2 ring-neutral-900/10'
                      : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla */}
        {loading && comprobantes.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw size={32} className="animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <Card className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error al cargar comprobantes</h3>
            <p className="text-neutral-500 mb-4">{error}</p>
            <Button onClick={loadComprobantes}>Reintentar</Button>
          </Card>
        ) : filteredComprobantes.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-neutral-500">No hay comprobantes que coincidan con los filtros</p>
          </Card>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead className="w-[100px]">Pedido</TableHead>
                  <TableHead className="min-w-[140px]">Cliente</TableHead>
                  <TableHead className="text-right w-[100px]">Monto</TableHead>
                  <TableHead className="text-center w-[90px]">Tipo</TableHead>
                  <TableHead className="text-center w-[100px]">Estado</TableHead>
                  <TableHead className="w-[100px]">Fecha</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComprobantes.map((comp) => (
                  <TableRow
                    key={comp.id}
                    isClickable
                    onClick={() => navigate(`/real-receipts/${comp.id}`)}
                  >
                    <TableCell>
                      <span className="font-mono text-xs text-neutral-500">
                        #{comp.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/real-orders/${comp.order_number}`);
                        }}
                        className="font-mono text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        #{comp.order_number}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-900 truncate max-w-[160px] block">
                        {comp.customer_name || 'Sin nombre'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-sm font-medium">{formatCurrency(comp.monto)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {comp.tipo === 'efectivo' ? (
                          <>
                            <Banknote size={14} className="text-green-600" />
                            <span className="text-xs text-green-700">Efectivo</span>
                          </>
                        ) : (
                          <>
                            <FileText size={14} className="text-blue-600" />
                            <span className="text-xs text-blue-700">Transfer.</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <EstadoBadge estado={comp.estado} />
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(comp.created_at), { addSuffix: true, locale: es })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {comp.file_url && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(comp.file_url);
                            }}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Ver imagen"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/real-receipts/${comp.id}`);
                          }}
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
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Mostrando {filteredComprobantes.length} de {comprobantes.length} comprobantes
          </span>
        </div>
      </div>

      {/* Modal de imagen */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Comprobante"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
