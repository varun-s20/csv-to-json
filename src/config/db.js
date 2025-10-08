import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})

const connectToDB = async() => {
    try{
        await pool;
        console.log("Connected to the database succesfully")
    }
    catch(error){
        console.error("Error connecting to the database", err);
        process.exit(1);
    }
}

export const query = (text, params) => pool.query(text, params);

export default connectToDB;