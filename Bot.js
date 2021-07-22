require('dotenv').config();
const {Client, MessageEmbed} = require('discord.js');
const Discord = require('discord.js');
const ping = require('minecraft-server-util');
const ytdl = require("ytdl-core");
const Youtube = require('simple-youtube-api');
const fs = require('fs');
const DeleteMessageLogs = require('./functions/DeleteMessageLogs');
const Apps = require('./functions/Apps');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const OwnerID = process.env.USER_OWNER;
const BotID = process.env.USER_BOT;

const prefix = '!';

const bot = new Client({partials: ['MESSAGE', 'REACTION']});
const CommandCooldown = new Set();
const queue = new Map();
const youtube = new Youtube(YOUTUBE_API_KEY);

var Ctime = [];
var stats = {};


bot.commands = new Discord.Collection();
const func = new Discord.Collection();
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
    bot.commands.set(command.name, command); // bot.commands.set(command.help.name, command); veikia
    console.log(`Command ${file} has loaded!`);
}
const holder = bot.commands;

// Loading functions
const FunctionFiles = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));
console.log(`\nLoading functions ...`);
for(const file of FunctionFiles)
{
    const command = require(`./functions/${file}`);
    func.set(command.name, command);
    console.log(`Function ${file} has loaded!`);
}

// Bot is ready to work
bot.on('ready', async () =>{
    console.log('The bot is online. ');
    bot.user.setActivity(`with ${bot.guilds.cache.get(process.env.GUILD).members.cache.get('366702124505235456').displayName}`, {type: 'WATCHING'}).catch(console.error);
    
    DeleteMessageLogs.execute(bot);

    Apps.execute(bot);     

    //Reading guilds that bot is currently in
    //bot.guilds.cache.map(guild => console.log(guild.name));
});

bot.ws.on('INTERACTION_CREATE', async (interaction) =>{
    // console.log(interaction.data.name);
    // console.log(interaction.data.options[0].options[0]);
    // console.log(interaction.data.options[0].name);
    const { name, options } = interaction.data;
    const { channel_id, guild_id } = interaction;

    let command = '';
    let msg = {};

    for(var i = 0; i < commandFiles.length; i++){
        const commands = require(`./commands/${commandFiles[i]}`);
        if(commands.alias.some(names =>{
            return name === names.toLowerCase();
        })) command = commands.name;
    }

    if(options)
        msg = {
            input: options[0].value,
            id: interaction.member.user.id,
            voiceChannel: bot.guilds.cache.get(guild_id).members.cache.get(interaction.member.user.id).voice.channel,
            guild: bot.guilds.cache.get(guild_id),
            interaction: interaction,
            author: bot.guilds.cache.get(process.env.GUILD).members.cache.get(interaction.member.user.id).user,
            channel: bot.channels.cache.get(channel_id),
            member: bot.guilds.cache.get(process.env.GUILD).members.cache.get(interaction.member.user.id),
            options: options,
        };
    else
        msg = {
            id: interaction.member.user.id,
            voiceChannel: bot.guilds.cache.get(guild_id).members.cache.get(interaction.member.user.id).voice.channel,
            guild: bot.guilds.cache.get(guild_id),
            interaction: interaction,
            author: bot.guilds.cache.get(process.env.GUILD).members.cache.get(interaction.member.user.id).user,
            channel: bot.channels.cache.get(channel_id),
            member: bot.guilds.cache.get(process.env.GUILD).members.cache.get(interaction.member.user.id),
        };

    if (CommandCooldown.has(msg.author.id)) return;
    
    const serverQueue = queue.get(msg.guild.id);

    bot.commands.get(command).execute(msg, '', BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, true, OwnerID, serverQueue); // eslint-disable-line)
        
                //console.log(interaction);
                // bot.api.interactions(interaction.id, interaction.token).callback.post({
                //     data: {
                //         type: 4,
                //         data: {
                //             content: 'pong',
                //         }
                //     }
                // });
});

//----------------------------------------------------------

// When a person joins a server
bot.on("guildMemberAdd", async member =>{

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

//rasyti prie msg funkcijos
 // console.log(`${msg.createdAt.getHours()}:${msg.createdAt.getMinutes()}:${msg.createdAt.getSeconds()} `);  // Jei leidziamas per mano pc 
  //console.log(`${msg.createdAt.getHours()+3}:${msg.createdAt.getMinutes()}:${msg.createdAt.getSeconds()} `); // Jei leidziamas per Heroku
    // let cmd = bot.commands.get(msg.content.toLowerCase());
    // console.log(`${cmd}`);
    // if(cmd) cmd.run(msg);
    //veikia


bot.on ('message', async msg=>
{
    if(msg.author.id === process.env.USER_BOT) return;
    let arg = msg.content.toLowerCase().split(" ");
    let args = msg.content.substring(prefix.length).split(" ");

    //jiglis norejo kad taip padaryciau
    if(args.includes('dilgeles')) msg.channel.send("https://lh3.googleusercontent.com/proxy/LPvB5N0aKcq49Y3jpIVw4OhbfTmQsRhxl9GMer12mbPuV_tinWnvvrAjbGeU6IYCZWYWJpdKvMfXlYHzel4MEWzTTWhsVDGUTq3wVArk045dfseN7HR8PofZ");
    //rokis norejo kad taip padaryciau
    if(args.includes('garsva')) msg.channel.send('https://manoukis.lt/media/public/3e/62/3e624e41-6b5e-4056-9f9e-29b1b839ae2b/kanapes_jolantos_bulotienes_nuotrauka.jpg');
    
    if (CommandCooldown.has(msg.author.id)) return await msg.delete({timeout: 1});

    await func.get('Statistics').execute(msg, args, BotID, stats, bot, OwnerID);
    await func.get('HandleCommands').execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID);
    await func.get('Rudeness').execute(arg, msg, CommandCooldown, Ctime, OwnerID, BotID);
    await func.get('Attachments').execute(bot, msg);
    await func.get('hello').execute(msg);
    msg.channel.stopTyping();
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------

bot.login(process.env.TOKEN);
