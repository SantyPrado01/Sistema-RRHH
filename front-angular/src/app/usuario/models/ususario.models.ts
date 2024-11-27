export class Usuario{

    id: number
    username: string;
    categoriaId: number;

    constructor(id: number, username: string, categoriaId: number){
        this.id = id
        this.username = username;
        this.categoriaId = categoriaId;
    }

}
