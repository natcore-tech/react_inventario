# StockMaster

## Sistema de Gestión de Inventario

---

## Integrantes

| Nombre |
|---------|
| Mikaela Zurita |
| Elihu Navarrete |
| Michael Lidioma |

---

# Descripción del Sistema

**StockMaster** es una API REST desarrollada con **Django** y **Django REST Framework**, diseñada para administrar y controlar el inventario de una compañia.

El sistema permite registrar, consultar, actualizar y eliminar información relacionada con el inventario, proporcionando un control eficiente del stock disponible y facilitando la administración de productos.

Su principal objetivo es mantener un registro preciso de las existencias en tiempo real, evitando tanto el desabastecimiento como el exceso de mercancía que pueda generar costos innecesarios.

---


# Estructura de carpetas del proyecto


```bash
src/
├── application/
│   ├── dtos/
│   │   ├── create-product.dto.ts     ← (Para tu modelo producto.py)
│   │   ├── create-sale.dto.ts        ← (Para venta.py)
│   │   ├── create-warehouse.dto.ts   ← (Para bodega.py)
│   │   └── login.dto.ts
│   └── use-cases/
│       ├── auth.use-case.ts
│       ├── product.use-case.ts       ← (Orquestará productos, categorías, marcas)
│       ├── sale.use-case.ts          ← (Orquestará ventas, cotizaciones)
│       └── warehouse.use-case.ts     ← (Orquestará bodegas, traslados, stock)
│
├── domain/
│   ├── entities/
│   │   ├── product.entity.ts
│   │   ├── category.entity.ts
│   │   ├── sale.entity.ts
│   │   ├── customer.entity.ts        ← (Para cliente.py)
│   │   ├── warehouse.entity.ts
│   │   └── stock.entity.ts           ← (Para stock_bodega.py)
│   ├── enums/
│   │   ├── sale-status.enum.ts       
│   │   └── movement-type.enum.ts     ← (Para ingresos/egresos)
│   ├── exceptions/
│   │   ├── api.exception.ts
│   │   └── domain.exception.ts
│   ├── ports/
│   │   ├── auth.repository.ts
│   │   ├── product.repository.ts
│   │   ├── sale.repository.ts
│   │   └── warehouse.repository.ts
│   └── services/
│       └── inventory-calc.service.ts ← (Para reglas de negocio puras)
│
├── infrastructure/
│   ├── adapters/
│   │   ├── axios-auth.repository.ts
│   │   ├── axios-product.repository.ts
│   │   ├── axios-sale.repository.ts
│   │   └── axios-warehouse.repository.ts
│   ├── config/
│   │   └── api.config.ts
│   ├── factories/
│   │   ├── auth.factory.ts
│   │   ├── product.factory.ts
│   │   ├── sale.factory.ts
│   │   └── warehouse.factory.ts
│   ├── http/
│   │   ├── axios-client.ts
│   │   └── parse-api-error.ts
│   └── storage/
│       └── local-token-storage.ts
│
└── presentation/
    ├── components/
    │   ├── ui/                       ← (Aquí van los de shadcn tal cual)
    │   ├── AppShell.tsx
    │   ├── ProductCard.tsx
    │   └── FilterPanel.tsx
    ├── pages/
    │   ├── auth/
    │   │   └── LoginPage.tsx
    │   ├── inventory/                ← (Aquí va el CRUD de productos, categorías, marcas)
    │   │   ├── ProductsPage.tsx
    │   │   └── CategoriesPage.tsx
    │   ├── sales/                    ← (Tus ventas, cotizaciones y clientes)
    │   │   ├── SalesPage.tsx
    │   │   └── NewSalePage.tsx
    │   └── warehouse/                ← (Tus bodegas, traslados y ajustes)
    │       ├── WarehousesPage.tsx
    │       └── StockMovementsPage.tsx
    ├── router/
    │   ├── AppRouter.tsx
    │   └── ProtectedRoute.tsx
    ├── store/
    │   ├── auth.store.ts
    │   ├── inventory.store.ts        
    │   ├── sales.store.ts            
    │   └── warehouse.store.ts        
    ├── theme/
    │   └── colors.ts
    └── utils/
        ├── cn.ts
        └── formatters.ts
```