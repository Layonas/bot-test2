
module.exports = {
    name: 'skip',
    description: 'Skips the current song to the next song in queue.',
    execute(msg, servers){
        var server = servers[msg.guild.id];
        if(server.dispatcher) server.dispatcher.end();
        msg.reply('Skipped a song!');
        console.log('Skipped a song.');
    }
}
