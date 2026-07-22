// src/presentation/pages/auth/LoginPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2, ArrowLeft, Eye, EyeOff,
  ShieldCheck, Zap, Package, Sparkles,
  UserCheck, Crown, KeyRound,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle'

const loginSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type LoginFormData = z.infer<typeof loginSchema>

const FEATURES = [
  { icon: ShieldCheck, title: 'Seguridad JWT + Roles DRF', desc: 'Control de acceso estricto is_staff' },
  { icon: Zap,         title: 'Punto de Venta POS 2.0',  desc: 'Facturación ultra fluida e imprimible' },
  { icon: Package,     title: 'Multi-Bodega & Series',     desc: 'Trazabilidad física de almacén' },
]

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showPw, setShowPw] = useState(false)
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/dashboard'
  const { login, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => { if (user) navigate(from, { replace: true }) }, [user, from, navigate])

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    clearError()
    try { await login(data.username, data.password); navigate(from, { replace: true }) }
    catch { /* error in store */ }
  }

  function fillDemo(userType: 'admin' | 'user') {
    if (userType === 'admin') {
      setValue('username', 'admin')
      setValue('password', 'admin1234')
    } else {
      setValue('username', 'vendedor')
      setValue('password', 'vendedor1234')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background p-4 sm:p-6 lg:p-8">

      {/* ── Background Elements ── */}
      <div className="absolute inset-0 mesh-gradient opacity-90" aria-hidden="true" />
      <div className="absolute inset-0 dot-pattern opacity-25" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl morph-blob" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-accent/15 blur-3xl"
        style={{ animation: 'morph 14s ease-in-out infinite reverse' }} />

      {/* ── Top Bar ── */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-30">
        <Link to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-200 bg-card/60 backdrop-blur-xl px-4 py-2 rounded-full border border-border/50 hover:border-primary/35 shadow-md">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al Inicio
        </Link>
        <ThemeToggle />
      </div>

      {/* ── Main Split Card ── */}
      <div className="relative z-20 w-full max-w-5xl my-12 animate-scale-in">
        <div className="overflow-hidden rounded-3xl border border-primary/30 bg-card/40 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12">

          {/* ── LEFT: Visual & Features ── */}
          <div className="lg:col-span-6 relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border/35">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-600/10 to-transparent pointer-events-none" />

            {/* Header / Brand */}
            <div className="relative z-10 space-y-6">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src="/logo_stock.png" alt="Stock Master" className="relative h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="text-2xl font-extrabold gradient-text tracking-tight">Stock Master</span>
              </Link>

              <div className="space-y-2 pt-2">
                <span className="section-badge text-[10px] tracking-wider uppercase font-bold">Consola de Autenticación</span>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight text-foreground">
                  Acceso Seguro al <span className="gradient-text">Sistema ERP</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Conéctate con tu perfil de usuario y gestiona tu inventario, ventas y sucursales en tiempo real.
                </p>
              </div>
            </div>

            {/* 3D Illustration Container */}
            <div className="relative z-10 my-6 group">
              <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-xl bg-background/50 backdrop-blur-md">
                <img
                  src="/images/login_auth_illustration.png"
                  alt="Plataforma de Inventario 3D"
                  className="w-full h-48 lg:h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-primary/25 text-[11px] font-semibold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span>Control por Rol Django</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary-foreground/80 bg-primary/30 px-2 py-0.5 rounded-md">v2.5 Live</span>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="relative z-10 space-y-2">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title}
                  className="glass-card p-3 flex items-center gap-3 border-border/30 hover:border-primary/45 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/25 group-hover:scale-105 transition-all duration-300">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-none">{title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Status */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30 pt-4 mt-6">
              <span>© {new Date().getFullYear()} Stock Master ERP</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
                Backend REST Operativo
              </span>
            </div>
          </div>

          {/* ── RIGHT: Login Form ── */}
          <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-card/20 backdrop-blur-md">
            <div className="max-w-md mx-auto w-full space-y-6">

              <div className="space-y-1.5">
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground">Iniciar Sesión</h3>
                <p className="text-xs text-muted-foreground">Introduce tus credenciales para acceder a la plataforma</p>
              </div>

              {/* Quick Demo Fill Helper */}
              <div className="p-3 rounded-2xl bg-primary/8 border border-primary/20 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
                  <KeyRound className="h-3.5 w-3.5" /> Acceso Rápido de Prueba:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemo('admin')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/80 border border-primary/30 text-[11px] font-bold text-foreground hover:bg-primary/20 hover:border-primary/60 transition-all">
                    <Crown className="h-3.5 w-3.5 text-amber-400" /> Admin (is_staff)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('user')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/80 border border-border text-[11px] font-bold text-foreground hover:bg-primary/20 hover:border-primary/60 transition-all">
                    <UserCheck className="h-3.5 w-3.5 text-primary" /> Vendedor Normal
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-destructive/15 border border-destructive/35 p-3.5 text-xs text-destructive animate-slide-down">
                  <span className="shrink-0 font-bold mt-0.5">✕</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="login-user" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Nombre de Usuario
                  </label>
                  <input
                    id="login-user" type="text" autoComplete="username"
                    placeholder="Ej. admin o vendedor"
                    aria-invalid={!!errors.username}
                    className="glow-input"
                    {...register('username')}
                  />
                  {errors.username && <p className="text-[11px] text-destructive pl-1">{errors.username.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="login-pass" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="login-pass"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      aria-invalid={!!errors.password}
                      className="glow-input pr-11"
                      {...register('password')}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 p-0.5 rounded">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-destructive pl-1">{errors.password.message}</p>}
                </div>

                <Button type="submit" id="btn-login-submit"
                  className="btn-glow w-full h-11 text-sm font-bold mt-2 rounded-xl"
                  disabled={isLoading}>
                  {isLoading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Iniciando Sesión…</>
                    : 'Ingresar a la Plataforma'}
                </Button>
              </form>

              <div className="pt-4 border-t border-border/35 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  ¿No tienes una cuenta aún?{' '}
                  <Link to="/register" className="font-bold text-primary hover:underline underline-offset-2">
                    Crea tu cuenta aquí
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

