// src/domain/entities/ajuste-inventario.entity.ts

export type TipoAjuste = 'ROBO' | 'DANO' | 'CADUCIDAD' | 'ERROR'

export const TIPO_AJUSTE_LABELS: Record<TipoAjuste, string> = {
  ROBO: 'Robo o Hurto',
  DANO: 'Mercadería Dañada/Rota',
  CADUCIDAD: 'Caducidad/Vencimiento',
  ERROR: 'Error de Conteo',
}

/**
 * Ajuste de inventario tal como lo devuelve AjusteInventarioSerializer.
 *
 * Nota: `producto` viene como ID plano (number), NO anidado — mismo caso
 * que NumeroSerie (fields = '__all__' sin PrimaryKeyRelatedField personalizado).
 * El nombre del producto se resuelve en el cliente contra useProductoStore.
 */
export interface AjusteInventario {
  id: number
  producto: number
  tipo_ajuste: TipoAjuste
  cantidad: number
  justificativo: string
  creado_en: string
}