import { describe, expect, it } from "vitest";
import { BloqueMemoria } from "../src/BloqueMemoria.js";
import { Validador } from "../src/Validador.js";

describe("BloqueMemoria (RF04)", () => {
  it("Guarda inicio, tamaño y proceso, solo puede guardar si está libre y el tamaño alcanza", () => {
    const validador = new Validador();
    const libre = new BloqueMemoria(0, 100, BloqueMemoria.Libre, validador);
    const ocupado = new BloqueMemoria(100, 50, "P1", validador);

    expect(ocupado.getInicio()).toBe(100);
    expect(ocupado.getTamanio()).toBe(50);
    expect(ocupado.getPid()).toBe("P1");
    expect(libre.estaLibre()).toBe(true);
    expect(ocupado.estaLibre()).toBe(false);
    expect(libre.puedeGuardar(100)).toBe(true);
    expect(libre.puedeGuardar(101)).toBe(false);
    expect(ocupado.puedeGuardar(10)).toBe(false);
  });
  it("Rechaza un inicio negativo y un tamaño cero", () => {
    const validador = new Validador();

    expect(() => new BloqueMemoria(-1, 10, BloqueMemoria.Libre, validador)).toThrow("El inicio del bloque no puede ser negativo");
    expect(() => new BloqueMemoria(0, 0, BloqueMemoria.Libre, validador)).toThrow("El tamaño del bloque debe ser mayor que cero");
  });
});