module.exports = {
   name: 'list',
   description: 'Full list of songs that are currently in the queue.',
   execute(msg, serverQueue, ytdl, queue)
   {
        msg.channel.bulkDelete(1);
        const Discord = require('discord.js');
        if(!serverQueue) return msg.reply('Šiuo metu niekas negroja.');
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(msg.author.avatarURL)
        .setDescription(`__**Playlist'as**__
        ${serverQueue.songs.map(song => `**+** ${song.title}`).join('\n')}
        
        Dabar yra **${serverQueue.songs.length}** dainų saraše!
        **__Dabar groja:__**  ${serverQueue.songs[0].title}`);
        return msg.channel.send(embed);
}
}