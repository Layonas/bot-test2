module.exports = {
   name: 'list',
   description: 'Full list of songs that are currently in the queue.',
   execute(msg, serverQueue, ytdl, queue)
   {
        msg.channel.bulkDelete(1);
        const Discord = require('discord.js');
        if(!serverQueue) return msg.reply('Nothing is playing.');
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(msg.author.avatarURL)
        .setDescription(`__**Playlist**__
        ${serverQueue.songs.map(song => `**+** ${song.title}`).join('\n')}
        
        **__Now playing:__**  ${serverQueue.songs[0].title}`);
        return msg.channel.send(embed);
}
}