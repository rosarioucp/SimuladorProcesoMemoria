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
