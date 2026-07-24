import CategoryProductsPage from './CategoryProductsPage'
import {
  Headphones,
  Mic2,
  Volume2,
  Radio,
  Gauge,
  Users,
  TrendingUp,
} from 'lucide-react'

const HERO_VIDEO = 'https://cdn.pixabay.com/video/2020/05/25/40141-424888125_large.mp4' 
const HERO_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?q=80&w=1600&auto=format&fit=crop'

const FEATURES = [
  { icon: Headphones, title: 'Audio Hi-Res', desc: 'Calidad de estudio con soporte para codecs Lossless y LDAC.' },
  { icon: Radio, title: 'Cancelación de Ruido', desc: 'Aislamiento activo inteligente que se adapta a tu entorno.' },
  { icon: Mic2, title: 'Llamadas Cristalinas', desc: 'Arreglos de micrófonos con IA para filtrar el viento y ruido de fondo.' },
  { icon: Volume2, title: 'Bajos Profundos', desc: 'Controladores dinámicos de 40mm para frecuencias graves contundentes.' },
]

const STATS = [
  { icon: Gauge, value: '85+', label: 'Modelos disponibles' },
  { icon: Radio, value: '30h', label: 'Batería promedio' },
  { icon: Users, value: '+5K', label: 'Audiófilos felices' },
  { icon: TrendingUp, value: '4.9★', label: 'Calificación media' },
]

export default function AudioPage() {
  return (
    <CategoryProductsPage
      categorySlug="audio"
      title="Audio y Sonido Premium"
      subtitle="Siente cada nota, cada beat y cada detalle. Descubre nuestra colección de auriculares y altavoces de alta fidelidad."
      accentColor="#6366f1" 
      heroGradient="from-indigo-950/80 via-[#05000A]/90 to-blue-950/80"
      heroImage={HERO_IMAGE_FALLBACK}
      heroVideo={HERO_VIDEO}
      heroTag="Audio de Alta Fidelidad"
      features={FEATURES}
      stats={STATS}
    />
  )
}
