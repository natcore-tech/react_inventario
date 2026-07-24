// src/presentation/pages/public/OrdersPage.tsx
import { useEffect } from 'react'
import { useVentaStore } from '@/presentation/store/venta.store'
import {
  PackageCheck, Calendar, ShieldCheck,
  Truck, CheckCircle2, ShoppingBag
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Link } from 'react-router-dom'

export default function OrdersPage() {
  const ventas = useVentaStore((state) => state.ventas)
  const loadVentas = useVentaStore((state) => state.loadVentas)
  const isLoading = useVentaStore((state) => state.isLoading)

  useEffect(() => {
    loadVentas()
  }, [loadVentas])

  return (
    <div className="min-h-[85vh] py-10 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-cyber-card border-neon-purple-strong relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl shadow-purple-950/80">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-neon-purple text-xs font-bold">
            <PackageCheck className="w-4 h-4 text-purple-300" /> Historial de Compras Cyber-Noir
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white text-neon-glow">
            Mis Pedidos y Facturas
          </h1>
          <p className="text-xs md:text-sm text-purple-200/80 max-w-xl">
            Consulte el estado en tiempo real de sus compras, comprobantes digitales y detalles de envío.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link to="/">
            <Button className="font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              Volver a la Tienda
            </Button>
          </Link>
        </div>

        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
      </div>

      {/* Lista de Pedidos */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-purple-500/20 border-t-purple-400 animate-spin" />
          <p className="text-xs text-purple-300">Cargando sus pedidos desde el servidor...</p>
        </div>
      ) : ventas.length === 0 ? (
        <div className="py-20 rounded-3xl glass-cyber-card text-center space-y-4 max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto text-purple-500/30" />
          <h3 className="text-lg font-bold text-white">No tienes pedidos registrados</h3>
          <p className="text-xs text-purple-300/70">
            Realiza tu primera compra en la tienda para ver aquí tu historial y comprobante digital.
          </p>
          <Link to="/">
            <Button className="font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-500">
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ventas.map((v) => {
            const totalNum = parseFloat(v.total) || 0
            const estadoColor = v.estado === 'ANULADA' ? 'text-rose-400 border-rose-500/40 bg-rose-950/40' : 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'

            return (
              <div
                key={v.id}
                className="p-6 rounded-2xl glass-cyber-card border-purple-500/30 hover:border-purple-400/60 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-purple-500/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-purple-300 font-bold">
                        COMPROBANTE #FAC-{v.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${estadoColor}`}>
                        {v.estado || 'COMPLETADA'}
                      </span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      {new Date(v.fecha_emision).toLocaleDateString('es-EC', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-purple-300">Total con IVA (15%):</p>
                    <p className="text-2xl font-black text-white text-neon-glow">
                      ${totalNum.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Pago Confirmado
                  </div>
                  <div className="h-0.5 flex-1 bg-purple-500/30 mx-2 hidden sm:block" />
                  <div className="flex items-center gap-2 text-purple-300 font-semibold">
                    <Truck className="w-4 h-4 text-purple-400" /> Despacho en Bodega Central
                  </div>
                  <div className="h-0.5 flex-1 bg-purple-500/30 mx-2 hidden sm:block" />
                  <div className="flex items-center gap-2 text-purple-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Garantía Activa
                  </div>
                </div>

                {/* Detalles de Ítems */}
                {v.detalles && v.detalles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      Ítems de la Orden:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {v.detalles.map((d) => (
                        <div key={d.id} className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex justify-between items-center text-xs">
                          <span className="font-semibold text-white truncate">
                            {d.nombre_producto || `Producto #${d.producto}`}
                          </span>
                          <span className="text-purple-300 font-mono">
                            {d.cantidad} x ${parseFloat(d.precio_unitario_venta).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
