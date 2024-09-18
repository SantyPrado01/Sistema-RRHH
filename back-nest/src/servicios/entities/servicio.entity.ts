import { CategoriaServicio } from "../../categoria-servicio/entities/categoria-servicio.entity";
import { Factura } from "../../facturas/entities/factura.entity";
import { NecesidadHoraria } from "../../necesidad-horaria/entities/necesidad-horaria.entity";
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

    @Column()
    ciudad: number;

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

    @OneToMany(() => Factura, factura => factura.servicio)
    facturas: Factura[];
}

