import { Empleado } from "../../empleados/models/empleado.models";
import { Empresa } from "../../servicios/models/servicio.models";
import { CreateHorariosAsignadoDto } from "./horarioAsignado.models";
import { CreateNecesidadHorariaDto } from "./necesidadHoraria.models"; 

export interface OrdenTrabajo {
    servicio: Empresa;
    empleadoAsignado: Empleado;
    necesidadHoraria?: CreateNecesidadHorariaDto[];
    mes: number;
    anio: number;
  }