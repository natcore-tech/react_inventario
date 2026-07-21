// src/presentation/router/DashboardRouter.tsx
import { useAuthStore } from '@/presentation/store/auth.store'
import DashboardUserPage from '@/presentation/pages/DashboardUserPage'
import DashboardAdminPage from '@/presentation/pages/DashboardAdminPage'

/** Decide qué dashboard mostrar en "/" según el rol — mismo user que usa AppShell. */
export default function DashboardRouter() {
  const user = useAuthStore((s) => s.user)
  return user?.is_staff ? <DashboardAdminPage /> : <DashboardUserPage />
}