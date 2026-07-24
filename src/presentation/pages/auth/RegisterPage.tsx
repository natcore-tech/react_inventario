// src/presentation/pages/auth/RegisterPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  User,
  Mail,
  Lock,
  UserPlus,
  Sparkles,
  Store,
  Crown,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'

// ─── Imagen de fondo (misma que login para consistencia) ──────────
const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop'

// ─── Esquema de validación ────────────────────────────────────────────
const schema = z
  .object({
    username: z.string().min(3, 'Mínimo 3 caracteres').max(150).regex(/^[\w.@+-]+$/, 'Solo letras, números y @ . + - _'),
    email: z.string().min(1, 'Email obligatorio').email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
type RegisterFormData = z.infer<typeof schema>

// ─── Componente de fortaleza de contraseña (mejorado) ──────────────
function PasswordStrength({ password }: { password: string }) {
  const rules = [
    { label: 'Mín. 6 caracteres', ok: password.length >= 6 },
    { label: 'Contiene número', ok: /\d/.test(password) },
    { label: 'Contiene letra', ok: /[a-zA-Z]/.test(password) },
  ]
  if (!password) return null
  const score = rules.filter((r) => r.ok).length
  const colors = ['bg-rose-500', 'bg-amber-400', 'bg-purple-500']
  const labels = ['Débil', 'Regular', 'Fuerte']
  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-purple-900/60'
                }`}
            />
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-bold ${colors[score - 1].replace('bg-', 'text-').replace('-500', '-400')}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {rules.map(({ label, ok }) => (
          <div key={label} className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-3.5 h-3.5 ${ok ? 'text-purple-400' : 'text-purple-500/40'}`} />
            <span className={`text-xs ${ok ? 'text-purple-400 font-bold' : 'text-purple-400/50'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Partículas ──────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 10,
  duration: Math.random() * 12 + 8,
  opacity: Math.random() * 0.4 + 0.1,
}))

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register: registerUser, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<RegisterFormData>({ resolver: zodResolver(schema) })
  const watchedPw = watch('password', '')

  async function onSubmit(data: RegisterFormData) {
    clearError()
    try {
      await registerUser(data.username, data.email, data.password)
      navigate('/', { replace: true })
    } catch {
      /* error set in store */
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden selection:bg-purple-500/30 selection:text-white">

      {/* ─── IMAGEN DE FONDO ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-[#0A0015]/90 to-purple-950/80" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjB2MjBtMjAtMjBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg5OSwgMTAyLCAyNDEsIDAuMDYpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-60" />

      {/* Orbes de luz */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-fuchsia-500/10 blur-[150px] animate-pulse delay-2000" />

      {/* Partículas flotantes */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-indigo-400 pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            boxShadow: `0 0 ${p.size * 2}px rgba(99,102,241,0.6)`,
          }}
        />
      ))}

      {/* ─── CONTENEDOR PRINCIPAL ────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-4 lg:mx-8 flex flex-col lg:flex-row rounded-3xl overflow-hidden backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_80px_rgba(99,102,241,0.15)] bg-black/40">

        {/* ─── LADO IZQUIERDO — FORMULARIO ──────────────────────────── */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 flex items-center justify-center relative bg-gradient-to-br from-indigo-950/30 to-purple-950/20 backdrop-blur-sm border-r border-indigo-500/10 order-2 lg:order-1">
          <div className="w-full max-w-md space-y-6">

            {/* Logo mobile */}
            <Link to="/" className="flex lg:hidden items-center gap-3 group">
              <img src="/logo_stock.png" alt="Logo" className="w-11 h-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <span className="text-xl font-black text-white">NEXUS <span className="text-indigo-400 font-light">Market</span></span>
            </Link>

            {/* Card del formulario */}
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-2xl p-6 sm:p-8 space-y-5 shadow-[0_0_60px_rgba(99,102,241,0.08)] hover:shadow-[0_0_80px_rgba(99,102,241,0.2)] transition-shadow duration-500">

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Crear Cuenta</h2>
                <p className="text-base text-indigo-300/60">Únete al marketplace y empieza a comprar</p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-900/30 border border-rose-500/40 text-rose-300 text-sm font-medium flex items-start gap-3">
                  <span className="text-lg shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" /> Nombre de Usuario
                  </label>
                  <div className="relative group">
                    <input
                      {...register('username')}
                      type="text"
                      placeholder="minimo_3_caracteres"
                      autoComplete="username"
                      className="w-full h-11 pl-5 pr-5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-white text-sm placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 border-2 border-indigo-400/50 blur-sm" />
                  </div>
                  {errors.username && <p className="text-sm font-bold text-rose-400">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" /> Correo Electrónico
                  </label>
                  <div className="relative group">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      className="w-full h-11 pl-5 pr-5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-white text-sm placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 border-2 border-indigo-400/50 blur-sm" />
                  </div>
                  {errors.email && <p className="text-sm font-bold text-rose-400">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400" /> Contraseña
                  </label>
                  <div className="relative group">
                    <input
                      {...register('password')}
                      type={showPw ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      className="w-full h-11 pl-5 pr-14 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-white text-sm placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-200 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 border-2 border-indigo-400/50 blur-sm" />
                  </div>
                  <PasswordStrength password={watchedPw} />
                  {errors.password && <p className="text-sm font-bold text-rose-400">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" /> Confirmar Contraseña
                  </label>
                  <div className="relative group">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      className="w-full h-11 pl-5 pr-14 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-white text-sm placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-200 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 border-2 border-indigo-400/50 blur-sm" />
                  </div>
                  {errors.confirmPassword && <p className="text-sm font-bold text-rose-400">{errors.confirmPassword.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full h-12 rounded-xl font-black text-white text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: '0 0 30px rgba(79,70,229,0.4)',
                  }}
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Creando cuenta...</>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" /> Crear Mi Cuenta
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Link a login */}
              <p className="text-center text-sm text-indigo-300/60">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-black text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ─── LADO DERECHO — BRANDING Y HERO ────────────────────────── */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden order-1 lg:order-2">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-purple-900/20 pointer-events-none" />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group relative z-10">
            <img src="/logo_stock.png" alt="Logo" className="w-16 h-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-300" />
            <div>
              <p className="text-3xl font-black text-white tracking-tight" style={{ textShadow: '0 0 20px rgba(99,102,241,0.8)' }}>
                NEXUS <span className="text-indigo-400 font-light text-xl">Market</span>
              </p>
              <p className="text-xs text-indigo-300/40 font-mono uppercase tracking-widest">Comercio en Línea · 2026</p>
            </div>
          </Link>

          {/* Centro — Mensaje inspirador */}
          <div className="flex-1 flex flex-col justify-center space-y-6 py-6 relative z-10">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
                <UserPlus className="w-3.5 h-3.5" /> Únete al Marketplace
              </span>
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight"
                style={{ textShadow: '0 0 40px rgba(99,102,241,0.3)' }}>
                Crea tu cuenta<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-fuchsia-400">
                  y empieza a comprar
                </span>
              </h1>
              <p className="text-sm text-indigo-200/60 leading-relaxed max-w-md">
                Regístrate gratis y accede al catálogo completo con cientos de productos, precios exclusivos y entregas garantizadas.
              </p>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Store, text: 'Catálogo con +500 productos exclusivos', color: 'text-indigo-400' },
                { icon: ShieldCheck, text: 'Compras protegidas con garantía', color: 'text-purple-400' },
                { icon: Crown, text: 'Beneficios exclusivos para miembros', color: 'text-amber-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/30 backdrop-blur-sm hover:border-indigo-400/50 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-900/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-xs font-medium text-indigo-200/80">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Pasos de registro */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Registro en 3 pasos
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: '01', label: 'Crea perfil' },
                  { step: '02', label: 'Explora' },
                  { step: '03', label: 'Compra' },
                ].map((s) => (
                  <div key={s.step} className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/30 text-center">
                    <span className="text-xs font-mono font-bold text-indigo-500/70">{s.step}</span>
                    <p className="text-xs font-bold text-white mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-indigo-400/40 font-mono relative z-10">
            <span>© 2026 NEXUS Market</span>
            <div className="flex gap-4">
            </div>
          </div>
        </div>
      </div>

      {/* ─── KEYFRAMES ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2); }
        }
      `}</style>
    </div>
  )
}