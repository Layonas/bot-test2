module.exports = {
name: 'removeCooldown',
alias: ['rc', 'removeCooldown', 'removec', 'removecooldown', 'rcooldown', 'rcool'],
usage: '!<alias> <@tag>',
example: '!removecooldown @eligijus',
description: 'Lets the owner remove the cooldown for a specific person',
execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
    //----------------------------------------
    //Includes and other variables
    const Discord = require('discord.js');
    //----------------------------------------

    if(msg.author.id === OwnerID){
        if(!args[1]) {
            msg.reply('Prašome pasirinkti ką norite išmesti iš sąrašo. __Tai turi būti tagintas žmogus **@**__');
            let embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Užrakinti žmonės`)
            .setThumbnail('https://i1.sndcdn.com/artworks-000516782226-xsqnhj-t500x500.jpg')
            .setDescription(`${Ctime.map ((user, index) => `**${index+1}**- __${msg.guild.members.cache.get(user.ID).user.username}__`).join('\n')}`);
            return msg.channel.send(embed);
        }else{
            //-----------------------------------
            //User inpurs
            const user = msg.mentions.users.first();
            if(user){ 
            const member = msg.guild.member(user);
            //-----------------------------------
            if(member){
                if(CommandCooldown.has(user.id)){
                    CommandCooldown.delete(user.id);
                    for(var i = 0; i < Ctime.length; i++){
                        if(Ctime[i].ID === user.id) Ctime.splice(i, 1);
                    }
                    return msg.channel.send(`**${msg.guild.members.cache.get(user.id).user.username}** buvo pašalintas iš ilsėjimų sąrašo.`);
                }
            } else  return msg.reply('Prašau patikrink ar tą žmogų užtaginai.');
        } else return msg.reply('Prašau užtaginti!');
        }

    }else if(CommandCooldown.has(msg.author.id)) return msg.bulkDelete(1);
        else return msg.reply(`Paprašyk ${msg.guild.get(OwnerID).username}.`);
}
};