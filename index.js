const Cursor = require("pg-cursor");
const {Pool} = require("pg");
const Args = process.argv.slice(2);
console.log('Args : ',Args);

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    password:"1234",
    database: "Banco",
    port: 5432,
});
// const pool = new Pool(config);

async function consultacuenta(){
pool.connect(async(error_conexion, client, release) => {

    try{
    const consulta = new Cursor('select * from cuentas;');
    const cursor = client.query(consulta);
    cursor.read(10, (err,rows)=>{
        console.log(rows);
        cursor.close();

    });
    

    }catch (e) {

        console.log("Error código: " + e.code);
        console.log("Detalle del error: " + e.detail);
        console.log("Tabla originaria del error: " + e.table);
        console.log("Restricción violada en el campo: " + e.constraint);

    }
        release();
        pool.end();
});   
}


async function transaccion () {
pool.connect(async(error_conexion, client, release) => {
    await client.query("BEGIN");
    try{
    
    const transaccion = {
        name: "transaccion",
        rowMode: "array",
        text: "INSERT INTO transacciones (descripcion,fecha,monto,cuenta) VALUES($1,$2,$3,$4) RETURNING * ;",
        values:[Args[1],Args[2],Args[3],Args[4]]
    };
    await client.query(transaccion);
    console.log("Último registro : ",res.rows[0]);
    }catch (e) {
       
        await client.query("ROLLBACK");
        console.log("Error código: " + e.code);
        console.log("Detalle del error: " + e.detail);
        console.log("Tabla originaria del error: " + e.table);
        console.log("Restricción violada en el campo: " + e.constraint);

    }
    release();
    pool.end();
});
};

switch(Args[0]){

    case 'transaccion' :
        await transaccion();
    break;

    case 'consulta' :
         await consultacuenta();
    break;


    default : 
    console.log('No se reconoció la operación');
};