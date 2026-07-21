import { Link } from 'react-router-dom'
import { Button } from '@/presentation/components/ui/button'
import { ShoppingBag, ArrowRight, BarChart3, Package, Users, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      
      {/* Navbar Minimalista */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold tracking-tight">Stock Master</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="font-medium">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Controla tu inventario <br className="hidden sm:inline" /> sin complicaciones
              </h1>
              
              <p className="text-muted-foreground md:text-xl leading-relaxed">
                Una herramienta simple para gestionar tus bodegas, ventas y cajas sin dolores de cabeza. Diseñada para locales que buscan velocidad y orden.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/login">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-muted/30 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">Hecho para el día a día</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Sin funciones de relleno. Solo lo que realmente usas para manejar tu local y ahorrar tiempo.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              
              <div className="flex flex-col space-y-3 p-6 bg-background rounded-xl border shadow-sm">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="font-bold">Varias bodegas</h3>
                <p className="text-sm text-muted-foreground">
                  Mueve mercadería entre sucursales y recibe avisos si algo se está agotando.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 bg-background rounded-xl border shadow-sm">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="font-bold">Reportes claros</h3>
                <p className="text-sm text-muted-foreground">
                  Mira cuánto estás ganando y descarga todo en Excel o PDF con un clic.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 bg-background rounded-xl border shadow-sm">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-bold">Ventas rápidas</h3>
                <p className="text-sm text-muted-foreground">
                  Cobra en segundos. Conecta tu lector de barras y atiende más rápido a tus clientes.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 bg-background rounded-xl border shadow-sm">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold">Permisos de acceso</h3>
                <p className="text-sm text-muted-foreground">
                  Tú decides qué partes del sistema pueden ver o modificar tus cajeros.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-primary text-primary-foreground rounded-2xl px-6 py-16 text-center max-w-4xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">¿Listo para empezar?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg">
                Deja el Excel atrás y empieza a controlar tu negocio de verdad. Configuración rápida y sin complicaciones.
              </p>
              <Link to="/register">
                <Button variant="secondary" size="lg" className="h-12 px-8 font-medium">
                  Crear mi cuenta gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium">
            <ShoppingBag className="h-4 w-4" />
            Stock Master
          </div>
          <p>© {new Date().getFullYear()} Stock Master. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
