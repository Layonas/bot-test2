module.exports = {
    name: 'NowPlaying',
    description: 'Tells what is the song that is currently playing.',
    execute(msg, serverQueue, queue){
        msg.channel.bulkDelete(1);
        if(!serverQueue) return msg.reply('Dabar niekas negroja!');
        return msg.reply(`Dabar groja **${serverQueue.songs[0].title}**
__Dainos nuoroda__ <${serverQueue.songs[0].url}>`);
    }
}