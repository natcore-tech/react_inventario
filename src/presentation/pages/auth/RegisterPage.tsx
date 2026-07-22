// src/presentation/pages/auth/RegisterPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2, ArrowLeft, Eye, EyeOff,
  CheckCircle2, ShieldCheck, Rocket, Boxes, Zap, Globe,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { ThemeToggle } from '@/presentation/components/ui/ThemeToggle'

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres').max(150).regex(/^[\w.@+-]+$/, 'Solo letras, números y @ . + - _'),
  email: z.string().min(1, 'Email obligatorio').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine(d => d.password === d.confirmPassword, { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] })

type RegisterFormData = z.infer<typeof schema>

// ─── Password strength indicator ─────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const rules = [
    { label: 'Mín. 6 chars', ok: password.length >= 6 },
    { label: 'Número',       ok: /\d/.test(password) },
    { label: 'Letra',        ok: /[a-zA-Z]/.test(password) },
  ]
  if (!password) return null
  const score = rules.filter(r => r.ok).length
  const colors = ['bg-destructive/60', 'bg-amber-400/80', 'bg-primary/80', 'bg-green-400']
  return (
    <div className="space-y-1.5 mt-1.5">
      <div className="flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-400 ${i < score ? colors[score] : 'bg-muted/50'}`} />
        ))}
      </div>
      <div className="flex gap-3">
        {rules.map(({ label, ok }) => (
          <div key={label} className="flex items-center gap-1">
            <CheckCircle2 className={`h-3 w-3 transition-colors ${ok ? 'text-green-400' : 'text-muted-foreground/30'}`} />
            <span className={`text-[10px] transition-colors ${ok ? 'text-green-400 font-medium' : 'text-muted-foreground/40'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const PERKS = [
  { icon: ShieldCheck, label: 'JWT + Roles', desc: 'Acceso seguro por perfil' },
  { icon: Rocket,      label: 'Setup en 5 min', desc: 'Sin tarjeta de crédito' },
  { icon: Boxes,       label: 'Multi-bodega', desc: 'Sucursales ilimitadas' },
  { icon: Zap,         label: 'POS incluido', desc: 'Cobros ultrarrápidos' },
  { icon: Globe,       label: 'Acceso 24/7', desc: 'Desde cualquier lugar' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPw, setShowPw]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register: registerUser, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => { if (user) navigate('/dashboard', { replace: true }) }, [user, navigate])

  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<RegisterFormData>({ resolver: zodResolver(schema) })

  const passwordValue = watch('password', '')

  async function onSubmit(data: RegisterFormData) {
    clearError()
    try { await registerUser(data.username, data.email, data.password); navigate('/dashboard', { replace: true }) }
    catch { /* error in store */ }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background p-4">

      {/* ── Animated background ── */}
      <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
      <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-primary/14 blur-3xl morph-blob" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[440px] h-[440px] rounded-full bg-accent/8 blur-3xl"
        style={{ animation: 'morph 13s ease-in-out infinite' }} />

      {/* ── Top controls ── */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-30">
        <Link to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-200 bg-card/55 backdrop-blur-xl px-4 py-2 rounded-full border border-border/50 hover:border-primary/35 shadow-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </Link>
        <ThemeToggle />
      </div>

      {/* ── Split-screen card ── */}
      <div className="relative z-20 w-full max-w-5xl animate-scale-in-spring my-16">
        <div className="overflow-hidden rounded-3xl border border-primary/22 bg-card/35 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12">

          {/* ── LEFT: Brand panel ── */}
          <div className="lg:col-span-5 relative p-8 lg:p-10 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border/35">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-600/10 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src="/logo_stock.png" alt="Stock Master" className="relative h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="text-xl font-extrabold gradient-text tracking-tight">Stock Master</span>
              </Link>
              <div className="space-y-2 pt-1">
                <span className="section-badge text-[10px]">Registro de Cuenta</span>
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight text-foreground">
                  Tu negocio merece <span className="gradient-text">control real</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Crea tu perfil y accede inmediatamente a todos los módulos operativos y de administración.
                </p>
              </div>
            </div>

            {/* 3D Illustration Container */}
            <div className="relative z-10 my-4 group">
              <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-xl bg-background/50 backdrop-blur-md">
                <img
                  src="/images/login_auth_illustration.png"
                  alt="Stock Master ERP 3D"
                  className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-foreground bg-card/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-primary/20">⚡ Alta Disponibilidad</span>
                  <span className="text-[10px] font-mono text-primary-foreground/80 bg-primary/30 px-2 py-0.5 rounded-md">Sin tarjetas</span>
                </div>
              </div>
            </div>

            {/* Perks list */}
            <div className="relative z-10 space-y-2 my-2">
              {PERKS.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-primary/10 transition-colors duration-200 group">
                  <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 group-hover:bg-primary/30 group-hover:scale-105 transition-all duration-250">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{label}</span>
                    <span className="text-[10px] text-muted-foreground">· {desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30 pt-4">
              <span>© {new Date().getFullYear()} Stock Master</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
                Registro Seguro JWT
              </span>
            </div>
          </div>

          {/* ── RIGHT: Form panel ── */}
          <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center bg-card/15">
            <div className="max-w-md mx-auto w-full space-y-6">

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground">Crear Cuenta</h3>
                <p className="text-xs text-muted-foreground">Completa el formulario para comenzar gratis</p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 border border-destructive/28 p-3.5 text-xs text-destructive animate-slide-down">
                  <span className="shrink-0 font-bold mt-0.5">✕</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                {/* Row: username + email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-user" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Usuario
                    </label>
                    <input id="reg-user" type="text" autoComplete="username"
                      placeholder="mi_usuario" aria-invalid={!!errors.username}
                      className="glow-input" {...register('username')} />
                    {errors.username && <p className="text-[11px] text-destructive pl-1">{errors.username.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="reg-email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Email
                    </label>
                    <input id="reg-email" type="email" autoComplete="email"
                      placeholder="tu@email.com" aria-invalid={!!errors.email}
                      className="glow-input" {...register('email')} />
                    {errors.email && <p className="text-[11px] text-destructive pl-1">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-pass" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input id="reg-pass" type={showPw ? 'text' : 'password'}
                      autoComplete="new-password" placeholder="••••••••"
                      aria-invalid={!!errors.password}
                      className="glow-input pr-11" {...register('password')} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 p-0.5 rounded">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={passwordValue} />
                  {errors.password && <p className="text-[11px] text-destructive pl-1">{errors.password.message}</p>}
                </div>

                {/* Confirm */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-confirm" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input id="reg-confirm" type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password" placeholder="••••••••"
                      aria-invalid={!!errors.confirmPassword}
                      className="glow-input pr-11" {...register('confirmPassword')} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 p-0.5 rounded">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] text-destructive pl-1">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" id="btn-register-submit"
                  className="btn-glow w-full h-11 text-sm font-bold mt-1"
                  disabled={isLoading}>
                  {isLoading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando cuenta…</>
                    : 'Crear mi cuenta gratis'}
                </Button>
              </form>

              <div className="pt-4 border-t border-border/35 text-center">
                <p className="text-xs text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="font-bold text-primary hover:underline underline-offset-2">
                    Inicia sesión aquí
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
