const { OwnerID } = require('../config');

module.exports = {
    name: 'Statistics',
    description: 'Gets all the statistics form all servers and sends throung different functions',
    async execute(msg, args, BotID, stats, bot, CommandCooldown){

        if(msg.author.id === BotID) return;

        if (CommandCooldown.has(msg.author.id)) return;

        //-----------------------------------------------------------------------------------
        // Additional variables
        const fs = require('fs'); //eslint-disable-line
        const jsonfile = require('jsonfile'); //eslint-disable-line
        const random = require('random');
        const { Client } = require('pg');
        //-----------------------------------------------------------------------------------

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

        const createTableusers = `CREATE TABLE IF NOT EXISTS users(
            id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            data json NOT NULL
        )`;

        await client.query(createTableusers).then(res => {console.log('Succesfully created new table users');}).catch(err => {console.error(err);}); //eslint-disable-line

        // Checking if stats.json exists
        // Have to change to check if there is something on the database
        // if(fs.existsSync(`./functions/JsonFiles/stats1.json`)){
        //     stats = jsonfile.readFileSync('./functions/JsonFiles/stats1.json');
        // } 

        // Getting information about all previous levels
        const { rows } = await client.query('SELECT * FROM users');
        //let xp = await client.query('SELECT data FROM users');
        //stats = xp.rows[0].data;

        //console.log(rows);

        try {
            stats = rows[0].data;
        }catch(err){
            stats = {};
        }

        //console.log(stats);

        // Checking for the information and making so it would be just a object of json type
        // var new_stats = JSON.stringify(stats);
        // if(new_stats.length > 10) stats = JSON.parse(new_stats.slice(9, new_stats.length-2));
        // else stats = {};  
        

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // If there were no previous guild or user in the stats.json file then they are added to it with additional information that should automaticly update
        if(msg.guild.id in stats === false){
            stats[msg.guild.id] = {
                name: msg.guild.name,
                guild_id: msg.guild.id
            };
        }

        const serverStats = stats[msg.guild.id];

        if(msg.author.id in serverStats === false){
            serverStats[msg.author.id] = {
                name: msg.author.username,
                user_id: msg.author.id, 
                OverallXp: 0,
                CurrentXp: 0,
                level: 0,
                Next_Level_At: 0,
                xpToNextLevel: 0,
                MessagesSent: 0,
                Last_message: 0,
            };
        }
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

        const userStats = serverStats[msg.author.id];

        if(Date.now() - userStats.Last_message >= 5000 || msg.author.id === OwnerID){
            
        if(msg.author.id === OwnerID) var amount = random.int(15, 25) + msg.content.length; // new variable so that the amount of xp for current and overall would be the same
        else if(msg.content.length >= 200) var amount = random.int(15, 25) + 200; // eslint-disable-line
        else var amount = random.int(15, 25) + msg.content.length; // eslint-disable-line

        userStats.CurrentXp += amount;
        userStats.OverallXp +=  amount;

        userStats.MessagesSent++;

        if(msg.attachments.size > 0){
            amount = msg.attachments.size * random.int(30, 55);

            userStats.CurrentXp += amount;
            userStats.OverallXp += amount;
        }

        userStats.Next_Level_At = 3 * Math.pow(userStats.level, 2) + 100 * userStats.level + 100;
        

        if(userStats.CurrentXp >= userStats.Next_Level_At){
            userStats.CurrentXp -= userStats.Next_Level_At;
            userStats.level++;
            userStats.Next_Level_At = 3 * Math.pow(userStats.level, 2) + 100 * userStats.level + 100;
            msg.channel.send(`**${msg.author.username} pasiekė ${userStats.level} lygį!**`);
        }
        
        userStats.xpToNextLevel = (3 * Math.pow(userStats.level, 2) + 100 * userStats.level + 100) - userStats.CurrentXp;

        userStats.Last_message = Date.now();
    }

        //await jsonfile.writeFileSync(`./functions/JsonFiles/stats.json`, stats, { spaces: 2}); // uncomment this then run and see all the info in the database

        //console.log(stats);

        // Updating the json file
        await client.query("UPDATE users SET data = '" + JSON.stringify(stats) + "'").then(res => {console.log('Added succesfully');}).catch(err => {bot.users.get('279665080000315393').send(`${err}`);console.log(err);}); // eslint-disable-line

        //var text = jsonfile.readFileSync('./functions/JsonFiles/stats.json');
        
        //jsonfile.writeFileSync(`./functions/JsonFiles/stats1.json`, stats, { spaces: 2});

        
//------------------------------------------------------------------------------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Creating and adding roles to people who have met certain level requirements

    const guild = bot.guilds.get('543848190995333152');

    //----------------------------------------------------------
    // Getting new role info
    var role_data = await client.query('SELECT * FROM Roles');

    var Roles = role_data.rows[0].roles;
    //----------------------------------------------------------

    client.end();

    //-----------------------------------------------------------------------------------
    // One time role checker for upcoming and gained levels

    if(userStats.level in Roles){
        var role_info = Roles[userStats.level];
        var previous_role_index; // number of previous role (the spot in an Object array)
        
        Object.keys(Roles).forEach((level, index) => {
            if(parseInt(level) === userStats.level) previous_role_index = index-1;
        }); // return the number
        var previous_role_array = Object.keys(Roles); // array of roles but not an object
        var previous_role = Roles[previous_role_array[previous_role_index]]; //Maybe gets the full object of the previous role
            if(!guild.roles.find(r => r.name === role_info.name)){
                await guild.createRole({
                    name: role_info.name,
                    color: role_info.color,
                    position: role_info.position,
                    permissions: ['SEND MESSAGES'],
                    mentionable: true,
                    hoist: true
                }).then(process.env.LOG_CHANNEL.send(`Created new role **${role_info.name}**`)).catch(err => console.log(err));
            }
        const member = guild.members.get(msg.author.id);
        //Adding the new role
        if(!member.roles.find(r => r.name === role_info.name)) member.addRole(guild.roles.find(r => r.name ===  role_info.name));

        var member_role_previous = member.roles.find(r => r.name === previous_role.name);
        // removing the previous role
        if (member_role_previous) member.removeRole(member_role_previous);
        
        // Deleting the role if there is no user in it
        if(guild.roles.find(r => r.name === previous_role.name) !== null && guild.roles.find(r => r.name === previous_role.name).members.size === 0) guild.roles.find(r => r.name === previous_role.name).delete();

    }

        return;
    }
};