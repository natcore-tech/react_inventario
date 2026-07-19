// src/presentation/pages/facturacion/AbrirTurnoDialog.tsx
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { useTurnoCajaStore } from '@/presentation/store/turno-caja.store'
import type { CreateTurnoCajaDto } from '@/application/dtos/turno-caja.dto'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'

interface AbrirTurnoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AbrirTurnoDialog({ open, onOpenChange }: AbrirTurnoDialogProps) {
  const { abrirTurno, isSaving, error, clearError } = useTurnoCajaStore()
  
  const [montoApertura, setMontoApertura] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setMontoApertura('')
      setFormError(null)
      clearError()
    }
  }, [open, clearError])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    const monto = parseFloat(montoApertura)
    if (isNaN(monto) || monto < 0) {
      return setFormError('El monto inicial debe ser un número válido, mayor o igual a 0.')
    }

    const dto: CreateTurnoCajaDto = {
      monto_apertura: monto,
    }

    try {
      await abrirTurno(dto)
      onOpenChange(false)
    } catch {
      // Error manejado en el store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Abrir Turno de Caja</DialogTitle>
        </DialogHeader>

        <form id="abrir-turno-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-4">
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError ?? error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tc-monto-apertura">Fondo inicial en caja ($)</Label>
              <Input
                id="tc-monto-apertura"
                type="number"
                step="0.01"
                min="0"
                value={montoApertura}
                onChange={(e) => {
                  setMontoApertura(e.target.value)
                  setFormError(null)
                }}
                placeholder="Ej: 50.00"
                disabled={isSaving}
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground">
                Ingresa el dinero físico con el que arranca tu caja.
              </p>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="abrir-turno-form" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Abriendo...
              </>
            ) : (
              'Confirmar Apertura'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
