// src/presentation/router/DashboardRouter.tsx
import { useAuthStore } from '@/presentation/store/auth.store'
import DashboardAdminPage from '@/presentation/pages/DashboardAdminPage'
import DashboardUserPage from '@/presentation/pages/DashboardUserPage'

/**
 * Renderiza el Dashboard correcto según el rol del usuario:
 * - is_staff = true  → Panel de administración completo
 * - is_staff = false → Panel operativo (Ventas, Clientes, Inventario básico)
 */
export default function DashboardRouter() {
  const user = useAuthStore((s) => s.user)
  return user?.is_staff ? <DashboardAdminPage /> : <DashboardUserPage />
}