module.exports = {
    name: 'checking',
    description: 'checks if the server is online',
   async execute(room, bot)
    {
        var a = 0;
        const ping = require('minecraft-server-util');
        const {Client, RichEmbed} = require('discord.js');
        
      await  ping('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>{
            if (error) throw error;
            if (response.version.slice(4) === 'Online')
            {
                if (a === 0)
                {
                    const embed = new RichEmbed()
                    .setColor('GREEN')
                    .setThumbnail('https://wallpapercave.com/wp/NjGW245.jpg')
                    .setTitle('**Server is Online**')
                    .addField('IP', response.host, true)
                    .setDescription('**Join Now!**')
                    room.send(embed);
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