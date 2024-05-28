// Main model class
import Database from "./Database";

export class Model extends Database{
    // Static methods    
    public errors = [];
    public tableName = "";
    public primaryKey = "";

    private table = this.tableName??  this.constructor.name.toLowerCase() + 's'; // default table name
    private primary_key = this.primaryKey?? this.constructor.name.toLowerCase() + '_id'; // default primary key
    
    public where = async (column: any, value: any, order='desc', limit=500, offset=0) => {
        const columnsName = this.cleanColumnName(column);

        const stmt = `SELECT * from ${this.table} where ($) = ($) order by ($) ($) limit ($) offset ($)`;
        const data = await this.Query( stmt, [columnsName,value,this.primary_key,order,limit,offset] );
        
        return this.afterSelect(data);
    }
    
    public first = async (col:any, val: any)=>{
        let columnName = this.cleanColumnName(col);        
        const stmt = `SELECT * FROM ${this.table} WHERE (columnName) = (val) limit 1;`;
        const data = await this.Query(stmt,[columnName,val]);
        if( data.length > 0 ){
            return this.afterSelect(data);       
        }
        return false;
    }

    public getAll = async (col: object, val: any, ord = 'desc') => {
        const column = this.cleanColumnName(col);
        const order = ord.replace(/[^a-zA-Z]/g, "");
        
        const stmt = `SELECT * FROM ${this.table} WHERE (column) = (value) order by (primaryKey) (order)`;
        const data = await this.Query(stmt,[column,val,this.primary_key,order]);
        if(data.length > 0 ){
            return this.afterSelect(data);        
        }
        return false;
    }
    
    public get = async(lim = 500,offs=0,ord="desc") => {
        // Here we are makeing sure that the limit and offset values are only numbers. and the order is string only.
        const limit = lim.toString().replace(/[^0-9]/g, "");
        const offset = offs.toString().replace(/[^0-9]/g, "");
        const order = ord.replace(/[^a-zA-Z]/g, "");
                
        const stmt = `select * from ${this.table} order by (primaryKey) (order) limit (limit) offset (offset)`;
        const data = await this.Query(stmt,[this.primary_key, order,limit,offset]);
        return this.afterSelect(data);
    }
    
    public innerJoin = async (table: string, id: any, col: string, value: any, order='desc') => {
        const column = this.cleanColumnName(col);
        const stmt = `SELECT * FROM ${this.table} INNER JOIN (table) ON ${this.primary_key} = (table).(id) where (column) = (value) order by ${this.primary_key} (order)` ;
      
        const data = await this.Query( stmt, [table,id,column,value,order] );
        return await this.afterSelect(data);
    }

    public insert  = async (inputData: any) =>{
        const data = this.beforeInsert(this.checkColumns(inputData) );

        if(data.length > 0){
            const keys = Object.keys(data);
            const columns = this.cleanColumnName(keys);
            const values = Object.values(data);
            
            const query = await `insert into ${this.table} (columns) values (values) retuning *;`;
            const result = await this.Query(query,[columns,values]);
            return result;
        }
        return false;
    }
    

    /**
     * This function gets and array or data object and create a sql update query.
     * @param Data array.
     * @param val string
     * @param col string | int
     * @returns object
     */

    public update = async(Data:any,val:string, col='id') => {
        let DATA = this.checkColumns(Data);
        let data = this.beforeUpdate(DATA);
        if(data.length > 0){
            let columns = Object.keys(data);
            let values = Object.values(data);
            let query = `UPDATE ${this.table} SET `;
            for(let i = 0; i < columns.length; i++){
                query += `${columns[i]} = '${values[i]}'`;
                if(i < columns.length - 1){
                    query += ', ';
                }
            }
            query += ` WHERE ${col} = '${val}' RETURNING *;`;
            return await this.Query(query);
        }
        return false;
    }

    
    public delete = async(col: string,val: string) => {
        const column = await this.cleanColumnName(col);
        const query = "delete from ${this.table} where (col) = (val) returning *;";
		return this.Query(query,[column,val]);
    }
    
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
}

  