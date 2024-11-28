import { OrdenTrabajo } from "src/ordenTrabajo/entities/ordenTrabajo.entity";
import { Factura } from "../../facturas/entities/factura.entity";
import { Categorias } from "src/categoria-empleado/entities/categoria-empleado.entity";
export declare class Servicio {
    servicioId: number;
    nombre: string;
    cuit: string;
    direccion: string;
    ciudad: number;
    telefono: string;
    categoria: Categorias[];
    descripcion: string;
    eliminado: boolean;
    facturas: Factura[];
    ordenesTrabajo: OrdenTrabajo[];
}
