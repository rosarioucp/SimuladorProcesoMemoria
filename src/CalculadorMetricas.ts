import { ICalcularMetricas } from "./ICalcularMetricas.js";
import { IConsultarMemoria } from "./IConsultarMemoria.js";

export class CalculadorMetricas implements ICalcularMetricas {
  public memoriaLibreTotal(memoria: IConsultarMemoria): number {
    return this._tamaniosLibres(memoria).reduce((suma, tamanio) => suma + tamanio, 0);
  }
