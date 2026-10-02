export interface IValidar {
  validarCondicion(condicion: boolean, mensaje: string): void;
  validarEnteroPositivo(valor: number, nombre: string): void;
  validarTextoNoVacio(valor: string, nombre: string): void;
}