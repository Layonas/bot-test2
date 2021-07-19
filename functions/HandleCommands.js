module.exports = {
    name: 'HandleCommands',
    description: 'Handles all commands that are presented to the bot so that the main test.js would look cleaner',
    async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID){
        
    if (!msg.content.startsWith(prefix)) return;

    //---------------------------------------------------------------------
    //Getting command alias and names
    if(msg.author.id !== BotID){
    var number = -1;
    for(var i = 0; i < commandFiles.length; i++){
        const command = require(`../commands/${commandFiles[i]}`);
        if(command.alias.some(names =>{
            return args[0].toLowerCase() === names.toLowerCase();
        })) number = command.name;
    }
    if(args[0].toLowerCase() === 'clear') {
        if (msg.author.username == "Layon")
        {
        if (!args[1]) return msg.reply('Please choose how much you want to delete');
        if (isNaN(args[1])) return msg.reply(`<${args[1]}> is not a number`);
        msg.channel.bulkDelete(parseInt(args[1])+1);
        }
        else msg.reply('No.');
    }
    if(number === -1) 
    {
        if(args[0].match(/\W{1,}|[ ]+/g))
        return;
        return msg.reply(`__**${args[0]}**__ nėra komanda!`);
    }
    }
     //--------------------------------------------------------------------

    const serverQueue = queue.get(msg.guild.id);

    bot.commands.get(number).execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue);

    }
};