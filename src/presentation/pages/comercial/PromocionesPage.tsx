// src/presentation/pages/comercial/PromocionesPage.tsx
import { useEffect, useState } from 'react'
import {
  Loader2,
  Tag,
  AlertCircle,
  TicketPercent,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'

import { usePromocionStore } from '@/presentation/store/promocion.store'
import type { Promocion } from '@/domain/entities/promocion.entity'
import PromocionFormDialog from './PromocionFormDialog'
import { Button } from '@/presentation/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esVigente(fechaInicio: string, fechaFin: string): boolean {
  const hoy = new Date().toISOString().slice(0, 10)
  return fechaInicio <= hoy && fechaFin >= hoy
}

function formatFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PromocionesPage() {
  const { promociones, isLoading, isSaving, error, loadPromociones, deletePromocion } =
    usePromocionStore()

  // ── Estado local de UI ────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Promocion | null>(null)

  useEffect(() => {
    loadPromociones()
  }, [loadPromociones])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleNew() {
    setSelectedPromocion(null)
    setIsFormOpen(true)
  }

  function handleEdit(promocion: Promocion) {
    setSelectedPromocion(promocion)
    setIsFormOpen(true)
  }

  async function handleDeleteExecute() {
    if (!deleteTarget) return
    await deletePromocion(deleteTarget.id)
    setDeleteTarget(null)
  }

  // ── Estado: cargando ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando promociones…</p>
      </div>
    )
  }

  // ── Estado: error ─────────────────────────────────────────────────────────
  if (error && promociones.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button id="btn-retry-promociones" variant="outline" onClick={loadPromociones}>
          Reintentar
        </Button>
      </div>
    )
  }

  // ── Métricas ──────────────────────────────────────────────────────────────
  const totalActivas = promociones.filter((p) => p.es_activa).length
  const totalVigentes = promociones.filter(
    (p) => p.es_activa && esVigente(p.fecha_inicio, p.fecha_fin),
  ).length
  const totalInactivas = promociones.filter((p) => !p.es_activa).length

  return (
    <>
      <div className="space-y-6 p-6">
        {/* ── Encabezado ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Promociones</h1>
            <p className="text-sm text-muted-foreground">
              {promociones.length} promoción{promociones.length !== 1 ? 'es' : ''} en el sistema
            </p>
          </div>
          <Button id="btn-nueva-promocion" onClick={handleNew}>
            <Plus className="h-4 w-4" />
            Nueva Promoción
          </Button>
        </div>

        {/* ── Estado vacío ─────────────────────────────────────────────── */}
        {promociones.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay promociones registradas.</p>
          </div>
        )}

        {promociones.length > 0 && (
          <>
            {/* ── Métricas ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <MetricCard
                id="metric-total-promociones"
                icon={<TicketPercent className="h-5 w-5 text-primary" />}
                label="Total"
                value={promociones.length.toString()}
              />
              <MetricCard
                id="metric-promociones-activas"
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                label="Activas"
                value={totalActivas.toString()}
              />
              <MetricCard
                id="metric-promociones-vigentes"
                icon={<CalendarCheck className="h-5 w-5 text-primary" />}
                label="Vigentes hoy"
                value={totalVigentes.toString()}
              />
              <MetricCard
                id="metric-promociones-inactivas"
                icon={<XCircle className="h-5 w-5 text-primary" />}
                label="Inactivas"
                value={totalInactivas.toString()}
              />
            </div>

            {/* ── Tabla ────────────────────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Descuento</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Vigencia</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {promociones.map((promocion) => {
                      const vigente =
                        promocion.es_activa &&
                        esVigente(promocion.fecha_inicio, promocion.fecha_fin)

                      return (
                        <tr
                          key={promocion.id}
                          id={`promocion-row-${promocion.id}`}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground">{promocion.nombre}</span>
                          </td>

                          <td className="px-4 py-3">
                            {promocion.nombre_producto ? (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {promocion.nombre_producto}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/40 italic">General</span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <span className="font-mono font-semibold text-foreground">
                              {parseFloat(promocion.porcentaje_descuento).toFixed(1)}%
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-xs text-muted-foreground">
                                {formatFecha(promocion.fecha_inicio)} → {formatFecha(promocion.fecha_fin)}
                              </span>
                              {vigente && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  <CalendarCheck className="h-3 w-3" />
                                  Vigente
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-center">
                              {promocion.es_activa ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Activa
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                                  <XCircle className="h-3 w-3" />
                                  Inactiva
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Acciones */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                id={`btn-edit-promocion-${promocion.id}`}
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleEdit(promocion)}
                                disabled={isSaving}
                                title="Editar promoción"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                id={`btn-delete-promocion-${promocion.id}`}
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setDeleteTarget(promocion)}
                                disabled={isSaving}
                                title="Eliminar promoción"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border bg-muted/20 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  {totalVigentes > 0 && (
                    <span className="font-medium text-primary">
                      ✓ {totalVigentes} promoción{totalVigentes !== 1 ? 'es' : ''} vigente{totalVigentes !== 1 ? 's' : ''} hoy.{' '}
                    </span>
                  )}
                  Mostrando {promociones.length} registro{promociones.length !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────────────── */}
      <PromocionFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setSelectedPromocion(null)
        }}
        promocion={selectedPromocion}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar la promoción{' '}
              <span className="font-semibold text-foreground">{deleteTarget?.nombre}</span>.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteExecute}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando…
                </>
              ) : (
                'Sí, eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Sub-componente: tarjeta de métrica ───────────────────────────────────────

interface MetricCardProps {
  id: string
  icon: React.ReactNode
  label: string
  value: string
}

function MetricCard({ id, icon, label, value }: MetricCardProps) {
  return (
    <div
      id={id}
      className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
