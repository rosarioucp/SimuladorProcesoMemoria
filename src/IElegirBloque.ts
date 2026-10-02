import { IGuardar } from "./IGuardar.js";

export interface IElegirBloque {
  elegir(bloques: IGuardar[], tamanio: number): IGuardar[];
}