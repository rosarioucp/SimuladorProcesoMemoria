export interface IAsignarMemoria {
  asignar(pid: string, tamanio: number): boolean;
  liberar(pid: string): void;
}