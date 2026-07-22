// src/presentation/pages/auth/LoginPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2, ArrowLeft, Eye, EyeOff, Sparkles, UserCheck, Crown,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle'

const loginSchema = z.object({
  username: z.string().min(3, 'El usuario o email debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/dashboard'
  const { login, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    clearError()
    try {
      await login(data.username, data.password)
      navigate(from, { replace: true })
    } catch {
      /* error is set in auth store */
    }
  }

  function fillDemo(userType: 'admin' | 'vendedor') {
    clearError()
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

      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 mesh-gradient opacity-90 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-primary/20 blur-[130px] animate-pulse-subtle" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[120px]" />

      {/* ── Top Bar ── */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-200 bg-card/70 backdrop-blur-xl px-4 py-2 rounded-full border border-border/50 hover:border-primary/40 shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al Inicio
        </Link>
        <ThemeToggle />
      </div>

      {/* ── Main Split Canvas Card ── */}
      <div className="relative z-20 w-full max-w-5xl my-16 animate-scale-in">
        <div className="overflow-hidden rounded-3xl border border-primary/35 bg-card/60 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12">

          {/* ── LEFT: Branding & 3D Visual Canvas ── */}
          <div className="lg:col-span-6 relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border/35">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/10 to-transparent pointer-events-none" />

            {/* Brand Header */}
            <div className="relative z-10 space-y-6">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-black gradient-text tracking-tight">Stock Master</span>
              </Link>

              <div className="space-y-3 pt-2">
                <span className="section-badge text-[10px] tracking-wider uppercase font-extrabold border-primary/40 bg-primary/10">
                  Consola de Autenticación JWT
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight text-foreground">
                  Acceso al Sistema <br />
                  <span className="gradient-text text-glow">ERP Empresarial</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Conéctate a tu panel operativo para supervisar sucursales, facturar en POS y controlar inventarios en tiempo real.
                </p>
              </div>
            </div>

            {/* Center 3D Illustration Canvas */}
            <div className="relative my-8 group">
              <div className="absolute inset-0 bg-primary/15 blur-2xl rounded-2xl pointer-events-none" />
              <img
                src="/images/login_auth_illustration.png"
                alt="Stock Master Logística 3D"
                className="relative w-full h-auto max-h-[240px] object-contain rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Overlaid Badges */}
              <div className="absolute -bottom-3 left-4 glass-card px-3.5 py-2 flex items-center gap-2 border-primary/30 shadow-xl backdrop-blur-xl">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-[10px] font-bold text-foreground">Django REST JWT</p>
                  <p className="text-[9px] text-emerald-400">Tokens Encriptados</p>
                </div>
              </div>
            </div>

            {/* Bottom Demo Credential Fill Chips */}
            <div className="relative z-10 pt-4 border-t border-border/30 space-y-2">
              <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Prueba Rápida en 1-Clic:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/35 text-xs font-extrabold text-foreground transition-all duration-200"
                >
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                  Admin (`is_staff = true`)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('vendedor')}
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-card/80 hover:bg-card border border-border/50 text-xs font-bold text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  Vendedor Operativo
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form Container ── */}
          <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-card/30 backdrop-blur-xl">

            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-foreground">Iniciar Sesión</h2>
                <p className="text-xs text-muted-foreground">Ingresa tus credenciales de usuario para continuar</p>
              </div>

              {/* Error Alert Banner */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold leading-relaxed flex items-start gap-2.5 animate-slide-up">
                  <span className="font-bold">⚠️ Error:</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Usuario / Username</label>
                  <div className="relative">
                    <input
                      {...register('username')}
                      type="text"
                      placeholder="Ej: admin o vendedor"
                      className="w-full h-12 px-4 rounded-2xl bg-background/70 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-[11px] font-bold text-rose-400">{errors.username.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">Contraseña</label>
                    <a href="#" className="text-[11px] font-semibold text-primary hover:underline" onClick={(e) => { e.preventDefault(); alert('Usa el botón de prueba rápida "Admin" o "Vendedor" arriba') }}>
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full h-12 pl-4 pr-11 rounded-2xl bg-background/70 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] font-bold text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-glow w-full h-13 text-base font-extrabold rounded-2xl transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" /> Verificando JWT...
                    </span>
                  ) : (
                    'Ingresar a la Plataforma'
                  )}
                </Button>
              </form>
            </div>

            {/* Bottom Register CTA */}
            <div className="pt-8 text-center border-t border-border/30 mt-6">
              <p className="text-xs text-muted-foreground">
                ¿Aún no tienes una cuenta de empresa?{' '}
                <Link to="/register" className="font-extrabold text-primary hover:underline ml-1">
                  Regístrate gratis aquí
                </Link>
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
