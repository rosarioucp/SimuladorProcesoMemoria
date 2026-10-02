import {IEstadoProceso} from "./IEstadoProceso.js";

export interface IConsultarProceso {
    getPid(): string;
    getMemoria(): number;
    getCpuTotal(): number;
    getCpuRestante(): number;
    getEstado(): IEstadoProceso;
    getQuantumConsumido(): number;
    getBloqueoRestante(): number;
}
