import { IGuardar } from "./IGuardar.js";
import { IElegirBloque } from "./IElegirBloque.js";

export class PoliticaFirstFit implements IElegirBloque {
  public elegir(bloques: IGuardar[], tamanio: number): IGuardar[] {
    const candidatos = bloques.filter((bloque) => bloque.puedeGuardar(tamanio));
    return candidatos.slice(0, 1);
  }
}