export interface IBloquear {
  definirES(inicio: number, duracion: number): void;
  debeBloquearse(): boolean;
  bloquear(): void;
  avanzarBloqueo(): void;
  desbloquear(): void;
}