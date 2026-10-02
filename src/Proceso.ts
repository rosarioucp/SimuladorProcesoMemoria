import { EstadoProceso } from "./EstadoProceso.js";
import { IConsultarProceso } from "./IConsultarProceso.js";
import {ICambiarEstado} from "./ICambiarEstado.js";
import { IEstadoProceso } from "./IEstadoProceso.js";
import { IValidar } from "./IValidar.js";
import { IBloquear } from "./IBloquear.js";


export class Proceso implements IConsultarProceso, ICambiarEstado {
  private readonly _pid: string;
  private readonly _memoria: number;
  private readonly _cpuTotal: number;
  private readonly _validador: IValidar;
  private _cpuRestante: number;
  private _estado: IEstadoProceso = EstadoProceso.Nuevo;
  private _quantumConsumido: number = 0;
  private _bloqueoRestante: number = 0;
  private _inicio: number = 0;
  private _duracion: number= 0;


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
 private _validarEstado(permitidos: IEstadoProceso[], accion: string): void {
    const estaPermitido = permitidos.includes(this._estado);
    const mensaje = `No se puede ${accion} ${this._pid} en estado ${this._estado.getNombre()}`;
    this._validador.validarCondicion(estaPermitido, mensaje);
  }

//Consulta sobre los procesos//
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

  //Acciones sobre los procesos//
  public esperarMemoria(): void {
    this._validarEstado([EstadoProceso.Nuevo, EstadoProceso.EsperandoMemoria], "poner en espera");
    this._estado = EstadoProceso.EsperandoMemoria;
  }

  public admitir(): void {
    this._validarEstado([EstadoProceso.Nuevo, EstadoProceso.EsperandoMemoria], "admitir");
    this._estado = EstadoProceso.Listo;
  }

  public asignarCpu(): void {
    this._validarEstado([EstadoProceso.Listo], "asignar CPU");
    this._estado = EstadoProceso.Ejecutando;
    this._quantumConsumido = 0;
  }

  public ejecutarTick(): void {
    this._validarEstado([EstadoProceso.Ejecutando], "ejecutar");
    this._cpuRestante = this._cpuRestante - 1;
    this._quantumConsumido = this._quantumConsumido + 1;
  }

  public expulsar(): void {
    this._validarEstado([EstadoProceso.Ejecutando], "expulsar");
    this._estado = EstadoProceso.Listo;
  }

  public renovarQuantum(): void {
    this._validarEstado([EstadoProceso.Ejecutando], "renovar el quantum de");
    this._quantumConsumido = 0;
  }

  public finalizar(): void {
    this._validarEstado([EstadoProceso.Ejecutando], "finalizar");
    this._validador.validarCondicion(this._cpuRestante === 0, `${this._pid} todavía tiene CPU restante`);
    this._estado = EstadoProceso.Terminado;
  }
//Entrada y Salida de los procesos//
 public definirES(inicio: number, duracion: number): void {
    this._validarEstado([EstadoProceso.Nuevo], "definir la E/S de");
    this._validador.validarEnteroPositivo(inicio, "El inicio de la E/S");
    this._validador.validarEnteroPositivo(duracion, "La duración de la E/S");
    this._validador.validarCondicion(inicio < this._cpuTotal, "La E/S debe iniciarse antes de que el proceso termine");
    this._inicio = inicio;
    this._duracion = duracion;
  }
 public debeBloquearse(): boolean {
    const cpuConsumida = this._cpuTotal - this._cpuRestante;
    return cpuConsumida === this._inicio;
  }
 public bloquear(): void {
    this._validarEstado([EstadoProceso.Ejecutando], "bloquear");
    this._estado = EstadoProceso.Bloqueado;
    this._bloqueoRestante = this._duracion;
  }

  public avanzarBloqueo(): void {
    this._validarEstado([EstadoProceso.Bloqueado], "avanzar el bloqueo de");
    this._bloqueoRestante = this._bloqueoRestante - 1;
  }

  public desbloquear(): void {
    this._validarEstado([EstadoProceso.Bloqueado], "desbloquear");
    this._validador.validarCondicion(this._bloqueoRestante === 0, `${this._pid} todavía está bloqueado`);
    this._estado = EstadoProceso.Listo;
  }
}

