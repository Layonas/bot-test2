module.exports = {
    name: 'resume',
    alias: ['resume'],
    description: 'Resumes the song that was paused.',
    execute(msg, queue, serverQueue){
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('Tu turi būti **Music** kalbėjimo kanale, kad galėtum pratęsti pristabdytą dainą!');
        if(msg.member.voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Tu turi būti **Music** kanale!');
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