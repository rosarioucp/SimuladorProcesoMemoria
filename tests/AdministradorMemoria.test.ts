import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Validador } from "../src/Validador.js";

describe("Asignación de memoria", () => {
  it("Partición parcial, divide el bloque cuando sobra espacio", () => {
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), new Validador());

    const asignado = memoria.asignar("P1", 200);

    expect(asignado).toBe(true);
    expect(memoria.getBloques().map((bloque) => bloque.getInicio())).toEqual([0, 200]);
    expect(memoria.getBloques().map((bloque) => bloque.getTamanio())).toEqual([200, 824]);
    expect(memoria.getBloques().map((bloque) => bloque.getPid())).toEqual(["P1", ""]);
  });

  it("Un ajuste exacto no genera bloques de tamaño cero", () => {
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), new Validador());

    const asignado = memoria.asignar("P1", 1024);

    expect(asignado).toBe(true);
    expect(memoria.getBloques().map((bloque) => bloque.getTamanio())).toEqual([1024]);
    expect(memoria.getBloques().map((bloque) => bloque.getPid())).toEqual(["P1"]);
  });