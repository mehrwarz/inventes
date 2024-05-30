// Main model class
import Database from "./Database";
import "./Functions";

export default class Model extends Database {
  // Static methods
  protected tableName: string;
  protected fields = {};
  protected allowedOperators = ["=", "<", ">", "<=", ">=", "<>"];
  protected validation = {};
  
  protected where = async (
    column: string,
    op: string,
    value: any,
    order = "desc",
    limit = 500,
    offset = 0
  ) => {
    if (this.allowedOperators.includes(op)) {
      const columnsName = await this.cleanColumnName(column);

      const stmt = `SELECT * from ${this.table} where ($) (op) ($) order by ($) ($) limit ($) offset ($)`;
      const data = await this.Query(stmt, [
        columnsName,
        op,
        value,
        this.primary_key,
        order,
        limit,
        offset,
      ]);

      return this.afterSelectFunc(data);
    }

    this.errors = { message: "Operation not allowd!" };

    return false;
  };

  protected first = async (col: any, val: any) => {
    let columnName = this.cleanColumnName(col);
    const stmt = `SELECT * FROM ${this.table} WHERE (columnName) = (val) limit 1;`;
    const data = await this.Query(stmt, [columnName, val]);
    if (data.length > 0) {
      return await this.afterSelectFunc(data);
    }
    return false;
  };

  protected getAll = async (col: object, val: any, ord = "desc") => {
    const column = this.cleanColumnName(col);
    const order = ord.replace(/[^a-zA-Z]/g, "");

    const stmt = `SELECT * FROM ${this.table} WHERE (column) = (value) order by (primaryKey) (order)`;
    const data = await this.Query(stmt, [column, val, this.primary_key, order]);
    if (data.length > 0) {
      return this.afterSelectFunc(data);
    }
    return false;
  };

        public get = async (lim = 500, offs = 0, ord = "desc") => {
          try{
            // Here we are makeing sure that the limit and offset values are only numbers. and the order is string only.
            const limit = lim.toString().replace(/[^0-9]/g, "");
            const offset = offs.toString().replace(/[^0-9]/g, "");
            const order = ord.replace(/[^a-zA-Z]/g, "");
            const PK = await this.primary_key();
            const TBL = await this.table();

            const query = `SELECT * FROM ${TBL} ORDER BY ${PK} ($1) LIMIT $2 OFFSET $3`;
            const data = await this.Query(query, [order, limit, offset]);
            
            console.log(data);

          // return await this.afterSelectFunc(data);
          } catch(Err){
            console.log("Error!" , Err.message);
            this.errors = Err.message;
            return Err;
          }
        };

  // public get = async (lim = 500, offs = 0, ord = "desc") => {
  //   try {
  //     const PK = await this.primary_key();
  //     const TBL = await this.table();
      
  //     // Prepare the statement (assuming your database library supports prepared statements)
  //     const query = `SELECT * FROM ${TBL} ORDER BY ${PK} ($1) LIMIT $2 OFFSET $3`;
  //     const values = [ord, lim, offs];
      
  //     const data = await this.Query(query, [ord, lim, offs]);
  //     console.log("data",data.rows)
  //     // ... (process data)
  //   } catch (err) {
  //     console.log("Error!", err.message);
  //     throw err;
  //     // ... (error handling)
  //   }
  // }
  

  protected innerJoin = async (
    table: string,
    id: any,
    col: string,
    value: any,
    order = "desc"
  ) => {
    const column = this.cleanColumnName(col);
    if (column) {
      const stmt = `SELECT * FROM ${this.table} INNER JOIN (table) ON ${this.primary_key} = (table).(id) where (column) = (value) order by ${this.primary_key} (order)`;
      const data = await this.Query(stmt, [table, id, column, value, order]);
      return await this.afterSelectFunc(data);
    }
    return false;
  };

  protected insert = async (inputData: any) => {
    const data = await this.beforeInsertFunc(this.cleanColumnName(inputData));

    if (data.length > 0) {
      const keys = Object.keys(data);
      const columns = this.cleanColumnName(keys);
      const values = Object.values(data);

      const query = `insert into ${this.table} (columns) values (values) retuning *;`;
      const result = await this.Query(query, [columns, values]);
      return result;
    }

    return false;
  };

  /**
   * This function gets and array or data object and create a sql update query.
   * @param Data array.
   * @param val string
   * @param col string | int
   * @returns object
   */

  protected update = async (Data: any, val: string, col = "id") => {
    let DATA = this.cleanColumnName(Data);
    let data = this.beforeUpdateFunc(DATA);
    if (data.length > 0) {
      let columns = Object.keys(data);
      let values = Object.values(data);
      let query = `UPDATE ${this.table} SET `;
      for (let i = 0; i < columns.length; i++) {
        query += `${columns[i]} = '${values[i]}'`;
        if (i < columns.length - 1) {
          query += ", ";
        }
      }
      query += ` WHERE ${col} = '${val}' RETURNING *;`;
      return await this.Query(query);
    }
    return false;
  };

  public delete = async (col: string, val: string) => {
    const column = await this.cleanColumnName(col);
    const query = "delete from ${this.table} where (col) = (val) returning *;";
    return await this.Query(query, [column, val]);
  };

  /**
   * Model should not be cloneable.
   */
  public clone(): never {
    throw new Error("Model should not be cloneable.");
  }

  /**
   * Model should not be restorable from strings.
   */
  public static fromString(): never {
    throw new Error("Model should not be restorable from strings.");
  }

  // Method to create table of the model in database and assign the primary key.
  public createTable = async () => {
    let query = `CREATE TABLE IF NOT EXISTS ${this.table} (`;
    let columns = Object.keys(this.fields);
    for (let column in columns) {
      query += `${column} ${this.fields[column]}`;
      if (columns.indexOf(column) < columns.length - 2) {
        query += ", ";
      }
    }
    query += `);`;

    await this.Query(query);
    // If primaryKey is not decleared this method concatinates the constractor name and _id as primary key column;
    let primaryKey =
      this.primaryKey ?? `${this.constructor.name.toLowerCase()}_id`;
    await this.Query(
      `ALTER TABLE ${this.table} ADD PRIMARY KEY (${this.primaryKey})`
    );
  };
}
