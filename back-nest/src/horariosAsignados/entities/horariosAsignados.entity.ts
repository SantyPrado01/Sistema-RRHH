import { Empleado } from "../../empleados/entities/empleado.entity";
import { OrdenTrabajo } from "src/ordenTrabajo/entities/ordenTrabajo.entity"; 
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('horariosAsignados')
export class HorarioAsignado {
    @PrimaryGeneratedColumn()
    horarioAsignadoId: number;

    @ManyToOne(() => OrdenTrabajo, (orden) => orden.horariosAsignados)
    ordenTrabajo: OrdenTrabajo;

    @ManyToOne(() => Empleado, { nullable: false })
    empleado: Empleado;

    @ManyToOne(() => Empleado, { nullable: true })
    empleadoSuplente?: Empleado;

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

    @Column({default:false})
    comprobado: boolean

    @Column({default:''})
    observaciones: string

    @Column({default:false})
    eliminado: boolean

}