import Model from "../../lib/Model"
export default class Session extends Model {
    protected fields = {
        session_id: "serial not null",
        user_id: "varchar(255) not null",
        token: "varchar(32) not null",
        created_at: "timestamp default current_timestamp",
        updated_at: "timestamp default current_timestamp",
    }

    protected allowedColumns = [
        "user_id",
        "token",
        "created_at",
    ];
}
