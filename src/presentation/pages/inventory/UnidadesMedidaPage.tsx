// src/presentation/pages/inventory/UnidadesMedidaPage.tsx
import { useEffect } from 'react'
import { useUnidadMedidaStore } from '@/presentation/store/unidad-medida.store'

export default function UnidadesMedidaPage() {
  const { unidades, isLoading, error, fetchUnidades } = useUnidadMedidaStore()

  useEffect(() => {
    fetchUnidades()
  }, [fetchUnidades])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Unidades de Medida</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Cargando unidades de medida...</span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && unidades.length === 0 && (
        <p className="text-muted-foreground">No hay unidades de medida registradas.</p>
      )}

      {!isLoading && unidades.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Abreviatura</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Descripción</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
