import { ICalcularMetricas } from "./ICalcularMetricas.js";
import { IConsultarMemoria } from "./IConsultarMemoria.js";

export class CalculadorMetricas implements ICalcularMetricas {
  public memoriaLibreTotal(memoria: IConsultarMemoria): number {
    return this._tamaniosLibres(memoria).reduce((suma, tamanio) => suma + tamanio, 0);
  }
 public mayorBloqueLibre(memoria: IConsultarMemoria): number {
    return Math.max(0, ...this._tamaniosLibres(memoria));
  }

  public ocupacionMemoria(memoria: IConsultarMemoria): number {
    const ocupada = memoria.getMemoriaTotal() - this.memoriaLibreTotal(memoria);
    return (100 * ocupada) / memoria.getMemoriaTotal();
  }

  public fragmentacionExterna(memoria: IConsultarMemoria): number {
    const libre = this.memoriaLibreTotal(memoria);
    const mayor = this.mayorBloqueLibre(memoria);
    return (100 * (libre - mayor)) / Math.max(libre, 1);
  }

  public utilizacionCpu(ticksCpuOcupada: number, ticksTranscurridos: number): number {
    return (100 * ticksCpuOcupada) / Math.max(ticksTranscurridos, 1);
  }

  private _tamaniosLibres(memoria: IConsultarMemoria): number[] {
    const libres = memoria.getBloques().filter((bloque) => bloque.estaLibre());
    return libres.map((bloque) => bloque.getTamanio());
  }
}