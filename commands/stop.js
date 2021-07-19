module.exports={
    name: 'stop',
    alias: ['stop', 'st', 's', 'sto', 'ds'],
    usage: '!<alias>',
    example: '!stop',
    description: 'Stops the music that is being played with the bot.',
    async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
        
        if(holder !== true) msg.delete({timeout: 3000});

        serverQueue = await queue.get(msg.guild.id);

        if(msg.author.id === process.env.USER_OWNER) {
            serverQueue.songs = [];
            if(serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.end();
            console.log('Forced Stop!');
            if(holder === true)
                return await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `Tu sustabdei muzikos grojima!`
                }}});
            else
                return msg.reply('Tu sustabdei muzikos grojima!');
        }

        if(!msg.member.voice.channel) 
            if(holder === true)
                return await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `Tu negali sustabdyti muzikos nes tu nesi pasikalbėjimų kanale!`
                }}});
            else
                return msg.reply('Tu negali sustabdyti muzikos nes tu nesi pasikalbėjimų kanale!');

        if(msg.member.voice.channel.id !== process.env.MUSIC_CHANNEL)
            if(holder === true)
                return await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `Tu turi būti **Music** kanale!`
                }}});
            else
                return msg.reply('Tu turi būti **Music** kanale!');

        if(!serverQueue) 
            if(holder === true)
                return await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `Nėra ką stabdyti, nes muzika negroja!`
                }}});
            else
                return msg.reply('Nėra ką stabdyti, nes muzika negroja!');

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();

        if(await queue.get(msg.guild.id)) queue.delete(msg.guild.id);
        console.log('Forced Stop!');
        if(holder === true)
            return await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                content: `Tu sustabdei muzikos grojima!`
            }}});
        else
            return msg.reply('Tu sustabdei muzikos grojima!');
    }
};