import { NecesidadHoraria } from "src/necesidad-horaria/entities/necesidad-horaria.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'Servicios'
})

export class Servicio {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number

    @Column()
    nombre:string

    @Column()
    CUIT: number

    @Column()
    direccion: string

    @Column()
    idCiudad: number

    @Column()
    telefono: number

    @Column()
    idCategoriaServicio: number

    @Column()
    descripcion: string

    @Column()
    elimindado: number

    @OneToMany(()=> NecesidadHoraria, necesidad => necesidad.servicio)
    necesidades: NecesidadHoraria[];

}

