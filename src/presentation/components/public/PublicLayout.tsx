import { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, selectIsStaff } from '@/presentation/store/auth.store'
import { useBodegaStore } from '@/presentation/store/bodega.store'
import { useCartStore, useCartTotalCount, useCartSubtotal } from '@/presentation/store/cart.store'
import { useAudioStore } from '@/presentation/store/audio.store'
import { audioService } from '@/presentation/utils/audio.service'
import { buildLoginRedirectState, hasActiveSessionToken } from '@/presentation/utils/session-auth'
import CheckoutModal from '@/presentation/components/public/CheckoutModal'
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  PackageCheck,
  ShoppingCart,
  ShieldCheck,
  User,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

const CATEGORY_NAV = [
  { label: 'Inicio', path: '/' },
  { label: 'Laptops', path: '/laptops' },
  { label: 'Realidad Virtual', path: '/vr' },
  { label: 'Audio & Sonido', path: '/audio' },
  { label: 'Gaming', path: '/gaming' },
  { label: 'Cyber-wear', path: '/cyberwear' },
] as const

export default function PublicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const isStaff = useAuthStore(selectIsStaff)

  const bodegas = useBodegaStore((state) => state.bodegas)
  const fetchBodegas = useBodegaStore((state) => state.fetchBodegas)

  const { enabled: audioEnabled, toggleAudio } = useAudioStore()

  const {
    items: cartItems,
    isOpen: isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
    selectedBodegaId,
    selectedBodegaNombre,
    setSelectedBodega,
    taxRate,
  } = useCartStore()

  const cartTotalCount = useCartTotalCount()
  const cartSubtotal = useCartSubtotal()
  const discountPercent = useCartStore((state) => state.discountPercent)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  useEffect(() => {
    fetchBodegas().catch(() => undefined)
  }, [fetchBodegas])

  const discountValue = cartSubtotal * (discountPercent / 100)
  const subtotalAfterDiscount = cartSubtotal - discountValue
  const taxCalculated = subtotalAfterDiscount * taxRate
  const totalWithTax = subtotalAfterDiscount + taxCalculated

  const handleCartClick = () => {
    if (!hasActiveSessionToken()) {
      navigate('/login', {
        state: buildLoginRedirectState(location.pathname, 'Inicia sesión para acceder a tu carrito de compras'),
      })
      return
    }
    openCart()
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090012] text-white selection:bg-purple-500/30 selection:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/25 bg-[#090012]/82 backdrop-blur-2xl shadow-[0_10px_40px_rgba(88,28,135,0.18)]">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" onClick={() => audioService.playClick()} className="flex items-center gap-3 shrink-0">
            <img src="/logo_stock.png" alt="Logo" className="h-10 w-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <div className="hidden sm:block">
              <p className="text-2xl font-black leading-none tracking-tight text-white">NEXUS <span className="text-purple-300">Market</span></p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-300/60">Purple Neon</p>
            </div>
          </Link>

          <nav className="hidden xl:flex shrink-0 items-center gap-1 rounded-full border border-purple-500/20 bg-white/5 px-2 py-1.5 overflow-hidden">
            {CATEGORY_NAV.map(({ label, path }) => {
              const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => audioService.playClick()}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.5)]'
                      : 'text-purple-100/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden 2xl:flex items-center gap-2 rounded-2xl border border-purple-500/20 bg-white/5 px-3 py-2 text-xs text-purple-100/80">
              <MapPin className="h-4 w-4 text-purple-300" />
              <select
                value={selectedBodegaId || ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null
                  const found = bodegas.find((bodega) => bodega.id === value)
                  setSelectedBodega(value, found?.nombre)
                }}
                className="min-w-0 bg-transparent text-sm font-bold text-white outline-none"
              >
                <option value="">{selectedBodegaNombre}</option>
                {bodegas.map((bodega) => (
                  <option key={bodega.id} value={bodega.id} className="bg-[#090012] text-white">
                    {bodega.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={toggleAudio}
              title={audioEnabled ? 'Sonido activado' : 'Sonido desactivado'}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-white/5 text-purple-100 transition-all hover:border-purple-400/50 hover:bg-white/10"
            >
              {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            {isStaff ? (
              <Link to="/dashboard" onClick={() => audioService.playWhoosh()} className="hidden lg:inline-flex">
                <Button className="h-11 rounded-2xl border border-purple-400/40 bg-purple-600/80 px-4 text-sm font-bold text-white shadow-[0_0_18px_rgba(168,85,247,0.35)] hover:bg-purple-500/90">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                </Button>
              </Link>
            ) : null}

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => audioService.playClick()}
                  className="hidden md:flex items-center gap-2 rounded-2xl border border-purple-500/20 bg-white/5 px-3 py-2 transition-all hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 font-black text-white">
                    {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-300/60">Sesión</p>
                    <p className="max-w-[120px] truncate text-sm font-bold text-white">{user.first_name || user.username}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-purple-500/20 bg-white/5 px-4 text-sm font-bold text-purple-100 transition-all hover:border-purple-400/50 hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => audioService.playClick()} className="hidden md:inline-flex">
                  <Button variant="outline" className="h-11 rounded-2xl border-purple-500/40 bg-white/5 px-4 text-sm font-bold text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => audioService.playClick()}>
                  <Button className="h-11 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 px-4 text-sm font-black text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] hover:from-purple-500 hover:to-indigo-500">
                    Registro
                  </Button>
                </Link>
              </>
            )}

            <button
              onClick={handleCartClick}
              className="relative flex h-11 items-center gap-3 rounded-2xl border border-purple-300/40 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 px-4 text-white shadow-[0_0_24px_rgba(168,85,247,0.45)] transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <ShoppingCart className="h-5 w-5" />
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Carrito</p>
                <p className="text-sm font-black leading-none">${cartSubtotal.toFixed(2)}</p>
              </div>
              {cartTotalCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-black text-black shadow-[0_0_12px_rgba(52,211,153,0.65)]">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="xl:hidden border-t border-purple-500/15 bg-white/5">
          <nav className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {CATEGORY_NAV.map(({ label, path }) => {
              const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => audioService.playClick()}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.45)]'
                      : 'bg-white/5 text-purple-100/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full pt-28 sm:pt-32">
        <Outlet />
      </main>

      <footer className="w-full border-t border-purple-500/20 bg-[#07010f] px-4 py-12 text-sm text-purple-200/70 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-700 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.35)]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-black text-white">NEXUS MARKET</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-purple-300/50">Purple Neon Commerce</p>
              </div>
            </div>
            <p className="max-w-sm leading-relaxed text-purple-200/60">
              Plataforma de comercio electrónico con navegación por pestañas, diseño premium y compra segura con sesión obligatoria.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-base font-black uppercase tracking-wider text-white">Enlaces</h4>
            <div className="space-y-2">
              <Link className="block transition-colors hover:text-purple-300" to="/about">Sobre la tienda</Link>
              <Link className="block transition-colors hover:text-purple-300" to="/features">Garantías</Link>
              <Link className="block transition-colors hover:text-purple-300" to="/orders">Mis pedidos</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base font-black uppercase tracking-wider text-white">Beneficios</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-purple-300" /> Compra autenticada</p>
              <p className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-purple-300" /> Catálogo independiente</p>
              <p className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-purple-300" /> Pago protegido</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base font-black uppercase tracking-wider text-white">Sucursal</h4>
            <div className="space-y-3 rounded-3xl border border-purple-500/20 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-purple-100/80">
                <Building2 className="h-4 w-4 text-purple-300" />
                <span className="font-bold">{selectedBodegaNombre}</span>
              </div>
              <p className="text-sm leading-relaxed text-purple-200/60">Inventario sincronizado y listo para despacho desde la sucursal activa.</p>
            </div>
          </div>
        </div>
      </footer>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm" onClick={closeCart}>
          <div
            className="flex h-full w-full max-w-md flex-col justify-between border-l border-purple-500/30 bg-[#090012] p-6 text-white shadow-2xl shadow-purple-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-500/25 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-300" />
                <h3 className="text-xl font-black">Carrito ({cartTotalCount})</h3>
              </div>
              <button onClick={closeCart} className="rounded-full border border-purple-500/25 bg-white/5 p-2 text-purple-200 transition-colors hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center text-purple-200/60">
                  <ShoppingCart className="h-14 w-14 text-purple-400/30" />
                  <p className="text-base font-bold text-white">Tu carrito está vacío</p>
                  <p className="text-sm">Agrega artículos desde una categoría para comenzar.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.producto.id} className="flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-white/5 p-3">
                    <img
                      src={item.producto.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=120'}
                      alt={item.producto.nombre}
                      className="h-14 w-14 rounded-xl border border-purple-500/20 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{item.producto.nombre}</p>
                      <p className="mt-0.5 text-sm font-black text-purple-300">${item.precioUnitario.toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-xl border border-purple-500/30 bg-[#110018]">
                          <button onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)} className="px-3 py-1 text-purple-200 transition-colors hover:text-white">-</button>
                          <span className="px-3 text-sm font-bold text-white">{item.cantidad}</span>
                          <button onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)} className="px-3 py-1 text-purple-200 transition-colors hover:text-white">+</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.producto.id)} className="rounded-full p-2 text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="space-y-4 border-t border-purple-500/25 pt-4">
                <div className="space-y-2 text-sm text-purple-200/80">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-white">${cartSubtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Descuento</span><span className="font-bold text-white">-${discountValue.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Impuestos</span><span className="font-bold text-white">${taxCalculated.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-purple-500/20 pt-2"><span className="text-base font-black text-white">Total</span><span className="text-2xl font-black text-white">${totalWithTax.toFixed(2)}</span></div>
                </div>
                <Button
                  onClick={() => {
                    if (!hasActiveSessionToken()) {
                      closeCart()
                      navigate('/login', {
                        state: buildLoginRedirectState('/', 'Inicia sesión para proceder al pago'),
                      })
                      return
                    }
                    closeCart()
                    setIsCheckoutOpen(true)
                    audioService.playWhoosh()
                  }}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-base font-black text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] hover:from-purple-500 hover:to-indigo-500"
                >
                  <CreditCard className="h-5 w-5" /> {hasActiveSessionToken() ? `Pagar $${totalWithTax.toFixed(2)}` : 'Iniciar sesión para pagar'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  )
}
