const {Client, RichEmbed} = require('discord.js');
const bot = new Client();
const ping = require('minecraft-server-util');
const token = 'NjcyODM2MzEwMTc1NzExMjcz.XjRRxg.82ce9gS8z-EJcOyVVePditPyPqk';
const prefix = '!';
bot.on('ready', () =>{
    console.log('The bot is online. ');
})

ping ('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>
            {
                if (error) throw error;
                var str = response.version;
                var str1 = str.slice(4);
                console.log(str1);
            })

bot.on('message', msg=>
{
    if (msg.content === "Hello")
    {
        msg.reply ('Hello bitch.');
    }
})

bot.on ('message', msg=>
{
    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0])
    {
        case 'gay':
             msg.channel.send('pong bitch!');
        break;
        
        case 'info':
            if (args[1] === 'YT')
            {
                 msg.channel.send('https://www.youtube.com/channel/UCMoy_yYppvhDjTUfEH210ew?view_as=subscriber');
            }
            else 
            {
                msg.channel.send('Are u gay, try again.');
            }
            break;
        case 'server':
            
            ping ('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>
            {
                if (error) throw error;
                if (response.version.slice(4) === 'Online')
                {
                const Embed = new RichEmbed()
                    .setTitle('Server status')
                    .addField('Status', response.version.slice(4), true )
                    .addField('Online players', response.onlinePlayers, true)
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
            break;
        /*case 'clear':
            if (!args[1]) return msg.reply('Please choose how much you want to delete')
            msg.channel.bulkDelete(args[1]);
            break;*/
    }
})

bot.off('unready', ()=>
{
    console.log('Bot is off');
})
.listen(process.env.PORT);
bot.login(token);
