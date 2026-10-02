import { IBloquear } from "./IBloquear.js";
import { ICambiarEstado } from "./ICambiarEstado.js";
import { IConsultarProceso } from "./IConsultarProceso.js";

export interface IProcesar extends IConsultarProceso, ICambiarEstado, IBloquear {}