module.exports = {
    name: 'restart',
    alias: ['restart', 'rs'],
    usage: '!<alias> <name>',
    example: '!restart self',
    description: 'Restarts the bot or a specified command',
    async execute(msg, args, OwnerID, bot){
        const { token } = require('../config.js');
        if(!args[1]) return msg.reply(`Neteisingas vartojimas, pažiūrėk pavyzdį ---> ${this.example}`);
        if(!msg.author.id === OwnerID) {
            await msg.guild.members.get(OwnerID).send(`${msg.author.username} request to restart the bot.`);
            return msg.reply('Prašymas išsiųstas');
        }
        
        if(args[1].toLowerCase() === 'self'){
            const owner =  msg.guild.members.get(OwnerID);
            await owner.send(`Bot restart is **commencing**.`).then(await bot.destroy()).then(await bot.login(token)).then(owner.send(`Bot restart is **complete**.`));
        }

    }
};