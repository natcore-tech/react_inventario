// src/presentation/pages/inventory/CategoriaFormDialog.tsx
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { useCategoriaStore } from '@/presentation/store/categoria.store'
import type { Categoria } from '@/domain/entities/categoria.entity'
import type { CreateCategoriaDto } from '@/application/dtos/categoria.dto'

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

interface CategoriaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoria: Categoria | null
}

interface FormValues {
  nombre: string
  descripcion: string
  activa: boolean
}

const EMPTY_FORM: FormValues = {
  nombre: '',
  descripcion: '',
  activa: true,
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CategoriaFormDialog({
  open,
  onOpenChange,
  categoria,
}: CategoriaFormDialogProps) {
  const { createCategoria, updateCategoria, isSaving, error, clearError } =
    useCategoriaStore()

  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  const isEditing = categoria !== null

  // ── Inicializar el formulario al abrir ──────────────────────────────────
  useEffect(() => {
    if (!open) return

    clearError()
    setFormError(null)

    if (categoria) {
      setForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        activa: categoria.activa,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, categoria, clearError])

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleField(field: keyof FormValues, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!form.nombre.trim()) return setFormError('El nombre es obligatorio.')

    const baseName = form.nombre.trim()
    const generatedSlug = baseName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos por guiones
      .replace(/(^-|-$)+/g, '') // Quitar guiones al principio y final

    const dto: CreateCategoriaDto = {
      nombre: baseName,
      slug: generatedSlug,
      descripcion: form.descripcion.trim(),
      activa: form.activa,
    }

    try {
      if (isEditing) {
        await updateCategoria(categoria!.id, dto)
      } else {
        await createCategoria(dto)
      }
      onOpenChange(false)
    } catch {
      // El error ya está en el store (error state), se muestra abajo
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
        </DialogHeader>

        <form id="categoria-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-2">
            {/* Error de la API o validación */}
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError ?? error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1">
              <Label htmlFor="cat-nombre">Nombre</Label>
              <Input
                id="cat-nombre"
                value={form.nombre}
                onChange={(e) => handleField('nombre', e.target.value)}
                placeholder="Ej: Accesorios"
                disabled={isSaving}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <Label htmlFor="cat-descripcion">
                Descripción <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="cat-descripcion"
                value={form.descripcion}
                onChange={(e) => handleField('descripcion', e.target.value)}
                placeholder="Descripción breve de la categoría..."
                rows={3}
                disabled={isSaving}
              />
            </div>

            {/* ¿Está activa? */}
            <div className="flex items-center gap-3">
              <input
                id="cat-activa"
                type="checkbox"
                checked={form.activa}
                onChange={(e) => handleField('activa', e.target.checked)}
                disabled={isSaving}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="cat-activa" className="cursor-pointer">
                Categoría activa
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
          <Button
            type="submit"
            form="categoria-form"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear categoría'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
