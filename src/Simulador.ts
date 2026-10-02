import { IAsignarMemoria } from "./IAsignarMemoria.js";
import { ICalcularMetricas } from "./ICalcularMetricas.js";
import { IConsultarCpu } from "./IConsultarCpu.js";
import { IConsultarMemoria } from "./IConsultarMemoria.js";
import { IConsultarProceso } from "./IConsultarProceso.js";
import { IConsultarSimulacion } from "./IConsultarSimulacion.js";
import { IGuardar } from "./IGuardar.js";
import { IPlanificar } from "./IPlanificar.js";
import { IProcesar } from "./IProcesar.js";
import { ISimular } from "./ISimular.js";
import { IValidar } from "./IValidar.js";
import { PlanificadorRoundRobin } from "./PlanificadorRoundRobin.js";
import { Proceso } from "./Proceso.js";

export class Simulador implements IConsultarSimulacion, ISimular {
  private readonly _memoria: IConsultarMemoria & IAsignarMemoria;
  private readonly _planificador: IConsultarCpu & IPlanificar;
  private readonly _calculador: ICalcularMetricas;
  private readonly _validador: IValidar;
  private _procesos: IProcesar[] = [];
  private _enEspera: IProcesar[] = [];
  private _bloqueados: IProcesar[] = [];
  private _terminados: IProcesar[] = [];
  private _tick: number = 0;

constructor(
    memoria: IConsultarMemoria & IAsignarMemoria,
    planificador: IConsultarCpu & IPlanificar,
    calculador: ICalcularMetricas,
    validador: IValidar,
  ) {
    this._memoria = memoria;
    this._planificador = planificador;
    this._calculador = calculador;
    this._validador = validador;
  }

  //registro del proceso//

  public registrarProceso(pid: string, memoria: number, cpuTotal: number): void {
    this._registrar(new Proceso(pid, memoria, cpuTotal, this._validador));
  }

  public registrarProcesoConES(pid: string, memoria: number, cpuTotal: number, inicio: number, duracion: number): void {
    const proceso = new Proceso(pid, memoria, cpuTotal, this._validador);
    proceso.definirES(inicio, duracion);
    this._registrar(proceso);
  }

  private _registrar(proceso: IProcesar): void {
    const repetidos = this._procesos.filter((otro) => otro.getPid() === proceso.getPid());
    this._validador.validarCondicion(repetidos.length === 0, `El PID ${proceso.getPid()} ya está registrado`);
    const cabe = proceso.getMemoria() <= this._memoria.getMemoriaTotal();
    this._validador.validarCondicion(cabe, `${proceso.getPid()} pide más memoria que la memoria total`);
    this._procesos.push(proceso);
    this._enEspera.push(proceso);
  }

  
  