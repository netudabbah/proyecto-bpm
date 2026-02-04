import { useState } from 'react';
import { Header } from '../components/layout';
import { Card, CardHeader, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui';
import {
  Shield,
  Webhook,
  MessageSquare,
  Save,
  Key,
  Building,
} from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState({
    emailOnValidation: true,
    emailOnRejection: true,
    pushNotifications: false,
    dailyDigest: true,
  });

  return (
    <div className="min-h-screen">
      <Header title="Configuración" subtitle="Administrá tu cuenta y preferencias" />

      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader
                title="Información del Perfil"
                description="Actualizá tus datos personales"
              />
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                    AG
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">
                      Cambiar Foto
                    </Button>
                    <p className="text-xs text-neutral-500 mt-1">
                      JPG, GIF o PNG. Tamaño máximo 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nombre" defaultValue="Ana" />
                  <Input label="Apellido" defaultValue="García" />
                  <Input label="Email" type="email" defaultValue="ana.garcia@company.com" />
                  <Input label="Teléfono" type="tel" defaultValue="+54 11 4567-8901" />
                </div>

                <div className="flex justify-end pt-4">
                  <Button leftIcon={<Save size={16} />}>Guardar Cambios</Button>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Empresa" description="Datos de tu organización" />
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Razón Social" defaultValue="E-Commerce Corp" />
                  <Input label="CUIT" defaultValue="30-12345678-9" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader
                title="Notificaciones por Email"
                description="Configurá cuándo querés recibir emails"
              />
              <div className="mt-6 space-y-4">
                {[
                  {
                    key: 'emailOnValidation',
                    title: 'Pago Validado',
                    description: 'Recibí un email cuando se confirma un pago',
                  },
                  {
                    key: 'emailOnRejection',
                    title: 'Pago Rechazado',
                    description: 'Recibí un email cuando se rechaza un pago',
                  },
                  {
                    key: 'dailyDigest',
                    title: 'Resumen Diario',
                    description: 'Recibí un resumen de las operaciones del día',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) =>
                          setNotifications((n) => ({ ...n, [item.key]: e.target.checked }))
                        }
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Notificaciones Push"
                description="Notificaciones en el navegador en tiempo real"
              />
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Activar Notificaciones Push</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Recibí alertas instantáneas en tu navegador
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.pushNotifications}
                      onChange={(e) =>
                        setNotifications((n) => ({ ...n, pushNotifications: e.target.checked }))
                      }
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader
                title="Tiendanube"
                description="Conectá tu tienda de e-commerce"
                action={
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md">
                    Conectado
                  </span>
                }
              />
              <div className="mt-6">
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-neutral-200">
                    <Building size={24} className="text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">Mi Tienda</p>
                    <p className="text-xs text-neutral-500">mitienda.tiendanube.com</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Desconectar
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="WhatsApp Business"
                description="Enviá notificaciones automáticas a los clientes"
                action={
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md">
                    Conectado
                  </span>
                }
              />
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <MessageSquare size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">Cuenta Business</p>
                    <p className="text-xs text-neutral-500">+54 11 9876-5432</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Webhooks"
                description="Enviá datos a servicios externos"
              />
              <div className="mt-6 space-y-4">
                <Input
                  label="URL del Webhook"
                  placeholder="https://tu-servicio.com/webhook"
                  leftIcon={<Webhook size={16} />}
                />
                <div className="flex justify-end">
                  <Button variant="secondary">Agregar Webhook</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader
                title="Cambiar Contraseña"
                description="Actualizá la contraseña de tu cuenta"
              />
              <div className="mt-6 space-y-4">
                <Input label="Contraseña Actual" type="password" />
                <Input label="Nueva Contraseña" type="password" />
                <Input label="Confirmar Nueva Contraseña" type="password" />
                <div className="flex justify-end pt-4">
                  <Button leftIcon={<Key size={16} />}>Actualizar Contraseña</Button>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Autenticación de Dos Factores"
                description="Agregá una capa extra de seguridad"
              />
              <div className="mt-6">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center">
                      <Shield size={20} className="text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Autenticación de Dos Factores
                      </p>
                      <p className="text-xs text-neutral-500">No habilitado</p>
                    </div>
                  </div>
                  <Button variant="secondary">Habilitar</Button>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Sesiones Activas"
                description="Administrá tus dispositivos conectados"
              />
              <div className="mt-6 space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'Buenos Aires, AR', current: true },
                  { device: 'iPhone 14', location: 'Buenos Aires, AR', current: false },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 text-xs text-emerald-600">(Actual)</span>
                        )}
                      </p>
                      <p className="text-xs text-neutral-500">{session.location}</p>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Revocar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
