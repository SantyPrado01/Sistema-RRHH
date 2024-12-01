import { Empleado } from "../../empleados/models/empleado.models";
import { Empresa } from "../../servicios/models/servicio.models";
import { CreateNecesidadHorariaDto } from "./necesidadHoraria.models"; 

export interface OrdenTrabajo {
    Id: number
    servicio: Empresa;
    empleadoAsignado: Empleado;
    horariosAsignados: [];
    necesidadHoraria?: CreateNecesidadHorariaDto[];
    mes: number;
    anio: number;
  }