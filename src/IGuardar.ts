export interface IGuardar {
  getInicio(): number;
  getTamanio(): number;
  getPid(): string;
  estaLibre(): boolean;
  puedeAlojar(tamanio: number): boolean;
}