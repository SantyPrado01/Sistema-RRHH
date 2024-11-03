import { Servicio } from "../../servicios/entities/servicio.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'categoriaServicio'})

export class CategoriaServicio {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number

    @Column()
    nombre:string

    @Column({default: false})
    eliminado: boolean

    @OneToMany(()=> Servicio, servicios => servicios.categoria)
    servicios: Servicio[];


}
