module.exports={
    name: 'stop',
    description: 'Stops the music that is being played with the bot.',
    execute(msg, serverQueue)
    {
        holder.get('p').dispatcher;
        if(!msg.member.voiceChannel) return msg.reply('You cant stop the music!');
        if(!serverQueue) return msg.reply('There is nothing to skip!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        msg.reply('You have stopped the music!');
        console.log('Forced Stop!');

    }
}