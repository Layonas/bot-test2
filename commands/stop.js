module.exports={
    name: 'stop',
    alias: ['stop', 'st', 's', 'sto', 'ds'],
    usage: '!<alias>',
    example: '!stop',
    description: 'Stops the music that is being played with the bot.',
    async execute(msg, serverQueue, queue)
    {
        msg.delete({timeout: 3000});
        serverQueue = await queue.get(msg.guild.id);
        if(msg.author.id === process.env.USER_OWNER) {
            serverQueue.songs = [];
            if(serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.end();
            console.log('Forced Stop!');
            return msg.reply('Tu sustabdei muzikos grojima!');
        }
        if(!msg.member.voice.channel) return msg.reply('Tu negali sustabdyti muzikos nes tu nesi pasikalbėjimų kanale!');
        if(msg.member.voice.channel.id !== process.env.MUSIC_CHANNEL) return msg.reply('Tu turi būti **Music** kanale!');
        if(!serverQueue) return msg.reply('Nėra ką stabdyti, nes muzika negroja!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        if(await queue.get(msg.guild.id)) queue.delete(msg.guild.id);
        console.log('Forced Stop!');
        return msg.reply('Tu sustabdei muzikos grojima!');
    }
};