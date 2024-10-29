import { Empleado } from "src/empleados/entities/empleado.entity";
import { OrdenTrabajo } from "src/orden-trabajo/entities/orden-trabajo.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('horarios_asignados')
export class HorarioAsignado {
    @PrimaryGeneratedColumn()
    horarioAsignadoId: number;

    @ManyToOne(() => OrdenTrabajo, (orden) => orden.horariosAsignados, { nullable: false })
    ordenTrabajo: OrdenTrabajo;

    @ManyToOne(() => Empleado, { nullable: false })
    empleado: Empleado;

    @ManyToOne(() => Empleado, { nullable: false })
    empleadoSuplente: Empleado;

    @Column()
    fecha: Date; 

    @Column()
    horaInicioProyectado: string;

    @Column()
    horaFinProyectado: string;

    @Column({ nullable: true })
    horaInicioReal: string; 

    @Column({ nullable: true })
    horaFinReal: string;    

    @Column()
    estado: string; 

    @Column({default: false})
    suplente: boolean
}
