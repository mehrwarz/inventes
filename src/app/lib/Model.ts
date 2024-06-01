// Main model class
import Database from "./Database";
import "./Functions";

export default class Model extends Database {
  protected fields = {};
  protected validation = {};
  protected allowedColumns = Array();
  protected postgresWhereOperators = [
    '','=', '<>', '!=', '>', '<', '>=', '<=', // Equality and Comparison Operators
    'LIKE', 'NOT LIKE', // Pattern Matching
    'IS NULL', 'IS NOT NULL', // NULL Comparison
    'BETWEEN', 'NOT BETWEEN', // Range Comparison
    'AND', 'OR', 'NOT', // Logical Operators
    'IN', 'NOT IN', // Set Membership
    'ANY', 'ALL' // Subqueries
  ];

  protected postgresWhereOperators = [
    '', '=', '<>', '!=', '>', '<', '>=', '<=', // Equality and Comparison Operators
    'LIKE', 'NOT LIKE', // Pattern Matching
    'IS NULL', 'IS NOT NULL', // NULL Comparison
    'BETWEEN', 'NOT BETWEEN', // Range Comparison
    'AND', 'OR', 'NOT', // Logical Operators
    'IN', 'NOT IN', // Set Membership
    'ANY', 'ALL' // Subqueries
  ];
  
  protected async where(clause: {}, op = '=', order = "desc", limit = 500, offset = 0): Promise<any[]> {
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
      const [columns,values] = [Object.keys(clause),Object.values(clause)];
  
      // Handle optional cleanColumnName function
      const cleanedColumns = await Promise.all(
        columns.map(col => (this.cleanColumnName ? this.cleanColumnName(col) : col))
      );
  
      // Build WHERE clause and params dynamically
      let query = `SELECT * FROM ${this.table_name()} WHERE `;
      const params = [];
  
      const whereClause = cleanedColumns.map((col, index) => `${col} ${op} $${index + 1}`).join(' AND ');
      query += `${whereClause} order by ${this.primary_key()} ${order} limit ${parseInt(limit)} offset ${parseInt(offset)}`;
  
      // Handle BETWEEN operator (if applicable)
      if (op.toUpperCase() === 'BETWEEN') {
        params.push(...values[0]); // Add values for BETWEEN
      } else {
        params.push(...values); // Add remaining values
      }
  
      console.log(query, params);
  
      // Execute query with parameters
      const result = await this.Query(query, params);
      const data = await this.afterSelectFunc(result);
      return data;
    } catch (error) {
      console.error("Error in where method:", error);
      throw error; // Re-throw for further handling
    }
  };
  


  protected getAll = async (col: object, val: any, ord = "desc") => {
  const column = this.cleanColumnName(col);
  const order = ord.replace(/[^a-zA-Z]/g, "");

  const query = `SELECT * FROM ${TBL} WHERE (column) = (value) order by (primaryKey) (order)`;
  const data = await this.Query(stmt, [column, val, this.primary_key, order]);
  if (data.length > 0) {
    return this.afterSelectFunc(data);
  }
  return false;
};

  public get = async (lim = 500, offs = 0, ord = "desc") => {
  try {
    // Here we are makeing sure that the limit and offset values are only numbers. and the order is string only.
    const limit = lim.toString().replace(/[^0-9]/g, "");
    const offset = offs.toString().replace(/[^0-9]/g, "");
    const order = ord.replace(/[^a-zA-Z]/g, "");
    const PK = await this.getPrimaryKey();
    const TBL = await this.getTableName();

    const query = `SELECT * FROM ${TBL} ORDER BY ${PK} ($1) LIMIT $2 OFFSET $3`;
    const data = await this.Query(query, [order, limit, offset]);

    console.log(data);

    // return await this.afterSelectFunc(data);
  } catch (Err) {
    console.log("Error!", Err.message);
    this.errors = Err.message;
    return Err;
  }
};


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
