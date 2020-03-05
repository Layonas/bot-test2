module.exports = {
    name: 'checking',
    description: 'checks if the server is online',
    execute()
    {
        var a = 0;
        const token = 'NjcyODM2MzEwMTc1NzExMjcz.XkQjrQ.23HJKoAYX9Zojsbq7Abk0c8FhYg';
        const ping = require('minecraft-server-util');
        const {Client, RichEmbed} = require('discord.js');
        const Discord = require('discord.js');
        const bot = new Client();
        ping('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>{
            if (error) throw error;
            if (response.version.slice(4) === 'Online')
            {
                if (a === 0)
                {

                    bot.on('message', msg =>{
                        // msg.guild.send('The server is online! Join now at ' + response.host);
                        const channel = msg.guild.channels.find(channel => channel.name === "general");
                        if (!channel) return;
                        channel.send('aaa');

                    })
                   
                    a++;
                }
                
            }
            else 
            {
                a = 0;

            }

            
        })

       
    }

    
}