const {Client, RichEmbed} = require('discord.js');
const Discord = require('discord.js');
const bot = new Client();
const ping = require('minecraft-server-util');
const token = 'NjcyODM2MzEwMTc1NzExMjcz.XkQjrQ.23HJKoAYX9Zojsbq7Abk0c8FhYg';
const prefix = '!';
const CommandCooldown = new Set();
const ytdl = require("ytdl-core");
var servers = {};

     

const fs = require('fs');
bot.commands = new Discord.Collection();
func = new Discord.Collection();
bot.on('ready', () =>{
    console.log('The bot is online. ');
    bot.user.setActivity('Layon.', {type: 'LISTENING'}).catch(console.error);
    setInterval(func.get('checking').execute, 1000*60*30)
})

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

    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0])
    {

        case 'play':
            bot.commands.get('play').execute(msg, args, ytdl, servers);
        break;
        case 'stop':
            bot.commands.get('stop').execute(msg, servers, holder);
        break;
        case 'skip':
            bot.commands.get('skip').execute(msg, servers);
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
            msg.channel.bulkDelete(parseInt(args[1])+1);
            }
            else msg.reply('No.');
            
            break;
    }
})

bot.on('message', msg=>{
    if(CommandCooldown.has(msg.author.id))
    {
        console.log('Deleting message.');
        msg.channel.bulkDelete(1);
    }
})

bot.login(token);
