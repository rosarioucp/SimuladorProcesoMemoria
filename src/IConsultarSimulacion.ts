import { IConsultarProceso } from "./IConsultarProceso.js";
import { IGuardar } from "./IGuardar.js";

export interface IConsultarSimulacion {
  getTick(): number;
  getProcesos(): IConsultarProceso[];
  getEnCpu(): IConsultarProceso[];
  getListos(): IConsultarProceso[];
  getEnEspera(): IConsultarProceso[];
  getBloqueados(): IConsultarProceso[];
  getTerminados(): IConsultarProceso[];
  getMapaMemoria(): IGuardar[];
  getHistorialCpu(): string[];
  getOcupacionMemoria(): number;
  getUtilizacionCpu(): number;
  getCambiosContexto(): number;
  getMemoriaLibreTotal(): number;
  getMayorBloqueLibre(): number;
  getFragmentacionExterna(): number;
}