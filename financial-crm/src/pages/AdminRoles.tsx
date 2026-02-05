import { useState, useEffect } from 'react';
import { Header } from '../components/layout';
import { RefreshCw, AlertCircle, Check, Save, ChevronDown } from 'lucide-react';
import { fetchRoles, fetchPermissions, updateRolePermissions, Role, Permission } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Pedidos (General)',
  orders_pago: 'Pedidos - Estados de Pago',
  orders_estado: 'Pedidos - Estados Logísticos',
  receipts: 'Comprobantes (General)',
  receipts_estado: 'Comprobantes - Estados',
  users: 'Usuarios',
};

const PERMISSION_LABELS: Record<string, string> = {
  'dashboard.view': 'Ver dashboard',
  // Orders general
  'orders.view': 'Ver pedidos',
  'orders.print': 'Imprimir pedido',
  'orders.update_status': 'Cambiar estado logístico',
  'orders.create_cash_payment': 'Registrar pago en efectivo',
  // Orders por estado de pago
  'orders.view_pendiente': 'Ver pendientes de pago',
  'orders.view_a_confirmar': 'Ver a confirmar',
  'orders.view_parcial': 'Ver pago parcial',
  'orders.view_total': 'Ver pago total',
  'orders.view_rechazado': 'Ver rechazados',
  // Orders por estado de pedido
  'orders.view_pendiente_pago': 'Ver pendiente de pago',
  'orders.view_a_imprimir': 'Ver a imprimir',
  'orders.view_armado': 'Ver armados',
  'orders.view_enviado': 'Ver enviados',
  'orders.view_en_calle': 'Ver en calle',
  'orders.view_retirado': 'Ver retirados',
  // Receipts general
  'receipts.view': 'Ver comprobantes',
  'receipts.download': 'Descargar imágenes',
  'receipts.upload_manual': 'Subir manual',
  'receipts.confirm': 'Confirmar',
  'receipts.reject': 'Rechazar',
  // Receipts por estado
  'receipts.view_pendiente': 'Ver pendientes',
  'receipts.view_a_confirmar': 'Ver a confirmar',
  'receipts.view_parcial': 'Ver parciales',
  'receipts.view_total': 'Ver totales',
  'receipts.view_rechazado': 'Ver rechazados',
  // Users
  'users.view': 'Ver usuarios',
  'users.create': 'Crear',
  'users.edit': 'Editar',
  'users.disable': 'Desactivar',
  'users.assign_role': 'Asignar rol',
};

const MODULE_ORDER = ['dashboard', 'orders', 'orders_pago', 'orders_estado', 'receipts', 'receipts_estado', 'users'];

export function AdminRoles() {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const canEdit = hasPermission('users.assign_role');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        fetchRoles(),
        fetchPermissions()
      ]);
      setRoles(rolesData);

      // Flatten permissions from grouped object
      const permsList: Permission[] = [];
      Object.values(permissionsData).forEach((perms) => {
        permsList.push(...(perms as Permission[]));
      });
      setAllPermissions(permsList);

      // Seleccionar primer rol por defecto
      if (rolesData.length > 0 && !selectedRoleId) {
        const firstRole = rolesData[0];
        setSelectedRoleId(firstRole.id);
        setEditedPermissions(firstRole.permissions);
        setOriginalPermissions(firstRole.permissions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectRole = (role: Role) => {
    setSelectedRoleId(role.id);
    setEditedPermissions(role.permissions);
    setOriginalPermissions(role.permissions);
    setSuccessMessage(null);
    setDropdownOpen(false);
  };

  const togglePermission = (permissionKey: string) => {
    if (!canEdit) return;

    setEditedPermissions(prev => {
      if (prev.includes(permissionKey)) {
        return prev.filter(p => p !== permissionKey);
      } else {
        return [...prev, permissionKey];
      }
    });
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (!selectedRoleId || !canEdit) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedRole = await updateRolePermissions(selectedRoleId, editedPermissions);
      setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
      setOriginalPermissions(editedPermissions);
      setSuccessMessage('Permisos guardados correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar permisos');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify([...editedPermissions].sort()) !== JSON.stringify([...originalPermissions].sort());
  const selectedRole = roles.find(r => r.id === selectedRoleId);

  // Agrupar permisos por módulo
  const permissionsByModule = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error && roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-8 text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error al cargar datos</h3>
          <p className="text-neutral-500 mb-4">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Permisos por Rol" subtitle="Configura los permisos de cada rol del sistema" />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Selector de rol */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-neutral-600 mb-2 uppercase tracking-wide">
            Rol:
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-xl text-left hover:border-neutral-300 transition-colors"
            >
              <span className="font-medium text-neutral-900 capitalize">
                {selectedRole?.name || 'Seleccionar rol'}
              </span>
              <ChevronDown size={20} className={`text-neutral-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role)}
                    className={`w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors capitalize ${
                      role.id === selectedRoleId ? 'bg-neutral-100 font-medium' : ''
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="border-neutral-200 mb-8" />

        {/* Mensajes */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm flex items-center gap-2">
            <Check size={18} />
            {successMessage}
          </div>
        )}

        {/* Lista de permisos por módulo */}
        {selectedRole && (
          <div className="space-y-8">
            {MODULE_ORDER.map(module => {
              const modulePerms = permissionsByModule[module];
              if (!modulePerms || modulePerms.length === 0) return null;

              return (
                <div key={module}>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    {MODULE_LABELS[module] || module}
                  </h3>
                  <div className="space-y-3 pl-1">
                    {modulePerms.map(permission => {
                      const isChecked = editedPermissions.includes(permission.key);
                      return (
                        <label
                          key={permission.id}
                          className={`flex items-center gap-3 cursor-pointer py-1 ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(permission.key)}
                            disabled={!canEdit}
                            className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0"
                          />
                          <span className="text-neutral-700">
                            {PERMISSION_LABELS[permission.key] || permission.key}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Botón guardar */}
            {canEdit && (
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg transition-all mt-8 ${
                  hasChanges && !saving
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar cambios
                  </>
                )}
              </button>
            )}

            {!canEdit && (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm text-center mt-8">
                No tienes permiso para editar roles. Contacta al administrador.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
