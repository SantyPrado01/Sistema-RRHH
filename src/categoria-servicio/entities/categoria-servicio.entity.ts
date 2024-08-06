import { Servicio } from "src/servicios/entities/servicio.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'categoriaServicio'
})

export class CategoriaServicio {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number

    @Column()
    name:string

    @OneToMany(()=> Servicio, servicios => servicios.categoria)
    servicios: Servicio[];


}
