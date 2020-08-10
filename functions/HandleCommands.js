module.exports = {
    name: 'HandleCommands',
    description: 'Handles all commands that are presented to the bot so that the main test.js would look cleaner',
    async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, RichEmbed, holder, OwnerID){

    if (CommandCooldown.has(msg.author.id)) return await msg.channel.bulkDelete(1);
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
     if(args[0].toLowerCase() === 'clear') number = 'clear';
     if(number === -1) return msg.reply(`__**${args[0]}**__ nėra komanda!`);
    }
     //--------------------------------------------------------------------

     //--------------------------------------------------------------------
     //Checking if a person is cooldowned
    if(CommandCooldown.has(msg.author.id))
    {
        if(number !== 'removecooldown' || number !== 'cooldowncheck' || number === -1){
        console.log('Deleting message.');
        return msg.channel.bulkDelete(1);
        }
    }
    //--------------------------------------------------------------------
    const serverQueue = queue.get(msg.guild.id);

    //Logging on a local machine
    //-------------------------------------------------------
    // var d = new Date();
    // fs.readFile('BotLogs.txt', (err, text) => {
    //     if (err) throw err;
    //     fs.writeFile('BotLogs.txt', `${text} \n[ ${d.getMonth()+1}:${d.getDate()} ${d.getHours()}h ${d.getMinutes()}m ${d.getSeconds()}s ]  ${msg.author.username} (${msg.author.id}) -- ${msg.content}`, (error) =>{
    //         if (error) throw error;
    //     })
    // })
    //-------------------------------------------------------

    switch(number.toLowerCase()){
        
        case 'clear':
            if (msg.author.username == "Layon")
            {
            if (!args[1]) return msg.reply('Please choose how much you want to delete');
            if (isNaN(args[1])) return msg.reply(`<${args[1]}> is not a number`);
            msg.channel.bulkDelete(parseInt(args[1])+1);
            }
            else msg.reply('No.');
        break;

        case 'volume':
            bot.commands.get('volume').execute(msg, args, serverQueue);
        break;

        case 'cooldown':
            bot.commands.get('cooldown').execute(msg, args, CommandCooldown, Ctime);
        break;

        case 'spam':
            bot.commands.get('spam').execute(msg, args);
        break;

        case 'help':
            bot.commands.get('help').execute(msg, args);
        break;

        case 'instaplay':
            bot.commands.get('instaPlay').execute(msg, args, ytdl, queue, youtube);
        break;

        case 'kick':
            bot.commands.get('kick').execute(msg, args);
        break;

        case 'playlist':
            bot.commands.get('playlist').execute(msg, serverQueue, queue, ytdl);
        break;

        case 'np':
            bot.commands.get('np').execute(msg, serverQueue);
        break;

        case 'pause':
            bot.commands.get('pause').execute(msg, queue, serverQueue);
        break;

        case 'play':
            bot.commands.get('play').execute(msg, args, ytdl, queue, serverQueue, youtube);
        break;

        case 'poll':
            bot.commands.get('poll').execute(msg, args);
        break;

        case 'resume':
            bot.commands.get('resume').execute(msg, queue, serverQueue);
        break;

        case 'server':
            holder.get('server').execute(msg, ping, RichEmbed);
        break;

        case 'skip':
            bot.commands.get('skip').execute(msg, serverQueue, args);
        break;

        case 'splay':
            bot.commands.get('splay').execute(msg, args, youtube, serverQueue, queue, ytdl);
        break;

        case 'stop':
            bot.commands.get('stop').execute(msg, serverQueue);
        break;

        case 'cooldowncheck':
            bot.commands.get('CooldownCheck').execute(msg, args, CommandCooldown, OwnerID, Ctime);
        break;

        case 'removecooldown':
            bot.commands.get('removeCooldown').execute(msg, args, CommandCooldown, OwnerID, Ctime);
        break;

        case 'removesong':
            bot.commands.get('RemoveSong').execute(msg, args, serverQueue, OwnerID);
        break;

        case 'profile':
            bot.commands.get('profile').execute(msg, args, BotID);
        break;

        case 'levelrole':
            bot.commands.get('levelRole').execute(msg, args, OwnerID);
        break;
    }
    }
};