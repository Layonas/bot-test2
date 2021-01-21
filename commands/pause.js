module.exports = {
    name: 'pause',
    alias: ['pause'],
    usage: '!<alias>',
    example: '!pause',
    description: 'Pauses the song that is playing.',
   async execute(msg, queue, serverQueue){
        await msg.delete({timeout: 3000});
        if(!msg.member.voice.channel) return msg.reply('Tu turi būti **Music** kalbėjimo kanale, kad galėtum pristabdyti dainą!');
        if(msg.member.voice.channel.name.toLowerCase() !== 'music') return msg.reply("Tu negali pristabdyti muzikos, nes nesi **Music** kanale!");
        if(serverQueue && serverQueue.playing)
        {
        await serverQueue.connection.dispatcher.pause();
        serverQueue.playing = false;
        msg.reply('Tu pristabdei muziką!');
        return console.log('The song has been paused!');
        } 
        else return msg.reply('Tu negali pristabdyti muzikos, nes jokia muzika negroja!');
    }
};