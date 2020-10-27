module.exports = {
    name: 'help',
    alias: ['help'],
    usage: '!<alias> <command_name>',
    example: '!help play',
    description: 'send all available commands',
    execute(msg, args){
//----------------------------------------------------------------
const DC = require('discord.js');
const owner = msg.guild.members.get('279665080000315393');
const fs = require('fs');
var CommandFiles = [];
//----------------------------------------------------------------
            const commandFiles = fs.readdirSync('./commands/').filter( file => file.endsWith('js'));

            for (const files of commandFiles){
                CommandFiles.push(files.slice(0, files.length-3));
            }

             
            
       if (!args[1]){
        msg.reply(CommandFiles.join(', '));
        msg.reply(`Dėl papildomos informacijos, kaip veikia komanda, prašome parašyti
**!help <komandos_pavadinimas>**
__Pavyzdys__ -- !help info`);

let embed = new DC.RichEmbed()// eslint-disable-line
.setColor('BLUE')
.setThumbnail(owner.user.avatarURL)
.setTitle('Information')
.setDescription(`Kūrėjas: **${owner.user.username}**
Boto pavadinimas: **${msg.guild.members.get('672836310175711273').user.username}**
Versija: **1.3.5**`); 
        msg.channel.send(embed);

       }

    const command = require(`./${args[1]}.js`);
    let embed = new DC.RichEmbed()
    .setColor('RANDOM')
    .setFooter('Komandų informacija gali keistis!', msg.guild.members.get('672836310175711273').user.avatarURL)
    .setAuthor(owner.user.username, owner.user.avatarURL)
    .setThumbnail(msg.author.avatarURL)
    .addField('Pavadinimas: ', command.name)
    .addField('Alias: ', command.alias.join(', '))
    .addField('Naudojimas', command.usage)
    .addField('Pavyzdys', command.example)
    .addField('Aprašymas', command.description)
    .setTitle('Informacija apie komandą');

    msg.channel.send(embed);


return;
}
};