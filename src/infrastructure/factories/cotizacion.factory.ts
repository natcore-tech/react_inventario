import { CotizacionUseCase } from '../../application/use-cases/cotizacion.use-case';
import { AxiosCotizacionRepository } from '../adapters/axios-cotizacion.repository';

export class CotizacionFactory {
  static create(): CotizacionUseCase {
    const repository = new AxiosCotizacionRepository();
    return new CotizacionUseCase(repository);
  }
}

export const cotizacionUseCase = CotizacionFactory.create();