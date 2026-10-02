import { EstadoProceso } from "./EstadoProceso.js";
import { IConsultarCpu } from "./IConsultarCpu.js";
import { IConsultarProceso } from "./IConsultarProceso.js";
import { IPlanificar } from "./IPlanificar.js";
import { IProcesar } from "./IProcesar.js";
import { IValidar } from "./IValidar.js";

export class PlanificadorRoundRobin implements IConsultarCpu, IPlanificar {
  public static readonly CpuOciosa: string = "-";
  private readonly _quantum: number;
  private readonly _validador: IValidar;
  private _listos: IProcesar[] = [];
  private _enCpu: IProcesar[] = [];
  private _terminadosDelTick: IProcesar[] = [];
  private _bloqueadosDelTick: IProcesar[] = [];
  private _historial: string[] = [];
  private _cambiosContexto: number = 0;

  constructor(quantum: number, validador: IValidar) {
    validador.validarEnteroPositivo(quantum, "El quantum");
    this._quantum = quantum;
    this._validador = validador;
  }

  
}