// src/presentation/pages/comercial/ClienteFormDialog.tsx
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { useClienteStore } from '@/presentation/store/cliente.store'
import type { Cliente } from '@/domain/entities/cliente.entity'
import type { CreateClienteDto } from '@/application/dtos/cliente.dto'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = modo crear | Cliente = modo editar */
  cliente: Cliente | null
}

interface FormValues {
  identificacion: string
  nombres: string
  email: string
  telefono: string
  direccion: string
  es_activo: boolean
}

const EMPTY_FORM: FormValues = {
  identificacion: '',
  nombres: '',
  email: '',
  telefono: '',
  direccion: '',
  es_activo: true,
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ClienteFormDialog({
  open,
  onOpenChange,
  cliente,
}: ClienteFormDialogProps) {
  const { createCliente, updateCliente, isSaving, error, clearError } = useClienteStore()

  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  const isEditing = cliente !== null

  // ── Inicializar formulario al abrir ─────────────────────────────────────
  useEffect(() => {
    if (!open) return
    clearError()
    setFormError(null)

    if (cliente) {
      setForm({
        identificacion: cliente.identificacion,
        nombres: cliente.nombres,
        email: cliente.email ?? '',
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        es_activo: cliente.es_activo,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, cliente]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleField(field: keyof FormValues, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    // Validación básica en cliente
    const id = form.identificacion.trim()
    if (!id) return setFormError('La identificación es obligatoria.')
    if (!/^\d{10}(\d{3})?$/.test(id))
      return setFormError('La identificación debe tener 10 dígitos (Cédula) o 13 (RUC).')
    if (!form.nombres.trim() || form.nombres.trim().length < 3)
      return setFormError('El nombre debe tener al menos 3 caracteres.')

    const dto: CreateClienteDto = {
      identificacion: id,
      nombres: form.nombres.trim(),
      // email vacío → enviar null (campo null=True en Django)
      email: form.email.trim() || null,
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      es_activo: form.es_activo,
    }

    try {
      if (isEditing) {
        await updateCliente(cliente!.id, dto)
      } else {
        await createCliente(dto)
      }
      onOpenChange(false)
    } catch {
      // El error ya está en el store, se muestra abajo
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form id="cliente-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-2">
            {/* Error de la API o validación */}
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError ?? error}
              </div>
            )}

            {/* Identificación */}
            <div className="space-y-1">
              <Label htmlFor="cli-identificacion">
                Cédula / RUC
              </Label>
              <Input
                id="cli-identificacion"
                value={form.identificacion}
                onChange={(e) => handleField('identificacion', e.target.value)}
                placeholder="10 dígitos (Cédula) o 13 (RUC)"
                maxLength={13}
                disabled={isSaving || isEditing} // La identificación no cambia al editar
              />
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  La identificación no puede modificarse una vez creada.
                </p>
              )}
            </div>

            {/* Nombres */}
            <div className="space-y-1">
              <Label htmlFor="cli-nombres">Nombres completos</Label>
              <Input
                id="cli-nombres"
                value={form.nombres}
                onChange={(e) => handleField('nombres', e.target.value)}
                placeholder="Ej: Juan Carlos Pérez"
                disabled={isSaving}
              />
            </div>

            {/* Email y Teléfono en dos columnas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cli-email">
                  Email <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="cli-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleField('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cli-telefono">
                  Teléfono <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="cli-telefono"
                  value={form.telefono}
                  onChange={(e) => handleField('telefono', e.target.value)}
                  placeholder="0999-000-000"
                  maxLength={20}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-1">
              <Label htmlFor="cli-direccion">
                Dirección <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="cli-direccion"
                value={form.direccion}
                onChange={(e) => handleField('direccion', e.target.value)}
                placeholder="Calle principal, número, ciudad…"
                rows={2}
                disabled={isSaving}
              />
            </div>

            {/* ¿Está activo? */}
            <div className="flex items-center gap-3">
              <input
                id="cli-es-activo"
                type="checkbox"
                checked={form.es_activo}
                onChange={(e) => handleField('es_activo', e.target.checked)}
                disabled={isSaving}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="cli-es-activo" className="cursor-pointer">
                Cliente activo
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
          <Button type="submit" form="cliente-form" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear cliente'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
