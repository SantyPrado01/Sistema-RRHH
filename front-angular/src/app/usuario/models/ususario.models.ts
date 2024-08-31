export class Usuario{

    username: string;
    password: string;
    rolID?: number;

    constructor(username: string, password: string, rolID: number){
        this.username = username;
        this.password = password;
        this.rolID = rolID
    }

}
