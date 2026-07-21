// src/presentation/pages/inventory/CategoriasPage.tsx
import { useEffect, useState } from 'react'
import {
  Loader2,
  AlertCircle,
  FolderTree,
  FolderOpen,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'

import { useCategoriaStore } from '@/presentation/store/categoria.store'
import type { Categoria } from '@/domain/entities/categoria.entity'
import CategoriaFormDialog from './CategoriaFormDialog'
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

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CategoriasPage() {
  const { categorias, isLoading, isSaving, error, loadCategorias, deleteCategoria } =
    useCategoriaStore()

  // ── Estado local de UI ────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Categoria | null>(null)

  useEffect(() => {
    loadCategorias()
  }, [loadCategorias])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleNew() {
    setSelectedCategoria(null)
    setIsFormOpen(true)
  }

  function handleEdit(categoria: Categoria) {
    setSelectedCategoria(categoria)
    setIsFormOpen(true)
  }

  function handleDeleteConfirm(categoria: Categoria) {
    setDeleteTarget(categoria)
  }

  async function handleDeleteExecute() {
    if (!deleteTarget) return
    await deleteCategoria(deleteTarget.id)
    setDeleteTarget(null)
  }

  // ── Estado: cargando ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando categorías…</p>
      </div>
    )
  }

  // ── Estado: error ─────────────────────────────────────────────────────────
  if (error && categorias.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button id="btn-retry-categorias" variant="outline" onClick={loadCategorias}>
          Reintentar
        </Button>
      </div>
    )
  }

  // ── Métricas rápidas ──────────────────────────────────────────────────────
  const totalActivas = categorias.filter((c) => c.activa).length
  const totalInactivas = categorias.length - totalActivas

  // ── Datos ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6 p-6">
        {/* ── Encabezado ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Categorías</h1>
            <p className="text-sm text-muted-foreground">
              {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} en total
            </p>
          </div>
          <Button id="btn-nueva-categoria" onClick={handleNew}>
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        {/* ── Estado vacío (con botón de crear) ────────────────────────── */}
        {categorias.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay categorías registradas.</p>
          </div>
        )}

        {categorias.length > 0 && (
          <>
            {/* ── Tarjetas de métricas ──────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricCard
                id="metric-total-categorias"
                icon={<FolderTree className="h-5 w-5 text-primary" />}
                label="Total de categorías"
                value={categorias.length.toString()}
              />
              <MetricCard
                id="metric-activas"
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                label="Activas"
                value={totalActivas.toString()}
              />
              <MetricCard
                id="metric-inactivas"
                icon={<XCircle className="h-5 w-5 text-primary" />}
                label="Inactivas"
                value={totalInactivas.toString()}
              />
            </div>

            {/* ── Tabla de categorías ────────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Productos</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categorias.map((categoria) => (
                      <tr
                        key={categoria.id}
                        id={`categoria-row-${categoria.id}`}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3 text-muted-foreground">{categoria.id}</td>

                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{categoria.nombre}</span>
                          {categoria.descripcion && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {categoria.descripcion}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-3 text-center font-mono text-muted-foreground">
                          {categoria.total_productos}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            {categoria.activa ? (
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
                              id={`btn-edit-categoria-${categoria.id}`}
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEdit(categoria)}
                              disabled={isSaving}
                              title="Editar categoría"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              id={`btn-delete-categoria-${categoria.id}`}
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteConfirm(categoria)}
                              disabled={isSaving}
                              title="Eliminar categoría"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Dialogs (montados fuera del scroll para evitar problemas de z-index) ── */}
      <CategoriaFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setSelectedCategoria(null)
        }}
        categoria={selectedCategoria}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar la categoría{' '}
              <span className="font-semibold text-foreground">
                {deleteTarget?.nombre}
              </span>
              . Esta acción la marcará como inactiva.
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
