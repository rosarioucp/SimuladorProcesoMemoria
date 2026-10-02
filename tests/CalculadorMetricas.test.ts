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

  