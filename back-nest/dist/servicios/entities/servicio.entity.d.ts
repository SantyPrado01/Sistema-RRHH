import { CategoriaServicio } from "../../categoria-servicio/entities/categoria-servicio.entity";
import { Ciudad } from "../../ciudad/entities/ciudad.entity";
import { Factura } from "../../facturas/entities/factura.entity";
import { NecesidadHoraria } from "../../necesidad-horaria/entities/necesidad-horaria.entity";
export declare class Servicio {
    servicioId: number;
    servicioNombre: string;
    CUIT: number;
    direccion: string;
    ciudad: Ciudad[];
    telefono: number;
    categoria: CategoriaServicio[];
    descripcion: string;
    elimindado: boolean;
    necesidades: NecesidadHoraria[];
    facturas: Factura[];
}
