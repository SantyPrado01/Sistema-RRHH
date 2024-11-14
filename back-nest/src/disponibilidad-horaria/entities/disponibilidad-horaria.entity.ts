import { Empleado } from "../../empleados/entities/empleado.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'disponibilidadHoraria'
})

export class DisponibilidadHoraria {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    disponibilidadHorariaId:number;

    @ManyToOne(() => Empleado, (empleado) => empleado.disponibilidades)
    empleado: Empleado;

    @Column({type: 'tinyint'})
    diaSemana?:number

    @Column({type: 'time'})
    horaInicio?:string

    @Column({type: 'time'})
    horaFin?:string

    @Column({default: false})
    fullTime: boolean
}
