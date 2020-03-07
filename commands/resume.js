module.exports = {
    name: 'resume',
    description: 'Resumes the song that was paused.',
    execute(msg, queue, serverQueue){
        msg.channel.bulkDelete(1);
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