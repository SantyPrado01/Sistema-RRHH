import { User } from "src/users/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'categoriaUsuario'})

export class CategoriaUsuario {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number

    @Column()
    nombre: string

    @Column({default: false})
    eliminado: boolean

    @OneToMany(()=> User, user => user.categoria)
    user: User[];

}
