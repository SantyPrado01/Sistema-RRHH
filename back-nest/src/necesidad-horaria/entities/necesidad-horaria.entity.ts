import { Servicio } from '../../servicios/entities/servicio.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({
    name:'necesidadHoraria'
})

export class NecesidadHoraria {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    necesidadHorariaId:number

    @ManyToOne(()=> Servicio, servicio => servicio.necesidades)
    @JoinColumn({name:'servicio_id'})
    servicio: Servicio;

    @Column({type: 'tinyint'})
    diaSemana:number

    @Column({type: 'time'})
    horaInicio:string

    @Column({type: 'time'})
    horaFin:string

    @Column({type:'date'})
    fechaInicio: string

    @Column({type:'date'})
    fechaFin:string

}
