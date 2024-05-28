import pool from "./Connection";

export default class Database {
    constructor() {
        this.Query = async (qry, arg) => {
            const db = await pool.connect();
            const result = await db.query(qry, arg);
            const rows = await result.rows;
            db.release();

            const data = this.afterSelect(rows);
            return data;
        }


        // After seclect method get data and check the value of afterSelect property
        // run dynamic function name from property with the data and return the result.
        this.afterSelect = (data) => {
            if (this.afterSelect) {
                if (this.afterSelect.length) {
                    for (funcName of this.afterSelect) {
                        return this[funcName](data);
                    }
                }
            }
            return data;
        }

        // This function gets data and runs function defiend in beforInsert array and return
        // the result the function as data.

        this.beforeInsert = (data) => {
            if (this.beforeInsert) {
                if (this.beforeInsert.length) {
                    for (funcName of this.beforeInsert) {
                        data = this[funcName](data);
                    }
                }
            }
            return data;
        }

        // This function get the data array and rund the function decleated in the
        // this.beforeUpdate array return the result data

        this.beforeUpdate = (data) => {
            if (this.beforeUpdate) {
                if (this.beforeUpdate.length) {
                    for (funcName of this.beforeUpdate) {
                        data = this[funcName](data);
                    }
                }
            }
            return data;
        }

        // Thhis function get an array of column names and checks with the allowedColumns property of the object and returns only the column name that are allowed.
        this.checkColumns = async column => {
            if (this.allowedColumns) {
                return column.filter(col => this.allowedColumns.includes(col));
            }
        }

        // This function get a table name as string and return its primary key by quering the Database.
        this.getPrimaryKey = async (tableName) => {
            let primaryKey = await this.query(`SHOW KEYS from ${table} WHERE Key_name = 'primary'`);
            return primaryKey[0].Column_name;
        }

        // Here we are maping the column name array and sanitizing the name to pervent sql injection.
        this.cleanColumnName = async (columnNames) => {
            // Check if input is an array
            if (!Array.isArray(columnNames)) {
                return columnNames.replace(/[^a-zA-Z0-9_\.]/g, "");
            }

            return columnNames.map(columnName => {
                // Remove special characters except alphanumeric, underscore, and period
                const sanitizedName = columnName.replace(/[^a-zA-Z0-9_\.]/g, "");

                // Prevent keywords by enclosing in backticks
                return `\`${sanitizedName}\``;
            });
        }
    }
}

