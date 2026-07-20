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
  Truck,
  FileText,
  FileSpreadsheet,
  ClipboardList,
  BellRing,
  RotateCcw,
  Users,
  Percent,
  CreditCard,
  Clock,
  Receipt,
  ArrowRightLeft,
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

              {/* Todo lo que sigue (Comercial, Facturacion, Catalogos, Bodegas,
                  Compras, Auditoria) es gestion/administracion del sistema.
                  Solo debe verlo un usuario con is_staff = true. */}
              {user.is_staff && (
                <>
                  {/* ══════════════════════════════════════════════════════════
                      COMERCIAL — Elihú (feat/comercial-core)
                      ══════════════════════════════════════════════════════════ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                      Comercial
                      <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link to="/inventory/products" className="flex items-center gap-2 cursor-pointer">
                          <Package className="h-4 w-4" />
                          Productos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/sales/customers" className="flex items-center gap-2 cursor-pointer">
                          <Users className="h-4 w-4" />
                          Clientes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/sales/promotions" className="flex items-center gap-2 cursor-pointer">
                          <Percent className="h-4 w-4" />
                          Promociones
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/sales/payment-methods" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="h-4 w-4" />
                          Métodos de Pago
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* ══════════════════════════════════════════════════════════
                      FACTURACIÓN — Elihú (feat/comercial-facturacion)
                      ══════════════════════════════════════════════════════════ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                      Facturación
                      <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link to="/billing/shifts" className="flex items-center gap-2 cursor-pointer">
                          <Clock className="h-4 w-4" />
                          Turnos de Caja
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/billing/pos" className="flex items-center gap-2 cursor-pointer">
                          <ShoppingCart className="h-4 w-4" />
                          Punto de Venta
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/billing/history" className="flex items-center gap-2 cursor-pointer">
                          <Receipt className="h-4 w-4" />
                          Historial de Ventas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/warehouse/movements" className="flex items-center gap-2 cursor-pointer">
                          <ArrowRightLeft className="h-4 w-4" />
                          Movimientos de Inventario
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* ══════════════════════════════════════════════════════════
                      CATÁLOGOS — Micky (feat/logistica-base)
                      ══════════════════════════════════════════════════════════ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                      Catálogos
                      <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link to="/inventory/categories" className="flex items-center gap-2 cursor-pointer">
                          <Boxes className="h-4 w-4" />
                          Categorías
                        </Link>
                      </DropdownMenuItem>
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
                      <DropdownMenuItem asChild>
                        <Link to="/warehouse/locations" className="flex items-center gap-2 cursor-pointer">
                          <MapPin className="h-4 w-4" />
                          Ubicaciones Físicas
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* ══════════════════════════════════════════════════════════
                      BODEGAS — Micky (feat/logistica-movimientos)
                      ══════════════════════════════════════════════════════════ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                      Bodegas
                      <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link to="/warehouse/bodegas" className="flex items-center gap-2 cursor-pointer">
                          <Boxes className="h-4 w-4" />
                          Bodega
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/warehouse/stock" className="flex items-center gap-2 cursor-pointer">
                          <Package className="h-4 w-4" />
                          Stock Bodega
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/warehouse/transfers" className="flex items-center gap-2 cursor-pointer">
                          <ArrowRightLeft className="h-4 w-4" />
                          Traslado Bodega
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* ══════════════════════════════════════════════════════════
                      COMPRAS — Michael (feat/compras-proveedores)
                      ══════════════════════════════════════════════════════════ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                      Compras
                      <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link to="/purchases/suppliers" className="flex items-center gap-2 cursor-pointer">
                          <Truck className="h-4 w-4" />
                          Proveedores
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/purchases/orders" className="flex items-center gap-2 cursor-pointer">
                          <FileText className="h-4 w-4" />
                          Órdenes de Compra
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/cotizaciones" className="flex items-center gap-2 cursor-pointer">
                          <FileSpreadsheet className="h-4 w-4" />
                          Cotizaciones
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* ══════════════════════════════════════════════════════════
                      AUDITORÍA — Michael / tú (feat/auditoria-trazabilidad)
                      ══════════════════════════════════════════════════════════ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                      Auditoría
                      <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link to="/warehouse/adjustments" className="flex items-center gap-2 cursor-pointer">
                          <ClipboardList className="h-4 w-4" />
                          Ajustes de Inventario
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/inventory/serial-numbers" className="flex items-center gap-2 cursor-pointer">
                          <Barcode className="h-4 w-4" />
                          Números de Serie
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/inventory/stock-alerts" className="flex items-center gap-2 cursor-pointer">
                          <BellRing className="h-4 w-4" />
                          Alertas de Stock
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/sales/returns" className="flex items-center gap-2 cursor-pointer">
                          <RotateCcw className="h-4 w-4" />
                          Devoluciones
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </nav>
          )}
          {/* Espacio flexible */}
          <div className="flex-1" />

          {/* Acciones del lado derecho */}
          <div className="flex items-center gap-2">

            {/* Alertas de Stock — tambien es gestion, solo para is_staff */}
            {user?.is_staff && (
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