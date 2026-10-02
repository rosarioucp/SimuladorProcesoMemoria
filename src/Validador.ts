import { IValidar } from "./IValidar.js";

export class Validador implements IValidar {
  private readonly _acciones: Record<"true" | "false", (mensaje: string) => void> = {
    true: () => {},
    false: (mensaje: string) => {
      throw new Error(mensaje);
    },
  };

  public validarCondicion(condicion: boolean, mensaje: string): void {
    const casillero = String(condicion) as "true" | "false";
    this._acciones[casillero](mensaje);
  }

  public validarEnteroPositivo(valor: number, nombre: string): void {
    this.validarCondicion(Number.isInteger(valor), `${nombre} debe ser un número entero`);
    this.validarCondicion(valor > 0, `${nombre} debe ser mayor que cero`);
  }

  public validarTextoNoVacio(valor: string, nombre: string): void {
    this.validarCondicion(valor.trim().length > 0, `${nombre} no puede estar vacío`);
  }
}
