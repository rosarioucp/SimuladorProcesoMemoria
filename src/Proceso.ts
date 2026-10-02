import { EstadoProceso } from "./EstadoProceso.js";
import { IConsultarProceso } from "./IConsultarProceso.js";
import { IEstadoProceso } from "./IEstadoProceso.js";
import { IValidar } from "./IValidar.js";

export class Proceso implements IConsultarProceso{
  private readonly _pid: string;
  private readonly _memoria: number;
  private readonly _cpuTotal: number;
  private readonly _validador: IValidar;
  private _cpuRestante: number;
  private _estado: IEstadoProceso = EstadoProceso.Nuevo;
  private _quantumConsumido: number = 0;
  private _bloqueoRestante: number = 0;

  constructor(pid: string, memoria: number, cpuTotal: number, validador: IValidar) {
    validador.validarTextoNoVacio(pid, "El PID");
    validador.validarEnteroPositivo(memoria, "La memoria requerida");
    validador.validarEnteroPositivo(cpuTotal, "El tiempo de CPU");
    this._pid = pid;
    this._memoria = memoria;
    this._cpuTotal = cpuTotal;
    this._cpuRestante = cpuTotal;
    this._validador = validador;
  }

  public getPid(): string {
    return this._pid;
  }

  public getMemoria(): number {
    return this._memoria;
  }

  public getCpuTotal(): number {
    return this._cpuTotal;
  }

  public getCpuRestante(): number {
    return this._cpuRestante;
  }

  public getEstado(): IEstadoProceso {
    return this._estado;
  }

  public getQuantumConsumido(): number {
    return this._quantumConsumido;
  }

  public getBloqueoRestante(): number {
    return this._bloqueoRestante;
  }
}

