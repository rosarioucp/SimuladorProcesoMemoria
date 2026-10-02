import { IConsultarProceso } from "./IConsultarProceso.js";

export interface IConsultarCpu {
  getQuantum(): number;
  getListos(): IConsultarProceso[];
  getEnCpu(): IConsultarProceso[];
  getCambiosContexto(): number;
  getHistorial(): string[];
}