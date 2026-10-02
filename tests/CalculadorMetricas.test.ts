import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Validador } from "../src/Validador.js";

describe("Métricas y límites", () => {
  it("Los huecos no contiguos de 100 y 300 KB dan libre 400, mayor hueco 300 y fragmentación 25%", () => {
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), new Validador());
    const calculador = new CalculadorMetricas();
    memoria.asignar("A", 100);
    memoria.asignar("B", 324);
    memoria.asignar("C", 300);
    memoria.asignar("D", 300);

    memoria.liberar("A");
    memoria.liberar("C");

    expect(calculador.memoriaLibreTotal(memoria)).toBe(400);
    expect(calculador.mayorBloqueLibre(memoria)).toBe(300);
    expect(calculador.fragmentacionExterna(memoria)).toBe(25);
  });

  it("La memoria llena hay ocupación 100%, libre 0, mayor bloque 0 y fragmentación 0%", () => {
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), new Validador());
    const calculador = new CalculadorMetricas();

    memoria.asignar("P1", 1024);

    expect(calculador.ocupacionMemoria(memoria)).toBe(100);
    expect(calculador.memoriaLibreTotal(memoria)).toBe(0);
    expect(calculador.mayorBloqueLibre(memoria)).toBe(0);
    expect(calculador.fragmentacionExterna(memoria)).toBe(0);
  });

  it("El tick en 0 la utilización de CPU es 0% y después es ticks ocupados sobre ticks transcurridos", () => {
    const calculador = new CalculadorMetricas();

    expect(calculador.utilizacionCpu(0, 0)).toBe(0);
    expect(calculador.utilizacionCpu(3, 4)).toBe(75);
  });
});
  