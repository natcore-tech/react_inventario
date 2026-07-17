// src/presentation/pages/facturacion/CerrarTurnoDialog.tsx
import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

import { useTurnoCajaStore } from '@/presentation/store/turno-caja.store'
import type { CloseTurnoCajaDto } from '@/application/dtos/turno-caja.dto'
import type { TurnoCaja } from '@/domain/entities/turno-caja.entity'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'

interface CerrarTurnoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  turno: TurnoCaja | null
}

export default function CerrarTurnoDialog({ open, onOpenChange, turno }: CerrarTurnoDialogProps) {
  const { cerrarTurno, isSaving, error, clearError } = useTurnoCajaStore()
  
  const [montoCierre, setMontoCierre] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setMontoCierre('')
      setObservaciones('')
      setFormError(null)
      clearError()
    }
  }, [open, clearError])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!turno) return

    const monto = parseFloat(montoCierre)
    if (isNaN(monto) || monto < 0) {
      return setFormError('Debes ingresar el dinero contado al cerrar.')
    }

    const dto: CloseTurnoCajaDto = {
      estado: 'CERRADO',
      monto_cierre: monto,
      observaciones: observaciones.trim() || undefined,
    }

    try {
      await cerrarTurno(turno.id, dto)
      onOpenChange(false)
    } catch {
      // Error manejado en el store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cerrar Turno de Caja</DialogTitle>
        </DialogHeader>

        <form id="cerrar-turno-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-4">
            {(error || formError) && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError ?? error}</span>
              </div>
            )}

            {turno && (
              <div className="rounded-md bg-muted/40 p-3 text-sm">
                <p><strong>Apertura:</strong> ${parseFloat(turno.monto_apertura).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Revisa tu sistema para ver las ventas generadas y comparar el saldo esperado contra el saldo físico contado.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tc-monto-cierre">Dinero físico contado ($)</Label>
              <Input
                id="tc-monto-cierre"
                type="number"
                step="0.01"
                min="0"
                value={montoCierre}
                onChange={(e) => {
                  setMontoCierre(e.target.value)
                  setFormError(null)
                }}
                placeholder="Total en caja..."
                disabled={isSaving}
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tc-observaciones">Observaciones (Opcional)</Label>
              <Textarea
                id="tc-observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Justificación de sobrantes o faltantes..."
                rows={3}
                disabled={isSaving}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="cerrar-turno-form" variant="destructive" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cerrando...
              </>
            ) : (
              'Declarar Cierre'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
