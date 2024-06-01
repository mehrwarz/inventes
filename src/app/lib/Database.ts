
import pool from "@/app/lib/Connection";

export default class Database {
    public errors = {};
    protected allowedColumns = [];
    protected afterSelect = [];
    protected afterInsert = [];
    protected afterUpdate = [];
    protected afterDelete = [];
    protected beforeSelect = [];
    protected beforeInsert = [];
    protected beforeUpdate = [];
    protected beforeDelete = [];
    protected tableName: string;
    protected primaryKey: string;
    public table_name = () => (this.tableName ?? this.constructor.name.toLowerCase() + "s").toString(); // default tabl;
    public primary_key = () => (this.primaryKey ?? this.constructor.name.toLowerCase() + "_id").toString(); // default primary key

    protected async Query(qry: string, arg = []): Promise<any[]> {
        const client = await pool.connect();

        try {
            const result = await client.query(qry, arg);
            const rows = result.rows; // Extract rows from the result
            const data = await this.afterSelectFunc(rows); // Process data

            return data;
        } catch (err) {
            // Check for specific error types
            if (err.name === 'QueryResultError') {
                console.error("Error executing query:", err.message); // Log specific error message
                // Handle query execution errors (e.g., syntax errors, constraint violations)
                throw new Error("Error executing query. See logs for details."); // Re-throw for further handling
            } else if (err.name === 'PoolError') {
                console.error("Error connecting to database pool:", err.message);
                // Handle connection pool errors (e.g., pool exhaustion, connection issues)
                throw new Error("Error connecting to database. See logs for details."); // Re-throw for further handling
            } else {
                console.error("Unexpected error:", err);
                // Handle unexpected errors
                throw err; // Re-throw for further handling
            }
        } finally {
            // Always release the connection back to the pool
            if (client) {
                await client.release();
            }
        }
    }


    // Thhis function get an array of column names and checks with the allowedColumns property of the object and returns only the column name that are allowed.
    private checkColumns = async (columns: any) => {
        if (this.allowedColumns.length && this.allowedColumns.includes(columns)) {
            return columns;
        }
        throw `The column name "${columns} " is pervented.`;
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
                return columnNames.replace(/[^a-zA-Z0-9_\.]/g, "");
            } else {

                return columnNames.map(columnName => {
                    // Remove special characters except alphanumeric, underscore, and period
                    const sanitizedName = columnName.replace(/[^a-zA-Z0-9_\.]/g, "");
                    return sanitizedName;
                });
            }
        }
        throw `The column name/s are not allowed for this model.`;
    }

    // This method get data and function name and calls the function with the given data
    //retuns the result.


    protected async function runModelFunctions(data: any[], funcArrayName: string): Promise<any[]> {
        if (!this[funcArrayName] || !this[funcArrayName].length) {
            return data; // No functions defined in the array, return data directly
        }

        try {
            // Loop through function names
            for (const funcName of this[funcArrayName]) {
                if (typeof this[funcName] !== 'function') {
                    console.warn(`${funcArrayName} function "${funcName}" does not exist. Skipping.`);
                    continue; // Skip non-existent functions
                }
                data = await this[funcName](data); // Call the function with data
            }
            return data;
        } catch (error) {
            console.error("Error in runAfterFunctions:", error);
            // Handle errors from after-functions (e.g., log, throw)
            throw error; // Re-throw for further handling
        }
    }



    // This function gets data nd runs function defiend in afterSelectFunc array and return
    // the result.

    protected async afterSelectFunc(data: object | any[]): Promise<any[]> {
        return await this.runAfterFunctions(data, 'afterSelect');
    }

    // This function gets data nd runs function defiend in afterInsertFunc array and return
    // the result.

    protected async afterInsertFunc(data: object | any[]): Promise<any[]> {
        return await this.runAfterFunctions(data, 'afterInsert');
    }

    // This function gets data nd runs function defiend in afterUpdateFunc array and return
    // the result.

    protected async afterUpdateFunc(data: any): Promise<any[]> {
        return await this.runAfterFunctions(data, 'afterUpdate');
    }


    // This function gets data nd runs function defiend in afterDeleteFunc array and return
    // the result
    protected async afterDeleteFunc(data: any): Promise<any[]> {
        return await this.runAfterFunctions(data, 'afterDelete');
    }

    // This function gets data nd runs function defiend in beforeSelect array and return
    // the result
    protected async beforeSelectFunc(data: object | any[]): Promise<any[]> {
        return await this.runBeforeFunctions(data, 'beforeSelect');
    }
    // This function gets data nd runs function defiend in beforeInsert array and return
    // the result
    protected async beforeInsertFunc(data: object | any[]): Promise<any[]> {
        return await this.runBeforeFunctions(data, 'beforeInsert');
    }
    // This function gets data nd runs function defiend in beforeUpdate array and return
    // the result
    protected async beforeUpdateFunc(data: any): Promise<any[]> {
        return await this.runBeforeFunctions(data, 'beforeUpdate');
    }
    // This function gets data nd runs function defiend in beforeDelete array and return
    // the result
    protected async beforeDeleteFunc(data: any): Promise<any[]> {
        return await this.runBeforeFunctions(data, 'beforeDelete');
    }
    // This function runs all functions in array and return result  
    private async runBeforeFunctions(data: any, type: string): Promise<any[]> {
        let result = [];
        for (let func of this.beforeFunctions[type]) {
            let res = await func(data);
            result.push(res);
        }
        return result;
    }
}