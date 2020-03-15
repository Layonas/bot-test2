module.exports = {
    name: 'pause',
    description: 'Pauses the song that is playing.',
   async execute(msg, queue, serverQueue){
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('Tu turi būti **Music** kalbėjimo kanale, kad galėtum pristabdyti dainą!');
        if(msg.member.voiceChannel.name.toLowerCase() !== 'music') return msg.reply("Tu negali pristabdyti muzikos, nes nesi **Music** kanale!");
        if(serverQueue && serverQueue.playing)
        {
        await serverQueue.connection.dispatcher.pause();
        serverQueue.playing = false;
        msg.reply('Tu pristabdei muziką!')
        return console.log('The song has been paused!');
        } 
        else return msg.reply('Tu negali pristabdyti muzikos, nes jokia muzika negroja!');
    }
}