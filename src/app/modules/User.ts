import psql from "@/app/lib/Database"

// Module user: Provide the type of user properties nad methodes.

export default class User {
    private allowedColumns = [];
    // Properties
    private tableName: string;
    private id: number;
    private username: string;
    private password: string;
    private role: string;
    private created_at: Date;
    private updated_at: Date;
    private token: string;
    private token_expiration: Date;
    private token_created_at: Date;
    private token_updated_at: Date;
    private phone_number: number;
    private phone_number_verified: boolean;
    private profile_picture: string;
    private bio: string;
    private is_banned: boolean;
    private login_attamp: number;
    private last_login: Date;
    private last_logout: Date;

    private get = async (id: number) => {
        // Here we sanitize the input value to only numbers.
        id = parseInt(id.toString().replace(/[^0-9]/g, ''));

        // Here we get the user data from the database.
        const tableName = this.tableName??  "users";
        return await psql.Query([`SELECT * FROM ${tableName} WHERE id =(id);`, [id=id]]);
    }

private create = async(data: any) => {
    // Checking of the data is an object or array and is not empty.
    if((data.length || data.count)  = 0 ){
        return false
    }
    // Here we are ketting the keys and values from data;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const result = psql.Query(`insert into ${table} (${keys} values(values))`, [values])
