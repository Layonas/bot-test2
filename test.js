require('dotenv').config();
const {Client, RichEmbed} = require('discord.js');
const {YOUTUBE_API_KEY, token, OwnerID, BotID} = require('./config.js');
const Discord = require('discord.js');
const ping = require('minecraft-server-util');
const ytdl = require("ytdl-core");
const Youtube = require('simple-youtube-api');

const prefix = '!';

const bot = new Client();
const CommandCooldown = new Set();
const queue = new Map();
const youtube = new Youtube(YOUTUBE_API_KEY);

var Ctime = [];
var stats = {};

const fs = require('fs');
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
bot.on('ready', () =>{
    console.log('The bot is online. ');
    bot.user.setActivity('Layon.', {type: 'LISTENING'}).catch(console.error);

    //////////////////////bot.guilds.map(guild => console.log(guild.name));

    // var d = new Date();
    // fs.readFile('BotLogs.txt', (error, text) =>{
    //             if(error) throw error;
    //         fs.writeFile('BotLogs.txt', `${text}\n[ ${d.getMonth()+1}:${d.getDate()} ${d.getHours()}h ${d.getMinutes()}m ${d.getSeconds()}s ] The bot went Online!`, (err) => {
    //     if (err) throw err;
    // })
    // })
 
    //func.get('checking').execute(bot);
    //closed this function because its not relevant anymore
});

// When a person joins a server
bot.on("guildMemberAdd", member =>{

    const channel = member.guild.channels.find(channel => channel.name === "memes-pls");
    if (!channel) return;

    channel.send(`Sveikas ${member}, sveikinu prisijungus prie mūsų serverio!`);

});

//when bot joins a new server
bot.on('guildCreate', guild =>{
    const ID = guild.id;
    const botOwner = bot.users.get('279665080000315393');
    botOwner.send(`Bot has been added to a new guild **${guild.name}** and id is: **${ID}**`);
});

//when a bot is kicked from a server
bot.on('guildDelete', guild =>{
    const botOwner = bot.users.get('279665080000315393');
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
    let arg = msg.content.toLowerCase().split(" ");
    let args = msg.content.substring(prefix.length).split(" ");

    await func.get('Statistics').execute(msg, args, BotID, stats, bot);
    func.get('HandleCommands').execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, RichEmbed, holder, OwnerID);
    func.get('Rudeness').execute(arg, msg);
    func.get('Attachments').execute(bot, msg);
    func.get('hello').execute(msg);

});
//-----------------------------------------------------------------------------------------------------------------------------------------------------

bot.login(token);
