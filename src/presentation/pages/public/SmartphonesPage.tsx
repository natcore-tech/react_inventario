import CategoryProductsPage from './CategoryProductsPage'
import {
  Smartphone,
  Camera,
  BatteryCharging,
  Cpu,
  Gauge,
  Users,
  TrendingUp,
} from 'lucide-react'

const HERO_VIDEO = 'https://cdn.pixabay.com/video/2021/08/17/85263-588825852_large.mp4' 
const HERO_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop'

const FEATURES = [
  { icon: Camera, title: 'Fotografía Computacional', desc: 'Sensores de 1 pulgada, zoom óptico 10x y procesamiento de IA.' },
  { icon: Smartphone, title: 'Pantallas P-OLED', desc: 'Brillo pico de 2500 nits y colores calibrados profesionalmente.' },
  { icon: Cpu, title: 'Chips de 3nm', desc: 'Potencia de nivel de escritorio en la palma de tu mano.' },
  { icon: BatteryCharging, title: 'Carga Ultra Rápida', desc: 'Del 0% al 100% en menos de 20 minutos con carga de 120W.' },
]

const STATS = [
  { icon: Gauge, value: '120+', label: 'Modelos en stock' },
  { icon: Camera, value: '200MP', label: 'Cámara máxima' },
  { icon: Users, value: '+50K', label: 'Dispositivos activos' },
  { icon: TrendingUp, value: '4.9★', label: 'Calificación media' },
]

export default function SmartphonesPage() {
  return (
    <CategoryProductsPage
      categorySlug="moda"
      title="Conectividad sin límites"
      subtitle="La última tecnología móvil. Desde flagships plegables hasta campeones de gama media, encuentra tu compañero perfecto."
      accentColor="#0ea5e9" 
      heroGradient="from-sky-950/80 via-[#05000A]/90 to-blue-950/80"
      heroImage={HERO_IMAGE_FALLBACK}
      heroVideo={HERO_VIDEO}
      heroTag="Dispositivos Móviles"
      features={FEATURES}
      stats={STATS}
    />
  )
}
