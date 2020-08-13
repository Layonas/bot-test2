module.exports={
    name: 'stop',
    alias: ['stop', 'st', 's', 'sto', 'ds'],
    description: 'Stops the music that is being played with the bot.',
    execute(msg, serverQueue)
    {
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('Tu negali sustabdyti muzikos nes tu nesi pasikalbėjimų kanale!');
        if(msg.member.voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Tu turi būti **Music** kanale!');
        if(!serverQueue) return msg.reply('Nėra ką stabdyti, nes muzika negroja!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        console.log('Forced Stop!');
        return msg.reply('Tu sustabdei muzikos grojima!');
    }
};