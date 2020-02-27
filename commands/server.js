module.exports = {
    name: 'server',
    description: 'Mc server checker.',
    execute(msg, ping, RichEmbed){
        if (msg.author.username !== 'AdvancingBot1')
        {
        ping ('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>
        {
            if (error) throw error;
            if (response.version.slice(4) === 'Online')
            {
            const Embed = new RichEmbed()
                .setTitle('Server status')
                .addField('Status', response.version.slice(4), true )
                .addField('Online players', 'One or more:)', true)
                .addField('Server IP', response.host)
                .setColor(0x3AFF00 )
                .setThumbnail(msg.author.avatarURL)
                

            msg.channel.send(Embed);
            console.log(response)
            }
            else 
            {
            const Embed = new RichEmbed()
                .setTitle('Server status')
                .addField('Status', response.version.slice(4), true )
                .addField('Online players', response.onlinePlayers, true)
                .addField('Server IP', response.host)
                .setColor(0xFF2D00 )
                .setThumbnail(msg.author.avatarURL)
                

            msg.channel.send(Embed);
            console.log(response)
            }
        })
        }
    }
}