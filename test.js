const {Client, RichEmbed} = require('discord.js');
const Discord = require('discord.js');
const bot = new Client();
const ping = require('minecraft-server-util');
const token = 'NjcyODM2MzEwMTc1NzExMjcz.XjRRxg.82ce9gS8z-EJcOyVVePditPyPqk';
const prefix = '!';

const fs = require('fs');
bot.commands = new Discord.Collection();

bot.on('ready', () =>{
    console.log('The bot is online. ');
})

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on("guildMemberAdd", member =>{

    const channel = member.guild.channels.find(channel => channel.name === "memes-pls");
    if (!channel) return;

    channel.send(`Sveikas ${member}, sveikinu prisijungus prie mūsų serverio!`);

});

bot.on('message', msg=>
{
    let args = msg.content.split(" ");

    switch (msg.content.toLowerCase()){
        case 'hello':
            bot.commands.get('hello').execute(msg);
         break;

         case 'labanaktis maziuk':
             if (msg.author.username === 'Layon')
             {
                       bot.commands.get('Layon').execute(msg);
             }
             else 
            {
                 msg.reply('Eik nx');
            }
      
        break;

    }


  
})

bot.on ('message', msg=>
{
    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0])
    {
        
        
        /*case 'info':
            if (args[1] === 'YT')
            {
                 msg.channel.send('https://www.youtube.com/channel/UCMoy_yYppvhDjTUfEH210ew?view_as=subscriber');
            }
            else 
            {
                msg.channel.send('Are u gay, try again.');
            }
            break;*/
        case 'server':
            if (msg.author.username !== 'AdvancingBot1')
            {
            ping ('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>
            {
                if (error) throw error;
                if (response.version.slice(4) === 'Online')
                {
                const Embed = new RichEmbed()
                    .setTitle('Server status')
                    .addField('Status', response.version.slice(4), true )
                    .addField('Online players', 'One or more:)', true)
                    .addField('Server IP', response.host)
                    .setColor(0x3AFF00 )
                    .setThumbnail(msg.author.avatarURL)
                    

                msg.channel.send(Embed);
                console.log(response)
                }
                else 
                {
                const Embed = new RichEmbed()
                    .setTitle('Server status')
                    .addField('Status', response.version.slice(4), true )
                    .addField('Online players', response.onlinePlayers, true)
                    .addField('Server IP', response.host)
                    .setColor(0xFF2D00 )
                    .setThumbnail(msg.author.avatarURL)
                    

                msg.channel.send(Embed);
                console.log(response)
                }
            })
            }
            break;
            
            case 'help':
            bot.commands.get('help').execute(msg, args);
            break;
            
        /*case 'clear':
            if (!args[1]) return msg.reply('Please choose how much you want to delete')
            msg.channel.bulkDelete(args[1]);
            break;*/
    }
})

bot.login(token);
