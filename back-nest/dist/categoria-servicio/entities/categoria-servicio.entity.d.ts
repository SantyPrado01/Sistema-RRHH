import { Servicio } from "../../servicios/entities/servicio.entity";
export declare class CategoriaServicio {
    id: number;
    nombre: string;
    eliminado: boolean;
    servicios: Servicio[];
}
