import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { PlanificadorRoundRobin } from "../src/PlanificadorRoundRobin.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Simulador } from "../src/Simulador.js";
import { Validador } from "../src/Validador.js";

describe("Round Robin", () => {
  it("con Q=2, P1 con CPU 3 y P2 con CPU 2 ejecutan P1, P1, P2, P2, P1 con un cambio de contexto", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 100, 3);
    simulador.registrarProceso("P2", 100, 2);
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();

    expect(planificador.getHistorial()).toEqual(["P1", "P1", "P2", "P2", "P1"]);
    expect(planificador.getCambiosContexto()).toBe(1);
    expect(simulador.getTerminados().map((proceso) => proceso.getPid())).toEqual(["P2", "P1"]);
  });
});

