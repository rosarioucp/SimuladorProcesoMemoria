import { describe, expect, it } from "vitest";
import { EstadoProceso } from "../src/EstadoProceso.js";

describe("EstadoProceso (RF03)", () => {
  it("Representa los estados de un proceso", () => {
    const estados = [
      EstadoProceso.Nuevo,
      EstadoProceso.EsperandoMemoria,
      EstadoProceso.Listo,
      EstadoProceso.Ejecutando,
      EstadoProceso.Bloqueado,
      EstadoProceso.Terminado,
    ];
     const nombres = estados.map((estado) => estado.getNombre());

    expect(nombres).toEqual(["Nuevo", "Esperando Memoria", "Listo", "Ejecutando", "Bloqueado", "Terminado"]);
  });
});