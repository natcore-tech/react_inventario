import { useEffect, useState } from 'react'
import { useMarcaStore } from '@/presentation/store/marca.store'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/presentation/components/ui/alert-dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { Marca } from '@/domain/entities/marca.entity'

export default function MarcasPage() {
  const { marcas, isLoading, error, fetchMarcas, createMarca, updateMarca, deleteMarca } = useMarcaStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null)
  const [formData, setFormData] = useState({ nombre: '' })

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null)

  useEffect(() => {
    fetchMarcas()
  }, [fetchMarcas])

  const openCreate = () => {
    setEditingMarca(null)
    setFormData({ nombre: '' })
    setIsFormOpen(true)
  }

  const openEdit = (marca: Marca) => {
    setEditingMarca(marca)
    setFormData({ nombre: marca.nombre })
    setIsFormOpen(true)
  }

  const openDelete = (marca: Marca) => {
    setMarcaToDelete(marca)
    setIsDeleteOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingMarca) {
        await updateMarca(editingMarca.id, formData)
      } else {
        await createMarca(formData)
      }
      setIsFormOpen(false)
    } catch (error) {
      // Error is handled by the store and displayed in UI
    }
  }

  const handleConfirmDelete = async () => {
    if (!marcaToDelete) return
    try {
      await deleteMarca(marcaToDelete.id)
      setIsDeleteOpen(false)
    } catch (error) {
      // Error handled by store
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Marca
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

      {!isLoading && !error && marcas.length === 0 && (
        <p className="text-muted-foreground">No hay marcas registradas.</p>
      )}

      {marcas.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {marcas.map((marca, idx) => (
                <tr
                  key={marca.id}
                  className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                >
                  <td className="px-4 py-3 text-muted-foreground">{marca.id}</td>
                  <td className="px-4 py-3 font-medium">{marca.nombre}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(marca)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(marca)}>
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
            <DialogTitle>{editingMarca ? 'Editar Marca' : 'Nueva Marca'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la marca</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. Nike, Adidas..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !formData.nombre.trim()}>
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
              Esta acción no se puede deshacer. Se eliminará permanentemente la marca 
              <span className="font-semibold text-foreground"> {marcaToDelete?.nombre} </span>
              y podría afectar los productos asociados a ella.
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
              {isLoading ? 'Eliminando...' : 'Sí, eliminar marca'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
