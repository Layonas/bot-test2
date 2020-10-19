module.exports = {
   name: 'playlist',
   alias: ['playlist', 'pl', 'play list', 'list'],
   usage: '!<alias>',
   example: '!playlist',
   description: 'Full list of songs that are currently in the queue.',
   execute(msg, serverQueue, ytdl, queue) // eslint-disable-line
   {
        var PlayListLenght = 0;
        for(var i = 0; i < serverQueue.songs.length; i++)
        {
            PlayListLenght += serverQueue.songs[i].hours*3600 + serverQueue.songs[i].minutes*60+serverQueue.songs[i].seconds;    
        }
        var PlayListLenghtMinutes = Math.round(PlayListLenght/60, 2); 
        var PlayListLenghtseconds = Math.round(PlayListLenght - Math.round(PlayListLenght/60)*60); 
        msg.channel.bulkDelete(1);
        const Discord = require('discord.js');
        if(!serverQueue) return msg.reply('Šiuo metu niekas negroja.');
        try {
                let embed = new Discord.RichEmbed()
                .setColor('RANDOM')
                .setThumbnail(msg.author.avatarURL)
                .setDescription(`__**Playlist'as**__
                ${serverQueue.songs.map((song, index) => `**+${index+1}** ${song.title}`).join('\n')}

Dabar yra **${serverQueue.songs.length}** dainų saraše!
**__Dabar groja:__**  ${serverQueue.songs[0].title}
**__Grojamos dainos linkas__** <${serverQueue.songs[0].url}>
**__Dainą užsakė__** ${serverQueue.requester[0]}
**__Dainos garsas__**  **${serverQueue.volume}**
**__Apytiksli trukmė__**  **${PlayListLenghtMinutes + 'min ' + PlayListLenghtseconds + 's'}**`);
                return msg.channel.send(embed);                
        } catch (error) {
                try {
                        let holder = serverQueue.songs.slice(0, 30);
                        let embed = new Discord.RichEmbed()
                        .setColor('RANDOM')
                        .setThumbnail(msg.author.avatarURL)
                        .setDescription(`__**Playlist'as**__
                        ${holder.map((song, index) => `**+${index+1}** ${song.title}`).join('\n')}

Dainų sąraše yra tik 30 dainų, tačiau tai ne visos!        
Dabar yra **${serverQueue.songs.length}** dainų sąraše!
**__Dabar groja:__**  ${holder[0].title}
**__Grojamos dainos linkas__** <${serverQueue.songs[0].url}>
**__Dainą užsakė__** ${serverQueue.requester[0]}
**__Dainos garsas__**  **${serverQueue.volume}**
**__Apytiksli trukmė__**  **${PlayListLenght/60 + 'min' + PlayListLenght/3600 + 's'}**`); //paziureti ar eina index ideti
                        return msg.channel.send(embed);                        
                } catch (err) {
                        console.error(err);
                        return msg.reply('Atsiprašome įvyko klaida, prašome pabandyti vėliau.');
                }
        }

}
};