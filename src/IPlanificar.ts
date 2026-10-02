import { IProcesar } from "./IProcesar.js";

export interface IPlanificar {
  encolar(proceso: IProcesar): void;
  ejecutarTick(): void;
  getTerminadosDelTick(): IProcesar[];
  getBloqueadosDelTick(): IProcesar[];
}