import { CategoriaServicio } from "src/categoria-servicio/entities/categoria-servicio.entity";
import { Ciudad } from "src/ciudad/entities/ciudad.entity";
import { NecesidadHoraria } from "src/necesidad-horaria/entities/necesidad-horaria.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'Servicios'
})

export class Servicio {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    servicioId:number

    @Column()
    servicioNombre:string

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

    @Column({default:false})
    elimindado: boolean

    @OneToMany(() => NecesidadHoraria, necesidad => necesidad.servicio)
    necesidades: NecesidadHoraria[];
}

