import { useEffect, useState } from 'react'
import { useUnidadMedidaStore } from '@/presentation/store/unidad-medida.store'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/presentation/components/ui/alert-dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { UnidadMedida } from '@/domain/entities/unidad-medida.entity'

export default function UnidadesMedidaPage() {
  const { unidades, isLoading, error, fetchUnidades, createUnidad, updateUnidad, deleteUnidad } = useUnidadMedidaStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUnidad, setEditingUnidad] = useState<UnidadMedida | null>(null)
  const [formData, setFormData] = useState({ nombre: '', abreviatura: '' })

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [unidadToDelete, setUnidadToDelete] = useState<UnidadMedida | null>(null)

  useEffect(() => {
    fetchUnidades()
  }, [fetchUnidades])

  const openCreate = () => {
    setEditingUnidad(null)
    setFormData({ nombre: '', abreviatura: '' })
    setIsFormOpen(true)
  }

  const openEdit = (unidad: UnidadMedida) => {
    setEditingUnidad(unidad)
    setFormData({ nombre: unidad.nombre, abreviatura: unidad.abreviatura })
    setIsFormOpen(true)
  }

  const openDelete = (unidad: UnidadMedida) => {
    setUnidadToDelete(unidad)
    setIsDeleteOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingUnidad) {
        await updateUnidad(editingUnidad.id, formData)
      } else {
        await createUnidad(formData)
      }
      setIsFormOpen(false)
    } catch (error) {
      // Manejado en el store
    }
  }

  const handleConfirmDelete = async () => {
    if (!unidadToDelete) return
    try {
      await deleteUnidad(unidadToDelete.id)
      setIsDeleteOpen(false)
    } catch (error) {
      // Manejado en el store
    }
  }

  const isFormValid = formData.nombre.trim() !== '' && formData.abreviatura.trim() !== ''

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Unidades de Medida</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Unidad
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Procesando...</span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-destructive text-sm mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && unidades.length === 0 && (
        <p className="text-muted-foreground">No hay unidades de medida registradas.</p>
      )}

      {unidades.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Abreviatura</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Descripción</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {unidades.map((u, idx) => (
                <tr
                  key={u.id}
                  className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                >
                  <td className="px-4 py-3 text-muted-foreground">{u.id}</td>
                  <td className="px-4 py-3 font-medium">{u.nombre}</td>
                  <td className="px-4 py-3">{u.abreviatura}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.descripcion_completa}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(u)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUnidad ? 'Editar Unidad de Medida' : 'Nueva Unidad de Medida'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. Kilogramo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="abreviatura">Abreviatura</Label>
              <Input
                id="abreviatura"
                value={formData.abreviatura}
                onChange={(e) => setFormData({ ...formData, abreviatura: e.target.value })}
                placeholder="Ej. kg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !isFormValid}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la unidad de medida
              <span className="font-semibold text-foreground"> {unidadToDelete?.descripcion_completa} </span>
              y podría afectar a los productos que la utilizan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={isLoading}
            >
              {isLoading ? 'Eliminando...' : 'Sí, eliminar unidad'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
