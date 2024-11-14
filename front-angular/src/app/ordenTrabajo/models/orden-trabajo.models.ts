import { Empleado } from "../../empleados/models/empleado.models";
import { Empresa } from "../../servicios/models/servicio.models";
import { CreateNecesidadHorariaDto } from "./necesidadHoraria.models"; 

export interface OrdenTrabajo {
    servicio: Empresa;
    empleadoAsignado: Empleado;
    horariosAsignados: [];
    necesidadHoraria?: CreateNecesidadHorariaDto[];
    mes: number;
    anio: number;
  }