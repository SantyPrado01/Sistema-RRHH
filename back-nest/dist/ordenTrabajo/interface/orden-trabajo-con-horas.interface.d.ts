import { OrdenTrabajo } from "../entities/ordenTrabajo.entity";
export interface OrdenTrabajoConHoras extends OrdenTrabajo {
    horasProyectadas: string;
    horasReales: string;
}
