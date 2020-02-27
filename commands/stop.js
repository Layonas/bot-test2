
module.exports={
    name: 'stop',
    description: 'Stops the music that is being played with the bot.',
    execute(msg, servers, holder)
    {
        holder.get('play').servers;
        var server = servers[msg.guild.id];
        if(msg.guild.voiceConnection)
        {
            for (var i = server.queue.length -1; i >=0; i--)
            {
                server.queue.splice(i, 1);
            }
            server.dispatcher.end();
            msg.reply('Stopped the songs!');
            console.log('Stopped the songs.');
        }
        if(msg.guild.connection) msg.guild.voiceConnection.disconnect();
    }
}