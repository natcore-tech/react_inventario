// src/presentation/pages/public/DocsPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Play, Layers, Terminal, Lock,
  Sparkles, Copy, Check, ChevronRight,
  Search, Zap, ArrowRight, Shield,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return { copied, copy }
}

function CodeBlock({ code, language = 'json', filename }: { code: string; language?: string; filename?: string }) {
  const { copied, copy } = useCopy()
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 my-4 bg-background/80 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          </div>
          {filename && <span className="text-[11px] font-mono text-muted-foreground ml-2">{filename}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground bg-muted/60 border border-border/40 rounded px-2 py-0.5 font-mono">{language}</span>
          <button
            onClick={() => copy(code)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors px-2 py-0.5 rounded hover:bg-primary/10"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const DOCS_MENU = [
  { id: 'intro', label: 'Introducción ERP', icon: BookOpen, desc: 'Conceptos clave y arquitectura' },
  { id: 'guide', label: 'Guía de Inicio Rápido', icon: Play, desc: 'Configuración en 5 pasos' },
  { id: 'modules', label: 'Módulos y Catálogos', icon: Layers, desc: 'Estructura funcional' },
  { id: 'api', label: 'API REST Django', icon: Terminal, desc: 'Endpoints JWT y payloads' },
  { id: 'roles', label: 'Roles `is_staff`', icon: Lock, desc: 'Matriz de seguridad' },
]

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('intro')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMenu = DOCS_MENU.filter(m =>
    m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-16 py-12">

      {/* Hero Header with Search Bar */}
      <section className="relative overflow-hidden pt-8 pb-8 text-center space-y-6 max-w-4xl mx-auto px-4">
        <span className="section-badge border-primary/40 bg-primary/10">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Centro de Documentación & Guías Técnicas
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
          Documentación oficial de <span className="gradient-text">Stock Master</span>
        </h1>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Encuentra especificaciones técnicas, guías paso a paso, ejemplos de integración con la API REST de Django y la matriz de permisos para usuarios con rol is_staff.
        </p>

        {/* Search Bar Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por módulo, endpoint o palabra clave..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-card/60 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg"
          />
        </div>
      </section>

      {/* Main split docs container */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2 mb-2">Secciones Disponibles</p>
            {filteredMenu.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                  activeTab === id
                    ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/5'
                    : 'border-border/40 bg-card/40 hover:bg-card hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${activeTab === id ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted/40 border-border/40 text-muted-foreground'}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === id ? 'text-primary translate-x-1' : 'text-muted-foreground/50'}`} />
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8 glass-card p-6 sm:p-10 space-y-8 border-primary/30">

            {activeTab === 'intro' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Visión General</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-3">¿Qué es Stock Master ERP?</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                    Stock Master es una plataforma empresarial moderna concebida para reemplazar planillas manuales y sistemas obsoletos. Permite gestionar sucursales multi-bodega, cobrar tickets en terminal POS ultrarrápida y supervisar trazabilidad unitaria por número de serie.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-background/60 border border-border/40 space-y-2">
                    <p className="text-xs font-extrabold text-foreground flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Sincronización en Vivo
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Actualización automática de existencias al cerrar facturas en POS o autorizar traslados entre depósitos.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/60 border border-border/40 space-y-2">
                    <p className="text-xs font-extrabold text-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-400" /> Seguridad Django REST
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Evaluación del campo is_staff en la base de datos de Django para segmentación de permisos.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                  <p className="text-xs font-bold text-primary">Arquitectura Técnica:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Frontend desarrollado en React 19 con Zustand para estado global local, Tailwind CSS v4 para diseño adaptativo y Axios para conexión con la API REST de Django.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Guía de Inicio</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-3">Configuración en 5 Pasos</h2>
                  <p className="text-xs text-muted-foreground mt-1">Sigue esta secuencia paso a paso para poner tu negocio en producción rápidamente.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Registro e Inicio de Sesión JWT', desc: 'Ingresa con tu cuenta. El sistema validará tu token JWT de acceso y leerá la propiedad is_staff de tu perfil.' },
                    { step: '2', title: 'Configurar Catálogos Base', desc: 'Accede al menú de Administración y define tus Categorías, Marcas y Unidades de Medida antes de crear productos.' },
                    { step: '3', title: 'Registrar Bodegas & Ubicaciones', desc: 'Crea tus bodegas físicas (ej: Bodega Central, Sucursal Norte) y asigna las ubicaciones físicas por pasillo y estante.' },
                    { step: '4', title: 'Alta de Productos & Stock Inicial', desc: 'Carga tus SKUs indicando precio, costo promedio, stock inicial y marca la opción de número de serie si lo requiere.' },
                    { step: '5', title: 'Apertura de Turno & Ventas POS', desc: 'Abre un turno de caja con tu monto inicial en efectivo y realiza tus primeras ventas escaneando códigos de barras.' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-4 p-4 rounded-2xl bg-background/60 border border-border/40">
                      <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/35 text-primary flex items-center justify-center font-black text-xs shrink-0">
                        {step}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-foreground">{title}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">Estructura Módulos</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-3">Glosario de Módulos ERP</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: '📦 Productos & SKUs', desc: 'Control de artículos con imagen, precio de venta, impuesto, stock mínimo e historial de precios.' },
                    { title: '🏢 Bodegas & Ubicaciones', desc: 'Gestión de depósitos físicos, pasillos, estantes y transferencias de mercadería con estado en tránsito.' },
                    { title: '🧾 POS & Cajas', desc: 'Cobro de facturas y tickets en segundos, cuadre ciego de caja e historial de turnos.' },
                    { title: '📋 Órdenes de Compra', desc: 'Requerimientos a proveedores con recepción e incremento directo al inventario.' },
                    { title: '🏷️ Números de Serie', desc: 'Seguimiento unitario e inmutable por cada ítem de alto valor vendido o transferido.' },
                    { title: '👤 Gestión de Usuarios', desc: 'Administración de usuarios y promoción de permisos is_staff para supervisores.' },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-1.5">
                      <p className="text-xs font-extrabold text-foreground">{title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/20">API REST</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-3">Integración Backend Django</h2>
                  <p className="text-xs text-muted-foreground mt-1">Endpoints principales para consultar datos en formato JSON:</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-foreground">1. Autenticación y obtención de tokens JWT:</p>
                    <CodeBlock
                      filename="POST /api/auth/login/"
                      code={`{\n  "username": "admin",\n  "password": "admin1234"\n}`}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-foreground">2. Respuesta del Servidor (Response 200 OK):</p>
                    <CodeBlock
                      filename="Response 200 OK"
                      code={`{\n  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI...",\n  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI...",\n  "user_id": 1,\n  "username": "admin",\n  "is_staff": true\n}`}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-foreground">3. Header de Autorización para peticiones HTTP:</p>
                    <CodeBlock
                      language="http"
                      code={`Authorization: Bearer <access_token>\nContent-Type: application/json`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roles' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">Seguridad</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-3">Matriz de Roles (`is_staff`)</h2>
                </div>

                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                  <p className="text-xs font-extrabold text-amber-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Regla de Enrutamiento en el Frontend:
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Al iniciar sesión o refrescar la página, el cliente evalúa la respuesta de <code className="text-primary font-mono">/api/users/profile/</code>. Si la propiedad <code className="text-primary font-mono">is_staff</code> es <strong className="text-foreground">true</strong>, se otorga acceso a la Consola de Administración (Gestión de Usuarios, Compras y Auditoría). Si es <strong className="text-foreground">false</strong>, el usuario ingresa directo a su Panel Operativo (Ventas POS y Catálogos básicos).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-background/50 border border-primary/30 space-y-2">
                    <p className="text-xs font-extrabold text-primary">👑 Administrador (`is_staff = true`)</p>
                    <ul className="text-[11px] text-muted-foreground space-y-1">
                      <li>• Métricas globales y ventas consolidadas</li>
                      <li>• Gestión de usuarios y cambios de rol</li>
                      <li>• Creación de órdenes de compra</li>
                      <li>• Auditoría inmutable de movimientos</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-2">
                    <p className="text-xs font-extrabold text-muted-foreground">🛒 Operador (`is_staff = false`)</p>
                    <ul className="text-[11px] text-muted-foreground space-y-1">
                      <li>• Terminal POS y cobro de tickets</li>
                      <li>• Apertura y cierre de turno de caja</li>
                      <li>• Consulta de stock por sucursal</li>
                      <li>• Gestión de clientes de la tienda</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* API Reference Table */}
      <section className="container mx-auto px-4 lg:px-8 border-t border-border/40 pt-16">
        <div className="text-center mb-10 space-y-2 max-w-2xl mx-auto">
          <span className="section-badge">Referencia Rápida API</span>
          <h2 className="text-2xl font-black text-foreground">Endpoints Principales</h2>
        </div>

        <div className="glass-card overflow-hidden border-primary/30 max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/50 text-foreground uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-black">Método</th>
                  <th className="p-3.5 font-black">Endpoint</th>
                  <th className="p-3.5 font-black">Descripción</th>
                  <th className="p-3.5 font-black">Permiso Requerido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-muted-foreground font-mono">
                <tr>
                  <td className="p-3.5 text-emerald-400 font-bold">POST</td>
                  <td className="p-3.5 text-foreground font-bold">/api/auth/login/</td>
                  <td className="p-3.5 font-sans">Obtener tokens JWT de acceso y refresco</td>
                  <td className="p-3.5 font-sans text-emerald-400">Público</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-blue-400 font-bold">GET</td>
                  <td className="p-3.5 text-foreground font-bold">/api/users/profile/</td>
                  <td className="p-3.5 font-sans">Obtener perfil del usuario autenticado</td>
                  <td className="p-3.5 font-sans text-primary">Autenticado</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-blue-400 font-bold">GET</td>
                  <td className="p-3.5 text-foreground font-bold">/api/productos/</td>
                  <td className="p-3.5 font-sans">Listado de catálogo con filtro de bodega</td>
                  <td className="p-3.5 font-sans text-primary">Autenticado</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-emerald-400 font-bold">POST</td>
                  <td className="p-3.5 text-foreground font-bold">/api/pos/ventas/</td>
                  <td className="p-3.5 font-sans">Registrar ticket de venta en turno de caja</td>
                  <td className="p-3.5 font-sans text-primary">Autenticado</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-purple-400 font-bold">PATCH</td>
                  <td className="p-3.5 text-foreground font-bold">/api/users/admin/{'{id}'}/</td>
                  <td className="p-3.5 font-sans">Modificar estado y rol (is_staff) de usuario</td>
                  <td className="p-3.5 font-sans text-amber-400">is_staff = true</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="container mx-auto px-4 lg:px-8 pb-8">
        <div className="rounded-3xl border border-primary/35 bg-card/60 backdrop-blur-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">¿Tienes dudas sobre la integración?</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Nuestro equipo técnico está disponible para ayudarte en la migración de tu catálogo actual a Stock Master.
          </p>
          <Link to="/register">
            <Button size="lg" className="btn-glow font-extrabold px-10 h-12 rounded-2xl text-sm">
              Registrar mi Cuenta de Prueba <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
