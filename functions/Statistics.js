module.exports = {
    name: 'Statistics',
    description: 'Gets all the statistics form all servers and sends through different functions',
    async execute(msg, args, BotID, stats, bot, OwnerID){

        if(msg.author.id === BotID) return;
        
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

        await client.query(createTableusers).catch(err => {console.error(err);}); //eslint-disable-line

        // Getting information about all previous levels
        const { rows } = await client.query('SELECT * FROM users');

        try {
            stats = rows[0].data;
        }catch(err){
            stats = {};
        }
        
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // If there were no previous guild or user in the database then they are added to it with additional information that should automaticly update
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
                MessageLength: 0,
            };
        }
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

        const userStats = serverStats[msg.author.id];

        const  previous_level = userStats.level;

        //fetch 10 messages
        //sort by id
        //check wether 3 or more messages are the same
        let spammers = [];
        let index = 0;
        await msg.channel.messages.fetch({cache: true, limit: 10})
        .then(messages => messages.each(m => spammers.push({id: m.author.id, content: m.content})))
        .catch(err => console.log('Error while trying to push to an array. \n' + err));
        for(var j = 0; j < spammers.length; j++){
            if(spammers[0].id === spammers[j].id)
                if(spammers[0].content === spammers[j].content)
                    {
                        index++;
                    }
        }
        if(index >= 3){
            console.log(`Spammer detected: `+spammers[0].id);
            return;
        }

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

        if(!userStats.MessageLength)
            userStats.MessageLength = msg.content.length;
        else userStats.MessageLength += msg.content.length; 
    }

        const current_level = userStats.level;
        //await jsonfile.writeFileSync(`./functions/JsonFiles/stats.json`, stats, { spaces: 2}); // uncomment this then run and see all the info in the database

        //console.log(stats);

        // Updating the json file
        await client.query("UPDATE users SET data = '" + JSON.stringify(stats) + "'").then(res => {console.log('Added succesfully');}).catch(err => {bot.users.get(OwnerID).send(`There has been an error with updating database : ${err}`);console.log(err);}); // eslint-disable-line

        //var text = jsonfile.readFileSync('./functions/JsonFiles/stats.json');
        
        //jsonfile.writeFileSync(`./functions/JsonFiles/stats1.json`, stats, { spaces: 2});

        
//------------------------------------------------------------------------------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Creating and adding roles to people who have met certain level requirements
    const guild = bot.guilds.cache.get('543848190995333152');
    if(msg.guild.id !== guild.id) return client.end();

    //----------------------------------------------------------
    // Getting new role info
    var role_data = await client.query('SELECT * FROM Roles');

    var Roles = role_data.rows[0].roles;
    //----------------------------------------------------------

    client.end();
    
    // var All_roles = {};
    // await GetRolePostition(All_roles, guild, Roles);

    //-----------------------------------------------------------------------------------
    // One time role checker for upcoming and gained levels
    // Need to read roles and get their positions the slice of unnecessary and calculate the position than is needed to be
    
    if(previous_level === current_level) return;
    if(userStats.level in Roles){
        var role_info = Roles[userStats.level];
        var previous_role_index; // number of previous role (the spot in an Object array)
        
        Object.keys(Roles).forEach((level, index) => {
            if(parseInt(level) === userStats.level && index !== 1) previous_role_index = index-1;
        }); // return the number
        var previous_role_array = Object.keys(Roles); // array of roles but not an object
        var previous_role = Roles[previous_role_array[previous_role_index]]; //Maybe gets the full object of the previous role
            if(!guild.roles.cache.find(r => r.name === role_info.name)){
                await guild.roles.create({
                    data: {
                        name: role_info.name,
                        color: role_info.color,
                        position: role_info.position,
                        permissions: ['SEND_MESSAGES'],
                        mentionable: true,
                        hoist: true
                    },
                    reason: `${msg.author.username} leveled up and now can have a new role.`,
                }).then(async () => {
                    bot.guilds.cache.get(process.env.GUILD).channels.cache.find(channel => channel.name === 'logs').send(`Created new role **${role_info.name}**`);

                    var All_roles = {};
                    await GetRolePostition(All_roles, guild, Roles);
                    var keys = Object.keys(All_roles);
                    //console.log(All_roles);
                    keys.forEach(async name =>{
                        if(guild.roles.cache.find(r => r.name === name)) await guild.setRolePositions([{role: guild.roles.cache.find(r => r.name === name).id, position: All_roles[name].position}])/*.then(console.log(`Changed (${name}) position to (${All_roles[name].position})`))*/.catch(err => {if(err) return;});
                    });
                    
                }).catch(err => console.log(err));
            }
        const member = guild.members.cache.get(msg.author.id);

        var member_role_previous = member.roles.cache.find(r => r.name === previous_role.name);
        // removing the previous role
        if (member_role_previous) member.roles.remove(member_role_previous); 
    
        //Adding the new role
        if(!member.roles.cache.find(r => r.name === role_info.name)) await member.roles.add(guild.roles.cache.find(r => r.name ===  role_info.name)).then(()=>{
            msg.channel.send('**' + msg.author.username + '**' + ' has been promoted to: **'+ role_info.name +'**');
        });
    }
        return;
    }
};  


async function GetRolePostition(All_roles, guild, Roles){
    guild.roles.cache.forEach(roles => {

        if(roles.name !== 'Feldwebel' && roles.name !== 'Fallschirmjäger' && roles.name !== 'Funker' && roles.name !== 'Gebirgsjäger' && roles.name !== 'Grenadier' && roles.name !== 'Panzergrenadier' && roles.name !== 'Tанкист' && roles.name !== 'AdvancingBot1'){
        if(roles.name in All_roles === false && roles.name !== undefined) {
            All_roles[roles.name] = {
            name: roles.name,
            level: 0,
            position: 0
        };
    }        
        if(All_roles[roles.name].name === '@everyone') {All_roles[roles.name].level = 0.1; All_roles[roles.name].position = 1;}
        if(All_roles[roles.name].name === 'Yuuki') {All_roles[roles.name].level = 0.2; All_roles[roles.name].position = 2;}
        if(All_roles[roles.name].name === 'Sanitäterin') {All_roles[roles.name].level = 1; All_roles[roles.name].position = 3;}
        if(All_roles[roles.name].name === 'Reichsleiter') {All_roles[roles.name].level = 2; All_roles[roles.name].position = 4;}
        if(All_roles[roles.name].name === 'Sturmpionier') {All_roles[roles.name].level = 3; All_roles[roles.name].position = 5;}
        if(All_roles[roles.name].name === 'Artillerist') {All_roles[roles.name].level = 4; All_roles[roles.name].position = 6;}
        if(All_roles[roles.name].name === 'Botting') {All_roles[roles.name].level = 4.2; All_roles[roles.name].position = 7;}
        if(All_roles[roles.name].name === 'GEIMERIAI') {All_roles[roles.name].level = 4.5; All_roles[roles.name].position = 8;}        
        
        Object.keys(Roles).forEach(level => {
            if(Roles[level].name === All_roles[roles.name].name) All_roles[roles.name].level = level;
        });        
        
    }
        
    });

    var keys = Object.keys(All_roles).sort((a, b) => {return All_roles[a].level - All_roles[b].level;});
    var unfinished_roles = {};
    keys.forEach(name =>{
        if(name in unfinished_roles === false) unfinished_roles[name] = All_roles[name];
    });
    

    var length = keys.length;

    for (let i = 0; i < length; i++) {
    unfinished_roles[keys[i]].position = i;
    }
    All_roles = unfinished_roles;


    var a = "";

        Object.keys(All_roles).forEach(async level => {
            a = a.concat(`\n**${All_roles[level].name}**`, ` position is **${All_roles[level].position}**.`);
        }); 
        await guild.channels.cache.find(c => c.name === 'logs').send(`Roles are sorted: ${a}`);

    return;
}