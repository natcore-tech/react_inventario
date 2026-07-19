// src/presentation/components/AppShell.tsx
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom'
import {
  Package,
  User,
  LogOut,
  LayoutDashboard,
  Bell,
  Boxes,
  ShoppingCart,
  Barcode,
  ChevronDown,
  Tag,
  Ruler,
  MapPin,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/presentation/components/ui/avatar'
import { Separator } from '@/presentation/components/ui/separator'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Obtiene las iniciales del username para el avatar. */
function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

/** Clases para los enlaces de navegación activos/inactivos. */
function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'text-sm font-medium transition-colors hover:text-primary',
    isActive ? 'text-primary' : 'text-muted-foreground',
  ].join(' ')
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AppShell() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Ejemplo: Podrías traer esto de un store de Inventario para leer tu "alerta_stock.py"
  const stockAlertsCount = 3

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4">
          {/* Logo / marca */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-primary"
          >
            <Package className="h-5 w-5" />
            <span>Sistema Inventario</span>
          </Link>

          <Separator orientation="vertical" className="h-6" />

          {/* Navegación principal */}
          {user && (
            <nav className="flex items-center gap-4">
              <NavLink to="/" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/inventory/products" className={navLinkClass}>
                Inventario
              </NavLink>

              {/* ── Menú desplegable: Catálogos base (Tarea 1) ── */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Catálogos
                  <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                    Inventario
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/inventory/brands" className="flex items-center gap-2 cursor-pointer">
                      <Tag className="h-4 w-4" />
                      Marcas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/inventory/units" className="flex items-center gap-2 cursor-pointer">
                      <Ruler className="h-4 w-4" />
                      Unidades de Medida
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                    Bodega
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/locations" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-4 w-4" />
                      Ubicaciones Físicas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/bodegas" className="flex items-center gap-2 cursor-pointer">
                      <Boxes className="h-4 w-4" />
                      Bodega
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/stock-bodegas" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      Stock Bodega
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/traslados-bodega" className="flex items-center gap-2 cursor-pointer">
                      <Tag className="h-4 w-4" />
                      Traslado Bodega
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/traslados-bodega-detalle" className="flex items-center gap-2 cursor-pointer">
                      <Tag className="h-4 w-4" />
                      Traslado Bodega Detalle
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <NavLink to="/sales" className={navLinkClass}>
                Ventas
              </NavLink>
              {/* Enlaces directos de Compras */}
              <NavLink to="/purchases/orders" className={navLinkClass}>
                Órdenes de Compra
              </NavLink>
              <NavLink to="/purchases/suppliers" className={navLinkClass}>
                Proveedores
              </NavLink>
              <NavLink to="/warehouse/bodegas" className={navLinkClass}>
                Bodegas
              </NavLink>
              <NavLink to="/inventory/serial-numbers" className={navLinkClass}>
                Núm. Serie
              </NavLink>
              <NavLink to="/warehouse/adjustments" className={navLinkClass}>
                Ajustes inventario
              </NavLink>
              <NavLink to="/inventory/stock-alerts" className={navLinkClass}>
                Alertas
              </NavLink>
              <NavLink to="/sales/returns" className={navLinkClass}>
                Devoluciones
              </NavLink>

              <NavLink to="/admin/cotizaciones" className={navLinkClass}>
                Cotizaciones
              </NavLink>
              
            </nav>
          )}

          {/* Espacio flexible */}
          <div className="flex-1" />

          {/* Acciones del lado derecho */}
          <div className="flex items-center gap-2">

            {/* Alertas de Stock (Reemplazo del carrito) */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative"
                aria-label="Alertas de stock"
              >
                <Link to="/warehouse/stock">
                  <Bell className="h-5 w-5" />
                  {stockAlertsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {stockAlertsCount > 99 ? '99+' : stockAlertsCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                    aria-label="Menú de usuario"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>

                  {user.is_staff && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Administración</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/" className="flex items-center gap-2 cursor-pointer">
                          <LayoutDashboard className="h-4 w-4" />
                          Panel Principal
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/inventory/categories" className="flex items-center gap-2 cursor-pointer">
                          <Boxes className="h-4 w-4" />
                          Gestionar Categorías
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/20">
        <div className="mx-auto max-w-[1400px] px-4 py-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t bg-background py-4 text-center text-sm text-muted-foreground">
        Sistema de Inventario &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}