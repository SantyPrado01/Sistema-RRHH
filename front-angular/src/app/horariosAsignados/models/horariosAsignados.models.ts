import { Empleado } from "../../empleados/models/empleado.models";
import { OrdenTrabajo } from "../../ordenTrabajo/models/orden-trabajo.models";

export interface HorarioAsignado {
    horarioAsignadoId?: number;
    ordenTrabajo: OrdenTrabajo;
    empleado: Empleado;
    empleadoSuplente?: Empleado;
    fecha: Date;
    horaInicioProyectado: string;
    horaFinProyectado: string;
    horaInicioReal?: string;
    horaFinReal?: string;
    estado?: string;
    estadoSuplente?: string;
    observaciones?: string;
    comprobado?: boolean;
    suplente?: boolean;
}

interface HorarioPorMes {
    mes: number;
    horarios: HorarioAsignado[];
  }
  
export interface HorarioPorEmpleado {
    empleadoId: number;
    empleadoNombre: string;
    horariosPorMes: HorarioPorMes[];
  }