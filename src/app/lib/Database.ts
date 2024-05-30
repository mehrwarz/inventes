
import pool from "@/app/lib/Connection";

export default class Database {
    public errors: any = undefined;
    protected primaryKey: string = "";
    protected allowedColumns = [];
    protected afterSelect = [];
    protected afterInsert = [];
    protected afterUpdate = [];
    protected afterDelete = [];
    protected beforeSelect = [];
    protected beforeInsert = [];
    protected beforeUpdate = [];
    protected beforeDelete = [];


    public table = async()=> {
        return await (this.tableName?? this.constructor.name.toLowerCase() + "s").toString(); // derault tabl;
    }
    public primary_key = async ()=> { return await ( this.primaryKey ?? this.constructor.name.toLowerCase() + "_id").toString()}; // default primary key

    protected async Query(qry: string, arg = []) {
        const db = await pool.connect();
        try {
          const result = await db.query(qry, arg);
          const rows = await result.rows;
          const data = await this.afterSelectFunc(rows);
          return data;
        } catch (err) {
          // Check for specific error types (e.g., database errors, connection pool errors)
          console.error("Error occurred:", err); // Or use a proper logging mechanism
          // Handle recoverable errors (e.g., retry) or throw unrecoverable ones
          throw err;
        } finally {
          // Always release the connection back to the pool
          if (db) {
            await db.release();
          }
        }
      }
      

    // After seclect method get data and check the value of afterSelect property
    // run dynamic function name from property with the data and return the result.
    protected afterSelectFunc = async (data: any) => {
        if (data.length) {
            if (this.afterSelect && this.afterSelect.length) {
                for (let funcName of this.afterSelect) {
                    data = this[funcName](data);
                }
            }
            return data;
        }
        return false;
    }

    // This function gets data and runs function defiend in beforInsert array and return
    // the result the function as data.

    protected beforeInsertFunc = async (data: any) => {
        if (data.length) {
            if (this.beforeInsert && this.beforeInsert.length) {
                for (let funcName of this.beforeInsert) {
                    data = this[funcName](data);
                }
            }
            return data;
        }
        return false;
    }

    // This function get the data array and rund the function decleated in the
    // this.beforeUpdate array return the result data

    protected beforeUpdateFunc = (data: any) => {
        if (data.length) {
            if (this.beforeUpdate && this.beforeUpdate.length) {
                for (let funcName of this.beforeUpdate) {
                    data = this[funcName](data);
                }
            }
            return data;
        }
        return false;
    }

    // Thhis function get an array of column names and checks with the allowedColumns property of the object and returns only the column name that are allowed.
    private checkColumns = async (columns:any )=> {
        if (this.allowedColumns && this.allowedColumns.length) {
            return columns.filter((col: never) => this.allowedColumns.includes(col));
        }
        this.errors.message = "Allowed Column Names not decleared.";
        return false;
    }

    // This function get a table name as string and return its primary key by quering the Database.
    protected getPrimaryKey = async (tableName: string) => {
        let primaryKey = await this.Query(`SHOW KEYS from ${tableName} WHERE Key_name = 'primary'`);
        return primaryKey[0].Column_name;
    }

    // Here we are maping the column name array and sanitizing the name to pervent sql injection.
    protected cleanColumnName = async (columnNames: any) => {
        // Remove column name not allowed.
        columnNames = await this.checkColumns(columnNames);

        // Check if checkColumns return columns.
        if (columnNames.length) {
            // Check if input is an array
            if (!Array.isArray(columnNames)) {
                // Remove special characters except alphanumeric, underscore, and period
                return `'${columnNames.replace(/[^a-zA-Z0-9_\.]/g, "")}'`;
            } else {
                return columnNames.map(columnName => {
                    // Remove special characters except alphanumeric, underscore, and period
                    const sanitizedName = columnName.replace(/[^a-zA-Z0-9_\.]/g, "");
                    return `\`${sanitizedName}\``;
                });
            }
        }
        this.errors.message = "The column names are not allowed. Check you column names.";
        return false;
    }
}

