// src/presentation/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { RefreshCw, AlertTriangle, Home } from 'lucide-react'
import { Button } from './ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)

    // Handle chunk loading 404 error (Failed to fetch dynamically imported module)
    const isChunkError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.name === 'ChunkLoadError'

    if (isChunkError) {
      const chunkReloadKey = 'chunk_reload_count'
      const reloadCount = parseInt(sessionStorage.getItem(chunkReloadKey) || '0', 10)

      if (reloadCount < 2) {
        sessionStorage.setItem(chunkReloadKey, String(reloadCount + 1))
        window.location.reload()
      }
    }
  }

  private handleReload = () => {
    sessionStorage.removeItem('chunk_reload_count')
    window.location.reload()
  }

  private handleGoHome = () => {
    sessionStorage.removeItem('chunk_reload_count')
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
          <div className="glass-card max-w-md w-full p-8 text-center space-y-6 border-primary/30 rounded-3xl shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">Actualización de Sistema</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Se detectó una nueva versión de la plataforma o un módulo cambió. Haz clic abajo para refrescar sin perder datos.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-[10px] font-mono text-muted-foreground break-all max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={this.handleReload} className="btn-glow h-12 font-extrabold text-sm rounded-2xl gap-2">
                <RefreshCw className="h-4 w-4" /> Recargar Página
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="h-11 font-bold text-xs rounded-2xl gap-2 border-border/60">
                <Home className="h-4 w-4" /> Ir a la Página Principal
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
