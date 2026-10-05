import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { IConsultarProceso } from "../src/IConsultarProceso.js";
import { IGuardar } from "../src/IGuardar.js";
import { PlanificadorRoundRobin } from "../src/PlanificadorRoundRobin.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Simulador } from "../src/Simulador.js";
import { Validador } from "../src/Validador.js";

describe("Prueba la configuración y registro", () => {
  it("el estado inicial es tick 0, un único bloque libre, colas vacías y contadores en cero", () => {
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
  it("Rechazar una memoria total o un quantum inválidos", () => {
    const validador = new Validador();

    expect(() => new AdministradorMemoria(0, new PoliticaFirstFit(), validador)).toThrow("La memoria total debe ser mayor que cero");
    expect(() => new AdministradorMemoria(10.5, new PoliticaFirstFit(), validador)).toThrow("La memoria total debe ser un número entero");
    expect(() => new PlanificadorRoundRobin(0, validador)).toThrow("El quantum debe ser mayor que cero");
  });

  it("Registrar un proceso Nuevo con CPU restante igual al total y contadores en cero", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 200, 5);
    const procesos = simulador.getProcesos();
    expect(procesos.map((proceso) => proceso.getPid())).toEqual(["P1"]);
    expect(procesos.map((proceso) => proceso.getMemoria())).toEqual([200]);
    expect(procesos.map((proceso) => proceso.getCpuRestante())).toEqual([5]);
    expect(procesos.map((proceso) => proceso.getQuantumConsumido())).toEqual([0]);
    expect(procesos.map((proceso) => proceso.getBloqueoRestante())).toEqual([0]);
    expect(procesos.map((proceso) => proceso.getEstado().getNombre())).toEqual(["Nuevo"]);
  });

   it("Rechaza los datos inválidos de un proceso", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    expect(() => simulador.registrarProceso("", 100, 3)).toThrow("El PID no puede estar vacío");
    expect(() => simulador.registrarProceso("P1", 0, 3)).toThrow("La memoria requerida debe ser mayor que cero");
    expect(() => simulador.registrarProceso("P1", 100, 1.5)).toThrow("El tiempo de CPU debe ser un número entero");
    expect(simulador.getProcesos()).toEqual([]);
  });

  it("Rechazar un PID repetido", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 100, 3);

    expect(() => simulador.registrarProceso("P1", 50, 1)).toThrow("El PID P1 ya está registrado");
    expect(simulador.getProcesos().length).toBe(1);
  });

it("Rechaza un proceso que pide más memoria que la total", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    expect(() => simulador.registrarProceso("P1", 1025, 3)).toThrow("P1 pide más memoria que la memoria total");
    expect(simulador.getProcesos()).toEqual([]);
  });
});
describe("Espera y admite", () => {
  it("Admite como Listo al que cabe y deja Esperando Memoria al que no, sin frenar a los de atrás", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1000, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 600, 10);
    simulador.registrarProceso("P2", 500, 10);
    simulador.registrarProceso("P3", 300, 10);
    simulador.avanzarTick();

    const estados = simulador.getProcesos().map((proceso) => proceso.getEstado().getNombre());
    expect(estados).toEqual(["Ejecutando", "Esperando Memoria", "Listo"]);
    expect(simulador.getEnEspera().map((proceso) => proceso.getPid())).toEqual(["P2"]);
  });

  it("El que proceso que esperaba es admitido cuando se libera memoria, y el Terminado no vuelve a las colas", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1000, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 600, 2);
    simulador.registrarProceso("P2", 500, 1);
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();

    expect(simulador.getHistorialCpu()).toEqual(["P1", "P1", "P2"]);
    expect(simulador.getTerminados().map((proceso) => proceso.getPid())).toEqual(["P1", "P2"]);
    expect(simulador.getListos()).toEqual([]);
    expect(simulador.getEnEspera()).toEqual([]);
  });
});

describe("Orden e invariantes", () => {
  it("Cada invocación avanza exactamente un tick y ejecuta como máximo un proceso", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 100, 4);
    simulador.registrarProceso("P2", 100, 4);
    simulador.avanzarTick();

    expect(simulador.getTick()).toBe(1);
    expect(simulador.getProcesos().map((proceso) => proceso.getCpuRestante())).toEqual([3, 4]);
  });

  it("La liberación al final del tick habilita la admisión recién en el siguiente", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1000, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 800, 1);
    simulador.registrarProceso("P2", 800, 1);
    simulador.avanzarTick();

    const estadosTick1 = simulador.getProcesos().map((proceso) => proceso.getEstado().getNombre());
    expect(estadosTick1).toEqual(["Terminado", "Esperando Memoria"]);

    simulador.avanzarTick();

    const estadosTick2 = simulador.getProcesos().map((proceso) => proceso.getEstado().getNombre());
    expect(estadosTick2).toEqual(["Terminado", "Terminado"]);
  });

  it("Expone tick, proceso en CPU, Listos, en espera, Bloqueados, Terminados y mapa de memoria", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1000, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 100, 1);
    simulador.registrarProcesoConES("P2", 100, 5, 1, 9);
    simulador.registrarProceso("P3", 100, 9);
    simulador.registrarProceso("P4", 100, 9);
    simulador.registrarProceso("P5", 900, 9);
    simulador.avanzarTick();
    simulador.avanzarTick();
    simulador.avanzarTick();

    expect(simulador.getTick()).toBe(3);
    expect(simulador.getEnCpu().map((proceso) => proceso.getPid())).toEqual(["P3"]);
    expect(simulador.getListos().map((proceso) => proceso.getPid())).toEqual(["P4"]);
    expect(simulador.getEnEspera().map((proceso) => proceso.getPid())).toEqual(["P5"]);
    expect(simulador.getBloqueados().map((proceso) => proceso.getPid())).toEqual(["P2"]);
    expect(simulador.getTerminados().map((proceso) => proceso.getPid())).toEqual(["P1"]);
    expect(simulador.getMapaMemoria().map((bloque) => bloque.getPid())).toEqual(["", "P2", "P3", "P4", ""]);
    expect(simulador.getMapaMemoria().map((bloque) => bloque.getTamanio())).toEqual([100, 100, 100, 100, 600]);
  });

    it("Nunca hay procesos duplicados, solapamientos de memoria ni dos procesos en CPU", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(600, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(2, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProceso("P1", 300, 5);
    simulador.registrarProcesoConES("P2", 200, 6, 2, 3);
    simulador.registrarProceso("P3", 300, 4);

    Array.from({ length: 25 }).forEach(() => {
      simulador.avanzarTick();
      const ubicados = [
        ...simulador.getEnCpu(),
        ...simulador.getListos(),
        ...simulador.getEnEspera(),
        ...simulador.getBloqueados(),
        ...simulador.getTerminados(),
      ].map((proceso) => proceso.getPid());
      const bloques = simulador.getMapaMemoria();
      const inicios = bloques.map((bloque) => bloque.getInicio());
      const finales = bloques.map((bloque) => bloque.getInicio() + bloque.getTamanio());

      expect(simulador.getEnCpu().length).toBeLessThanOrEqual(1);
      expect(ubicados.sort()).toEqual(["P1", "P2", "P3"]);
      expect(inicios).toEqual([0, ...finales.slice(0, -1)]);
    });
  });

   it("La admisión va antes que los bloqueados: el admitido queda delante del que vuelve de E/S", () => {
    const validador = new Validador();
    const memoria = new AdministradorMemoria(1024, new PoliticaFirstFit(), validador);
    const planificador = new PlanificadorRoundRobin(5, validador);
    const simulador = new Simulador(memoria, planificador, new CalculadorMetricas(), validador);

    simulador.registrarProcesoConES("P1", 100, 3, 1, 1);
    simulador.registrarProceso("P2", 100, 5);
    simulador.avanzarTick();
    simulador.registrarProceso("P3", 100, 5);
    simulador.avanzarTick();

    expect(simulador.getEnCpu().map((proceso) => proceso.getPid())).toEqual(["P2"]);
    expect(simulador.getListos().map((proceso) => proceso.getPid())).toEqual(["P3", "P1"]);
  });
});