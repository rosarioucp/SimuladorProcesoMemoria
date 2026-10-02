export interface ISimular {
  registrarProceso(pid: string, memoria: number, cpuTotal: number): void;
  registrarProcesoConES(pid: string, memoria: number, cpuTotal: number, inicio: number, duracion: number): void;
  avanzarTick(): void;
}