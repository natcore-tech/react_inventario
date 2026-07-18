// src/presentation/pages/facturacion/MovimientosPage.tsx
import { useEffect, useState } from 'react'
import {
  Loader2,
  AlertCircle,
  Inbox,
  ArrowDownToLine,
  ArrowUpFromLine,
  PlusCircle,
  MinusCircle,
  Plus
} from 'lucide-react'

import { useMovimientoInventarioStore } from '@/presentation/store/movimiento-inventario.store'
import { Button } from '@/presentation/components/ui/button'
import MovimientoFormDialog from './MovimientoFormDialog'

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

function getTipoIcon(tipo: string) {
  switch (tipo) {
    case 'ENTRADA': return <ArrowDownToLine className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    case 'SALIDA': return <ArrowUpFromLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
    case 'AJUSTE_POS': return <PlusCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    case 'AJUSTE_NEG': return <MinusCircle className="h-4 w-4 text-destructive" />
    default: return null
  }
}

function getTipoColor(tipo: string) {
  switch (tipo) {
    case 'ENTRADA': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    case 'SALIDA': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    case 'AJUSTE_POS': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    case 'AJUSTE_NEG': return 'bg-destructive/10 text-destructive border-destructive/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function MovimientosPage() {
  const { movimientos, isLoading, error, loadMovimientos } = useMovimientoInventarioStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadMovimientos()
  }, [loadMovimientos])

  // ── Estado: Cargando ────────────────────────────────────────────────────
  if (isLoading && movimientos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando movimientos de inventario...</p>
      </div>
    )
  }

  // ── Estado: Error ───────────────────────────────────────────────────────
  if (error && movimientos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" onClick={loadMovimientos}>
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
            Movimientos de Inventario
          </h1>
          <p className="text-sm text-muted-foreground">
            Registro histórico de entradas, salidas y ajustes de stock.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Registrar Movimiento
        </Button>
      </div>

      {/* ── Tabla Histórica ──────────────────────────────────────────── */}
      <div className="space-y-4">
        {movimientos.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay movimientos registrados.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoría</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Cantidad</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Motivo / Proveedor</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {movimientos.map((mov) => (
                    <tr
                      key={mov.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-muted-foreground">
                          {formatDateTime(mov.creado_en)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getTipoColor(mov.tipo)}`}>
                          {getTipoIcon(mov.tipo)}
                          {mov.tipo_display}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{mov.producto_nombre}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground">{mov.producto_categoria}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${
                          ['SALIDA', 'AJUSTE_NEG'].includes(mov.tipo) ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {['SALIDA', 'AJUSTE_NEG'].includes(mov.tipo) ? '-' : '+'}{mov.cantidad}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <div className="flex flex-col truncate">
                          {mov.motivo ? (
                            <span className="truncate text-foreground" title={mov.motivo}>{mov.motivo}</span>
                          ) : (
                            <span className="text-muted-foreground italic">Sin motivo</span>
                          )}
                          {mov.proveedor_nombre && (
                            <span className="text-xs text-muted-foreground font-medium truncate">
                              Prov: {mov.proveedor_nombre}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground text-xs uppercase tracking-wide">
                          {mov.usuario}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <MovimientoFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => loadMovimientos()}
      />
    </div>
  )
}
