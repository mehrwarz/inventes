// Main model class
import { promises } from "dns";
import Database from "./Database";
import "./Functions";

export default class Model extends Database {
  protected fields = {};
  protected validation = {};

  private postgresWhereOperators = [
    "", "=", "<>", "!=", ">", "<", ">=", "<=", // Equality and Comparison Operators 
    "LIKE", "NOT LIKE", // Pattern Matching 
    "IS NULL", "IS NOT NULL", // NULL Comparison 
    "BETWEEN", "NOT BETWEEN", // Range Comparison 
    "AND", "OR", "NOT", // Logical Operators 
    "IN", "NOT IN", // Set Membership 
    "ANY", "ALL", // Subqueries
  ];

  public async where( clause: {}, op = "=", ord = "desc", limit = 500, offset = 0): Promise<any[]> {
    try {
      // Validate operator
      if (!this.postgresWhereOperators.includes(op.toUpperCase())) {
        throw new Error(`Invalid operator: ${op}`);
      }

      // Validate offset and limit (non-negative)
      if (offset < 0 || limit < 0) {
        throw new Error("Offset and limit must be non-negative");
      }

      // Extract columns and values from clause object
      const [columns, values] = [Object.keys(clause), Object.values(clause)];

      // Handle optional cleanColumnName function
      const cleanedColumns = await Promise.all(
        columns.map((col) =>
          this.cleanColumnName ? this.cleanColumnName(col) : col
        )
      );

      // Build WHERE clause and params dynamically
      let query = `SELECT * FROM ${this.table_name()} WHERE `;
      const params = [];

      const order = ord.replace(/[^a-zA-Z]/g, "");

      const whereClause = cleanedColumns.map((col, index) => `${col} ${op} $${index + 1}`).join(" AND ");
      query += `${whereClause} order by ${this.primary_key()} ${order} limit ${parseInt(limit)} offset ${parseInt(offset)}`;

      // Handle BETWEEN operator (if applicable)
      if (op.toUpperCase() === "BETWEEN") {
        params.push(...values[0]); // Add values for BETWEEN
      } else {
        params.push(...values); // Add remaining values
      }

      // Execute query with parameters
      const result = await this.Query(query, params);
      const data = await this.afterSelectFunc(result);
      if (data.length == 1) {
        return data[0];
      }
      return data;
    } catch (error) {
      console.error("Error in where method:", error);
      this.errors = { message: error };
      throw error; // Re-throw for further handling
    }
  }

  public async getAll(col: object, val: any, ord = "desc"): promises<any> {
    try {
      const column = this.cleanColumnName(col);
      const order = ord.replace(/[^a-zA-Z]/g, "");

      const query = `SELECT * FROM ${this.table_name()} WHERE ($1) = ($2) order by ${this.primary_key()} ${order}`;
      const data = await this.Query(stmt, [column, val, order]);
      return data;
    } catch (error) {
      console.error("Error in getAll method:", error);
      throw error; // Re-throw for further handling
    }
  }

  public get = async (lim = 500, offs = 0, ord = "desc") => {
    try {
      // Here we are makeing sure that the limit and offset values are only numbers. and the order is string only.
      
      const query = `SELECT * FROM ${this.table_name()} ORDER BY ${this.primary_key()} ($1) LIMIT $2 OFFSET $3`;
      const data = await this.Query(query, [ord, lim, offs]);
      return await this.afterSelectFunc(data);
    } catch (Err) {
      console.log("Error!", Err);
      throw Err; // Re-throw for further handling
    }
  };

  public innerJoin = async (table: string,id: any, col: string,value: any, order = "desc") => {
    const column = this.cleanColumnName(col);
    if (column) {
      const stmt = `SELECT * FROM ${this.table_name()} INNER JOIN (table) ON ${this.primary_key} = (table).(id) where (column) = (value) order by ${this.primary_key()} (order)`;
      const data = await this.Query(stmt, [table, id, column, value, order]);
      return await this.afterSelectFunc(data);
    }
    return false;
  };

  public async insert(inputData: any): Promise<object> {
    try {
      const data = await this.beforeInsertFunc(this.cleanColumnName(inputData));
      if (data.length > 0) {
        const keys = Object.keys(data);
        const columns = (await this.cleanColumnName(keys)) as never;
        const values = Object.values(data) as never;
        const query = `insert into ${this.table_name()} ($1) values ($2) retuning *;`;
        const result = await this.Query(query, [columns, values]);
        return result;
      }
      throw new Error("The given data did not passed data validation.");
    } catch (err) {
      console.log(err);
      throw new Error("Unable to store data. Database error");
    }
  }

  /**
   * This function gets and array or data object and create a sql update query.
   * @param Data array.
   * @param val string
   * @param col string | int
   * @returns object
   */

  public update = async (Data: any, val: string, col = "id") => {
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
  public createTable = async (del = false) => {
    if (del) {
      const exist = await this.Query(
        `select table_name from information_schema.tables where table_name = '${this.table_name()}'`
      );
      if (exist.length) {
        await this.Query("drop table " + this.table_name());
      }
    }

    const [columns, types]: Array<any> = [
      Object.keys(this.fields),
      Object.values(this.fields),
    ];

    let query = `CREATE TABLE IF NOT EXISTS ${this.table_name()} (`;

    for (let num in columns) {
      query += `${columns[num]} ${types[num]}`;
      if (columns.indexOf(columns[num]) < columns.length - 1) {
        query += ", ";
      }
    }
    query += `);`;
    await this.Query(query);
    await this.Query(
      `ALTER TABLE ${this.table_name()} ADD PRIMARY KEY (${this.primary_key()})`
    );
  };

  // End of the Model Class
}
