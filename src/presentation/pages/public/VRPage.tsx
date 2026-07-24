import CategoryProductsPage from './CategoryProductsPage'
import {
  Glasses,
  Eye,
  Crosshair,
  Wifi,
  Gauge,
  Users,
  TrendingUp,
} from 'lucide-react'

const HERO_VIDEO = 'https://cdn.pixabay.com/video/2023/11/09/188450-882898492_large.mp4' 
const HERO_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1920&auto=format&fit=crop'

const FEATURES = [
  { icon: Glasses, title: 'Inmersión Total', desc: 'Visores con campo de visión de 120 grados y seguimiento ocular.' },
  { icon: Eye, title: 'Resolución Retina', desc: 'Pantallas Micro-OLED con resolución 4K por ojo sin efecto rejilla.' },
  { icon: Crosshair, title: 'Tracking Preciso', desc: 'Seguimiento 6DoF sub-milimétrico para manos y controladores.' },
  { icon: Wifi, title: 'Juego Inalámbrico', desc: 'Transmisión Wi-Fi 6E para PC VR sin cables ni latencia.' },
]

const STATS = [
  { icon: Gauge, value: '40+', label: 'Visores y accesorios' },
  { icon: Glasses, value: '4K', label: 'Resolución base' },
  { icon: Users, value: '+3K', label: 'Usuarios explorando' },
  { icon: TrendingUp, value: '4.7★', label: 'Calificación media' },
]

export default function VRPage() {
  return (
    <CategoryProductsPage
      categorySlug="virtual"
      title="Realidad Virtual y AR"
      subtitle="Cruza la frontera hacia nuevos mundos. Experimenta la próxima generación de entretenimiento, trabajo y colaboración social."
      accentColor="#10b981" 
      heroGradient="from-emerald-950/80 via-[#05000A]/90 to-teal-950/80"
      heroImage={HERO_IMAGE_FALLBACK}
      heroVideo={HERO_VIDEO}
      heroTag="Explora el Metaverso"
      features={FEATURES}
      stats={STATS}
    />
  )
}
