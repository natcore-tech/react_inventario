import { useEffect, useState, useRef } from 'react';
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  FileWarning,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';

import { useCotizacionStore } from '../../store/cotizacion.store';
import type { Cotizacion } from '../../../domain/entities/cotizacion.entity';
import { CotizacionDialog } from '../../components/admin/CotizacionDialog';
import { DeleteConfirmDialog } from '../../components/admin/DeleteConfirmDialog';
import { apiClient } from '@/infrastructure/http/axios-client';

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 300;

export default function AdminCotizacionesPage() {
  const cotizaciones = useCotizacionStore((s) => s.cotizaciones);
  const isLoadingCotizaciones = useCotizacionStore((s) => s.isLoadingCotizaciones);
  const cotizacionesError = useCotizacionStore((s) => s.cotizacionesError);
  const cotizacionesTotal = useCotizacionStore((s) => s.cotizacionesTotal);
  const fetchCotizaciones = useCotizacionStore((s) => s.fetchCotizaciones);
  const deleteCotizacion = useCotizacionStore((s) => s.deleteCotizacion);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [proveedores, setProveedores] = useState<Array<{ id: number; nombre: string }>>([]);
  const [productos, setProductos] = useState<Array<{ id: number; nombre: string; precio?: number }>>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Cotizacion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cotizacion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(cotizacionesTotal / PAGE_SIZE));

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [provRes, prodRes] = await Promise.all([
          apiClient.get<any>('/proveedores/'),
          apiClient.get<any>('/productos/'),
        ]);

        const provData = Array.isArray(provRes.data)
          ? provRes.data
          : provRes.data?.results || [];
        setProveedores(
          provData.map((p: any) => ({
            id: p.id,
            nombre: p.nombre || p.razon_social || `Proveedor ${p.id}`,
          }))
        );

        const prodData = Array.isArray(prodRes.data)
          ? prodRes.data
          : prodRes.data?.results || [];
        setProductos(
          prodData.map((p: any) => ({
            id: p.id,
            nombre: p.nombre || `Producto ${p.id}`,
            precio: Number(p.precio) || 0,
          }))
        );
      } catch (error) {
        console.error('Error cargando metadatos de proveedores y productos:', error);
      }
    }
    loadMetadata();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  useEffect(() => {
    fetchCotizaciones(page, debouncedSearch);
  }, [fetchCotizaciones, page, debouncedSearch]);

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      await deleteCotizacion(deleteTarget.id);
      toast.success('Cotización eliminada', {
        description: `La cotización "${deleteTarget.codigo_cotizacion}" fue eliminada correctamente.`,
      });
      setDeleteTarget(null);
    } catch (err: any) {
      const message = err?.message || 'No se pudo eliminar la cotización.';
      toast.error('Error', { description: message });
    } finally {
      setIsDeleting(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const getProveedorNombre = (id: number) => {
    return proveedores.find((p) => p.id === id)?.nombre || `Proveedor #${id}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Cotizaciones de Proveedores</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona las propuestas y cotizaciones recibidas de los proveedores.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cotización
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {cotizacionesError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {cotizacionesError}
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha Emisión</TableHead>
              <TableHead>Fecha Validez</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-right">Total Propuesto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingCotizaciones &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-8" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-20" /></TableCell>
                </TableRow>
              ))}

            {!isLoadingCotizaciones && cotizaciones.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileWarning className="h-10 w-10 text-muted-foreground/60" />
                    <p className="text-sm font-medium">
                      {debouncedSearch
                        ? `Sin resultados para "${debouncedSearch}"`
                        : 'No hay cotizaciones registradas'}
                    </p>
                    {!debouncedSearch && (
                      <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Crear primera cotización
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoadingCotizaciones &&
              cotizaciones.map((cotizacion) => (
                <TableRow key={cotizacion.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {cotizacion.codigo_cotizacion}
                  </TableCell>
                  <TableCell>{getProveedorNombre(cotizacion.proveedor)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cotizacion.fecha_emision
                      ? new Date(cotizacion.fecha_emision).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(cotizacion.fecha_validez).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {cotizacion.detalles?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatPrice(cotizacion.total_propuesto)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditTarget(cotizacion)}
                        title="Editar Cotización"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(cotizacion)}
                        title="Eliminar Cotización"
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

      {!isLoadingCotizaciones && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando{' '}
            <span className="font-medium">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, cotizacionesTotal)}
            </span>{' '}
            de <span className="font-medium">{cotizacionesTotal}</span> cotizaciones
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            <span className="text-sm">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </div>
        </div>
      )}

      <CotizacionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        proveedores={proveedores}
        productos={productos}
      />

      <CotizacionDialog
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        cotizacion={editTarget ?? undefined}
        proveedores={proveedores}
        productos={productos}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="¿Eliminar cotización?"
        description={
          deleteTarget
            ? `Esta acción no se puede deshacer. La cotización "${deleteTarget.codigo_cotizacion}" será eliminada permanentemente del sistema.`
            : ''
        }
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}