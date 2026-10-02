import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { PlanificadorRoundRobin } from "../src/PlanificadorRoundRobin.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Simulador } from "../src/Simulador.js";
import { Validador } from "../src/Validador.js";

describe("Bloquearse por E/S", () => {
  it("Al bloquearse libera la CPU, conserva la memoria y cuenta un cambio de contexto", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(5, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProcesoConES("P1", 200, 4, 2, 3);
    simulador.avanzarTick();
    simulador.avanzarTick();

    expect(simulador.getProcesos().map((proceso) => proceso.getEstado().getNombre())).toEqual(["Bloqueado"]);
    expect(simulador.getBloqueados().map((proceso) => proceso.getPid())).toEqual(["P1"]);
    expect(simulador.getEnCpu()).toEqual([]);
    expect(simulador.getMapaMemoria().map((bloque) => bloque.getPid())).toEqual(["P1", ""]);
    expect(simulador.getCambiosContexto()).toBe(1);
  });

  