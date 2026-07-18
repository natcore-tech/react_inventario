// src/presentation/pages/facturacion/HistorialVentasPage.tsx
import { useEffect } from 'react'
import {
  Loader2,
  AlertCircle,
  Inbox,
  Ban,
} from 'lucide-react'

import { useVentaStore } from '@/presentation/store/venta.store'
import { Button } from '@/presentation/components/ui/button'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatMoney(val: string): string {
  return `$${parseFloat(val).toFixed(2)}`
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function HistorialVentasPage() {
  const { ventas, isLoading, error, loadVentas, isSaving, anularVenta } = useVentaStore()

  useEffect(() => {
    loadVentas()
  }, [loadVentas])

  // ── Handlers ────────────────────────────────────────────────────────────

  async function handleAnularVenta(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas anular esta venta? Esta acción no se puede deshacer.')) {
      return
    }
    try {
      await anularVenta(id)
    } catch {
      // Error manejado en el store
    }
  }

  // ── Estado: Cargando ────────────────────────────────────────────────────
  if (isLoading && ventas.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando historial de ventas...</p>
      </div>
    )
  }

  // ── Estado: Error ───────────────────────────────────────────────────────
  if (error && ventas.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" onClick={loadVentas}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* ── Encabezado ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Historial de Ventas
          </h1>
          <p className="text-sm text-muted-foreground">
            Revisa todas las ventas realizadas, montos y estados.
          </p>
        </div>
      </div>

      {/* ── Tabla Histórica ──────────────────────────────────────────── */}
      <div className="space-y-4">
        {ventas.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay ventas registradas en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Emisión</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cajero</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Subtotal</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">IVA</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ventas.map((venta) => (
                    <tr
                      key={venta.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground">
                          {formatDateTime(venta.fecha_emision)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{venta.nombre_cliente}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground">{venta.nombre_cajero}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-muted-foreground">{formatMoney(venta.subtotal)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-muted-foreground">{formatMoney(venta.iva)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono font-bold text-foreground">{formatMoney(venta.total)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          {venta.estado === 'PAGADA' && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              Pagada
                            </span>
                          )}
                          {venta.estado === 'EMITIDA' && (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                              Emitida
                            </span>
                          )}
                          {venta.estado === 'ANULADA' && (
                            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                              Anulada
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {venta.estado !== 'ANULADA' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={isSaving}
                            onClick={() => handleAnularVenta(venta.id)}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Anular
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
