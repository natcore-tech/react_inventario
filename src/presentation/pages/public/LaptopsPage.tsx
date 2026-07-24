import CategoryProductsPage from './CategoryProductsPage'
import {
  Cpu,
  Battery,
  Monitor,
  ShieldCheck,
  Gauge,
  Users,
  TrendingUp,
} from 'lucide-react'

const HERO_VIDEO = 'https://cdn.pixabay.com/video/2022/10/27/136049-766928561_large.mp4'
const HERO_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=1920&auto=format&fit=crop'

const FEATURES = [
  { icon: Cpu, title: 'Procesadores de Última Gen', desc: 'Intel Core Ultra y AMD Ryzen serie 8000 para máximo rendimiento.' },
  { icon: Battery, title: 'Batería de Larga Duración', desc: 'Hasta 18 horas de autonomía para trabajar sin interrupciones.' },
  { icon: Monitor, title: 'Pantallas de Alta Definición', desc: 'Resolución 4K, OLED y tasa de refresco de 120Hz.' },
  { icon: ShieldCheck, title: 'Seguridad Integrada', desc: 'Cifrado de datos, lector de huellas y cámara con obturador.' },
]

const STATS = [
  { icon: Gauge, value: '150+', label: 'Modelos disponibles' },
  { icon: Battery, value: '18h', label: 'Autonomía promedio' },
  { icon: Users, value: '+12K', label: 'Clientes felices' },
  { icon: TrendingUp, value: '4.8★', label: 'Calificación media' },
]

export default function LaptopsPage() {
  return (
    <CategoryProductsPage
      categorySlug="laptop"
      title="Potencia y movilidad extrema"
      subtitle="Descubre las mejores laptops del mercado. Diseñadas para profesionales, gamers y creadores que exigen lo último en tecnología."
      accentColor="#a855f7" 
      heroGradient="from-purple-950/80 via-[#05000A]/90 to-indigo-950/80"
      heroImage={HERO_IMAGE_FALLBACK}
      heroVideo={HERO_VIDEO}
      heroTag="Modelos Disponibles"
      features={FEATURES}
      stats={STATS}
    />
  )
}