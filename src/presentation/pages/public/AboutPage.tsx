// src/presentation/pages/public/AboutPage.tsx
import { Link } from 'react-router-dom'
import { Zap, ShieldCheck, Globe, Award, ArrowRight } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Hero Brand Story */}
      <div className="p-10 md:p-14 rounded-3xl glass-cyber-card border-neon-purple-strong relative overflow-hidden shadow-2xl shadow-purple-950/80">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-neon-purple text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-purple-300" /> Nuestra Visión Cyber-Noir
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white text-neon-glow leading-tight">
            NEXUS Cyber-Marketplace 2026
          </h1>
          <p className="text-sm md:text-base text-purple-200/80 leading-relaxed">
            Reinventando la experiencia de compra en línea mediante un modelo abierto estilo Amazon, con estética morada neón y sincronización en tiempo real desde la Bodega Central.
          </p>
        </div>

        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Valores de la Marca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Calidad y Trazabilidad</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Cada producto en nuestro catálogo proviene de proveedores verificados y cuenta con registro inmutable en inventario.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Logística Abierta</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Acceso libre para clientes al catálogo masivo, comprobantes digitales y seguimiento de pedidos sin barreras.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Seguridad Comercial</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Validación instantánea de ventas y actualización automática de existencias para eliminar sobreventas o faltantes.
          </p>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/50 via-purple-800/40 to-indigo-900/50 border border-purple-500/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-white text-neon-glow">
            Únase a la experiencia de compra Cyber-Noir
          </h3>
          <p className="text-xs text-purple-200/80 mt-1">
            Catálogo disponible las 24 horas con despacho desde Bodega Central.
          </p>
        </div>
        <Link to="/">
          <Button size="lg" className="font-bold rounded-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            Explorar Tienda <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
