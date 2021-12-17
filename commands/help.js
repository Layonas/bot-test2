module.exports = {
    name: 'help',
    alias: ['help'],
    usage: '!<alias> <command_name>',
    example: '!help play',
    description: 'send all available commands',
    async execute(msg, args, bot, interaction, player){ // eslint-disable-line
//----------------------------------------------------------------
const DC = require('discord.js');
const owner = msg.guild.members.cache.get(process.env.USER_OWNER);
const fs = require('fs');
var CommandFiles = [];
//----------------------------------------------------------------
    const c = fs.readdirSync('./commands/').filter( file => file.endsWith('js'));


    for (const files of c){
        if(files !== 'help.js')
            CommandFiles.push(files.slice(0, files.length-3));
    }
            
    if (!args[1]){
        msg.reply(CommandFiles.join(', '));
        msg.reply(`Dėl papildomos informacijos, kaip veikia komanda, prašome parašyti
**!help <komandos_pavadinimas>**
__Pavyzdys__ -- !help play`);

    let embed = new DC.MessageEmbed()// eslint-disable-line
    .setColor('BLUE')
    .setThumbnail(owner.user.avatarURL())
    .setTitle('Information')
    .setDescription(`Kūrėjas: **${owner.user.username}**
    Boto pavadinimas: **${msg.guild.members.cache.get(process.env.USER_BOT).user.username}**
    Versija: **2.1.0**`); 
    return msg.channel.send({embeds: [embed]});
}

var command;
command = require(`./${args[1]}.js`);

    if (command)
    {
        var embed;

        embed = new DC.MessageEmbed()
        .setColor('RANDOM')
        .setFooter('Komandų informacija gali keistis!', msg.guild.members.cache.get(process.env.USER_BOT).user.avatarURL())
        .setAuthor(owner.user.username, owner.user.avatarURL())
        .setThumbnail(msg.author.avatarURL())
        .addField('Pavadinimas: ', command.name)
        .addField('Alias: ', command.alias.join(', '))
        .addField('Naudojimas', command.usage)
        .addField('Pavyzdys', command.example)
        .addField('Aprašymas', command.description)
        .setTitle('Informacija apie komandą');

        msg.channel.send({embeds: [embed]});
    }

return;
}
};