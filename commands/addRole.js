module.exports = {
    name: 'addRole',
    alias: ['addRole', 'aR', 'Roleadd', 'ar', 'arole', 'ARole', 'Arole', 'addrole'],
    usage: `!<alias> <name> <min_level> <max_level> <color> <position>`,
    example: '!addRole',
    description: 'Adds a role to the database and auto updates the bot with new roles.',
    async execute(msg, args, OwnerID){
        //-------------------------------------------------
        const {Client} = require('pg');
        const jsfile = require('jsonfile'); // eslint-disable-line
        //-------------------------------------------------
        if(msg.author.id !== OwnerID) {
            msg.Delete(3000);
            return msg.reply('Neturite teisių!');
        }
        //-------------------------------------------------
        //Connencting to the database
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
            });

        client.connect();
        //-------------------------------------------------

        // Creating a table
        var createTableRoles = `CREATE TABLE IF NOT EXISTS Roles(
            id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            roles json NOT NULL
            )`;

        await client.query(createTableRoles);

        //-------------------------------------------------
        // Extracting info from DB
        const {rows} = await client.query(`SELECT * FROM Roles`);

        var Roles = {}; 

        try {
            Roles = rows[0].roles;
        } catch (error) {
            Roles = {};
        }

        //one time use to add existing roles
        //Roles = jsfile.readFileSync('./functions/JsonFiles/Roles.json');
        //-------------------------------------------------

        var Role_name = args[1].replace(/_/gi, ' ');

        if(isNaN(args[2])) {
            client.end();
            return msg.reply(`${this.usage}`);
        }

        if(args[2] in Roles === false){
            Roles[args[2]] = {
                name: '',
                min_level: 0,
                max_level: 0,
                color: '',
                position: 0
            };
        }   

        var setting = Roles[args[2]];

        if(isNaN(args[3])){
            setting.name = Role_name;
            setting.max_level = 0;
            setting.min_level = args[2];
            setting.color = args[3];
            setting.position = args[4];
        } else {
            setting.name = Role_name;
            setting.min_level = args[2];
            setting.max_level = args[3];
            setting.color = args[4];
            setting.position = args[5];
        }   

        // one time use to push existing roles to DB
        //await client.query('DELETE FROM Roles');
        //await client.query('INSERT INTO Roles(roles) values($1)', [Roles]);
        await client.query("UPDATE Roles SET roles = '" + JSON.stringify(Roles) + "'").then(() => {msg.reply('Naują rolę pavyko pridėti.'); console.log('Successfully added new role');}).catch(err => console.log(err));

        //jsfile.writeFileSync('./functions/JsonFiles/Roles.json', Roles, {spaces: 2});

        client.end();
    }
};