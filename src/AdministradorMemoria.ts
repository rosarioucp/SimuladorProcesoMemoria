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