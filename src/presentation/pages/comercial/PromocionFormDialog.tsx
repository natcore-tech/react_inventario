// src/presentation/pages/comercial/PromocionFormDialog.tsx
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { usePromocionStore } from '@/presentation/store/promocion.store'
import { productoUseCase } from '@/infrastructure/factories/producto.factory'
import type { Promocion } from '@/domain/entities/promocion.entity'
import type { Producto } from '@/domain/entities/producto.entity'
import type { CreatePromocionDto } from '@/application/dtos/promocion.dto'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PromocionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = modo crear | Promocion = modo editar */
  promocion: Promocion | null
}

interface FormValues {
  nombre: string
  producto_id: string     // '' = sin producto (general)
  porcentaje: string
  fecha_inicio: string
  fecha_fin: string
  es_activa: boolean
}

const EMPTY_FORM: FormValues = {
  nombre: '',
  producto_id: '',
  porcentaje: '',
  fecha_inicio: '',
  fecha_fin: '',
  es_activa: true,
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function PromocionFormDialog({
  open,
  onOpenChange,
  promocion,
}: PromocionFormDialogProps) {
  const { createPromocion, updatePromocion, isSaving, error, clearError } = usePromocionStore()

  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [productos, setProductos] = useState<Producto[]>([])
  const [loadingProds, setLoadingProds] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const isEditing = promocion !== null

  // ── Inicializar formulario al abrir ─────────────────────────────────────
  useEffect(() => {
    if (!open) return
    clearError()
    setFormError(null)

    if (promocion) {
      setForm({
        nombre: promocion.nombre,
        producto_id: promocion.producto !== null ? String(promocion.producto) : '',
        porcentaje: parseFloat(promocion.porcentaje_descuento).toString(),
        fecha_inicio: promocion.fecha_inicio,
        fecha_fin: promocion.fecha_fin,
        es_activa: promocion.es_activa,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, promocion]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cargar productos activos al abrir ───────────────────────────────────
  useEffect(() => {
    if (!open) return
    setLoadingProds(true)
    productoUseCase
      .getProductos()
      .then((prods) => setProductos(prods.filter((p) => p.es_activo)))
      .catch(() => setProductos([]))
      .finally(() => setLoadingProds(false))
  }, [open])

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleField(field: keyof FormValues, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    // Validación básica en cliente
    if (!form.nombre.trim()) return setFormError('El nombre es obligatorio.')
    const pct = parseFloat(form.porcentaje)
    if (isNaN(pct) || pct <= 0 || pct > 100)
      return setFormError('El porcentaje debe ser mayor a 0 y máximo 100.')
    if (!form.fecha_inicio) return setFormError('La fecha de inicio es obligatoria.')
    if (!form.fecha_fin) return setFormError('La fecha de fin es obligatoria.')
    if (form.fecha_fin < form.fecha_inicio)
      return setFormError('La fecha de fin no puede ser anterior a la fecha de inicio.')

    const dto: CreatePromocionDto = {
      nombre: form.nombre.trim(),
      producto: form.producto_id ? parseInt(form.producto_id) : null,
      porcentaje_descuento: pct,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      es_activa: form.es_activa,
    }

    try {
      if (isEditing) {
        await updatePromocion(promocion!.id, dto)
      } else {
        await createPromocion(dto)
      }
      onOpenChange(false)
    } catch {
      // Error ya visible desde el store
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Promoción' : 'Nueva Promoción'}
          </DialogTitle>
        </DialogHeader>

        <form id="promocion-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-2">
            {/* Error */}
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError ?? error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1">
              <Label htmlFor="prom-nombre">Nombre</Label>
              <Input
                id="prom-nombre"
                value={form.nombre}
                onChange={(e) => handleField('nombre', e.target.value)}
                placeholder="Ej: Descuento de verano"
                disabled={isSaving}
              />
            </div>

            {/* Producto (opcional) */}
            <div className="space-y-1">
              <Label htmlFor="prom-producto">
                Producto <span className="text-muted-foreground">(opcional — dejar vacío para promoción general)</span>
              </Label>
              {loadingProds ? (
                <div className="flex h-8 items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando productos…
                </div>
              ) : (
                <Select
                  value={form.producto_id}
                  onValueChange={(val) => handleField('producto_id', val === '__none__' ? '' : val)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="prom-producto" className="w-full">
                    <SelectValue placeholder="— General (sin producto específico) —" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— General (sin producto específico) —</SelectItem>
                    {productos.map((prod) => (
                      <SelectItem key={prod.id} value={String(prod.id)}>
                        {prod.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Descuento y estado en una fila */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prom-porcentaje">Descuento (%)</Label>
                <Input
                  id="prom-porcentaje"
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={form.porcentaje}
                  onChange={(e) => handleField('porcentaje', e.target.value)}
                  placeholder="Ej: 15.00"
                  disabled={isSaving}
                />
              </div>
              <div className="flex flex-col justify-end pb-1">
                <div className="flex items-center gap-3">
                  <input
                    id="prom-es-activa"
                    type="checkbox"
                    checked={form.es_activa}
                    onChange={(e) => handleField('es_activa', e.target.checked)}
                    disabled={isSaving}
                    className="h-4 w-4 accent-primary"
                  />
                  <Label htmlFor="prom-es-activa" className="cursor-pointer">
                    Activa
                  </Label>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prom-fecha-inicio">Fecha de inicio</Label>
                <Input
                  id="prom-fecha-inicio"
                  type="date"
                  value={form.fecha_inicio}
                  onChange={(e) => handleField('fecha_inicio', e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prom-fecha-fin">Fecha de fin</Label>
                <Input
                  id="prom-fecha-fin"
                  type="date"
                  value={form.fecha_fin}
                  min={form.fecha_inicio || undefined}
                  onChange={(e) => handleField('fecha_fin', e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="submit" form="promocion-form" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear promoción'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
