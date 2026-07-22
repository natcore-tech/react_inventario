// src/presentation/pages/public/DocsPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Play, Layers, Terminal, Lock,
  Sparkles, CheckCircle2, Copy, Check, ChevronRight, ArrowRight,
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
    <div className="rounded-2xl overflow-hidden border border-border/50 my-4 bg-background/80">
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
  { id: 'intro', label: 'Introducción', icon: BookOpen, desc: 'Conceptos clave y arquitectura' },
  { id: 'guide', label: 'Inicio Rápido', icon: Play, desc: 'Configuración en 5 pasos' },
  { id: 'modules', label: 'Módulos ERP', icon: Layers, desc: 'Funcionalidades del sistema' },
  { id: 'api', label: 'API REST Django', icon: Terminal, desc: 'Endpoints JWT y payloads' },
  { id: 'roles', label: 'Roles is_staff', icon: Lock, desc: 'Permisos de administración' },
]

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('intro')

  return (
    <div className="space-y-12 py-12">

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-8 pb-8 text-center space-y-4 max-w-3xl mx-auto">
        <span className="section-badge border-primary/40 bg-primary/10">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Documentación & Guía Técnica
        </span>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-foreground">
          Aprende a dominar <span className="gradient-text">Stock Master</span>
        </h1>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Guías completas para configurar tu inventario, conectar con la API REST de Django y utilizar los módulos de POS y multi-bodega.
        </p>
      </section>

      {/* Main split docs container */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar Menu */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-3 mb-3">Navegación</p>
            {DOCS_MENU.map(({ id, label, icon: Icon, desc }) => (
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
          <div className="lg:col-span-8 glass-card p-6 sm:p-8 space-y-6">

            {activeTab === 'intro' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Visión General</span>
                  <h2 className="text-2xl font-black text-foreground mt-3">¿Qué es Stock Master ERP?</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                    Stock Master es una plataforma web moderna para la gestión de inventarios, sucursales multi-bodega y cobros en punto de venta (POS). Desarrollado con tecnología de punta (React, Zustand y Django REST Framework).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-2">
                    <p className="text-xs font-extrabold text-foreground">💡 Control en Tiempo Real</p>
                    <p className="text-[11px] text-muted-foreground">Sincronización instantánea de stock al cobrar tickets o realizar traslados.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-2">
                    <p className="text-xs font-extrabold text-foreground">🔒 Seguridad Django REST</p>
                    <p className="text-[11px] text-muted-foreground">Evaluación estricta del campo is_staff en base de datos para restringir áreas clave.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Paso a Paso</span>
                  <h2 className="text-2xl font-black text-foreground mt-3">Guía de Inicio Rápido</h2>
                </div>

                <div className="space-y-3">
                  {[
                    '1. Inicia sesión en la plataforma utilizando tus credenciales de prueba o de usuario registrado.',
                    '2. Dirígete a la sección de Catálogos para configurar tus categorías, marcas y unidades de medida.',
                    '3. Crea tus Bodegas físicas y asigna las Ubicaciones Físicas correspondientes (pasillo/estante).',
                    '4. Registra tus Productos especificando el precio, impuesto, stock inicial y stock mínimo.',
                    '5. Abre un Turno de Caja en el módulo POS para efectuar ventas rápidas.',
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-background/60 border border-border/40 text-xs font-semibold text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">Módulos</span>
                  <h2 className="text-2xl font-black text-foreground mt-3">Estructura del Sistema</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Inventario & Productos', desc: 'SKUs, series únicas, marcas, imágenes y precios.' },
                    { title: 'Bodegas & Traslados', desc: 'Existencias separadas por sucursal y transferencias.' },
                    { title: 'POS & Turnos de Caja', desc: 'Terminal de cobro con soporte de lector de barras.' },
                    { title: 'Auditoría & Ajustes', desc: 'Registro inmutable de motivos de entrada/salida.' },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-1">
                      <p className="text-xs font-extrabold text-foreground">{title}</p>
                      <p className="text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/20">API REST</span>
                  <h2 className="text-2xl font-black text-foreground mt-3">Autenticación & Endpoints</h2>
                  <p className="text-xs text-muted-foreground mt-1">Payload de ejemplo para inicio de sesión en `/api/auth/login/`:</p>
                </div>

                <CodeBlock
                  filename="POST /api/auth/login/"
                  code={`{\n  "username": "admin",\n  "password": "admin1234"\n}`}
                />

                <p className="text-xs text-muted-foreground">Respuesta con tokens JWT y datos de perfil:</p>

                <CodeBlock
                  filename="Response 200 OK"
                  code={`{\n  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI...",\n  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI...",\n  "user_id": 1,\n  "username": "admin",\n  "is_staff": true\n}`}
                />
              </div>
            )}

            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">Permisos</span>
                  <h2 className="text-2xl font-black text-foreground mt-3">Gestión de Roles (`is_staff`)</h2>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <p className="text-xs font-extrabold text-amber-400">Regla Estricta del Sistema:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Si `is_staff = true`, el usuario cuenta con permisos administrativos totales para gestionar otros usuarios, realizar compras y auditorías. Si `is_staff = false`, el sistema le otorga acceso exclusivo al panel operativo (POS, Ventas y consulta de Inventario básico).
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* CTA Bottom */}
      <section className="container mx-auto px-4 lg:px-8 pb-8">
        <div className="rounded-3xl border border-primary/35 bg-card/60 backdrop-blur-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">¿Listo para comenzar?</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="btn-glow h-12 px-8 font-extrabold text-sm rounded-2xl">
                Crear cuenta gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
