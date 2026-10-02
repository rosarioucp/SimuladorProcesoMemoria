import { BloqueMemoria } from "./BloqueMemoria.js";
import { IAsignarMemoria } from "./IAsignarMemoria.js";
import { IConsultarMemoria } from "./IConsultarMemoria.js";
import { IElegirBloque } from "./IElegirBloque.js";
import { IGuardar } from "./IGuardar.js";
import { IValidar } from "./IValidar.js";

export class AdministradorMemoria implements IConsultarMemoria, IAsignarMemoria {
  private readonly _memoriaTotal: number;
  private readonly _politica: IElegirBloque;
  private readonly _validador: IValidar;
  private _bloques: IGuardar[];
  
constructor(memoriaTotal: number, politica: IElegirBloque, validador: IValidar) {
    validador.validarEnteroPositivo(memoriaTotal, "La memoria total");
    this._memoriaTotal = memoriaTotal;
    this._politica = politica;
    this._validador = validador;
    this._bloques = [this._crearBloque(0, memoriaTotal, BloqueMemoria.Libre)];
  }


  //consultas sobre la memoria//

  public getMemoriaTotal(): number {
    return this._memoriaTotal;
  }

  public getBloques(): IGuardar[] {
    return [...this._bloques];
  }

  // Asignacion de memoria//

  public asignar(pid: string, tamanio: number): boolean {
    this._validador.validarTextoNoVacio(pid, "El PID");
    this._validador.validarEnteroPositivo(tamanio, "El tamaño a asignar");
    this._validador.validarCondicion(this._bloquesDe(pid).length === 0, `${pid} ya tiene memoria asignada`);
    const elegidos = this._politica.elegir(this.getBloques(), tamanio);
    elegidos.forEach((bloque) => this._ocupar(bloque, pid, tamanio));
    return elegidos.length === 1;
  }

  private _ocupar(bloque: IGuardar, pid: string, tamanio: number): void {
    const ocupado = this._crearBloque(bloque.getInicio(), tamanio, pid);
    const sobrantes = [bloque.getTamanio() - tamanio].filter((sobrante) => sobrante > 0);
    const libres = sobrantes.map((sobrante) => this._crearBloque(bloque.getInicio() + tamanio, sobrante, BloqueMemoria.Libre));
    this._reemplazar(bloque, [ocupado, ...libres]);
  }
  
  //liberacion y coalescencia de los bloques//
  public liberar(pid: string): void {
    this._validador.validarCondicion(this._bloquesDe(pid).length === 1, `${pid} no tiene memoria asignada`);
    this._bloquesDe(pid).forEach((bloque) => this._liberarBloque(bloque));
    this._bloques = this._bloques.reduce((resultado: IGuardar[], actual) => this._agregarFusionando(resultado, actual), []);
  }

  private _liberarBloque(bloque: IGuardar): void {
    const libre = this._crearBloque(bloque.getInicio(), bloque.getTamanio(), BloqueMemoria.Libre);
    this._reemplazar(bloque, [libre]);
  }

  private _agregarFusionando(resultado: IGuardar[], actual: IGuardar): IGuardar[] {
    const ultimo = resultado.slice(-1);
    const fusionables = ultimo.filter((bloque) => bloque.estaLibre()).filter(() => actual.estaLibre());
    const fusionados = fusionables.map((bloque) => this._crearBloque(bloque.getInicio(), bloque.getTamanio() + actual.getTamanio(), BloqueMemoria.Libre));
    const anteriores = resultado.slice(0, resultado.length - fusionados.length);
    const sinFusionar = [actual].slice(fusionados.length);
    return [...anteriores, ...fusionados, ...sinFusionar];
  }

  //metodos para no repetir codigo//
 private _bloquesDe(pid: string): IGuardar[] {
    return this._bloques.filter((bloque) => bloque.getPid() === pid);
  }

  private _crearBloque(inicio: number, tamanio: number, pid: string): IGuardar {
    return new BloqueMemoria(inicio, tamanio, pid, this._validador);
  }

  private _reemplazar(original: IGuardar, nuevos: IGuardar[]): void {
    const posicion = this._bloques.indexOf(original);
    const anteriores = this._bloques.slice(0, posicion);
    const posteriores = this._bloques.slice(posicion + 1);
    this._bloques = [...anteriores, ...nuevos, ...posteriores];
  }
}
  