import { IConsultarMemoria } from "./IConsultarMemoria.js";

export interface ICalcularMetricas {
  memoriaLibreTotal(memoria: IConsultarMemoria): number;
  mayorBloqueLibre(memoria: IConsultarMemoria): number;
  ocupacionMemoria(memoria: IConsultarMemoria): number;
  fragmentacionExterna(memoria: IConsultarMemoria): number;
  utilizacionCpu(ticksCpuOcupada: number, ticksTranscurridos: number): number;
}