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

  //Consultas//

  public getQuantum(): number {
    return this._quantum;
  }

  public getListos(): IConsultarProceso[] {
    return [...this._listos];
  }

  public getEnCpu(): IConsultarProceso[] {
    return [...this._enCpu];
  }

  public getCambiosContexto(): number {
    return this._cambiosContexto;
  }

  public getHistorial(): string[] {
    return [...this._historial];
  }

  public getTerminadosDelTick(): IProcesar[] {
    return [...this._terminadosDelTick];
  }

  public getBloqueadosDelTick(): IProcesar[] {
    return [...this._bloqueadosDelTick];
  }

  // --- Acciones ---

  public encolar(proceso: IProcesar): void {
    this._validador.validarCondicion(proceso.getEstado() === EstadoProceso.Listo, `${proceso.getPid()} no está Listo`);
    this._validador.validarCondicion(!this._listos.includes(proceso), `${proceso.getPid()} ya está en la cola de Listos`);
    this._listos.push(proceso);
  }

  public ejecutarTick(): void {
    this._asignarCpu();
    const ejecutados = [...this._enCpu];
    ejecutados.forEach((proceso) => proceso.ejecutarTick());
    this._anotarHistorial(ejecutados);
    this._resolverSalidas(ejecutados);
  }

  