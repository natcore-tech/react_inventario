// src/presentation/pages/public/CategoryProductsPage.tsx
// Reusable page rendered by every dedicated category route (/laptops, /vr, etc.)
import React, { useEffect, useState, useMemo } from 'react'

import { useProductoStore } from '@/presentation/store/producto.store'
import { useCategoriaStore } from '@/presentation/store/categoria.store'
import { useStockBodegaStore } from '@/presentation/store/stock-bodega.store'
import { useCartStore } from '@/presentation/store/cart.store'

import { audioService } from '@/presentation/utils/audio.service'

import type { Producto } from '@/domain/entities/producto.entity'
import ProductDetailModal from '@/presentation/components/public/ProductDetailModal'
import {
  ShoppingBag, CheckCircle2, Zap, Filter, SlidersHorizontal, Star, Sparkles
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

export interface Feature {
  icon: any
  title: string
  desc: string
}

export interface Stat {
  icon: any
  value: string
  label: string
}

export interface CategoryProductsPageProps {
  /** Exact category name substring to match against (case-insensitive) */
  categorySlug: string
  /** Display title shown in the hero banner */
  title: string
  /** Short tagline */
  subtitle: string
  /** Accent hex color for neon glow effects */
  accentColor: string
  /** Gradient classes for the hero banner background */
  heroGradient: string
  /** Full-res hero image URL */
  heroImage?: string
  /** Background video URL */
  heroVideo?: string
  /** Emoji or short label tag shown in the hero badge */
  heroTag: string
  /** Features to display */
  features?: Feature[]
  /** Stats to display */
  stats?: Stat[]
}

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 6,
  opacity: Math.random() * 0.3 + 0.1,
}))

export default function CategoryProductsPage({
  categorySlug,
  title,
  subtitle,
  accentColor,
  heroGradient,
  heroImage,
  heroVideo,
  heroTag,
  features,
  stats
}: CategoryProductsPageProps) {


  const productos = useProductoStore((s) => s.productos)
  const loadProductos = useProductoStore((s) => s.loadProductos)
  const isLoading = useProductoStore((s) => s.isLoading)

  const categorias = useCategoriaStore((s) => s.categorias)
  const loadCategorias = useCategoriaStore((s) => s.loadCategorias)

  const stocksBodega = useStockBodegaStore((s) => s.stocks)
  const fetchStocks = useStockBodegaStore((s) => s.fetchStocks)

  const { addItem, selectedBodegaId, selectedBodegaNombre } = useCartStore()

  const [onlyInStock, setOnlyInStock] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    Promise.allSettled([loadProductos(), loadCategorias(), fetchStocks()])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Resolve the matching category id from the slug / keyword
  const matchedCategoryId = useMemo(() => {
    if (!categorias.length) return null
    const match = categorias.find((c) =>
      c.nombre.toLowerCase().includes(categorySlug.toLowerCase()) ||
      (c.slug && c.slug.toLowerCase().includes(categorySlug.toLowerCase()))
    )
    return match?.id ?? null
  }, [categorias, categorySlug])

  const getStock = (p: Producto): number => {
    if (!selectedBodegaId) return p.stock
    const s = stocksBodega.find((x) => x.producto === p.id && x.bodega === selectedBodegaId)
    return s ? s.cantidad : 0
  }

  const filtered = useMemo(() => {
    return productos.filter((p) => {
      // Usar slug primero o fallback
      const catMatch = matchedCategoryId ? p.categoria?.id === matchedCategoryId : p.categoria?.nombre.toLowerCase().includes(categorySlug.toLowerCase())
      if (!catMatch) return false
      if (onlyInStock && getStock(p) <= 0) return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos, matchedCategoryId, categorySlug, onlyInStock, selectedBodegaId, stocksBodega])

  const handleAddToCart = (p: Producto, e: React.MouseEvent) => {
    e.stopPropagation()
    const success = addItem(p, 1, getStock(p))
    setToastMessage(
      success
        ? `✓ "${p.nombre}" agregado al carrito`
        : `Stock máximo alcanzado para "${p.nombre}"`
    )
    setTimeout(() => setToastMessage(null), 2800)
  }

  return (
    <div className="w-full pb-20 bg-[#05000A] selection:bg-purple-500/30 selection:text-white overflow-x-hidden">

      {/* ─── Toast ─────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div
          className="fixed bottom-8 right-8 z-50 px-5 py-4 rounded-2xl bg-[#0A0012] border border-purple-500/60 text-white text-base font-bold shadow-2xl flex items-center gap-3 animate-slide-up"
          style={{ boxShadow: `0 0 30px ${accentColor}40` }}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* ─── Hero Banner ────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image / Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover"
              poster={heroImage}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={heroImage}
              alt={title}
              className="absolute w-full h-full object-cover"
              style={{ filter: 'brightness(0.35) saturate(1.4)' }}
            />
          )}
        </div>

        {/* Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-br ${heroGradient} opacity-85 z-0`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05000A] via-[#05000A]/60 to-transparent z-0" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjB2MjBtMjAtMjBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNjgsIDg1LCAyNDcsIDAuMDYpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-60 z-0" />

        {/* Light Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse z-0" style={{ background: `${accentColor}30` }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] animate-pulse delay-1000 z-0" style={{ background: `${accentColor}25` }} />

        {/* Partículas */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none z-0"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              background: accentColor,
              animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              boxShadow: `0 0 ${p.size * 2}px ${accentColor}`,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 xl:px-12 py-20">
          <div className="max-w-3xl space-y-8">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-sm"
              style={{
                borderColor: `${accentColor}60`,
                color: accentColor,
                background: `${accentColor}18`,
              }}
            >
              <Zap className="w-3.5 h-3.5" /> {heroTag}
            </span>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight"
              style={{ textShadow: `0 0 40px ${accentColor}80, 0 0 80px ${accentColor}40` }}
            >
              {title}
            </h1>
            
            <p className="text-lg sm:text-xl text-purple-100/70 leading-relaxed max-w-xl font-medium">
              {subtitle}
            </p>
            
            <div className="flex items-center gap-4 mt-8">
              <span
                className="px-4 py-2 rounded-full text-sm font-bold text-white"
                style={{ background: `${accentColor}30`, border: `1px solid ${accentColor}50` }}
              >
                {filtered.length} productos disponibles
              </span>
              <span className="text-base text-purple-200/60 font-medium flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"
                  style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }}
                />
                {selectedBodegaNombre}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────────────────── */}
      {features && features.length > 0 && (
        <section id="features" className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6 xl:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em]" style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} /> Innovación sin límites
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Diseñados para el futuro</h2>
              <p className="text-white/60 text-base sm:text-lg">Cada producto combina rendimiento, durabilidad y estilo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl transition-all hover:-translate-y-2 hover:bg-white/[0.04] cursor-default" style={{ '--tw-border-opacity': 1, borderColor: 'inherit' } as any}>
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-5" style={{ background: `linear-gradient(135deg, ${accentColor}, #000)`, boxShadow: `0 0 20px ${accentColor}60` }}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 transition-colors">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Stats ──────────────────────────────────────────────────────── */}
      {stats && stats.length > 0 && (
        <section className="py-16 border-y border-white/5 relative z-10" style={{ background: `linear-gradient(90deg, ${accentColor}10, transparent)` }}>
          <div className="max-w-7xl mx-auto px-6 xl:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:-translate-y-1 transition-transform">
                  <stat.icon className="h-8 w-8 mx-auto mb-3" style={{ color: accentColor }} />
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Filters Bar ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 xl:px-12 py-8 flex flex-wrap items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 text-base font-bold text-white mr-2">
          <SlidersHorizontal className="w-5 h-5" style={{ color: accentColor }} />
          Catálogo:
        </div>
        <button
          onClick={() => { setOnlyInStock(!onlyInStock); audioService.playClick() }}
          className={`px-5 py-2.5 rounded-xl text-base font-bold border transition-all flex items-center gap-2 ${
            onlyInStock
              ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.3)]'
              : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Solo disponibles
        </button>
        <span className="ml-auto text-base text-white/50 font-medium hidden md:block">
          {filtered.length} artículos · <Filter className="w-4 h-4 inline-block -mt-0.5" style={{ color: accentColor }} />
        </span>
      </section>

      {/* ─── Product Grid ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 xl:px-12 pb-12 relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-3xl bg-white/5 border border-white/10 animate-pulse p-6 space-y-4"
              >
                <div className="w-full h-52 rounded-2xl bg-white/10" />
                <div className="h-6 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <ShoppingBag className="w-16 h-16 mx-auto text-white/20" />
            <p className="text-2xl font-black text-white">Sin productos disponibles</p>
            <p className="text-base text-white/50">
              Prueba cambiar la sucursal o desactivar el filtro de disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((p) => {
              const stockVal = getStock(p)
              const isAvailable = stockVal > 0
              const imgUrl =
                p.image_url ||
                'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600&auto=format&fit=crop'

              return (
                <div
                  key={p.id}
                  onClick={() => { setSelectedProduct(p); audioService.playWhoosh() }}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 backdrop-blur-xl hover:-translate-y-3 hover:bg-white/[0.06] hover:border-white/20"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-4">
                    <img
                      src={imgUrl}
                      alt={p.nombre}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Tags */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {'4.5'}
                      </div>
                      {!isAvailable && (
                        <div className="bg-rose-500/80 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-lg text-center">
                          Agotado
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-auto">
                      <h3 className="text-xl font-black text-white group-hover:text-white/80 transition-colors line-clamp-2 leading-tight">
                        {p.nombre}
                      </h3>
                      <p className="text-sm text-white/50 mt-2 line-clamp-2">
                        {p.descripcion || 'Sin descripción'}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black" style={{ color: accentColor }}>
                          ${p.precio_con_impuesto?.toLocaleString() || p.precio}
                        </span>
                      </div>
                      
                      {/* Buy Button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isAvailable) handleAddToCart(p, e)
                        }}
                        disabled={!isAvailable}
                        className={`h-11 px-4 rounded-xl font-bold transition-all ${
                          isAvailable
                            ? 'shadow-lg hover:scale-105'
                            : 'bg-white/5 text-white/30 border-white/5 opacity-50 cursor-not-allowed'
                        }`}
                        style={isAvailable ? {
                          background: `linear-gradient(135deg, ${accentColor}, #000)`,
                          border: `1px solid ${accentColor}60`,
                          color: '#fff'
                        } : {}}
                      >
                        {isAvailable ? (
                          <>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Agregar
                          </>
                        ) : (
                          'Agotado'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ─── Product Detail Modal ───────────────────────────────────────── */}
      {selectedProduct && (
        <ProductDetailModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* ─── KEYFRAMES ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2); }
        }
      `}</style>
    </div>
  )
}
