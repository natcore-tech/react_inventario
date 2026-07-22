// src/presentation/pages/admin/AdminUsuariosPage.tsx
import { useEffect, useState, useMemo } from 'react'
import {
  Users, ShieldCheck, UserX, Search, RefreshCw,
  Crown, UserCog, CheckCircle2, XCircle, Loader2,
  AlertTriangle, Filter,
} from 'lucide-react'
import { toast } from 'sonner'
import { useUsuarioAdminStore } from '@/presentation/store/usuario-admin.store'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import type { UsuarioAdmin } from '@/domain/entities/usuario-admin.entity'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(u: UsuarioAdmin) {
  if (u.first_name && u.last_name) return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase()
  return u.username.slice(0, 2).toUpperCase()
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-EC', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ─── Role badge ───────────────────────────────────────────────────────────────
function RoleBadge({ isStaff, isSuperuser }: { isStaff: boolean; isSuperuser: boolean }) {
  if (isSuperuser) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400">
        <Crown className="h-3 w-3" /> Superusuario
      </span>
    )
  }
  if (isStaff) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary">
        <ShieldCheck className="h-3 w-3" /> Administrador
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground">
      <UserCog className="h-3 w-3" /> Operativo
    </span>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean
  disabled: boolean
  onChange(): void
  label: string
}
function Toggle({ checked, disabled, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={[
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        checked
          ? 'bg-primary border-primary/60 shadow-[0_0_10px_hsl(var(--primary)/0.4)]'
          : 'bg-muted/60 border-border/60',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300',
          checked ? 'translate-x-3.5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

// ─── Stats card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent }: {
  label: string; value: number; icon: React.ReactNode; accent: string
}) {
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
        style={{ backgroundColor: `${accent}18`, borderColor: `${accent}30`, color: accent }}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  )
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  user: UsuarioAdmin
  action: 'promote' | 'demote'
  onConfirm(): void
  onCancel(): void
}
function ConfirmDialog({ user, action, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative z-10 glass-card p-6 max-w-sm w-full space-y-5 animate-scale-in border-primary/25 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            action === 'promote'
              ? 'bg-primary/15 border-primary/30 text-primary'
              : 'bg-destructive/15 border-destructive/30 text-destructive'
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {action === 'promote' ? 'Ascender a Administrador' : 'Revocar Administrador'}
            </p>
            <p className="text-[11px] text-muted-foreground">Esta acción es inmediata y reversible</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3 space-y-1">
          <p className="text-xs font-bold text-foreground">@{user.username}</p>
          {(user.first_name || user.last_name) && (
            <p className="text-[11px] text-muted-foreground">{user.first_name} {user.last_name}</p>
          )}
          <p className="text-[11px] text-muted-foreground">{user.email || 'Sin email'}</p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {action === 'promote'
            ? 'Este usuario podrá acceder a todos los módulos de administración, gestionar compras, auditoría y usuarios.'
            : 'Este usuario perderá el acceso a los módulos de administración. Solo tendrá acceso operativo (POS, Ventas, Clientes).'}
        </p>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" size="sm" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            size="sm"
            className={`flex-1 font-bold ${action === 'demote' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}`}
            onClick={onConfirm}>
            {action === 'promote' ? 'Ascender' : 'Revocar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── User row ─────────────────────────────────────────────────────────────────
interface UserRowProps {
  user: UsuarioAdmin
  currentUserId: number | undefined
  savingId: number | null
  onToggleStaff(u: UsuarioAdmin): void
  onToggleActive(u: UsuarioAdmin): void
  index: number
}
function UserRow({ user, currentUserId, savingId, onToggleStaff, onToggleActive, index }: UserRowProps) {
  const isSelf = user.id === currentUserId
  const isSaving = savingId === user.id

  return (
    <div
      className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3.5 rounded-xl border border-border/30 bg-muted/10 hover:bg-muted/20 hover:border-primary/20 transition-all duration-200 animate-slide-up group"
      style={{ animationDelay: `${index * 40}ms` }}>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border transition-transform duration-200 group-hover:scale-105"
        style={{
          background: user.is_staff
            ? 'hsl(var(--primary)/0.15)'
            : 'hsl(var(--muted)/0.5)',
          borderColor: user.is_staff
            ? 'hsl(var(--primary)/0.3)'
            : 'hsl(var(--border)/0.5)',
          color: user.is_staff ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        }}>
        {getInitials(user)}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-foreground truncate">@{user.username}</span>
          <RoleBadge isStaff={user.is_staff} isSuperuser={user.is_superuser} />
          {isSelf && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-green-400">
              Tú
            </span>
          )}
          {!user.is_active && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
              Inactivo
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
          {user.email || 'Sin email'} · Registrado {formatDate(user.date_joined)}
        </p>
      </div>

      {/* Last login — hidden on mobile */}
      <div className="hidden lg:block text-right shrink-0">
        <p className="text-[11px] text-muted-foreground">Último acceso</p>
        <p className="text-xs font-medium text-foreground">{formatDate(user.last_login)}</p>
      </div>

      {/* Staff toggle */}
      <div className="hidden lg:flex flex-col items-center gap-1 shrink-0">
        <span className="text-[10px] text-muted-foreground font-medium">Admin</span>
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Toggle
            checked={user.is_staff}
            disabled={user.is_superuser || isSelf}
            onChange={() => onToggleStaff(user)}
            label={`Toggle admin para ${user.username}`}
          />
        )}
      </div>

      {/* Active toggle */}
      <div className="hidden lg:flex flex-col items-center gap-1 shrink-0">
        <span className="text-[10px] text-muted-foreground font-medium">Activo</span>
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Toggle
            checked={user.is_active}
            disabled={isSelf}
            onChange={() => onToggleActive(user)}
            label={`Toggle activo para ${user.username}`}
          />
        )}
      </div>

      {/* Mobile: action button */}
      <div className="lg:hidden shrink-0">
        <button
          onClick={() => onToggleStaff(user)}
          disabled={user.is_superuser || isSelf || isSaving}
          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: user.is_staff ? 'hsl(var(--destructive)/0.10)' : 'hsl(var(--primary)/0.10)',
            borderColor: user.is_staff ? 'hsl(var(--destructive)/0.30)' : 'hsl(var(--primary)/0.30)',
            color: user.is_staff ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
          }}>
          {isSaving
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : user.is_staff
              ? <><UserX className="h-3 w-3" /> Revocar</>
              : <><ShieldCheck className="h-3 w-3" /> Ascender</>}
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'admin' | 'operative' | 'inactive'

export default function AdminUsuariosPage() {
  const { usuarios, isLoading, savingId, error, loadUsuarios, toggleStaff, toggleActive, clearError } =
    useUsuarioAdminStore()
  const currentUser = useAuthStore((s) => s.user)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [confirm, setConfirm] = useState<{ user: UsuarioAdmin; action: 'promote' | 'demote' } | null>(null)

  useEffect(() => { loadUsuarios() }, [loadUsuarios])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const filtered = useMemo(() => {
    let list = usuarios
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(q),
      )
    }
    if (filter === 'admin')     list = list.filter((u) => u.is_staff)
    if (filter === 'operative') list = list.filter((u) => !u.is_staff && u.is_active)
    if (filter === 'inactive')  list = list.filter((u) => !u.is_active)
    return list
  }, [usuarios, search, filter])

  const stats = useMemo(() => ({
    total:     usuarios.length,
    admins:    usuarios.filter((u) => u.is_staff).length,
    operativos: usuarios.filter((u) => !u.is_staff && u.is_active).length,
    inactivos: usuarios.filter((u) => !u.is_active).length,
  }), [usuarios])

  function handleToggleStaff(user: UsuarioAdmin) {
    setConfirm({ user, action: user.is_staff ? 'demote' : 'promote' })
  }

  async function handleToggleActive(user: UsuarioAdmin) {
    await toggleActive(user.id, user.is_active)
    toast.success(
      user.is_active
        ? `@${user.username} desactivado`
        : `@${user.username} activado`,
    )
  }

  async function handleConfirm() {
    if (!confirm) return
    await toggleStaff(confirm.user.id, confirm.user.is_staff)
    toast.success(
      confirm.action === 'promote'
        ? `@${confirm.user.username} ascendido a Administrador`
        : `Rol de administrador revocado para @${confirm.user.username}`,
    )
    setConfirm(null)
  }

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all',       label: `Todos (${stats.total})` },
    { key: 'admin',     label: `Admin (${stats.admins})` },
    { key: 'operative', label: `Operativos (${stats.operativos})` },
    { key: 'inactive',  label: `Inactivos (${stats.inactivos})` },
  ]

  return (
    <div className="space-y-7 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Gestión de <span className="gradient-text">Usuarios</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra roles, permisos y estados de las cuentas registradas
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadUsuarios()}
          disabled={isLoading}
          className="gap-2 shrink-0 border-border/60 hover:border-primary/40 hover:text-primary transition-all">
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Usuarios" value={stats.total}
          icon={<Users className="h-4 w-4" />}
          accent="hsl(var(--primary))" />
        <StatCard label="Administradores" value={stats.admins}
          icon={<ShieldCheck className="h-4 w-4" />}
          accent="hsl(44 89% 60%)" />
        <StatCard label="Operativos" value={stats.operativos}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="hsl(142 58% 49%)" />
        <StatCard label="Inactivos" value={stats.inactivos}
          icon={<XCircle className="h-4 w-4" />}
          accent="hsl(5 78% 57%)" />
      </div>

      {/* ── Role guide callout ── */}
      <div className="glass-card p-4 border-primary/20 bg-primary/5 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <p className="text-xs font-bold text-foreground">Sistema de roles</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground">
          <div className="flex items-start gap-2">
            <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span><span className="text-amber-400 font-semibold">Superusuario:</span> Control total del sistema. Solo editable desde Django Admin. No modificable desde aquí.</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span><span className="text-primary font-semibold">Administrador (is_staff=true):</span> Acceso a compras, auditoría, alertas, devoluciones y esta consola.</span>
          </div>
          <div className="flex items-start gap-2">
            <UserCog className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span><span className="font-semibold text-foreground">Operativo (is_staff=false):</span> Panel básico: POS, ventas, clientes, inventario y bodegas.</span>
          </div>
        </div>
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar por usuario, email o nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glow-input pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex gap-1 bg-muted/30 border border-border/40 rounded-xl p-1">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={[
                  'px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 whitespace-nowrap',
                  filter === key
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                ].join(' ')}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table header ── */}
      <div className="hidden lg:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        <span className="w-9" />
        <span>Usuario</span>
        <span className="text-right">Último Acceso</span>
        <span className="text-center">Admin</span>
        <span className="text-center">Activo</span>
      </div>

      {/* ── User list ── */}
      {isLoading && usuarios.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-md animate-ping-slow" />
          </div>
          <p className="text-sm text-muted-foreground">Cargando usuarios…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Sin resultados</p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? `No se encontraron usuarios para "${search}"` : 'No hay usuarios en esta categoría'}
            </p>
          </div>
          {search && (
            <button onClick={() => setSearch('')}
              className="text-xs text-primary hover:underline underline-offset-2">
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user, i) => (
            <UserRow
              key={user.id}
              user={user}
              currentUserId={currentUser?.user_id}
              savingId={savingId}
              onToggleStaff={handleToggleStaff}
              onToggleActive={handleToggleActive}
              index={i}
            />
          ))}
          <p className="text-[11px] text-muted-foreground text-center pt-2">
            Mostrando {filtered.length} de {usuarios.length} usuarios
          </p>
        </div>
      )}

      {/* ── Confirm dialog ── */}
      {confirm && (
        <ConfirmDialog
          user={confirm.user}
          action={confirm.action}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
