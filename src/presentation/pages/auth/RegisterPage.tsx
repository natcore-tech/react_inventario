// src/presentation/pages/auth/RegisterPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2, ArrowLeft, Eye, EyeOff,
  CheckCircle2, ShieldCheck, Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle'

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres').max(150).regex(/^[\w.@+-]+$/, 'Solo letras, números y @ . + - _'),
  email: z.string().min(1, 'Email obligatorio').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine(d => d.password === d.confirmPassword, { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] })

type RegisterFormData = z.infer<typeof schema>

function PasswordStrength({ password }: { password: string }) {
  const rules = [
    { label: 'Mín. 6 caracteres', ok: password.length >= 6 },
    { label: 'Contiene número', ok: /\d/.test(password) },
    { label: 'Contiene letra', ok: /[a-zA-Z]/.test(password) },
  ]
  if (!password) return null
  const score = rules.filter(r => r.ok).length
  const colors = ['bg-rose-500', 'bg-amber-400', 'bg-emerald-400']

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-muted/50'}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {rules.map(({ label, ok }) => (
          <div key={label} className="flex items-center gap-1">
            <CheckCircle2 className={`h-3 w-3 ${ok ? 'text-emerald-400' : 'text-muted-foreground/40'}`} />
            <span className={`text-[10px] ${ok ? 'text-emerald-400 font-bold' : 'text-muted-foreground/50'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register: registerUser, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<RegisterFormData>({ resolver: zodResolver(schema) })

  const passwordValue = watch('password', '')

  async function onSubmit(data: RegisterFormData) {
    clearError()
    try {
      await registerUser(data.username, data.email, data.password)
      navigate('/dashboard', { replace: true })
    } catch {
      /* error is set in auth store */
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background p-4 sm:p-6 lg:p-8">

      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 mesh-gradient opacity-90 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full bg-primary/20 blur-[130px] animate-pulse-subtle" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[120px]" />

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

          {/* ── LEFT: Visual Canvas & Benefits ── */}
          <div className="lg:col-span-6 relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border/35">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/10 to-transparent pointer-events-none" />

            {/* Header / Brand */}
            <div className="relative z-10 space-y-6">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-black gradient-text tracking-tight">Stock Master</span>
              </Link>

              <div className="space-y-3 pt-2">
                <span className="section-badge text-[10px] tracking-wider uppercase font-extrabold border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                  Registro de Nueva Cuenta
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight text-foreground">
                  Comienza a Gestionar tu <br />
                  <span className="gradient-text text-glow">Inventario en Minutos</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Sin tarjeta de crédito requerida. Acceso inmediato a la consola operativa, punto de venta y catálogo.
                </p>
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="relative z-10 my-8 space-y-3">
              {[
                { title: 'Control Multi-Bodega Sincronizado', desc: 'Gestiona existencias en múltiples sucursales' },
                { title: 'Terminal POS Ultrarrápida', desc: 'Atiende ventas y emite tickets en segundos' },
                { title: 'Seguridad JWT + Django REST', desc: 'Roles estStrictos con is_staff para administración' },
              ].map(({ title, desc }) => (
                <div key={title} className="p-3.5 rounded-2xl bg-background/50 border border-border/40 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/30">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-foreground">{title}</p>
                    <p className="text-[10px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div className="relative z-10 pt-4 border-t border-border/30">
              <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                Tus datos están protegidos con encriptación SSL y tokens JWT.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Form Container ── */}
          <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-card/30 backdrop-blur-xl">

            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-foreground">Crear Cuenta</h2>
                <p className="text-xs text-muted-foreground">Completa los campos para registrar tu usuario</p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold leading-relaxed flex items-start gap-2.5 animate-slide-up">
                  <span className="font-bold">⚠️ Error:</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Nombre de Usuario</label>
                  <input
                    {...register('username')}
                    type="text"
                    placeholder="Ej: mariagomez"
                    className="w-full h-11 px-4 rounded-2xl bg-background/70 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                  {errors.username && (
                    <p className="text-[11px] font-bold text-rose-400">{errors.username.message}</p>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Correo Electrónico</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="maria@empresa.com"
                    className="w-full h-11 px-4 rounded-2xl bg-background/70 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                  {errors.email && (
                    <p className="text-[11px] font-bold text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Contraseña</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full h-11 pl-4 pr-11 rounded-2xl bg-background/70 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={passwordValue} />
                  {errors.password && (
                    <p className="text-[11px] font-bold text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Confirmar Contraseña</label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full h-11 pl-4 pr-11 rounded-2xl bg-background/70 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] font-bold text-rose-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-glow w-full h-12 text-sm font-extrabold rounded-2xl transition-all duration-300 mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Registrando Cuenta...
                    </span>
                  ) : (
                    'Crear Mi Cuenta Gratis'
                  )}
                </Button>
              </form>
            </div>

            {/* Bottom Login Link */}
            <div className="pt-6 text-center border-t border-border/30 mt-4">
              <p className="text-xs text-muted-foreground">
                ¿Ya tienes una cuenta activada?{' '}
                <Link to="/login" className="font-extrabold text-primary hover:underline ml-1">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
