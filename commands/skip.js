module.exports = {
    name: 'skip',
    description: 'Skips the current song to the next song in queue.',
    execute(msg, serverQueue){
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('Tu negali praleisti muzikos, nes nesi kalbėjimo kanale!');
        if(msg.member.voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Tu turi būti **Music** kanale!');
        if(!serverQueue) return msg.reply('Nėra dainų, kurias būtu galima praleisti!');
        serverQueue.connection.dispatcher.end();
        msg.reply('Tu praleidai dainą!');
        console.log('Skipped a song.');
    }
}