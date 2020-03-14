module.exports={
    name: 'stop',
    description: 'Stops the music that is being played with the bot.',
    execute(msg, serverQueue)
    {
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('You cant stop the music!');
        if(msg.member.voiceChannel.name.toLowerCase() !== 'music') return msg.reply('You must be in **music** voice channel!');
        if(!serverQueue) return msg.reply('There is nothing to stop!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        console.log('Forced Stop!');
        return msg.reply('You have stopped the music!');
    }
}