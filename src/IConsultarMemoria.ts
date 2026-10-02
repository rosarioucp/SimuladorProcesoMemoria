import { IGuardar } from "./IGuardar.js";

export interface IConsultarMemoria {
  getMemoriaTotal(): number;
  getBloques(): IGuardar[];
}