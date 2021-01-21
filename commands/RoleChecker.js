const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'RoleChecker',
    alias: ['roles', 'checkroles', 'RoleChecker', 'Roles', 'rolec'],
    usage: '!<alias>',
    example: '!RoleChecker',
    description: 'Checks the roles and send them to the channel.',
    async execute(msg){
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

        let embed = new MessageEmbed()
        .setThumbnail(msg.author.avatarURL())
        .setTitle('Roles')
        .setFooter('More roles can be added so you can suggest with !lr <name> <level>', msg.guild.members.cache.get(process.env.USER_BOT).user.avatarURL())
        .setColor('RANDOM')
        .setDescription(`${Roles.map((roles) => `**${Role_info[roles].name}** nuo **${Role_info[roles].min_level}** iki **${Role_info[roles].max_level}** lygio **${Role_info[roles].color}**`).join('\n')}`)
        .setAuthor(msg.guild.members.cache.get(process.env.USER_OWNER).user.username, msg.guild.members.cache.get(process.env.USER_OWNER).user.avatarURL());


        msg.channel.send(embed);

        return client.end();
    }
};