
import Model from "@/app/lib/Model"

export default class User extends Model {
    protected fields = {
        id: "serial primary key",
        username: "varchar(255) not null",
        password: "varchar(255) not null",
        email: "varchar(255) not null",
        contact: " bigint",
        address: "varchar(255)",
        created_at: "timestamp default current_timestamp",
        updated_at: "timestamp default current_timestamp",
    }

    protected allowedColumns = [
        "user_id",
        "username",
        "password",
        "email",
        "contact",
        "address",
    ];
}
