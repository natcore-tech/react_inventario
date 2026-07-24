import CategoryProductsPage from './CategoryProductsPage'
import {
  Gamepad2,
  Cpu,
  MonitorPlay,
  Zap,
  Gauge,
  Users,
  TrendingUp,
} from 'lucide-react'

const HERO_VIDEO = 'https://cdn.pixabay.com/video/2023/10/22/185876-876527877_large.mp4' 
const HERO_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop'

const FEATURES = [
  { icon: Cpu, title: 'Hardware de Élite', desc: 'Equipado con tarjetas gráficas RTX Serie 4000 y RX 7000.' },
  { icon: MonitorPlay, title: 'Refresco Extremo', desc: 'Monitores e integrados con tasas de 240Hz hasta 500Hz.' },
  { icon: Zap, title: 'Baja Latencia', desc: 'Tecnología NVIDIA Reflex y periféricos de 1ms de respuesta.' },
  { icon: Gamepad2, title: 'RGB Sync', desc: 'Iluminación inmersiva sincronizada con tu juego y música.' },
]

const STATS = [
  { icon: Gauge, value: '200+', label: 'Productos disponibles' },
  { icon: Gamepad2, value: '1ms', label: 'Latencia promedio' },
  { icon: Users, value: '+25K', label: 'Gamers equipados' },
  { icon: TrendingUp, value: '4.9★', label: 'Calificación media' },
]

export default function GamingPage() {
  return (
    <CategoryProductsPage
      categorySlug="gaming"
      title="Domina tu partida"
      subtitle="El equipo definitivo para llevar tus habilidades al siguiente nivel. Encuentra PCs, periféricos y accesorios para gamers exigentes."
      accentColor="#ef4444" 
      heroGradient="from-red-950/80 via-[#05000A]/90 to-orange-950/80"
      heroImage={HERO_IMAGE_FALLBACK}
      heroVideo={HERO_VIDEO}
      heroTag="Setup Gamer"
      features={FEATURES}
      stats={STATS}
    />
  )
}
