import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../src/AdministradorMemoria.js";
import { CalculadorMetricas } from "../src/CalculadorMetricas.js";
import { IConsultarProceso } from "../src/IConsultarProceso.js";
import { IGuardar } from "../src/IGuardar.js";
import { PlanificadorRoundRobin } from "../src/PlanificadorRoundRobin.js";
import { PoliticaFirstFit } from "../src/PoliticaFirstFit.js";
import { Simulador } from "../src/Simulador.js";
import { Validador } from "../src/Validador.js";

function crearSimulador(memoriaTotal: number = 1024, quantum: number = 2): Simulador {
  const validador = new Validador();
  const memoria = new AdministradorMemoria(memoriaTotal, new PoliticaFirstFit(), validador);
  const planificador = new PlanificadorRoundRobin(quantum, validador);
  return new Simulador(memoria, planificador, new CalculadorMetricas(), validador);
}