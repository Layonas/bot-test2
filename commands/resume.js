module.exports = {
    name: 'resume',
    alias: ['resume'],
    usage: '!<alias>',
    example: '!resume',
    description: 'Resumes the song that was paused.',
    async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
        await msg.delete({timeout: 3000});
        if(!msg.member.voice.channel) return msg.reply('Tu turi būti **Music** kalbėjimo kanale, kad galėtum pratęsti pristabdytą dainą!');
        if(msg.member.voice.channel.name.toLowerCase() !== 'music') return msg.reply('Tu turi būti **Music** kanale!');
        if(serverQueue && !serverQueue.playing)
        {
        serverQueue.connection.dispatcher.resume();
        serverQueue.playing = true;
        msg.reply('Tu pratesiai pristabdytą dainą!');
        return console.log('The song has been resumed.');
        }
        else return msg.reply('Tu negali pratęsti dainos, nes jokia daina negroja!');
    }
};