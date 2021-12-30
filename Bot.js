require('dotenv').config();
const{ Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const DeleteMessageLogs = require('./functions/DeleteMessageLogs');
const Apps = require('./functions/Apps');
const { Player } = require('discord-music-player');

const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'REACTION', 'USER', 'GUILD_MEMBER', 'CHANNEL']});
const player = new Player(bot, {
    leaveOnEmpty: false, // This options are optional.
});

    //------------------------------------------------------------------------------------------------
    // Event listeners
    player
        .on("songAdd", (queue, song) => {
            song.data.interaction
                ? song.data.interaction.editReply(
                    "**" + song.name + " ** *has been added to the list.*\n" + 
                    "*There are currently* **" + queue.songs.length + "** *in the queue.*")
                : song.data.msg.reply(
                    "**" + song.name + " ** *has been added to the list.*\n" + 
                    "*There are currently* **" + queue.songs.length + "** *in the queue.*");
        })
        .on("songChanged", (queue, newSong) => {
            let { channel } = newSong.data;
            channel.send(`**${newSong.name}** *started playing!*\n*Only* **${queue.songs.length}** *remain*`);
        });
    //------------------------------------------------------------------------------------------------

bot.commands = new Discord.Collection();
bot.functions = new Discord.Collection();
//End of variables
//--------------------------------------------------------------------------------------------------------


bot.on('disconnect', () => console.log('Bot got disconnected, trying to reconnect now ...'));
bot.on('reconnecting', () => console.log('Reconnecting ....'));
bot.on('warn', console.warn);

// Loading commands
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
console.log(`Loading commands ...`);
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    command.alias.forEach((value) => {
        bot.commands.set(value, command);
    });
    console.log(`Command ${file} has loaded!`);
}

// Loading functions
const FunctionFiles = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));
console.log(`\nLoading functions ...`);
for(const file of FunctionFiles)
{
    const command = require(`./functions/${file}`);
    bot.functions.set(command.name, command);
    console.log(`Function ${file} has loaded!`);
}

// Bot is ready to work
bot.on('ready', async () =>{
    console.log('\nThe bot is online. ');

    bot.user.setPresence({activities: [{name: 'Turbo mod On'}], status: 'idle'});
    
    DeleteMessageLogs.execute(bot);

    await Apps.execute(bot);
    
    //Reading guilds that bot is currently in
    console.log('\nBot is currently in these servers:');
    bot.guilds.cache.map(guild => console.log(guild.name));  
});

//----------------------------------------------------------

// When a person joins a server
bot.on('guildMemberAdd', async member =>{

    const channel = bot.guilds.cache.get(process.env.GUILD).channels.cache.get('772550965232140338');
    if (!channel) return console.log('No channel.');

    await channel.send(`Sveikas ${member}, sveikinu prisijungus prie mūsų serverio!`);

    const role = member.guild.roles.cache.get('748097420256215070');
    if(!role)
    return;

    member.roles.add(role);
});

//when bot joins a new server
bot.on('guildCreate', guild =>{
    const ID = guild.id;
    const botOwner = bot.users.cache.get(process.env.USER_OWNER);
    botOwner.send(`Bot has been added to a new guild **${guild.name}** and id is: **${ID}**`);
});

//when a bot is kicked from a server
bot.on('guildDelete', guild =>{
    const botOwner = bot.users.cache.get(process.env.USER_OWNER);
    botOwner.send(`Bot has been removed from **${guild.name}** and id is: **${guild.id}**`);
});


//-----------------------------------------------------------------------------------------------------------------------------------------------------
//Main message catching

bot.on ('messageCreate', async msg=>
{
    if(msg.author.id === process.env.USER_BOT) return;
    let args = msg.content.toLowerCase().substring(1).split(" ");
    args = args.filter(str => {
        return /\S/.test(str);
    });

    // if(msg.author.id === '301073530240630795')
    //     msg.reply('https://cdn.discordapp.com/attachments/543849764219781131/915249866366681108/unknown.png');

    //jiglis norejo kad taip padaryciau
    if(args.includes('dilgeles')) msg.channel.send("https://sveikas.info/wp-content/uploads/2011/05/dilgeles2.jpg");
    //rokis norejo kad taip padaryciau
    if(args.includes('garsva')) msg.channel.send('https://manoukis.lt/media/public/3e/62/3e624e41-6b5e-4056-9f9e-29b1b839ae2b/kanapes_jolantos_bulotienes_nuotrauka.jpg');

    await bot.functions.get('Statistics').execute(msg, args, bot);
    await bot.functions.get('HandleCommands').execute(msg, args, bot, null, player);
    await bot.functions.get('Rudeness').execute(msg, args);
    await bot.functions.get('Attachments').execute(bot, msg);
    await bot.functions.get('hello').execute(msg);
});

bot.on('interactionCreate', async(interaction) =>{

    if(!interaction.isCommand())
        return;

    await bot.functions.get('HandleCommands').execute('', [], bot, interaction, player);
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------

bot.login(process.env.TOKEN);
