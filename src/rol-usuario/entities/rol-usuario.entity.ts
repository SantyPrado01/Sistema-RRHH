import { User } from "src/users/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'rolUsuario'
})

export class RolUsuario {

    @PrimaryGeneratedColumn({
        type:'int',
        name:'id'
    })
    id:number

    @Column()
    nombre: string

    @OneToMany(() => User, user => user.rol)
    usuarios: User[];

}
