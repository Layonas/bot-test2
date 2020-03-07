module.exports = {
    name: 'NowPlaying',
    description: 'Tells what is the song that is currently playing.',
    execute(msg, serverQueue, queue){
        if(!serverQueue) return msg.reply('Nothing is playing!');
        return msg.reply(`Now playing **${serverQueue.songs[0].title}**`);
    }
}