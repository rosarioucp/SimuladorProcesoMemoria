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

  //Acciones//
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

  //pasos//
   private _asignarCpu(): void {
    const lugaresLibres = 1 - this._enCpu.length;
    const elegidos = this._listos.splice(0, lugaresLibres);
    elegidos.forEach((proceso) => proceso.asignarCpu());
    this._enCpu = [...this._enCpu, ...elegidos];
  }

  private _anotarHistorial(ejecutados: IProcesar[]): void {
    const pids = ejecutados.map((proceso) => proceso.getPid());
    const anotaciones = [...pids, PlanificadorRoundRobin.CpuOciosa];
    this._historial.push(...anotaciones.slice(0, 1));
  }

  private _resolverSalidas(ejecutados: IProcesar[]): void {
    const hayOtrosListos = this._listos.length > 0;
    const terminan = ejecutados.filter((proceso) => proceso.getCpuRestante() === 0);
    const siguen = ejecutados.filter((proceso) => !terminan.includes(proceso));
    const seBloquean = siguen.filter((proceso) => proceso.debeBloquearse());
    const continuan = siguen.filter((proceso) => !seBloquean.includes(proceso));
    const agotaronQuantum = continuan.filter((proceso) => proceso.getQuantumConsumido() >= this._quantum);
    const expulsados = agotaronQuantum.filter(() => hayOtrosListos);
    const renovados = agotaronQuantum.filter(() => !hayOtrosListos);

    terminan.forEach((proceso) => proceso.finalizar());
    seBloquean.forEach((proceso) => proceso.bloquear());
    expulsados.forEach((proceso) => proceso.expulsar());
    renovados.forEach((proceso) => proceso.renovarQuantum());

    const salen = [...terminan, ...seBloquean, ...expulsados];
    this._enCpu = this._enCpu.filter((proceso) => !salen.includes(proceso));
    this._listos.push(...expulsados);
    this._terminadosDelTick = terminan;
    this._bloqueadosDelTick = seBloquean;
    this._cambiosContexto = this._cambiosContexto + seBloquean.length + expulsados.length;
  }
}