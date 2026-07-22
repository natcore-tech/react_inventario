// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { useAuthStore } from '@/presentation/store/auth.store'
import ProtectedRoute from './ProtectedRoute'
import AppShell from '@/presentation/components/AppShell'
import AdminNumerosSeriePage from '../pages/admin/AdminNumerosSeriePage'
import AdminAjustesInventarioPage from '../pages/admin/AdminAjustesInventarioPage'
import AdminAlertasStockPage from '../pages/admin/AdminAlertasStockPage'
import AdminDevolucionesPage from '../pages/admin/AdminDevolucionesPage'
import PlaceholderPage from '@/presentation/pages/PlaceholderPage'
import AdminCotizacionesPage from '../pages/admin/AdminCotizacionesPage'
import DashboardRouter from './DashboardRouter'
import PublicLayout from '../components/public/PublicLayout'
import { ErrorBoundary } from '@/presentation/components/ErrorBoundary'
import HomePage from '../pages/public/HomePage'
import FeaturesPage from '../pages/public/FeaturesPage'
import AboutPage from '../pages/public/AboutPage'
import DocsPage from '../pages/public/DocsPage'

// ─── Lazy imports ─────────────────────────────────────────────────────────────

const LoginPage    = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const ProfilePage  = lazy(() => import('../pages/profile/ProfilePage'))

const MarcasPage = lazy(() => import('../pages/inventory/MarcasPage'))
const CategoriasPage = lazy(() => import('../pages/inventory/CategoriasPage'))
const UnidadesMedidaPage = lazy(() => import('../pages/inventory/UnidadesMedidaPage'))
const UbicacionesFisicasPage = lazy(() => import('../pages/warehouse/UbicacionesFisicasPage'))

const ProveedoresPage = lazy(() => import('../pages/inventory/ProveedoresPage'))
const OrdenesCompraPage = lazy(() => import('../pages/admin/OrdenesCompraPage'))
const ProductosPage = lazy(() => import('../pages/comercial/ProductosPage'))
const ClientesPage = lazy(() => import('../pages/comercial/ClientesPage'))
const PromocionesPage = lazy(() => import('../pages/comercial/PromocionesPage'))
const MetodosPagoPage = lazy(() => import('../pages/comercial/MetodosPagoPage'))
// 🦸‍♂️ Módulo Facturación y POS
const TurnosCajaPage = lazy(() => import('../pages/facturacion/TurnosCajaPage'))
const HistorialVentasPage = lazy(() => import('../pages/facturacion/HistorialVentasPage'))
const PosPage = lazy(() => import('../pages/facturacion/PosPage'))
const MovimientosPage = lazy(() => import('../pages/facturacion/MovimientosPage'))


// ── Bodega ────────────────────────────────────────────────────────────────────
const BodegasPage = lazy(() => import('../pages/warehouse/BodegasPage'))
const StockBodegaPage = lazy(() => import('../pages/warehouse/StockBodegaPage'))
const TrasladosPage = lazy(() => import('../pages/warehouse/TrasladosPage'))
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
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Rutas públicas — PublicLayout con tabs ───────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/"        element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/docs"     element={<DocsPage />} />
          </Route>

          {/* ── Auth (sin layout) ──────────────────────────────────────── */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Rutas Privadas del Inventario (con AppShell y ProtectedRoute) ── */}
          <Route element={<AppShell />}>

            {/* Dashboard Principal */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />

            {/* Perfil de Usuario */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Inventario — Catálogo Base */}
            <Route path="/inventory/products" element={
              <ProtectedRoute>
                <ProductosPage /> {/* Aquí inyectamos tu pantalla real */}
              </ProtectedRoute>
            } />

            <Route path="/inventory/products/:id" element={
              <ProtectedRoute>
                <PlaceholderPage title="Inventario — Detalle de Producto" />
              </ProtectedRoute>
            } />
            <Route path="/inventory/categories" element={
              <ProtectedRoute>
                <CategoriasPage />
              </ProtectedRoute>
            } />

            {/* Tarea 1 — Marca */}
            <Route path="/inventory/brands" element={
              <ProtectedRoute>
                <MarcasPage />
              </ProtectedRoute>
            } />

            {/* Tarea 1 — Unidad de Medida */}
            <Route path="/inventory/units" element={
              <ProtectedRoute>
                <UnidadesMedidaPage />
              </ProtectedRoute>
            } />
            <Route path="/inventory/serial-numbers" element={
              <ProtectedRoute>
                <AdminNumerosSeriePage />
              </ProtectedRoute>
            } />

            {/* Ventas — Flujo de Salida */}
            <Route path="/sales" element={
              <ProtectedRoute>
                <PlaceholderPage title="Ventas — Historial" />
              </ProtectedRoute>
            } />
            {/* Facturación y POS */}
            <Route path="/billing/pos" element={
              <ProtectedRoute>
                <PosPage />
              </ProtectedRoute>
            } />
            <Route path="/billing/shifts" element={
              <ProtectedRoute>
                <TurnosCajaPage />
              </ProtectedRoute>
            } />
            <Route path="/billing/history" element={
              <ProtectedRoute>
                <HistorialVentasPage />
              </ProtectedRoute>
            } />
            <Route path="/sales/quotes" element={
              <ProtectedRoute>
                <PlaceholderPage title="Ventas — Cotizaciones" />
              </ProtectedRoute>
            } />
            <Route path="/sales/returns" element={
              <ProtectedRoute requireStaff>
                <AdminDevolucionesPage />
              </ProtectedRoute>
            } />
            <Route path="/sales/customers" element={
              <ProtectedRoute>
                <ClientesPage />
              </ProtectedRoute>
            } />
            <Route path="/sales/promotions" element={
              <ProtectedRoute>
                <PromocionesPage />
              </ProtectedRoute>
            } />
            <Route path="/sales/payment-methods" element={
              <ProtectedRoute>
                <MetodosPagoPage />
              </ProtectedRoute>
            } />

            {/* Compras — Flujo de Entrada */}
            <Route path="/purchases/orders" element={
              <ProtectedRoute>
                <OrdenesCompraPage />
              </ProtectedRoute>
            } />
            <Route path="/purchases/orders/:id" element={
              <ProtectedRoute>
                <PlaceholderPage title="Compras — Detalle de Orden" />
              </ProtectedRoute>
            } />
            <Route path="/purchases/suppliers" element={
              <ProtectedRoute>
                <ProveedoresPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/cotizaciones"
              element={
                <ProtectedRoute>
                  <AdminCotizacionesPage />
                </ProtectedRoute>
              }
            />
            {/* Bodega — Logística y Control */}
            <Route path="/warehouse/bodegas" element={
              <ProtectedRoute>
                <BodegasPage />
              </ProtectedRoute>
            } />
            {/* Tarea 1 — Ubicación Física */}
            <Route path="/warehouse/locations" element={
              <ProtectedRoute>
                <UbicacionesFisicasPage />
              </ProtectedRoute>
            } />
            <Route path="/warehouse/stock" element={
              <ProtectedRoute>
                <StockBodegaPage />
              </ProtectedRoute>
            } />
            <Route path="/warehouse/movements" element={
              <ProtectedRoute>
                <MovimientosPage />
              </ProtectedRoute>
            } />
            <Route path="/warehouse/transfers" element={
              <ProtectedRoute>
                <TrasladosPage />
              </ProtectedRoute>
            } />
            <Route path="/warehouse/transfers/:id" element={
              <ProtectedRoute>
                <TrasladoBodegaDetallePage />
              </ProtectedRoute>
            } />

            {/* Ejemplo de ruta súper protegida (requiere rol de administrador/staff) */}
            <Route path="/warehouse/adjustments" element={
              <ProtectedRoute requireStaff>
                <AdminAjustesInventarioPage />
              </ProtectedRoute>
            } />


            <Route path="/inventory/stock-alerts" element={
              <ProtectedRoute requireStaff>
                <AdminAlertasStockPage />
              </ProtectedRoute>
            } />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
  )
}