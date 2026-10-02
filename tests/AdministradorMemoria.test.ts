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

  it("First-Fit selecciona el primer bloque suficiente por dirección", () => {
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), new Validador());
    memoria.asignar("A", 100);
    memoria.asignar("B", 100);
    memoria.asignar("C", 100);
    memoria.asignar("D", 100);
    memoria.liberar("A");
    memoria.liberar("C");

    memoria.asignar("X", 80);

    expect(memoria.getBloques().map((bloque) => bloque.getPid())).toEqual(["X", "", "B", "", "D", ""]);
    expect(memoria.getBloques().map((bloque) => bloque.getTamanio())).toEqual([80, 20, 100, 100, 100, 624]);
  });

 it("Si no hay hueco suficiente falla sin modificar los bloques, aunque la suma de libres alcance", () => {
    const memoria = new AdministradorMemoria(400, new PoliticaFirstFit(), new Validador());
    memoria.asignar("A", 100);
    memoria.asignar("B", 100);
    memoria.asignar("C", 100);
    memoria.asignar("D", 100);
    memoria.liberar("A");
    memoria.liberar("C");

    const asignado = memoria.asignar("X", 150);

    expect(asignado).toBe(false);
    expect(memoria.getBloques().map((bloque) => bloque.getPid())).toEqual(["", "B", "", "D"]);
    expect(memoria.getBloques().map((bloque) => bloque.getTamanio())).toEqual([100, 100, 100, 100]);
  });
});

describe("Test Coalescencia", () => {
  it("Se fusiona con el bloque izquierdo", () => {
    const memoria = new AdministradorMemoria(400, new PoliticaFirstFit(), new Validador());
    memoria.asignar("A", 100);
    memoria.asignar("B", 100);
    memoria.asignar("C", 100);
    memoria.asignar("D", 100);

    memoria.liberar("A");
    memoria.liberar("B");

    expect(memoria.getBloques().map((bloque) => bloque.getPid())).toEqual(["", "C", "D"]);
    expect(memoria.getBloques().map((bloque) => bloque.getTamanio())).toEqual([200, 100, 100]);
  });

  it("Se fusiona con el bloque derecho", () => {
    const memoria = new AdministradorMemoria(400, new PoliticaFirstFit(), new Validador());
    memoria.asignar("A", 100);
    memoria.asignar("B", 100);
    memoria.asignar("C", 100);
    memoria.asignar("D", 100);

    memoria.liberar("C");
    memoria.liberar("B");

    expect(memoria.getBloques().map((bloque) => bloque.getPid())).toEqual(["A", "", "D"]);
    expect(memoria.getBloques().map((bloque) => bloque.getTamanio())).toEqual([100, 200, 100]);
  });