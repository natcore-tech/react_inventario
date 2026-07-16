// src/presentation/pages/comercial/ClientesPage.tsx
import { useEffect } from 'react'
import {
  Loader2,
  UsersRound,
  AlertCircle,
  Users,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Mail,
  Phone,
} from 'lucide-react'

import { useClienteStore } from '@/presentation/store/cliente.store'

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ClientesPage() {
  const { clientes, isLoading, error, loadClientes } = useClienteStore()

  useEffect(() => {
    loadClientes()
  }, [loadClientes])

  // ── Estado: cargando ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando clientes…</p>
      </div>
    )
  }

  // ── Estado: error ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Ocurrió un error</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <button
          id="btn-retry-clientes"
          onClick={loadClientes}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // ── Estado: sin datos ─────────────────────────────────────────────────────
  if (clientes.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UsersRound className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No hay clientes registrados.</p>
      </div>
    )
  }

  // ── Métricas rápidas ──────────────────────────────────────────────────────
  const totalActivos = clientes.filter((c) => c.es_activo).length
  const totalInactivos = clientes.filter((c) => !c.es_activo).length
  const totalConCompras = clientes.filter((c) => c.total_compras > 0).length

  // ── Datos ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} en el sistema
          </p>
        </div>
      </div>

      {/* ── Tarjetas de métricas ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricCard
          id="metric-total-clientes"
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Total de clientes"
          value={clientes.length.toString()}
        />
        <MetricCard
          id="metric-clientes-activos"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
          label="Activos"
          value={totalActivos.toString()}
        />
        <MetricCard
          id="metric-clientes-inactivos"
          icon={<XCircle className="h-5 w-5 text-primary" />}
          label="Inactivos"
          value={totalInactivos.toString()}
        />
        <MetricCard
          id="metric-clientes-con-compras"
          icon={<ShoppingCart className="h-5 w-5 text-primary" />}
          label="Con compras"
          value={totalConCompras.toString()}
        />
      </div>

      {/* ── Tabla de clientes ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Identificación</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombres</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contacto</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dirección</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Compras</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  id={`cliente-row-${cliente.id}`}
                  className="transition-colors hover:bg-muted/20"
                >
                  {/* Identificación */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {cliente.identificacion}
                    </span>
                  </td>

                  {/* Nombres */}
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{cliente.nombres}</span>
                  </td>

                  {/* Contacto: email + teléfono */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {cliente.email ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          {cliente.email}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/40 italic">Sin email</span>
                      )}
                      {cliente.telefono ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          {cliente.telefono}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Dirección */}
                  <td className="px-4 py-3">
                    {cliente.direccion ? (
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {cliente.direccion}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/40 italic">—</span>
                    )}
                  </td>

                  {/* Total compras */}
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        cliente.total_compras > 0
                          ? 'font-semibold text-primary'
                          : 'text-muted-foreground'
                      }
                    >
                      {cliente.total_compras}
                    </span>
                  </td>

                  {/* Estado activo/inactivo */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {cliente.es_activo ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          <CheckCircle2 className="h-3 w-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                          <XCircle className="h-3 w-3" />
                          Inactivo
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla */}
        <div className="border-t border-border bg-muted/20 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {totalInactivos > 0 && (
              <span className="font-medium text-destructive">
                ⚠ {totalInactivos} cliente{totalInactivos !== 1 ? 's' : ''} inactivo{totalInactivos !== 1 ? 's' : ''}.{' '}
              </span>
            )}
            Mostrando {clientes.length} registro{clientes.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-componente: tarjeta de métrica ───────────────────────────────────────

interface MetricCardProps {
  id: string
  icon: React.ReactNode
  label: string
  value: string
}

function MetricCard({ id, icon, label, value }: MetricCardProps) {
  return (
    <div
      id={id}
      className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
