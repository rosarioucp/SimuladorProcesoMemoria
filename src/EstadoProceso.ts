import {IEstadoProceso} from "./IEstadoProceso.js";
export class EstadoProceso implements IEstadoProceso {
    public static readonly Nuevo: IEstadoProceso = new EstadoProceso("Nuevo");
    public static readonly EsperandoMemoria: IEstadoProceso = new EstadoProceso("Esperando Memoria");
    public static readonly Listo: IEstadoProceso = new EstadoProceso("Listo");
    public static readonly Ejecutando: IEstadoProceso = new EstadoProceso("Ejecutando");
    public static readonly Bloqueado: IEstadoProceso = new EstadoProceso("Bloqueado");
    public static readonly Terminado: IEstadoProceso = new EstadoProceso("Terminado");

    private readonly _nombre: string;
    private constructor (nombre: string){
        this._nombre= nombre;
    }
    public getNombre(): string {
        return this._nombre;
    }
}