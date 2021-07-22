module.exports = {
    name: 'RoleChecker',
    alias: ['roles', 'checkroles', 'RoleChecker', 'Roles', 'rolec'],
    usage: '!<alias>',
    example: '!RoleChecker',
    description: 'Checks the roles and send them to the channel.',
    async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
        const {Client} = require('pg');

        const client = new Client ({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });

        client.connect();

        const {rows} = await client.query('SELECT * FROM Roles');

        const Role_info = rows[0].roles;

        var Roles = [];
        Object.keys(Role_info).forEach(role => Roles.push(role));

        var count = Math.ceil(Roles.length/30);

        if(holder !== true)
            await msg.reply(
`There are currently ${count} pages.
Choose which page you want to see:`);
        else
            await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                content: 
`There are currently ${count} pages.
Choose which page you want to see:`
            }}});

        const filter = message => message.author.id === msg.author.id && message.content > 0 && message.content <= count;

        var response = await msg.channel.awaitMessages(filter, {max: 1, time: 10000});

        if(!response) return;

        let rolesHold = Roles.slice(0+30*(response.first().content-1), 30*response.first().content);

            let embed = new MessageEmbed()
            .setThumbnail(msg.author.avatarURL())
            .setTitle('Roles')
            .setFooter('More roles can be added so you can suggest with !lr <name> <level>', msg.guild.members.cache.get(process.env.USER_BOT).user.avatarURL())
            .setColor('RANDOM')
            .setDescription(`${rolesHold.map((roles, index) => `**${index+1}.** **${Role_info[roles].name}** nuo **${Role_info[roles].min_level}** iki **${Role_info[roles].max_level}** lygio **${Role_info[roles].color}**`).join('\n')}`)
            .setAuthor(msg.guild.members.cache.get(process.env.USER_OWNER).user.username, msg.guild.members.cache.get(process.env.USER_OWNER).user.avatarURL());

            await msg.channel.send(embed);

        return client.end();
    }
};