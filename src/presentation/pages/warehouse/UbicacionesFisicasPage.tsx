// src/presentation/pages/warehouse/UbicacionesFisicasPage.tsx
import { useEffect } from 'react'
import { useUbicacionFisicaStore } from '@/presentation/store/ubicacion-fisica.store'

export default function UbicacionesFisicasPage() {
  const { ubicaciones, isLoading, error, fetchUbicaciones } = useUbicacionFisicaStore()

  useEffect(() => {
    fetchUbicaciones()
  }, [fetchUbicaciones])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ubicaciones Físicas</h1>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Cargando ubicaciones físicas...</span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && ubicaciones.length === 0 && (
        <p className="text-muted-foreground">No hay ubicaciones físicas registradas.</p>
      )}

      {!isLoading && ubicaciones.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pasillo</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Estante</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Coordenada</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
