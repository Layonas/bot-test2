module.exports = {
    name: 'skip',
    description: 'Skips the current song to the next song in queue.',
    execute(msg, serverQueue){
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('You cant skip the music!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('You must be in **music** voice channel!');
        if(!serverQueue) msg.reply('No songs to skip');
        serverQueue.connection.dispatcher.end();
        msg.reply('Skipped a song!');
        console.log('Skipped a song.');
    }
}