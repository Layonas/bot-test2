module.exports = {
    name: 'skip',
    alias: ['skip', 'sk', 'ski'],
    usage: '!<alias>',
    example: '!skip',
    description: 'Skips the current song to the next song in queue.',
    async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
        if(holder !== true) msg.delete({timeout: 3000});
        if(!msg.member.voice.channel)
            if(holder === true)
                return await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `Tu negali praleisti muzikos, nes nesi kalbėjimo kanale!`
                }}});
            else
                return msg.reply('Tu negali praleisti muzikos, nes nesi kalbėjimo kanale!');

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
                    content: `Nėra dainų, kurias būtu galima praleisti!`
                }}});
            else
                return msg.reply('Nėra dainų, kurias būtu galima praleisti!');

        if(!args[1] && !msg.input){
            try {
                serverQueue.connection.dispatcher.end();
            } catch (error) {
                serverQueue.voiceChannel = msg.member.voice.channel;
                serverQueue.connection = await serverQueue.voiceChannel.join();
                console.log("Connection: " + serverQueue.connection !== null);
                console.log(error);
                serverQueue.connection.dispatcher.end();
            }

            if(holder === true){
                await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `Tu praleidai dainą!`
                }}});
            }
            else
                msg.reply('Tu praleidai dainą!');

        return console.log('Skipped a song.');
        }
        if(isNaN(args[1]) && !msg.input) return msg.reply(`${args[1]} nėra skaičius!`);

        try {
            if(msg.input)
                serverQueue.songs.splice(0, msg.input-1);
            else
                serverQueue.songs.splice(0, parseInt(args[1])-1);

            await serverQueue.connection.dispatcher.end();

            if(holder === true)
                await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `${msg.author.username} praleido ${msg.input} dainų!`
                }}});
            else
                msg.channel.send(`${msg.author.username} praleido ${args[1]} dainų!`);

            return console.log(`Skipped ${args[1]} songs.`);
        } catch (error) {
            console.error(error);
            if(holder === true)
                return await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                    content: `Atsiprašome įvyko klaida, bandykite sumažinti skaičių arba bandykite vėliau!`
                }}});
            else
                return msg.reply(`Atsiprašome įvyko klaida, bandykite sumažinti skaičių arba bandykite vėliau!`);
        } 
    }
};