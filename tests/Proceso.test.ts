import { Proceso } from "../src/Proceso.js";
import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { PlanificadorRoundRobin } from "../src/PlanificadorRoundRobin.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Simulador } from "../src/Simulador.js";
import { Validador } from "../src/Validador.js";

describe("Proceso, sus transiciones y contadores", () => {
  it("Recorre el ciclo de vida de Nuevo a Terminado y actualiza su contador", () => {
    const proceso = new Proceso("P1", 100, 2, new Validador());

    proceso.admitir();
    proceso.asignarCpu();
    proceso.ejecutarTick();

    expect(proceso.getEstado().getNombre()).toBe("Ejecutando");
    expect(proceso.getCpuRestante()).toBe(1);
    expect(proceso.getQuantumConsumido()).toBe(1);

    proceso.ejecutarTick();
    proceso.finalizar();

    expect(proceso.getEstado().getNombre()).toBe("Terminado");
    expect(proceso.getCpuRestante()).toBe(0);
  });
   it("Rechaza las acciones que no corresponden a su estado y no cambia sus datos", () => {
    const proceso = new Proceso("P1", 100, 2, new Validador());

    expect(() => proceso.ejecutarTick()).toThrow("No se puede ejecutar P1 en estado Nuevo");
    expect(() => proceso.asignarCpu()).toThrow("No se puede asignar la CPU a P1 en estado Nuevo");
    expect(() => proceso.finalizar()).toThrow("No se puede finalizar P1 en estado Nuevo");
    expect(proceso.getEstado().getNombre()).toBe("Nuevo");
    expect(proceso.getCpuRestante()).toBe(2);
  });

  it("Un proceso Terminado rechaza cualquier acción", () => {
    const proceso = new Proceso("P1", 100, 1, new Validador());
    proceso.admitir();
    proceso.asignarCpu();
    proceso.ejecutarTick();
    proceso.finalizar();

    expect(() => proceso.admitir()).toThrow("No se puede admitir P1 en estado Terminado");
    expect(() => proceso.asignarCpu()).toThrow("No se puede asignar la CPU a P1 en estado Terminado");
    expect(() => proceso.ejecutarTick()).toThrow("No se puede ejecutar P1 en estado Terminado");
    expect(proceso.getEstado().getNombre()).toBe("Terminado");
  });
});


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
it("Bloqueado no consume CPU y al vencer el temporizador devuelve a Listos y ejecuta", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(5, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProcesoConES("P1", 200, 4, 2, 3);
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();

    expect(simulador.getHistorialCpu()).toEqual(["P1", "P1", "-", "-", "P1", "P1"]);
    expect(simulador.getProcesos().map((proceso) => proceso.getEstado().getNombre())).toEqual(["Terminado"]);
    expect(simulador.getCambiosContexto()).toBe(1);
  });

  it("Rechaza un evento de E/S inválido", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    expect(() => simulador.registrarProcesoConES("P1", 100, 4, 0, 2)).toThrow("El inicio de la E/S debe ser mayor que cero");
    expect(() => simulador.registrarProcesoConES("P1", 100, 4, 4, 2)).toThrow("La E/S debe iniciarse antes de que el proceso termine");
    expect(simulador.getProcesos()).toEqual([]);
  });
});
  