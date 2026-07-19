// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { useAuthStore } from '@/presentation/store/auth.store'
import ProtectedRoute from './ProtectedRoute'
import AppShell from '@/presentation/components/AppShell'
import PlaceholderPage from '../pages/PlaceholderPage'
import AdminNumerosSeriePage from '../pages/admin/AdminNumerosSeriePage'
import AdminAjustesInventarioPage from '../pages/admin/AdminAjustesInventarioPage'
import AdminAlertasStockPage from '../pages/admin/AdminAlertasStockPage'
import AdminDevolucionesPage from '../pages/admin/AdminDevolucionesPage'

// ─── Lazy imports ─────────────────────────────────────────────────────────────

// Auth (sin shell)
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))

// 🦸‍♂️ Módulo Comercial y Core (Tus pantallas)
const ProductosPage = lazy(() => import('../pages/comercial/ProductosPage'))
const ClientesPage = lazy(() => import('../pages/comercial/ClientesPage'))
const PromocionesPage = lazy(() => import('../pages/comercial/PromocionesPage'))
const MetodosPagoPage = lazy(() => import('../pages/comercial/MetodosPagoPage'))
// 🦸‍♂️ Módulo Facturación y POS
const TurnosCajaPage = lazy(() => import('../pages/facturacion/TurnosCajaPage'))
const HistorialVentasPage = lazy(() => import('../pages/facturacion/HistorialVentasPage'))
const PosPage = lazy(() => import('../pages/facturacion/PosPage'))
const MovimientosPage = lazy(() => import('../pages/facturacion/MovimientosPage'))

// El resto de páginas se irán reemplazando por lazy imports reales
// conforme vayas construyendo los módulos de tu backend.

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Rutas Privadas del Inventario (con AppShell y ProtectedRoute) ── */}
          <Route element={<AppShell />}>

            {/* Dashboard Principal */}
            <Route path="/" element={
              <ProtectedRoute>
                <PlaceholderPage title="Dashboard — Métricas de Inventario" />
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
                <PlaceholderPage title="Inventario — Categorías" />
              </ProtectedRoute>
            } />
            <Route path="/inventory/brands" element={
              <ProtectedRoute>
                <PlaceholderPage title="Inventario — Marcas" />
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
            <Route path="/sales/customers" element={
              <ProtectedRoute>
                <PlaceholderPage title="Ventas — Clientes" />
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
                <PlaceholderPage title="Compras — Órdenes de Compra" />
              </ProtectedRoute>
            } />
            <Route path="/purchases/orders/:id" element={
              <ProtectedRoute>
                <PlaceholderPage title="Compras — Detalle de Orden" />
              </ProtectedRoute>
            } />
            <Route path="/purchases/suppliers" element={
              <ProtectedRoute>
                <PlaceholderPage title="Compras — Proveedores" />
              </ProtectedRoute>
            } />

            {/* Bodega — Logística y Control */}
            <Route path="/warehouse/stock" element={
              <ProtectedRoute>
                <MovimientosPage />
              </ProtectedRoute>
            } />
            <Route path="/warehouse/movements" element={
              <ProtectedRoute>
                <PlaceholderPage title="Bodega — Movimientos de Inventario" />
              </ProtectedRoute>
            } />
            <Route path="/warehouse/transfers" element={
              <ProtectedRoute>
                <PlaceholderPage title="Bodega — Traslados entre Bodegas" />
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
  )
}