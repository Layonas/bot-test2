module.exports = {
    name: 'levelRole',
    alias: ['lr', 'levelRole', 'levelrole', 'levelr'],
    description: 'Suggests what roles users wants to add.',
    execute(msg, args, OwnerID){

        if(!args[1]) return msg.reply('Neteisingai ivedėtę komandą, prašau parašyti !help levelRole.');

        if(!args[2]) return msg.reply('Neteisingai ivedėtę komandą, prašau parašyti !help levelRole.');

        if(isNaN(args[2])) return msg.reply('Neteisingai formuluojate komandos tekstą, pasitikrinkite kaip rašyti !help levelRole');

        return msg.guild.members.get(OwnerID).send(`Naują rolę pasiūlė ***${msg.author.username}*** Rolės pavadinimas **${args[1]}** Rolės lygis **${args[2]}**`);

    }
};