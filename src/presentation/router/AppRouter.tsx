// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../pages/PlaceholderPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth — Acceso y Usuarios */}
        <Route path="/login" element={<PlaceholderPage title="Login de Usuario" />} />
        
        {/* Dashboard Principal */}
        <Route path="/" element={<PlaceholderPage title="Dashboard — Métricas de Inventario" />} />

        {/* Inventario — Catálogo Base */}
        <Route path="/inventory/products" element={<PlaceholderPage title="Inventario — Productos" />} />
        <Route path="/inventory/products/:id" element={<PlaceholderPage title="Inventario — Detalle de Producto" />} />
        <Route path="/inventory/categories" element={<PlaceholderPage title="Inventario — Categorías" />} />
        <Route path="/inventory/brands" element={<PlaceholderPage title="Inventario — Marcas" />} />

        {/* Ventas — Flujo de Salida */}
        <Route path="/sales" element={<PlaceholderPage title="Ventas — Historial" />} />
        <Route path="/sales/new" element={<PlaceholderPage title="Ventas — Nueva Venta / POS" />} />
        <Route path="/sales/quotes" element={<PlaceholderPage title="Ventas — Cotizaciones" />} />
        <Route path="/sales/returns" element={<PlaceholderPage title="Ventas — Devoluciones" />} />
        <Route path="/sales/customers" element={<PlaceholderPage title="Ventas — Clientes" />} />

        {/* Compras — Flujo de Entrada */}
        <Route path="/purchases/orders" element={<PlaceholderPage title="Compras — Órdenes de Compra" />} />
        <Route path="/purchases/orders/:id" element={<PlaceholderPage title="Compras — Detalle de Orden" />} />
        <Route path="/purchases/suppliers" element={<PlaceholderPage title="Compras — Proveedores" />} />

        {/* Bodega — Logística y Control */}
        <Route path="/warehouse/stock" element={<PlaceholderPage title="Bodega — Stock Actual" />} />
        <Route path="/warehouse/movements" element={<PlaceholderPage title="Bodega — Movimientos de Inventario" />} />
        <Route path="/warehouse/transfers" element={<PlaceholderPage title="Bodega — Traslados entre Bodegas" />} />
        <Route path="/warehouse/adjustments" element={<PlaceholderPage title="Bodega — Ajustes de Inventario" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}