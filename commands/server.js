module.exports = {
    name: 'server',
    alias: ['server'],
    description: 'Mc server checker.',
    execute(msg, ping, RichEmbed){
        if (msg.author.username === 'AdvancingBot1') return;
        
        ping ('g09.rfox.cloud', 10249, (error, response) =>
        {
            if (error) throw error;

            const Embed = new RichEmbed()
                .setTitle('Server status')
                .addField('Version', response.version, true )
                .addField('Online players', response.onlinePlayers, true)
                .addField('Server IP', `${response.host}:${response.port}`)
                .setColor(0x3AFF00)
                .setThumbnail(msg.author.avatarURL);
                

            msg.channel.send(Embed);

        });
    }
};
    
    


