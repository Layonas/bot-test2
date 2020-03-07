module.exports = {
    name: 'pause',
    description: 'Pauses the song that is playing.',
    execute(msg, queue, serverQueue){
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('You have to be in a **music** voice channel to pause the song!');
        if(msg.member.voiceChannel.name.toLowerCase() !== 'music') return msg.reply("You cannot stop the song while not being in a **music** voice channel!");
        if(serverQueue && serverQueue.playing)
        {
        serverQueue.connection.dispatcher.pause();
        serverQueue.playing = false;
        msg.reply('You paused the song!')
        console.log('The song has been paused!');
        } 
        else return msg.reply('You cant pause nothing!');
    }
}