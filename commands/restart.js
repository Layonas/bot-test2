module.exports = {
    name: 'restart',
    alias: ['restart', 'rs'],
    usage: '!<alias> <name>',
    example: '!restart self',
    description: 'Restarts the bot or a specified command',
    async execute(msg, args, OwnerID, bot){
        //No need to restart the commands because when pushing to github bot automatically restarts with new commands or tweaks done -- restart command would only benefit
        //if I were to run the bot on local machine
        if(!args[1]) return msg.reply(`Neteisingas vartojimas, pažiūrėk pavyzdį ---> ${this.example}`);
        if(msg.author.id !== OwnerID) {
            await msg.guild.members.cache.get(OwnerID).send(`**${msg.author.username}** request to restart the bot.`);
            return msg.reply('Prašymas išsiųstas');
        }
        
        if(args[1].toLowerCase() === 'self'){
            const owner =  msg.guild.members.cache.get(OwnerID);
            await owner.send(`Bot restart is **commencing**.`).then(await bot.destroy()).then(await bot.login(process.env.TOKEN)).then(owner.send(`Bot restart is **complete**.`));
        }

    }
};