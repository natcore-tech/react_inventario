// src/presentation/pages/comercial/MetodoPagoFormDialog.tsx
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { useMetodoPagoStore } from '@/presentation/store/metodo-pago.store'
import type { MetodoPago } from '@/domain/entities/metodo-pago.entity'

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
import type { CreateMetodoPagoDto } from '@/application/dtos/metodo-pago.dto'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MetodoPagoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = modo crear | MetodoPago = modo editar */
  metodoPago: MetodoPago | null
}

interface FormValues {
  nombre: string
  es_activo: boolean
}

const EMPTY_FORM: FormValues = {
  nombre: '',
  es_activo: true,
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function MetodoPagoFormDialog({
  open,
  onOpenChange,
  metodoPago,
}: MetodoPagoFormDialogProps) {
  const { createMetodoPago, updateMetodoPago, isSaving, error, clearError } =
    useMetodoPagoStore()

  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  const isEditing = metodoPago !== null

  // ── Inicializar formulario al abrir ─────────────────────────────────────
  useEffect(() => {
    if (!open) return
    clearError()
    setFormError(null)

    if (metodoPago) {
      setForm({ nombre: metodoPago.nombre, es_activo: metodoPago.es_activo })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, metodoPago]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleField(field: keyof FormValues, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!form.nombre.trim()) return setFormError('El nombre es obligatorio.')

    const dto: CreateMetodoPagoDto = {
      nombre: form.nombre.trim(),
      es_activo: form.es_activo,
    }

    try {
      if (isEditing) {
        await updateMetodoPago(metodoPago!.id, dto)
      } else {
        await createMetodoPago(dto)
      }
      onOpenChange(false)
    } catch {
      // Error ya visible desde el store
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          </DialogTitle>
        </DialogHeader>

        <form id="metodo-pago-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-2">
            {/* Error */}
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError ?? error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1">
              <Label htmlFor="mp-nombre">Nombre</Label>
              <Input
                id="mp-nombre"
                value={form.nombre}
                onChange={(e) => handleField('nombre', e.target.value)}
                placeholder="Ej: Tarjeta de Crédito, Efectivo…"
                disabled={isSaving}
                autoFocus
              />
            </div>

            {/* ¿Está activo? */}
            <div className="flex items-center gap-3">
              <input
                id="mp-es-activo"
                type="checkbox"
                checked={form.es_activo}
                onChange={(e) => handleField('es_activo', e.target.checked)}
                disabled={isSaving}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="mp-es-activo" className="cursor-pointer">
                Método activo
              </Label>
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
          <Button type="submit" form="metodo-pago-form" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear método'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
