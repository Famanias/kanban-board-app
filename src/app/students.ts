
export class Tasks{
    //eto yung mga name sa database
        id?: number;
        task_name?: string;
        task_desc?: string;
        status?: string;
        date?: Date;
        position?: number;
}

export class Users{
    user_id?: number;
    user_name?: string;
    user_pass?: string;
    user_email?: string;

    constructor(user_id?: number, user_name?: string,user_email?:string, user_pass?:string){
        this.user_id = user_id;
        this.user_name = user_name;
        this.user_email = user_email;
        this.user_pass = user_pass;

    }
}