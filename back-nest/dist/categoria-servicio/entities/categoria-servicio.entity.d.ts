import { Servicio } from "../../servicios/entities/servicio.entity";
export declare class CategoriaServicio {
    categoriaServicioId: number;
    nombreCategoriaServico: string;
    eliminado: boolean;
    servicios: Servicio[];
}
