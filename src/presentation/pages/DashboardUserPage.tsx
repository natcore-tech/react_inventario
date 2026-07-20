import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

export default function DashboardUserPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <AlertCircle className="h-10 w-10 text-primary" />
      </div>
      
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
        Usuario no autorizado
      </h1>
      
      <p className="mb-8 max-w-md text-muted-foreground">
        No tienes los permisos necesarios para acceder a esta sección de la plataforma.
      </p>
      
      <Button 
        onClick={() => navigate(-1)}
        className="w-full max-w-xs"
        size="lg"
      >
        Volver atrás
      </Button>
    </div>
  )
}

