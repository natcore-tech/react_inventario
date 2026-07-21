// src/presentation/pages/comercial/ProductoFormDialog.tsx
import { useEffect, useState, useRef } from 'react'
import { Loader2, ImagePlus, X } from 'lucide-react'

import { useProductoStore } from '@/presentation/store/producto.store'
import { categoriaUseCase } from '@/infrastructure/factories/categoria.factory'
import type { Producto } from '@/domain/entities/producto.entity'
import type { Categoria } from '@/domain/entities/categoria.entity'
import type { CreateProductoDto } from '@/application/dtos/producto.dto'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ProductoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = modo crear | Producto = modo editar */
  producto: Producto | null
}

interface FormValues {
  nombre: string
  descripcion: string
  precio: string
  stock: string
  es_activo: boolean
  categoria_id: string
  image?: File | null
}

const EMPTY_FORM: FormValues = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '0',
  es_activo: true,
  categoria_id: '',
  image: null,
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ProductoFormDialog({
  open,
  onOpenChange,
  producto,
}: ProductoFormDialogProps) {
  const { createProducto, updateProducto, isSaving, error, clearError } = useProductoStore()

  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loadingCats, setLoadingCats] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = producto !== null

  // ── Inicializar el formulario al abrir ──────────────────────────────────
  useEffect(() => {
    if (!open) return

    clearError()
    setFormError(null)
    setImagePreview(null)

    if (producto) {
      setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? '',
        precio: parseFloat(producto.precio).toString(),
        stock: producto.stock.toString(),
        es_activo: producto.es_activo,
        categoria_id: String(producto.categoria.id),
        image: null,
      })
      setImagePreview(producto.image_url)
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, producto]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cargar categorías activas al abrir ──────────────────────────────────
  useEffect(() => {
    if (!open) return
    setLoadingCats(true)
    categoriaUseCase
      .getCategorias()
      .then((cats) => setCategorias(cats.filter((c) => c.activa)))
      .catch(() => setCategorias([]))
      .finally(() => setLoadingCats(false))
  }, [open])

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleField(field: keyof FormValues, value: string | boolean | File | null) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (ej: 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormError('La imagen no debe superar los 2MB.')
      return
    }

    handleField('image', file)
    
    // Crear preview local
    const reader = new FileReader()
    reader.onload = (event) => setImagePreview(event.target?.result as string)
    reader.readAsDataURL(file)
  }

  function clearImage() {
    handleField('image', null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    // Validación básica en cliente
    if (!form.nombre.trim()) return setFormError('El nombre es obligatorio.')
    if (!form.precio || isNaN(parseFloat(form.precio)) || parseFloat(form.precio) <= 0)
      return setFormError('El precio debe ser mayor a 0.')
    if (!form.stock || isNaN(parseInt(form.stock)) || parseInt(form.stock) < 0)
      return setFormError('El stock no puede ser negativo.')
    if (!form.categoria_id) return setFormError('Debes seleccionar una categoría.')

    const dto: CreateProductoDto = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      es_activo: form.es_activo,
      categoria_id: parseInt(form.categoria_id),
    }

    // Solo agregar image al DTO si el usuario seleccionó un nuevo archivo
    if (form.image) {
      dto.image = form.image
    }

    try {
      if (isEditing) {
        await updateProducto(producto!.id, dto)
      } else {
        await createProducto(dto)
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
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>

        <form id="producto-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-2">
            {/* Error de la API o validación */}
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError ?? error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1">
              <Label htmlFor="prod-nombre">Nombre</Label>
              <Input
                id="prod-nombre"
                value={form.nombre}
                onChange={(e) => handleField('nombre', e.target.value)}
                placeholder="Ej: Laptop Dell XPS 13"
                disabled={isSaving}
              />
            </div>

            {/* Imagen del Producto */}
            <div className="space-y-2">
              <Label>Imagen del Producto (opcional)</Label>
              <div className="flex items-center gap-4">
                <div 
                  className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted/50"
                >
                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <ImagePlus className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    ref={fileInputRef}
                    id="prod-imagen"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleImageChange}
                    disabled={isSaving}
                    className="text-sm cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Formatos: JPG, PNG, WebP. Máximo 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <Label htmlFor="prod-descripcion">
                Descripción <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="prod-descripcion"
                value={form.descripcion}
                onChange={(e) => handleField('descripcion', e.target.value)}
                placeholder="Descripción breve del producto…"
                rows={2}
                disabled={isSaving}
              />
            </div>

            {/* Precio y Stock en dos columnas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prod-precio">Precio ($)</Label>
                <Input
                  id="prod-precio"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => handleField('precio', e.target.value)}
                  placeholder="0.00"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prod-stock">Stock</Label>
                <Input
                  id="prod-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => handleField('stock', e.target.value)}
                  placeholder="0"
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-1">
              <Label htmlFor="prod-categoria">Categoría</Label>
              {loadingCats ? (
                <div className="flex h-8 items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando categorías…
                </div>
              ) : (
                <Select
                  value={form.categoria_id}
                  onValueChange={(val) => handleField('categoria_id', val)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="prod-categoria" className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* ¿Está activo? */}
            <div className="flex items-center gap-3">
              <input
                id="prod-es-activo"
                type="checkbox"
                checked={form.es_activo}
                onChange={(e) => handleField('es_activo', e.target.checked)}
                disabled={isSaving}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="prod-es-activo" className="cursor-pointer">
                Producto activo
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
            form="producto-form"
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
              'Crear producto'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
