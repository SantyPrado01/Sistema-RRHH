
import { Empleado } from "../../empleados/entities/empleado.entity";
import { HorarioAsignado } from "../../horarios-asignados/entities/horarios-asignado.entity";
import { NecesidadHoraria } from "../../necesidad-horaria/entities/necesidad-horaria.entity";
import { Servicio } from "../../servicios/entities/servicio.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('ordenes-trabajo')
export class OrdenTrabajo {

    @PrimaryGeneratedColumn()
    ordenTrabajoId: number;

    @ManyToOne(() => Servicio, (servicio) => servicio.ordenesTrabajo)
    servicio: Servicio;

    @ManyToOne(() => Empleado, { nullable: false })
    empleadoAsignado: Empleado;  

    @OneToMany(() => HorarioAsignado, (horario) => horario.ordenTrabajo)
    horariosAsignados?: HorarioAsignado[];

    @Column()
    mes: number; 

    @Column()
    anio: number;  

    @OneToMany(() => NecesidadHoraria, (necesidades) => necesidades.ordenTrabajo)
    necesidadHoraria?: NecesidadHoraria[];
}
