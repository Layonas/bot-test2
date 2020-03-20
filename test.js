const {Client, RichEmbed} = require('discord.js');
const {YOUTUBE_API_KEY, token} = require('./config.js');
const Discord = require('discord.js');
const ping = require('minecraft-server-util');
const ytdl = require("ytdl-core");
const Youtube = require('simple-youtube-api');

const prefix = '!';

const bot = new Client();
const CommandCooldown = new Set();
const queue = new Map();
const youtube = new Youtube(YOUTUBE_API_KEY);

const fs = require('fs');
bot.commands = new Discord.Collection();
func = new Discord.Collection();

var a = 0;

bot.on('disconnect', () => console.log('Bot got disconnected, trying to reconnect now ...'));
bot.on('reconnecting', () => console.log('Reconnecting ....'));
bot.on('warn', console.warn);


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}
const holder = bot.commands;
const FunctionFiles = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));
for(const file of FunctionFiles)
{
    const command = require(`./functions/${file}`);
    func.set(command.name, command);
}

bot.on('ready', () =>{
    console.log('The bot is online. ');
    bot.user.setActivity('Layon.', {type: 'LISTENING'}).catch(console.error);

    var d = new Date();
    fs.readFile('BotLogs.txt', (error, text) =>{
                if(error) throw error;
            fs.writeFile('BotLogs.txt', `${text}\n[ ${d.getMonth()+1}:${d.getDate()} ${d.getHours()}h ${d.getMinutes()}m ${d.getSeconds()}s ] The bot went Online!`, (err) => {
        if (err) throw err;
    })
    })
 

    
    setInterval( () => {
        //var room =  bot.channels.get('543849764219781131');
        var room = bot.channels.get('672837776672030774'); 
        try {
            func.get('checking').execute(room, bot, a);
        } catch (error) {
            console.error(error);
        } 
        
    }, 1000*60*30);
})


bot.on("guildMemberAdd", member =>{

    const channel = member.guild.channels.find(channel => channel.name === "memes-pls");
    if (!channel) return;

    channel.send(`Sveikas ${member}, sveikinu prisijungus prie mūsų serverio!`);

});

bot.on('message', msg=>
{
    switch (msg.content.toLowerCase()){
        case 'hello':
            bot.commands.get('hello').execute(msg);
         break;      

    }
})

bot.on ('message', msg=>
{
    if (!msg.content.startsWith(prefix)) return;

    if(CommandCooldown.has(msg.author.id))
    {
        console.log('Deleting message.');
        return msg.channel.bulkDelete(1);
    }

    let args = msg.content.substring(prefix.length).split(" ");

    const serverQueue = queue.get(msg.guild.id);

    var d = new Date();
    fs.readFile('BotLogs.txt', (err, text) => {
        if (err) throw err;
        fs.writeFile('BotLogs.txt', `${text} \n[ ${d.getMonth()+1}:${d.getDate()} ${d.getHours()}h ${d.getMinutes()}m ${d.getSeconds()}s ]  ${msg.author.username} (${msg.author.id}) -- ${msg.content}`, (error) =>{
            if (error) throw error;
        })
    })
    
    switch(args[0].toLowerCase())
    {
        case 'play'://, 'join', 'start', 'listen':
            bot.commands.get('play').execute(msg, args, ytdl, queue, serverQueue, youtube);
            break;
        case 'splay':
            bot.commands.get('splay').execute(msg, args, youtube, serverQueue, queue, ytdl);
        break;
        case 'np'://, 'NowPlaying', 'nowplaying':
            bot.commands.get('NowPlaying').execute(msg, serverQueue, queue);
            break;
        case 'stop'://, 's', 'st':
            bot.commands.get('stop').execute(msg, serverQueue);
        break;
        case 'skip'://, 'sk':
            bot.commands.get('skip').execute(msg, serverQueue, args);
        break;
        case 'playlist'://, 'pl', 'list', 'Playlist':
            bot.commands.get('list').execute(msg, serverQueue, queue, ytdl);
            break;
        case 'pause':
            bot.commands.get('pause').execute(msg, queue, serverQueue);
            break;
        case 'resume':
            bot.commands.get('resume').execute(msg, queue, serverQueue);
            break;

            case 'server':
            holder.get('server').execute(msg, ping, RichEmbed);
            break;
            
            case 'help':
            bot.commands.get('help').execute(msg, args);
            break;
            case 'kick':
                bot.commands.get('kick').execute(msg, args);
            break;

            case 'cooldown':
                    bot.commands.get('cooldown').execute(msg, args, CommandCooldown);
            break;
            
            case 'clear':
            if (msg.author.username == "Layon")
            {
            if (!args[1]) return msg.reply('Please choose how much you want to delete')
            if (isNaN(args[1])) return msg.reply(`<${args[1]}> is not a number`)
            msg.channel.bulkDelete(parseInt(args[1])+1);
            }
            else msg.reply('No.');
            
            break;
    }
})

bot.login(token);
