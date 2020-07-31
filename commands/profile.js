module.exports = {
    name: 'profile',
    alias: ['profile', 'prof'],
    description: 'Lets people see what level and other stuff they have like xp from the database',
    async execute(msg, args, BotID){
        //---------------------------------------------------------
        const { RichEmbed } = require('discord.js');
        const { Client } = require('pg');
        //---------------------------------------------------------

        //---------------------------------------------------------
        // Connecting to the database
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        });

        client.connect();
        //---------------------------------------------------------

        if(!args[1]){

            const { rows } = await client.query('SELECT data FROM users');
            var stats = rows;
            var new_stats = JSON.stringify(stats);
            stats = JSON.parse(new_stats.slice(9, new_stats.length-2));

            var serverStats =  stats[msg.guild.id];
            var userStats = serverStats[msg.author.id];

            var embed = new RichEmbed()
            .setImage('https://i.pinimg.com/474x/64/89/35/64893517cd0fad84c451c85b135ee091.jpg')
            .setAuthor(msg.author.username)
            .setColor('RANDOM')
            .setTitle('Informacija apie tave')
            .setThumbnail(msg.author.avatarURL)
            .addField('Dabartinis XP: ', userStats.CurrentXp, true).addField('Visas XP: ', userStats.OverallXp, true)
            .addField('Tavo dabartinis lygis yra: ', userStats.level, true)
            .addField('Iki kito lygio tau trūksta: ', userStats.xpToNextLevel, true)
            .setFooter('Tu gali pakeisti arba pašalinti didžiają nuotrauką! ', msg.guild.members.get(BotID).user.avatarURL);

            msg.channel.send(embed);
            return client.end();
        } else if(args[1].toLowerCase() === 'xp'){

            const { rows } = await client.query('SELECT data FROM users');
            var stats = rows; //eslint-disable-line
            var new_stats = JSON.stringify(stats); //eslint-disable-line
            stats = JSON.parse(new_stats.slice(9, new_stats.length-2));

            var serverStats =  stats[msg.guild.id]; //eslint-disable-line
            var userStats = serverStats[msg.author.id]; //eslint-disable-line

            msg.reply(`Tu dabar turi **${userStats.CurrentXp}**, iš viso turi **${userStats.OverallXp}**`);

            return client.end();
        } else if(args[1].toLowerCase() === 'level' || args[1].toLowerCase() === 'lygis' || args[1].toLowerCase() === 'l' ||args[1].toLowerCase() === 'lvl'){

            const { rows } = await client.query('SELECT data FROM users');
            var stats = rows; //eslint-disable-line
            var new_stats = JSON.stringify(stats); //eslint-disable-line
            stats = JSON.parse(new_stats.slice(9, new_stats.length-2));

            var serverStats =  stats[msg.guild.id]; //eslint-disable-line
            var userStats = serverStats[msg.author.id]; //eslint-disable-line

            msg.reply(`Tavo lygis yra **${userStats.level}**`);

            return client.end();
        }else if(args[1].toLowerCase() === 'update' || args[1].toLowerCase() === '-u'){
            msg.reply('Dar statomas :)');

            return client.end();
        }

    }
};