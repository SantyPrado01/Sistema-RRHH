import { ItemsFactura } from "../../items-facturas/entities/items-factura.entity";
import { Servicio } from "../../servicios/entities/servicio.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity({
    name:'Facturas'
})

export class Factura {

    @PrimaryGeneratedColumn({
        type: 'int',
        name:'id'
    })
    facturaId:number

    @Column()
    numero: number

    @Column('date')
    fecha: Date

    @Column()
    total: number

    @Column({default: false})
    eliminado: boolean

    @ManyToOne(() => Servicio, servicio => servicio.facturas)
    @JoinColumn({ name: 'servicioId' })
    servicio: Servicio;

    @OneToMany(() => ItemsFactura, item => item.factura, { cascade: true })
    items: ItemsFactura[];
}
