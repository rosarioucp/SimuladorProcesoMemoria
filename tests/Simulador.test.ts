import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { IConsultarProceso } from "../src/IConsultarProceso.js";
import { IGuardar } from "../src/IGuardar.js";
import { PlanificadorRoundRobin } from "../src/PlanificadorRoundRobin.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Simulador } from "../src/Simulador.js";
import { Validador } from "../src/Validador.js";

describe("Prueba la configuración y registro"), () => {
  it("RF01: el estado inicial es tick 0, un único bloque libre, colas vacías y contadores en cero", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    expect(simulador.getTick()).toBe(0);
    expect(simulador.getMapaMemoria().map((bloque) => bloque.getTamanio())).toEqual([1024]);
    expect(simulador.getMapaMemoria().map((bloque) => bloque.estaLibre())).toEqual([true]);
    expect(simulador.getListos()).toEqual([]);
    expect(simulador.getEnCpu()).toEqual([]);
    expect(simulador.getEnEspera()).toEqual([]);
    expect(simulador.getBloqueados()).toEqual([]);
    expect(simulador.getTerminados()).toEqual([]);
    expect(simulador.getCambiosContexto()).toBe(0);
  });

  