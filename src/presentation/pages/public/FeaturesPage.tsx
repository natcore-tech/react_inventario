// src/presentation/pages/public/FeaturesPage.tsx
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Truck, Cpu, CreditCard, RefreshCw,
  Sparkles, Zap, ArrowRight
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header Hero */}
      <div className="p-10 rounded-3xl glass-cyber-card border-neon-purple-strong text-center space-y-4 shadow-2xl shadow-purple-950/80">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-neon-purple text-xs font-bold uppercase tracking-wider mx-auto">
          <Sparkles className="w-4 h-4 text-purple-300" /> Excelencia Cyber-Noir 2026
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white text-neon-glow">
          Garantía y Beneficios del Comercio NEXUS
        </h1>
        <p className="text-xs md:text-sm text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
          Diseñado para brindarle una experiencia de compra directa, transparente y segura, respaldada por la Bodega Central.
        </p>
      </div>

      {/* Grid de Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Despacho Cyber-Express</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Envíos coordinados desde la Bodega Central en Ecuador con seguimiento digital de la orden en tiempo real.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Números de Serie Únicos</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Cada artículo de alto valor cuenta con un número de serie registrado para garantizar su autenticidad y soporte técnico.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Facturación 15% IVA Transparente</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Comprobantes oficiales emitidos automáticamente con desglose del precio base e impuesto de ley.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Devoluciones Sin Complicaciones</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Gestión simplificada de devoluciones para clientes con reintegro automático de existencias si el estado es óptimo.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Pagos Encriptados</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Pasarela multi-método (Tarjetas, Transferencias, Efectivo) con retroalimentación visual en neón y confirmación inmediata.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-cyber-card border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Soporte Continuo</h3>
          <p className="text-xs text-purple-300/70 leading-relaxed">
            Asistencia en línea para consultas de catálogo, disponibilidad de productos y estado de envío de sus compras.
          </p>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/50 via-purple-800/40 to-indigo-900/50 border border-purple-500/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-white text-neon-glow">
            ¿Listo para adquirir su tecnología Cyber-Noir?
          </h3>
          <p className="text-xs text-purple-200/80 mt-1">
            Explore el catálogo masivo y procese su pedido en segundos.
          </p>
        </div>
        <Link to="/">
          <Button size="lg" className="font-bold rounded-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            Ir a la Tienda <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
