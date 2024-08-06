import { CategoriaServicio } from "src/categoria-servicio/entities/categoria-servicio.entity";
import { Ciudad } from "src/ciudad/entities/ciudad.entity";
import { NecesidadHoraria } from "src/necesidad-horaria/entities/necesidad-horaria.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(()=> Ciudad, ciudad => ciudad.servicios)
    ciudad: Ciudad[];

    @Column()
    telefono: number

    @ManyToOne(()=> CategoriaServicio, categoria => categoria.servicios)
    categoria: CategoriaServicio[];

    @Column()
    descripcion: string

    @Column()
    elimindado: number

    @OneToMany(() => NecesidadHoraria, necesidad => necesidad.servicio)
    necesidades: NecesidadHoraria[];
}

