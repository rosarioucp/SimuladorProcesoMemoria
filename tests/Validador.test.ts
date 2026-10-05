import { describe, expect, it } from "vitest";
import { Validador } from "../src/Validador.js";

describe ("Validador", () => {
    it ("No hace nada cuando el dato es válido", ()=> {
    const validador = new Validador();

    expect(() => validador.validarCondicion(true, "No debería fallar")).not.toThrow();
    expect(() => validador.validarEnteroPositivo(5, "El quantum")).not.toThrow();
    expect(() => validador.validarTextoNoVacio("P1", "El PID")).not.toThrow();
  });
    it("Da error con el mensaje cuando el dato es inválido", () => {
    const validador = new Validador();

    expect(() => validador.validarCondicion(false, "Dato inválido")).toThrow("Dato inválido");
    expect(() => validador.validarEnteroPositivo(0, "El quantum")).toThrow("El quantum debe ser mayor que cero");
    expect(() => validador.validarEnteroPositivo(2.5, "El quantum")).toThrow("El quantum debe ser un número entero");
    expect(() => validador.validarTextoNoVacio("   ", "El PID")).toThrow("El PID no puede estar vacío");
  });
});
