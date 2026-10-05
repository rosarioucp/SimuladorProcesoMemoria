import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { PlanificadorRoundRobin } from "../src/PlanificadorRoundRobin.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Simulador } from "../src/Simulador.js";
import { Validador } from "../src/Validador.js";
import { Proceso } from "../src/Proceso.js";

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

describe("Quantum y finalización", () => {
  it("Un unico proceso renueva su quantum sin cambio de contexto", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 100, 5);
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();

    expect(planificador.getHistorial()).toEqual(["P1", "P1", "P1", "P1", "P1"]);
    expect(planificador.getCambiosContexto()).toBe(0);
  });

  it("Finalizar en el límite del quantum no vuelve el proceso a la cola", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 100, 2);
    simulador.registrarProceso("P2", 100, 1);
    simulador.avanzarTick();
    simulador.avanzarTick();

    expect(simulador.getTerminados().map((proceso) => proceso.getPid())).toEqual(["P1"]);
    expect(planificador.getListos().map((proceso) => proceso.getPid())).toEqual(["P2"]);
    expect(planificador.getCambiosContexto()).toBe(0);
  });
});
describe("Planificador Round Robin, cola de Listos", () => {
  it("Solo pone en cola procesos Listos y nunca dos veces al mismo", () => {
    const validador = new Validador();
    const planificador = new PlanificadorRoundRobin(2, validador);
    const proceso = new Proceso("P1", 100, 3, validador);

    expect(() => planificador.encolar(proceso)).toThrow("P1 no está Listo");

    proceso.admitir();
    planificador.encolar(proceso);

    expect(() => planificador.encolar(proceso)).toThrow("P1 ya está en la cola de Listos");
    expect(planificador.getListos().map((listo) => listo.getPid())).toEqual(["P1"]);
  });
});