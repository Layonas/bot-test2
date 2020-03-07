module.exports={
    name: 'stop',
    description: 'Stops the music that is being played with the bot.',
    execute(msg, serverQueue)
    {
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('You cant stop the music!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('You must be in **music** voice channel!');
        if(!serverQueue) return msg.reply('There is nothing to skip!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        msg.reply('You have stopped the music!');
        console.log('Forced Stop!');

    }
}