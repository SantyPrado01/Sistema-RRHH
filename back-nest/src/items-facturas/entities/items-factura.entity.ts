import { Factura } from "../../facturas/entities/factura.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";


@Entity({
    name:'ItemsFactura'
})

export class ItemsFactura {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    descripcion: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    valor: number;
  
    @ManyToOne(() => Factura, factura => factura.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'factura_id' })
    factura: Factura;

}
