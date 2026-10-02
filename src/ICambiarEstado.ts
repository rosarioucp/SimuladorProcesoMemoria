export interface ICambiarEstado {
  esperarMemoria(): void;
  admitir(): void;
  asignarCpu(): void;
  ejecutarTick(): void;
  expulsar(): void;
  renovarQuantum(): void;
  finalizar(): void;
}