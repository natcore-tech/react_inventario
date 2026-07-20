// src/presentation/pages/DashboardUserPage.tsx
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Users, Receipt, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'

interface ShortcutCardProps {
  to: string
  icon: React.ReactNode
  label: string
  description: string
}

function ShortcutCard({ to, icon, label, description }: ShortcutCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/20"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

export default function DashboardUserPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Hola, {user?.username} 👋
        </h1>
        <p className="text-sm text-muted-foreground">¿Qué quieres hacer hoy?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ShortcutCard
          to="/billing/pos"
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Punto de Venta"
          description="Registrar una nueva venta"
        />
        <ShortcutCard
          to="/inventory/products"
          icon={<Package className="h-5 w-5" />}
          label="Productos"
          description="Consultar el catálogo"
        />
        <ShortcutCard
          to="/sales/customers"
          icon={<Users className="h-5 w-5" />}
          label="Clientes"
          description="Ver o registrar clientes"
        />
        <ShortcutCard
          to="/billing/history"
          icon={<Receipt className="h-5 w-5" />}
          label="Historial de Ventas"
          description="Consultar ventas anteriores"
        />
      </div>
    </div>
  )
}