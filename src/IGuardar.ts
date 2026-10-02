export interface IGuardar {
  getInicio(): number;
  getTamanio(): number;
  getPid(): string;
  estaLibre(): boolean;
  puedeGuardar(tamanio: number): boolean;
}