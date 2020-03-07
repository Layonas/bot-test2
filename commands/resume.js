module.exports = {
    name: 'resume',
    description: 'Resumes the song that was paused.',
    execute(msg, queue, serverQueue){
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('You have to be in **music** voice channel to resume the song!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('You must be in **music** voice channel!');
        if(serverQueue && !serverQueue.playing)
        {
        serverQueue.connection.dispatcher.resume();
        serverQueue.playing = true;
        msg.reply('You have resumed the song!');
        console.log('The song has been resumed.');
        }
        else return msg.reply('You cant resume nothing!');
    }
}