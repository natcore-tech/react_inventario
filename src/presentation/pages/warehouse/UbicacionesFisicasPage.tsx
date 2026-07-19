import { useEffect, useState } from 'react'
import { useUbicacionFisicaStore } from '@/presentation/store/ubicacion-fisica.store'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/presentation/components/ui/alert-dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { UbicacionFisica } from '@/domain/entities/ubicacion-fisica.entity'

export default function UbicacionesFisicasPage() {
  const { ubicaciones, isLoading, error, fetchUbicaciones, createUbicacion, updateUbicacion, deleteUbicacion } = useUbicacionFisicaStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUbicacion, setEditingUbicacion] = useState<UbicacionFisica | null>(null)
  const [formData, setFormData] = useState({ pasillo: '', estante: '' })

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [ubicacionToDelete, setUbicacionToDelete] = useState<UbicacionFisica | null>(null)

  useEffect(() => {
    fetchUbicaciones()
  }, [fetchUbicaciones])

  const openCreate = () => {
    setEditingUbicacion(null)
    setFormData({ pasillo: '', estante: '' })
    setIsFormOpen(true)
  }

  const openEdit = (ubicacion: UbicacionFisica) => {
    setEditingUbicacion(ubicacion)
    setFormData({ pasillo: ubicacion.pasillo, estante: ubicacion.estante })
    setIsFormOpen(true)
  }

  const openDelete = (ubicacion: UbicacionFisica) => {
    setUbicacionToDelete(ubicacion)
    setIsDeleteOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingUbicacion) {
        await updateUbicacion(editingUbicacion.id, formData)
      } else {
        await createUbicacion(formData)
      }
      setIsFormOpen(false)
    } catch (error) {
      // Manejado en el store
    }
  }

  const handleConfirmDelete = async () => {
    if (!ubicacionToDelete) return
    try {
      await deleteUbicacion(ubicacionToDelete.id)
      setIsDeleteOpen(false)
    } catch (error) {
      // Manejado en el store
    }
  }

  const isFormValid = formData.pasillo.trim() !== '' && formData.estante.trim() !== ''

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Ubicaciones Físicas</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Ubicación
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

      {!isLoading && !error && ubicaciones.length === 0 && (
        <p className="text-muted-foreground">No hay ubicaciones físicas registradas.</p>
      )}

      {ubicaciones.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pasillo</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Estante</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Coordenada</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((u, idx) => (
                <tr
                  key={u.id}
                  className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                >
                  <td className="px-4 py-3 text-muted-foreground">{u.id}</td>
                  <td className="px-4 py-3 font-medium">{u.pasillo}</td>
                  <td className="px-4 py-3">{u.estante}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.coordenada_exacta}</td>
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
            <DialogTitle>{editingUbicacion ? 'Editar Ubicación' : 'Nueva Ubicación'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pasillo">Pasillo</Label>
              <Input
                id="pasillo"
                value={formData.pasillo}
                onChange={(e) => setFormData({ ...formData, pasillo: e.target.value })}
                placeholder="Ej. A, B, 1, 2"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estante">Estante</Label>
              <Input
                id="estante"
                value={formData.estante}
                onChange={(e) => setFormData({ ...formData, estante: e.target.value })}
                placeholder="Ej. 1, 2, 3"
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
              Esta acción no se puede deshacer. Se eliminará permanentemente la ubicación física
              <span className="font-semibold text-foreground"> {ubicacionToDelete?.coordenada_exacta} </span>
              y podría afectar a los productos o movimientos que la utilizan.
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
              {isLoading ? 'Eliminando...' : 'Sí, eliminar ubicación'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
