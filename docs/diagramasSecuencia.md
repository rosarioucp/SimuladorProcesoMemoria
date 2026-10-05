```mermaid
sequenceDiagram
  title Admisión y asignación de memoria (RF03 y RF04)
  actor Usuario
  participant S as Simulador
  participant M as AdministradorMemoria
  participant F as PoliticaFirstFit
  participant P as Proceso
  participant R as PlanificadorRoundRobin

  Usuario->>S: avanzarTick()
  S->>S: _faseAdmision()
  S->>M: asignar(pid, memoria)
  M->>F: elegir(bloques, tamanio)
  F-->>M: bloque elegido (lista de 0 o 1)

  alt hay un bloque libre suficiente
    M->>M: _ocupar(bloque, pid, tamanio)
    M-->>S: true
    S->>P: admitir()
    Note right of P: pasa a Listo
    S->>R: encolar(proceso)
  else no hay bloque suficiente
    M-->>S: false
    S->>P: esperarMemoria()
    Note right of P: queda en Esperando Memoria
  end
  ```

```mermaid
  sequenceDiagram
  title Un tick de Round Robin (RF06 y RF07)
  participant S as Simulador
  participant R as PlanificadorRoundRobin
  participant P as Proceso
  participant M as AdministradorMemoria

  S->>S: _faseEjecucion()
  S->>R: ejecutarTick()
  R->>R: _asignarCpu()
  R->>P: asignarCpu()
  Note right of P: pasa a Ejecutando
  R->>P: ejecutarTick()
  Note right of P: CPU restante -1, quantum consumido +1
  R->>R: _anotarHistorial(ejecutados)
  R->>R: _resolverSalidas(ejecutados)

  alt CPU restante es 0
    R->>P: finalizar()
    Note right of P: pasa a Terminado
  else agotó el quantum y hay otros Listos
    R->>P: expulsar()
    Note right of P: vuelve a Listo, al final de la cola
    Note over R: cambios de contexto +1
  else agotó el quantum y no hay otros Listos
    R->>P: renovarQuantum()
    Note right of P: sigue en Ejecutando
  end
 
  S->>R: getTerminadosDelTick()
  R-->>S: procesos terminados
  S->>M: liberar(pid)
  Note right of M: libera el bloque y fusiona los libres vecinos

   ```
```mermaid
  sequenceDiagram
  title Bloqueo y retorno por E/S (RF08)
  participant S as Simulador
  participant R as PlanificadorRoundRobin
  participant P as Proceso

  Note over S,P: Tick en que se inicia la E/S
  S->>R: ejecutarTick()
  R->>P: ejecutarTick()
  R->>P: debeBloquearse()
  P-->>R: true
  R->>P: bloquear()
  Note right of P: pasa a Bloqueado, deja la CPU y conserva su memoria
  Note over R: cambios de contexto +1
  S->>R: getBloqueadosDelTick()
  R-->>S: procesos bloqueados

  Note over S,P: Ticks siguientes
  loop un tick por cada unidad de duración de la E/S
    S->>S: _faseBloqueados()
    S->>P: avanzarBloqueo()
    Note right of P: bloqueo restante -1
  end

  Note over S,P: Tick en que el bloqueo llega a 0
  S->>P: getBloqueoRestante()
  P-->>S: 0
  S->>P: desbloquear()
  Note right of P: vuelve a Listo
  S->>R: encolar(proceso)
  ```
