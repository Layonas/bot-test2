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
const func = new Discord.Collection();


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
 
    func.get('checking').execute(bot);

});


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

bot.on('message', msg=>
{

 // console.log(`${msg.createdAt.getHours()}:${msg.createdAt.getMinutes()}:${msg.createdAt.getSeconds()} `);  // Jei leidziamas per mano pc 
  //console.log(`${msg.createdAt.getHours()+3}:${msg.createdAt.getMinutes()}:${msg.createdAt.getSeconds()} `); // Jei leidziamas per Heroku
    // let cmd = bot.commands.get(msg.content.toLowerCase());
    // console.log(`${cmd}`);
    // if(cmd) cmd.run(msg);
    //veikia
    switch (msg.content.toLowerCase()){
        case 'hello':
            bot.commands.get('hello').execute(msg);
         break;      

    }
});

bot.on ('message', msg=>
{
    if (!msg.content.startsWith(prefix)) return;

    if(CommandCooldown.has(msg.author.id))
    {
        console.log('Deleting message.');
        return msg.channel.bulkDelete(1);
    }

    let args = msg.content.substring(prefix.length).split(" ");
    var number = -1;
     for(var i = 0; i < commandFiles.length; i++){
        const command = require(`./commands/${commandFiles[i]}`);
        if(command.name.toLowerCase() === args[0].toLowerCase()) number = i;
     }
     if(args[0].toLowerCase() === 'clear') number = 1;
     if(number === -1) return msg.reply(`__**${args[0]}**__ nėra komanda!`);

    const serverQueue = queue.get(msg.guild.id);

    // var d = new Date();
    // fs.readFile('BotLogs.txt', (err, text) => {
    //     if (err) throw err;
    //     fs.writeFile('BotLogs.txt', `${text} \n[ ${d.getMonth()+1}:${d.getDate()} ${d.getHours()}h ${d.getMinutes()}m ${d.getSeconds()}s ]  ${msg.author.username} (${msg.author.id}) -- ${msg.content}`, (error) =>{
    //         if (error) throw error;
    //     })
    // })


    // var PlaySet = new Set();
    // PlaySet = func.get('setPlacing').playSet;
    // console.log(PlaySet);
    // if (PlaySet.has(args[0].toLowerCase())) bot.commands.get('play').execute(msg, args, ytdl, queue, serverQueue, youtube);
    //WORKS

    //let cmd = bot.commands.get(args[0]);  veiktu jeigu .execute() nebutu skirtingi

    switch(args[0].toLowerCase())
    {
        case 'play'://, 'join', 'start', 'listen':
            bot.commands.get('play').execute(msg, args, ytdl, queue, serverQueue, youtube);
            break;
        case 'splay':
            bot.commands.get('splay').execute(msg, args, youtube, serverQueue, queue, ytdl);
        break;
        case 'instaplay':
            bot.commands.get('instaPlay').execute(msg, args, ytdl, queue, youtube);
        break;
        case 'np'://, 'NowPlaying', 'nowplaying':
            bot.commands.get('np').execute(msg, serverQueue);
            break;
        case 'stop'://, 's', 'st':
            bot.commands.get('stop').execute(msg, serverQueue);
        break;
        case 'skip'://, 'sk':
            bot.commands.get('skip').execute(msg, serverQueue, args);
        break;
        case 'playlist'://, 'pl', 'list', 'Playlist':
            bot.commands.get('playlist').execute(msg, serverQueue, queue, ytdl);
            break;
        case 'pause':
            bot.commands.get('pause').execute(msg, queue, serverQueue);
            break;
        case 'resume':
            bot.commands.get('resume').execute(msg, queue, serverQueue);
            break;

        case 'poll':
             bot.commands.get('poll').execute(msg, args);
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

            case 'elyga':
                    bot.commands.get('elyga').execute(msg, args);
            break;
            
            case 'clear':
            if (msg.author.username == "Layon")
            {
            if (!args[1]) return msg.reply('Please choose how much you want to delete');
            if (isNaN(args[1])) return msg.reply(`<${args[1]}> is not a number`);
            msg.channel.bulkDelete(parseInt(args[1])+1);
            }
            else msg.reply('No.');
            
            break;
    }
});

bot.login(token);
