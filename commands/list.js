module.exports = {
   name: 'list',
   description: 'Full list of songs that are currently in the queue.',
   execute(msg, serverQueue, ytdl, queue)
   {
        if(!serverQueue) return msg.reply('Nothing is playing.');
        return msg.reply(`
        __**Playlist**__
${serverQueue.songs.map(song => `**+** ${song.title}`).join('\n')}

        **Now playing: ** ${serverQueue.songs[0].title}
        `);
   }
}