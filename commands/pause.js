module.exports = {
    name: 'pause',
    description: 'Pauses the song that is playing.',
    execute(msg, queue, serverQueue){
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