// src/presentation/pages/auth/LoginPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Crown,
  UserCheck,
  Store,
  Sparkles,
  Fingerprint,
  Lock,
  Mail,
} from 'lucide-react'
import { useAuthStore } from '@/presentation/store/auth.store'

const loginSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type LoginFormData = z.infer<typeof loginSchema>

// Imagen de fondo (puedes cambiar la URL)
const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop'

// Partículas flotantes
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 10,
  duration: Math.random() * 12 + 8,
  opacity: Math.random() * 0.4 + 0.1,
}))

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const locationState = location.state as { from?: { pathname?: string }; message?: string } | null
  const from = locationState?.from?.pathname ?? '/'
  const infoMessage = locationState?.message
  const { login, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    clearError()
    try {
      await login(data.username, data.password)
      navigate(from, { replace: true })
    } catch {
      /* error set in store */
    }
  }

  function fillDemo(type: 'admin' | 'vendedor') {
    clearError()
    setValue('username', type === 'admin' ? 'admin' : 'vendedor')
    setValue('password', type === 'admin' ? 'admin1234' : 'vendedor1234')
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden selection:bg-purple-500/30 selection:text-white">
      {/* ─── IMAGEN DE FONDO ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      />
      {/* Overlay oscuro con gradiente para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-[#0A0015]/90 to-indigo-950/80" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjB2MjBtMjAtMjBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNjgsIDg1LCAyNDcsIDAuMDYpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-60" />

      {/* Orbes de luz ambiental */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-600/15 blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-fuchsia-500/10 blur-[150px] animate-pulse delay-2000" />

      {/* Partículas flotantes */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-purple-400 pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            boxShadow: `0 0 ${p.size * 2}px rgba(168,85,247,0.6)`,
          }}
        />
      ))}

      {/* ─── CONTENEDOR PRINCIPAL ────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-4 lg:mx-8 flex flex-col lg:flex-row rounded-3xl overflow-hidden backdrop-blur-xl border border-purple-500/20 shadow-[0_0_80px_rgba(168,85,247,0.15)] bg-black/40">
        {/* ─── LADO IZQUIERDO — BRANDING Y HERO ────────────────────── */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-indigo-900/20 pointer-events-none" />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group relative z-10">
            <img src="/logo_stock.png" alt="Logo" className="w-16 h-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-300" />
            <div>
              <p className="text-3xl font-black text-white tracking-tight" style={{ textShadow: '0 0 20px rgba(168,85,247,0.8)' }}>
                NEXUS <span className="text-purple-400 font-light text-xl">Market</span>
              </p>
              <p className="text-xs text-purple-300/40 font-mono uppercase tracking-widest">Comercio en Línea · 2026</p>
            </div>
          </Link>

          {/* Centro — Mensaje inspirador */}
          <div className="flex-1 flex flex-col justify-center space-y-8 py-12 relative z-10">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
                <Fingerprint className="w-3.5 h-3.5" /> Acceso Seguro
              </span>
              <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight"
                style={{ textShadow: '0 0 40px rgba(168,85,247,0.3)' }}>
                Bienvenido <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400">
                  al futuro del retail
                </span>
              </h1>
              <p className="text-lg text-purple-200/60 leading-relaxed max-w-md">
                Accede a tu cuenta para gestionar inventario, realizar pedidos y conectar con tu equipo en tiempo real.
              </p>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Store, text: 'Catálogo con +500 productos exclusivos', color: 'text-purple-400' },
                { icon: ShieldCheck, text: 'Transacciones protegidas con encriptación', color: 'text-indigo-400' },
                { icon: Crown, text: 'Panel administrativo de alto rendimiento', color: 'text-amber-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-purple-500/20 bg-purple-950/30 backdrop-blur-sm hover:border-purple-400/50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-purple-200/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-purple-400/40 font-mono relative z-10">
            <span>© 2026 NEXUS Market</span>
            <div className="flex gap-4">
            </div>
          </div>
        </div>

        {/* ─── LADO DERECHO — FORMULARIO ────────────────────────────── */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex items-center justify-center relative bg-gradient-to-br from-purple-950/30 to-indigo-950/20 backdrop-blur-sm border-l border-purple-500/10">
          <div className="w-full max-w-md space-y-8">
            {/* Logo mobile */}
            <Link to="/" className="flex lg:hidden items-center gap-3 group">
              <img src="/logo_stock.png" alt="Logo" className="w-11 h-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <span className="text-xl font-black text-white">NEXUS <span className="text-purple-400 font-light">Market</span></span>
            </Link>

            {/* Card del formulario con glassmorphism mejorado */}
            <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-2xl p-8 sm:p-10 space-y-8 shadow-[0_0_60px_rgba(168,85,247,0.08)] hover:shadow-[0_0_80px_rgba(168,85,247,0.2)] transition-shadow duration-500">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Iniciar Sesión</h2>
                <p className="text-base text-purple-300/60">Ingresa tus credenciales para continuar</p>
              </div>

              {/* Mensaje de redirección */}
              {infoMessage && (
                <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-500/40 text-indigo-300 text-sm font-medium flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                  {infoMessage}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-900/30 border border-rose-500/40 text-rose-300 text-sm font-medium flex items-start gap-3">
                  <span className="text-lg shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-purple-200 block flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" /> Usuario o Email
                  </label>
                  <div className="relative group">
                    <input
                      {...register('username')}
                      type="text"
                      placeholder="Ej: admin, vendedor..."
                      autoComplete="username"
                      className="w-full h-14 pl-5 pr-5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-white text-base placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 border-2 border-purple-400/50 blur-sm" />
                  </div>
                  {errors.username && (
                    <p className="text-sm font-bold text-rose-400">{errors.username.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-purple-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" /> Contraseña
                    </label>
                    <button type="button" onClick={() => alert('Usa los accesos rápidos de demostración')}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2">
                      ¿Olvidaste?
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      {...register('password')}
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      className="w-full h-14 pl-5 pr-14 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-white text-base placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 border-2 border-purple-400/50 blur-sm" />
                  </div>
                  {errors.password && (
                    <p className="text-sm font-bold text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full h-14 rounded-2xl font-black text-white text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                    boxShadow: '0 0 30px rgba(124,58,237,0.4)',
                  }}
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Verificando...</>
                  ) : (
                    <>Ingresar a la Plataforma <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>

              {/* Accesos rápidos */}
              <div className="space-y-3 pt-2 border-t border-purple-500/20">
                <p className="text-xs font-bold text-purple-400/70 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3" /> Acceso rápido de demostración
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => fillDemo('admin')}
                    className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-amber-900/30 border border-amber-500/30 text-amber-300 text-sm font-bold hover:bg-amber-900/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                  >
                    <Crown className="w-4 h-4" /> Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('vendedor')}
                    className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm font-bold hover:bg-purple-900/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  >
                    <UserCheck className="w-4 h-4" /> Vendedor
                  </button>
                </div>
              </div>

              {/* Registro */}
              <p className="text-center text-sm text-purple-300/60">
                ¿Sin cuenta aún?{' '}
                <Link to="/register" className="font-black text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KEYFRAMES PARA ANIMACIÓN DE PARTÍCULAS ────────────────── */}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2); }
        }
      `}</style>
    </div>
  )
}