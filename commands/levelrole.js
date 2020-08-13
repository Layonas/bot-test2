module.exports = {
    name: 'levelRole',
    alias: ['lr', 'levelRole', 'levelrole', 'levelr'],
    usage: '!<alias> <pavadinimas> <lygis>',
    example: '!lr juodas_batas 2000',
    description: 'Suggests what roles users wants to add.',
    execute(msg, args, OwnerID){

        if(!args[1]) return msg.reply(`Neteisingai įvedėte, **${this.usage}**`);

        if(!args[2]) return msg.reply(`Neteisingai ivedėtę komandą, **${this.usage}**`);

        if(isNaN(args[2])) return msg.reply(`Neteisingai formuluojate komandos tekstą, **${this.example}**`);

        var role = args[1].replace(/_/gi, ' ');
        msg.channel.send(`Ačiū už jūsų bendradarbiavimą, **${role}** pridėta peržiūrėjimui.`);

        return msg.guild.members.get(OwnerID).send(`Naują rolę pasiūlė ***${msg.author.username}*** Rolės pavadinimas **${role}** Rolės lygis **${args[2]}**`);

    }
};