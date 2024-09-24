import { CategoriaServicio } from "../../categoria-servicio/entities/categoria-servicio.entity";
import { Factura } from "../../facturas/entities/factura.entity";
import { NecesidadHoraria } from "../../necesidad-horaria/entities/necesidad-horaria.entity";
export declare class Servicio {
    servicioId: number;
    nombre: string;
    cuit: string;
    direccion: string;
    ciudad: number;
    telefono: string;
    categoria: CategoriaServicio[];
    descripcion: string;
    elimindado: boolean;
    necesidades: NecesidadHoraria[];
    facturas: Factura[];
}
