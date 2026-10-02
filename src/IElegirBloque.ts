import { IGuardar } from "./IGuardar.js";

export interface ISeleccionarBloque {
  elegir(bloques: IGuardar[], tamanio: number): IGuardar[];
}