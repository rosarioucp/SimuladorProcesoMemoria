import { IGuardar } from "./IGuardar.js";
import { IValidar } from "./IValidar.js";

export class BloqueMemoria implements IGuardar {
  public static readonly Libre: string = "";
  private readonly _inicio: number;
  private readonly _tamanio: number;
  private readonly _pid: string;

  constructor(inicio: number, tamanio: number, pid: string, validador: IValidar) {
    validador.validarCondicion(Number.isInteger(inicio), "El inicio del bloque debe ser un número entero");
    validador.validarCondicion(inicio >= 0, "El inicio del bloque no puede ser negativo");
    validador.validarEnteroPositivo(tamanio, "El tamaño del bloque");
    this._inicio = inicio;
    this._tamanio = tamanio;
    this._pid = pid;
  }
}