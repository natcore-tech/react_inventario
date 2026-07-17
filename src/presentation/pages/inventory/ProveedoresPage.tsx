// Ruta: src/presentation/pages/inventory/ProveedoresPage.tsx
// (o pages/admin/ si asi organiza tu equipo las paginas de gestion — ajusta la carpeta segun tu router)
// Nota: usa DeleteConfirmDialog, que segun la guia ya existe compartido en components/admin/.
// Si aun no existe en tu proyecto, avisa y te lo armo tambien.

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Search, Building2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '../../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { useComprasStore } from '../../store/compras.store'
import { ApiException } from '../../../domain/exceptions/api.exception'
import type { Proveedor } from '../../../domain/entities/proveedor.entity'
import { ProveedorDialog } from '../../components/admin/ProveedorDialog'
import { DeleteConfirmDialog } from '../../components/admin/DeleteConfirmDialog'

export default function ProveedoresPage() {
  const proveedores = useComprasStore((s) => s.proveedores)
  const isLoadingProveedores = useComprasStore((s) => s.isLoadingProveedores)
  const proveedoresError = useComprasStore((s) => s.proveedoresError)
  const fetchProveedores = useComprasStore((s) => s.fetchProveedores)
  const deleteProveedor = useComprasStore((s) => s.deleteProveedor)

  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Proveedor | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Proveedor | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProveedores()
  }, [fetchProveedores])

  const filtrados = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.ruc.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteProveedor(deleteTarget.id)
      toast.success('Proveedor eliminado', {
        description: `"${deleteTarget.nombre}" fue eliminado correctamente.`,
      })
      setDeleteTarget(null)
    } catch (err) {
      const message = err instanceof ApiException ? err.detail : 'No se pudo eliminar el proveedor.'
      toast.error('Error', { description: message })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestiona los proveedores registrados.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo proveedor
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nombre o RUC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {proveedoresError && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {proveedoresError}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingProveedores &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-14" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-20" /></TableCell>
                </TableRow>
              ))}

            {!isLoadingProveedores && filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Building2 className="h-10 w-10" />
                    <p className="text-sm font-medium">
                      {search ? `Sin resultados para "${search}"` : 'No hay proveedores registrados'}
                    </p>
                    {!search && (
                      <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Crear primer proveedor
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoadingProveedores &&
              filtrados.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="max-w-[200px] truncate font-medium">{proveedor.nombre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{proveedor.ruc}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{proveedor.telefono || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{proveedor.email || '—'}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={proveedor.es_activo ? 'success' : 'destructive'}>
                      {proveedor.es_activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditTarget(proveedor)}
                        title="Editar proveedor"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(proveedor)}
                        title="Eliminar proveedor"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <ProveedorDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ProveedorDialog
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        proveedor={editTarget ?? undefined}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="¿Eliminar proveedor?"
        description={
          deleteTarget
            ? `Esta accion no se puede deshacer. El proveedor "${deleteTarget.nombre}" sera eliminado permanentemente.`
            : ''
        }
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}