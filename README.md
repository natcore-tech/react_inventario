# StockMaster — App de Gestión de Inventario (React)

## Integrantes

| Nombre |
|---------|
| Mikaela Zurita |
| Elihu Navarrete |
| Michael Lidioma |

# Descripción del Sistema

**StockMaster** es una moderna aplicación web diseñada para administrar y controlar el inventario de una compañía de forma centralizada y eficiente. Construida con **React**, **Zustand** y estilizada con **Tailwind CSS/Shadcn**, la plataforma se conecta a una robusta API REST desarrollada en **Django**.

El sistema proporciona un panel de administración completo e intuitivo para gestionar el ciclo de vida del negocio, incluyendo:
- 📦 **Catálogo e Inventario:** Control preciso de productos, categorías, marcas, múltiples bodegas y movimientos de stock.
- 🛒 **Ventas y Cotizaciones:** Registro ágil de ventas, generación de cotizaciones y seguimiento de transacciones.
- 👥 **Gestión de Clientes:** Mantenimiento de la base de datos de compradores.

Su principal objetivo es mantener un registro exacto de las existencias en tiempo real, previniendo desabastecimientos y optimizando el flujo operativo mediante una interfaz fluida e interactiva.
## 📋 Requisitos

* **Node.js** 20.x o superior
* Un gestor de paquetes como **npm** (recomendado, el proyecto genera `package-lock.json`), **yarn** o **pnpm**.
* Un editor compatible: VS Code o similar.
* Conexión a internet (la app consume una API remota, no funciona 100% offline).

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/natcore-tech/react_inventario.git
   cd react_inventario
   code .
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Comandos principales

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta la app en modo desarrollo (por defecto en el puerto 5173). |
| `npm run build` | Compila la aplicación para producción. |
| `npm run preview` | Ejecuta la versión compilada para probar producción localmente. |
| `npm run lint` | Ejecuta el linter (oxlint) para validar el código. |

## Variables de entorno

El proyecto utiliza variables de entorno para su configuración. Debes crear un archivo `.env` en la raíz del proyecto basándote en la URL de la API:

```env
VITE_API_URL=https://stock-master.nael.live/api
```

## Credenciales de prueba

* Usuario: `Admin`
* Contraseña: `Admin123` 

## Cómo se conecta la app a la API

* La app usa **Axios** como cliente HTTP, configurado en `src/infrastructure/http/axios-client.ts`.
* La autenticación es mediante **JWT** (`djangorestframework-simplejwt`): al iniciar sesión, el backend devuelve un token que se almacena (por ejemplo en `local-token-storage.ts`) y se adjunta automáticamente en las peticiones siguientes a través de los repositorios.
* El proyecto sigue una **Arquitectura Limpia**, por lo que cada módulo tiene su propio **repositorio** en `src/infrastructure/adapters/` (ej: `axios-product.repository.ts`, `axios-sale.repository.ts`), que llama a los endpoints correspondientes de la API.
* El estado global se maneja mediante **Zustand** (`src/presentation/store/`).
* Puedes explorar la documentación interactiva de la API (Swagger) en la URL de la API proporcionada en tu documento.

## Estructura completa del proyecto

El código fuente está modularizado aplicando rigurosamente los principios de **Clean Architecture**:

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

## Problemas comunes

* **Error de CORS o Network Error**: Verifica que la variable `VITE_API_URL` esté correcta en el archivo `.env` y que el backend esté levantado o accesible.
* **Fallos al instalar dependencias**: Asegúrate de estar usando una versión reciente de Node.js (se recomienda la 20 o LTS).

---
