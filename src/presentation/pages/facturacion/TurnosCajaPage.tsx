// src/presentation/pages/facturacion/TurnosCajaPage.tsx
import { useEffect, useState } from 'react'
import {
  Loader2,
  AlertCircle,
  Inbox,
  Lock,
  Unlock,
  Plus,
  Ban,
} from 'lucide-react'

import { useTurnoCajaStore, useTurnoAbiertoActual } from '@/presentation/store/turno-caja.store'
import type { TurnoCaja } from '@/domain/entities/turno-caja.entity'

import AbrirTurnoDialog from './AbrirTurnoDialog'
import CerrarTurnoDialog from './CerrarTurnoDialog'
import { Button } from '@/presentation/components/ui/button'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(isoString: string | null): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatMoney(val: string | null): string {
  if (!val) return '—'
  return `$${parseFloat(val).toFixed(2)}`
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function TurnosCajaPage() {
  const { turnos, isLoading, error, loadTurnos } = useTurnoCajaStore()
  const turnoActivo = useTurnoAbiertoActual()

  const [isAbrirOpen, setIsAbrirOpen] = useState(false)
  const [isCerrarOpen, setIsCerrarOpen] = useState(false)
  const [turnoParaCerrar, setTurnoParaCerrar] = useState<TurnoCaja | null>(null)

  useEffect(() => {
    loadTurnos()
  }, [loadTurnos])

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleAbrirTurno() {
    setIsAbrirOpen(true)
  }

  function handleCerrarTurno(turno: TurnoCaja) {
    setTurnoParaCerrar(turno)
    setIsCerrarOpen(true)
  }

  // ── Estado: Cargando ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando turnos de caja...</p>
      </div>
    )
  }

  // ── Estado: Error ───────────────────────────────────────────────────────
  if (error && turnos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button id="btn-retry-turnos" variant="outline" onClick={loadTurnos}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* ── Encabezado ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Turnos de Caja
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestión de apertura y cierre de caja.
            </p>
          </div>
          <div>
            {turnoActivo ? (
              <Button 
                variant="destructive" 
                onClick={() => handleCerrarTurno(turnoActivo)}
              >
                <Ban className="h-4 w-4 mr-2" />
                Cerrar Caja (Turno Actual)
              </Button>
            ) : (
              <Button onClick={handleAbrirTurno}>
                <Plus className="h-4 w-4 mr-2" />
                Abrir Turno
              </Button>
            )}
          </div>
        </div>

        {/* ── Tarjeta de Estado Actual ─────────────────────────────────── */}
        {turnoActivo ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Unlock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Turno Activo
                </h2>
                <p className="text-sm text-muted-foreground">
                  Abierto el {formatDateTime(turnoActivo.fecha_apertura)} por {turnoActivo.nombre_cajero}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Fondo de Apertura:</span>
                <p className="text-xl font-bold text-foreground">
                  {formatMoney(turnoActivo.monto_apertura)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Caja Cerrada
                </h2>
                <p className="text-sm text-muted-foreground">
                  No tienes ningún turno activo en este momento. Abre un turno para comenzar a facturar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabla Histórica ──────────────────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Historial de Turnos</h3>
          
          {turnos.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No hay turnos registrados en el sistema.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cajero</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Apertura</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cierre</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Monto Inicial</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Monto Final</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {turnos.map((turno) => (
                      <tr
                        key={turno.id}
                        className={`transition-colors hover:bg-muted/20 ${turno.estado === 'ABIERTO' ? 'bg-primary/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{turno.nombre_cajero}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground">
                            {formatDateTime(turno.fecha_apertura)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground">
                            {formatDateTime(turno.fecha_cierre)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-mono">{formatMoney(turno.monto_apertura)}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-mono">{formatMoney(turno.monto_cierre)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            {turno.estado === 'ABIERTO' ? (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                Abierto
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                Cerrado
                              </span>
                            )}
                          </div>
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

      {/* ── Dialogs ──────────────────────────────────────────────────────── */}
      <AbrirTurnoDialog
        open={isAbrirOpen}
        onOpenChange={setIsAbrirOpen}
      />

      <CerrarTurnoDialog
        open={isCerrarOpen}
        onOpenChange={(open) => {
          setIsCerrarOpen(open)
          if (!open) setTurnoParaCerrar(null)
        }}
        turno={turnoParaCerrar}
      />
    </>
  )
}
