// src/interfaces/orden-trabajo-con-horas.interface.ts
import { OrdenTrabajo } from "../entities/ordenTrabajo.entity";  // Importar la entidad original

// Extiende la interfaz de OrdenTrabajo
export interface OrdenTrabajoConHoras extends OrdenTrabajo {
  horasProyectadas: string;
  horasReales: string;
}
