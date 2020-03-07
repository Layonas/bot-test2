module.exports = {
    name: 'skip',
    description: 'Skips the current song to the next song in queue.',
    execute(msg, serverQueue){
        if(!msg.member.voiceChannel) return msg.reply('You cant stop the music!');
        if(!serverQueue) msg.reply('No songs to skip');
        serverQueue.connection.dispatcher.end();
        msg.reply('Skipped a song!');
        console.log('Skipped a song.');
    }
}