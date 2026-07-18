// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { useAuthStore } from '@/presentation/store/auth.store'
import ProtectedRoute from './ProtectedRoute'
import AppShell from '@/presentation/components/AppShell'

// ─── Lazy imports ─────────────────────────────────────────────────────────────

// Auth (sin shell)
const LoginPage    = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))

// ── Bodega ────────────────────────────────────────────────────────────────────
const BodegasPage              = lazy(() => import('../pages/warehouse/BodegasPage'))
const StockBodegaPage          = lazy(() => import('../pages/warehouse/StockBodegaPage'))
const TrasladosPage            = lazy(() => import('../pages/warehouse/TrasladosPage'))
const TrasladoBodegaDetallePage = lazy(() => import('../pages/warehouse/TrasladoBodegaDetallePage'))

// ─── Loader global ────────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function AppRouter() {
  const loadSession = useAuthStore((state) => state.loadSession)

  // Cargar la sesión guardada al iniciar la app.
  useEffect(() => {
    loadSession()
  }, [loadSession])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Rutas de autenticación (sin AppShell, acceso público) ── */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Rutas Privadas de Bodega (con AppShell y ProtectedRoute) ── */}
          <Route element={<AppShell />}>

            {/* Redirect raíz → bodegas */}
            <Route path="/" element={<Navigate to="/warehouse/bodegas" replace />} />

            {/* ✅ Bodega — Gestión de Bodegas */}
            <Route path="/warehouse/bodegas" element={
              <ProtectedRoute>
                <BodegasPage />
              </ProtectedRoute>
            } />

            {/* ✅ StockBodega — Stock en Bodegas */}
            <Route path="/warehouse/stock" element={
              <ProtectedRoute>
                <StockBodegaPage />
              </ProtectedRoute>
            } />

            {/* ✅ TrasladoBodega — Traslados entre Bodegas */}
            <Route path="/warehouse/transfers" element={
              <ProtectedRoute>
                <TrasladosPage />
              </ProtectedRoute>
            } />

            {/* ✅ TrasladoBodegaDetalle — Detalle de un Traslado específico */}
            <Route path="/warehouse/transfers/:id" element={
              <ProtectedRoute>
                <TrasladoBodegaDetallePage />
              </ProtectedRoute>
            } />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/warehouse/bodegas" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}