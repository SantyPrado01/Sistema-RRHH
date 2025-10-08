import { OrdenTrabajo } from "src/ordenTrabajo/entities/ordenTrabajo.entity"; 
import { Factura } from "../../facturas/entities/factura.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categorias } from "src/categoria-empleado/entities/categoria-empleado.entity";

@Entity({
    name:'Servicios'
})

export class Servicio {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    servicioId:number

    @Column()
    nombre:string

    @Column({default:'0'})
    cuit: string

    @Column()
    direccion: string

    @Column({nullable:true})
    ciudad: number;

    @Column({default:'0'})
    telefono: string;

    @ManyToOne(()=> Categorias, categoria => categoria.servicios)
    categoria: Categorias[];

    @Column({default:''})
    descripcion: string

    @Column({default:false})
    eliminado: boolean

    @Column({default:'0'})
    horasFijas: string;

    @OneToMany(() => Factura, factura => factura.servicio)
    facturas: Factura[];

    @OneToMany(() => OrdenTrabajo, (ordenTrabajo) => ordenTrabajo.servicio)
    ordenesTrabajo: OrdenTrabajo[];

}

