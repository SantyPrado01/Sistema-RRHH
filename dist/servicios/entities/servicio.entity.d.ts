import { CategoriaServicio } from "src/categoria-servicio/entities/categoria-servicio.entity";
import { Ciudad } from "src/ciudad/entities/ciudad.entity";
import { NecesidadHoraria } from "src/necesidad-horaria/entities/necesidad-horaria.entity";
export declare class Servicio {
    id: number;
    nombre: string;
    CUIT: number;
    direccion: string;
    ciudad: Ciudad[];
    telefono: number;
    categoria: CategoriaServicio[];
    descripcion: string;
    elimindado: number;
    necesidades: NecesidadHoraria[];
}
