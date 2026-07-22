// src/presentation/components/AppShell.tsx
import { useState } from 'react'
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom'
import {
  Package, User, LogOut, LayoutDashboard, Bell, Boxes,
  ShoppingCart, Barcode, ChevronDown, Tag, Ruler, MapPin,
  Truck, FileText, FileSpreadsheet, ClipboardList, BellRing,
  RotateCcw, Users, Percent, CreditCard, Clock, Receipt,
  ArrowRightLeft, Menu, X,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/presentation/components/ui/avatar'
import { Separator } from '@/presentation/components/ui/separator'
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle'

function getInitials(u: string) { return u.slice(0, 2).toUpperCase() }

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'relative text-sm font-medium transition-all duration-200 px-1 py-0.5 rounded whitespace-nowrap',
    isActive ? 'text-primary nav-active' : 'text-muted-foreground hover:text-foreground',
  ].join(' ')
}

function DropBtn({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground px-1 py-0.5 rounded focus-visible:outline-none whitespace-nowrap">
      {label} <ChevronDown className="h-3.5 w-3.5 opacity-60" />
    </button>
  )
}

export default function AppShell() {
  const navigate = useNavigate()
  const { user, logout, isLoading } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const stockAlertsCount = 3

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-md animate-ping-slow" />
          </div>
          <p className="text-sm text-muted-foreground">Cargando…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="shell-header sticky top-0 z-50 w-full animate-slide-down">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 lg:px-6">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img src="/logo_stock.png" alt="Stock Master"
                className="relative h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <span className="text-sm font-extrabold tracking-tight gradient-text hidden sm:block">Stock Master</span>
          </Link>

          <Separator orientation="vertical" className="h-5 shrink-0" />

          {/* Desktop nav */}
          {user && (
            <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>

              {/* Comercial */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><DropBtn label="Comercial" /></DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="glass animate-scale-in w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/inventory/products" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4 text-primary" /> Productos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/sales/customers" className="flex items-center gap-2 cursor-pointer">
                      <Users className="h-4 w-4 text-primary" /> Clientes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/sales/promotions" className="flex items-center gap-2 cursor-pointer">
                      <Percent className="h-4 w-4 text-primary" /> Promociones
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/sales/payment-methods" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4 text-primary" /> Métodos de Pago
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Facturación */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><DropBtn label="Facturación" /></DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="glass animate-scale-in w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/billing/shifts" className="flex items-center gap-2 cursor-pointer">
                      <Clock className="h-4 w-4 text-primary" /> Turnos de Caja
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/billing/pos" className="flex items-center gap-2 cursor-pointer">
                      <ShoppingCart className="h-4 w-4 text-primary" /> Punto de Venta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/billing/history" className="flex items-center gap-2 cursor-pointer">
                      <Receipt className="h-4 w-4 text-primary" /> Historial de Ventas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/movements" className="flex items-center gap-2 cursor-pointer">
                      <ArrowRightLeft className="h-4 w-4 text-primary" /> Movimientos
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Catálogos */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><DropBtn label="Catálogos" /></DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="glass animate-scale-in w-52">
                  <DropdownMenuItem asChild>
                    <Link to="/inventory/categories" className="flex items-center gap-2 cursor-pointer">
                      <Boxes className="h-4 w-4 text-primary" /> Categorías
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/inventory/brands" className="flex items-center gap-2 cursor-pointer">
                      <Tag className="h-4 w-4 text-primary" /> Marcas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/inventory/units" className="flex items-center gap-2 cursor-pointer">
                      <Ruler className="h-4 w-4 text-primary" /> Unidades de Medida
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/locations" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-4 w-4 text-primary" /> Ubicaciones Físicas
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Bodegas */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><DropBtn label="Bodegas" /></DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="glass animate-scale-in w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/bodegas" className="flex items-center gap-2 cursor-pointer">
                      <Boxes className="h-4 w-4 text-primary" /> Bodega
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/stock" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4 text-primary" /> Stock Bodega
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/warehouse/transfers" className="flex items-center gap-2 cursor-pointer">
                      <ArrowRightLeft className="h-4 w-4 text-primary" /> Traslados
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin-only */}
              {user.is_staff && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><DropBtn label="Compras" /></DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="glass animate-scale-in w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/purchases/suppliers" className="flex items-center gap-2 cursor-pointer">
                          <Truck className="h-4 w-4 text-primary" /> Proveedores
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/purchases/orders" className="flex items-center gap-2 cursor-pointer">
                          <FileText className="h-4 w-4 text-primary" /> Órdenes de Compra
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/cotizaciones" className="flex items-center gap-2 cursor-pointer">
                          <FileSpreadsheet className="h-4 w-4 text-primary" /> Cotizaciones
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><DropBtn label="Auditoría" /></DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="glass animate-scale-in w-52">
                      <DropdownMenuItem asChild>
                        <Link to="/warehouse/adjustments" className="flex items-center gap-2 cursor-pointer">
                          <ClipboardList className="h-4 w-4 text-primary" /> Ajustes Inventario
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/inventory/serial-numbers" className="flex items-center gap-2 cursor-pointer">
                          <Barcode className="h-4 w-4 text-primary" /> Números de Serie
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/inventory/stock-alerts" className="flex items-center gap-2 cursor-pointer">
                          <BellRing className="h-4 w-4 text-primary" /> Alertas de Stock
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/sales/returns" className="flex items-center gap-2 cursor-pointer">
                          <RotateCcw className="h-4 w-4 text-primary" /> Devoluciones
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </nav>
          )}

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            {user?.is_staff && (
              <Button variant="ghost" size="icon" asChild
                className="relative group hover:bg-primary/10 hover:text-primary transition-all duration-200"
                aria-label="Alertas de stock">
                <Link to="/inventory/stock-alerts">
                  <Bell className="h-4.5 w-4.5" />
                  {stockAlertsCount > 0 && (
                    <Badge variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold animate-scale-in">
                      {stockAlertsCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* User menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted/50 transition-colors duration-200 focus-visible:outline-none group">
                    <Avatar className="h-7 w-7 ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all duration-200">
                      <AvatarFallback className="text-[11px] font-bold bg-primary/15 text-primary">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground hidden sm:block max-w-[100px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass animate-scale-in w-52">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-1">
                    <p className="font-bold text-foreground text-sm">{user.username}</p>
                    {user.is_staff && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 border border-primary/25 rounded-full px-2 py-0.5 mt-1 font-semibold">
                        ✦ Administrador
                      </span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4 text-primary" /> Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive hover:text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" /> Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="Menú móvil">
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {user && (
          <div className={`lg:hidden overflow-hidden transition-all duration-350 ease-in-out border-t border-border/40 ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
            <nav className="flex flex-col gap-1 px-4 py-3 bg-background/95 backdrop-blur-xl">
              {[
                { to: '/dashboard',           label: 'Dashboard',          icon: LayoutDashboard },
                { to: '/inventory/products',  label: 'Productos',          icon: Package },
                { to: '/sales/customers',     label: 'Clientes',           icon: Users },
                { to: '/billing/pos',         label: 'Punto de Venta',     icon: ShoppingCart },
                { to: '/billing/history',     label: 'Historial Ventas',   icon: Receipt },
                { to: '/warehouse/bodegas',   label: 'Bodegas',            icon: Boxes },
                { to: '/warehouse/stock',     label: 'Stock',              icon: Package },
                { to: '/warehouse/transfers', label: 'Traslados',          icon: ArrowRightLeft },
              ].map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200">
                  <Icon className="h-4 w-4 text-primary" /> {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border/40 mt-1">
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 w-full">
                  <LogOut className="h-4 w-4" /> Cerrar Sesión
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-background/60 py-5 mt-auto">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/logo_stock.png" alt="Stock Master" className="h-5 w-auto object-contain opacity-70" />
            <span className="text-xs font-semibold gradient-text">Stock Master ERP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Stock Master — Panel de Control
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping-slow" />
            Sistema operativo
          </div>
        </div>
      </footer>
    </div>
  )
}
