import { OrdenTrabajo } from "src/orden-trabajo/entities/orden-trabajo.entity";
import { CategoriaServicio } from "../../categoria-servicio/entities/categoria-servicio.entity";
import { Factura } from "../../facturas/entities/factura.entity";
export declare class Servicio {
    servicioId: number;
    nombre: string;
    cuit: string;
    direccion: string;
    ciudad: number;
    telefono: string;
    categoria: CategoriaServicio[];
    descripcion: string;
    eliminado: boolean;
    facturas: Factura[];
    ordenesTrabajo: OrdenTrabajo[];
}
