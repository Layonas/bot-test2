async function CreateSavingsStatus(){
    
    const { Client } = require('pg');

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
        });

    client.connect();
    //-----------------------------------------------------------------------------------

    const table = `CREATE table if not exists savings(
        money int,
        hourly int,
        hourlyClaimed bool,
        daily int,
        dailyClaimed bool,
        weakly int,
        weaklyClaimed bool,
        level int,
        gambled int,
        won int,
        lost int,
        playerId varchar(255)
        )`;

    await client.query(table).catch(err => console.log(err));

    client.end();
}

module.exports ={
    name: 'Savings',
    description: 'Database information associated with savings',
    CreateSavingsStatus
};