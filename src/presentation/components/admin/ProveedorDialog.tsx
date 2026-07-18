// Ruta: src/presentation/components/admin/ProveedorDialog.tsx

import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useComprasStore } from '../../store/compras.store'
import { ApiException } from '../../../domain/exceptions/api.exception'
import type { Proveedor } from '../../../domain/entities/proveedor.entity'
import { ProveedorForm, type ProveedorFormValues } from './ProveedorForm'

interface ProveedorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proveedor?: Proveedor
}

export function ProveedorDialog({ open, onOpenChange, proveedor }: ProveedorDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const createProveedor = useComprasStore((s) => s.createProveedor)
  const updateProveedor = useComprasStore((s) => s.updateProveedor)

  const isEditing = Boolean(proveedor)
  const title = isEditing ? 'Editar proveedor' : 'Nuevo proveedor'

  async function handleSubmit(data: ProveedorFormValues) {
    setIsLoading(true)
    try {
      if (isEditing && proveedor) {
        await updateProveedor(proveedor.id, data)
        toast.success('Proveedor actualizado', {
          description: `"${data.nombre}" fue actualizado correctamente.`,
        })
      } else {
        await createProveedor(data)
        toast.success('Proveedor creado', {
          description: `"${data.nombre}" fue creado correctamente.`,
        })
      }
      onOpenChange(false)
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.detail
          : isEditing
            ? 'No se pudo actualizar el proveedor.'
            : 'No se pudo crear el proveedor.'
      toast.error('Error', { description: message })
      setIsLoading(false)
    }
  }

  const defaultValues: Partial<ProveedorFormValues> | undefined = proveedor
    ? {
        nombre: proveedor.nombre,
        ruc: proveedor.ruc,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
        es_activo: proveedor.es_activo,
      }
    : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ProveedorForm
          key={proveedor?.id ?? 'new'}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}