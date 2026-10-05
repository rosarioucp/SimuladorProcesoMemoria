import { describe, expect, it } from "vitest";
import { BloqueMemoria } from "../src/BloqueMemoria.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Validador } from "../src/Validador.js";

describe("Politica First Fit", () => {
     it("Elige el primer bloque libre donde entra el tamaño pedido", () => {
    const validador = new Validador();
    const bloques = [
      new BloqueMemoria(0, 50, BloqueMemoria.Libre, validador),
      new BloqueMemoria(50, 100, "P1", validador),
      new BloqueMemoria(150, 200, BloqueMemoria.Libre, validador),
      new BloqueMemoria(350, 300, BloqueMemoria.Libre, validador),
    ];

    const elegidos = new PoliticaFirstFit().elegir(bloques, 120);

    expect(elegidos.map((bloque) => bloque.getInicio())).toEqual([150]);
  });
    it("Devuelve una lista vacía cuando ningún bloque libre alcanza", () => {
    const validador = new Validador();
    const bloques = [
      new BloqueMemoria(0, 50, BloqueMemoria.Libre, validador),
      new BloqueMemoria(50, 100, "P1", validador),
    ];

    const elegidos = new PoliticaFirstFit().elegir(bloques, 80);

    expect(elegidos).toEqual([]);
  });
});