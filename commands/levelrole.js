module.exports = {
    name: 'levelRole',
    alias: ['lr', 'levelRole', 'levelrole', 'levelr', 'suggestRole', 'sr', 'suggest_role'],
    usage: '!<alias> <pavadinimas> <lygis> (optional) <lygis>',
    example: '!lr juodas_batas 2000',
    description: 'Suggests what roles users wants to add.',
    async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line

        if(holder === true){

            await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                content: `Ačiū už jūsų bendradarbiavimą, **${msg.input}** pridėta peržiūrėjimui.`
            }}});

            if(msg.options[2].value)
                return await msg.guild.members.cache.get(OwnerID).send(`Naują rolę pasiūlė ***${msg.author.username}*** Rolės pavadinimas **${msg.input}** Rolės lygis nuo **${msg.options[1].value}** iki **${msg.options[2].value}**`);
            else 
                return await msg.guild.members.cache.get(OwnerID).send(`Naują rolę pasiūlė ***${msg.author.username}*** Rolės pavadinimas **${msg.input}** Rolės lygis nuo **${msg.options[1].value}** iki **${msg.options[1].value}**`);
        }
        else{

            if(!args[1]) return msg.reply(`Neteisingai įvedėte, **${this.usage}**`);

            if(!args[2]) return msg.reply(`Neteisingai ivedėtę komandą, **${this.usage}**`);

            if(isNaN(args[2])) return msg.reply(`Neteisingai formuluojate komandos tekstą, **${this.example}**`);

            var role = args[1].replace(/_/gi, ' ');
            await msg.channel.send(`Ačiū už jūsų bendradarbiavimą, **${role}** pridėta peržiūrėjimui.`);

            if(!args[3]) return msg.guild.members.cache.get(OwnerID).send(`Naują rolę pasiūlė ***${msg.author.username}*** Rolės pavadinimas **${role}** Rolės lygis **${args[2]}**`);
            else if(!isNaN(args[3]))return msg.guild.members.cache.get(OwnerID).send(`Naują rolę pasiūlė ***${msg.author.username}*** Rolės pavadinimas **${role}** Rolės lygis nuo **${args[2]}** iki **${args[3]}**`);
            else msg.reply('Neteisingai suformuluota komanda!');

        }

    }
};