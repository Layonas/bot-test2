module.exports = {
   name: 'list',
   description: 'Full list of songs that are currently in the queue.',
   execute(msg, serverQueue, ytdl, queue)
   {
        msg.channel.bulkDelete(1);
        const Discord = require('discord.js');
        if(!serverQueue) return msg.reply('Šiuo metu niekas negroja.');
        try {
                let embed = new Discord.RichEmbed()
                .setColor('RANDOM')
                .setThumbnail(msg.author.avatarURL)
                .setDescription(`__**Playlist'as**__
                ${serverQueue.songs.map(song => `**+** ${song.title}`).join('\n')}

Dabar yra **${serverQueue.songs.length}** dainų saraše!
**__Dabar groja:__**  ${serverQueue.songs[0].title}
**__Grojamos dainos linkas__** <${serverQueue.songs[0].url}>`);
                return msg.channel.send(embed);                
        } catch (error) {
                try {
                        let holder = serverQueue.songs.slice(0, 30);
                        let embed = new Discord.RichEmbed()
                        .setColor('RANDOM')
                        .setThumbnail(msg.author.avatarURL)
                        .setDescription(`__**Playlist'as**__
                        ${holder.map(song => `**+** ${song.title}`).join('\n')}

Dainų sąraše yra tik 30 dainų, tačiau tai ne visos!        
Dabar yra **${serverQueue.songs.length}** dainų sąraše!
**__Dabar groja:__**  ${holder[0].title}`); //paziureti ar eina index ideti
                        return msg.channel.send(embed);                        
                } catch (err) {
                        console.log(err);
                        return msg.reply('Atsiprašome įvyko klaida, prašome pabandyti vėliau.');
                }
        }

}
}