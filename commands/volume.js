module.exports = {
    name: 'volume',
    alias: ['vol', 'volume', 'v', 'vo', 'volum'],
    usage: '!<alias> <number>',
    example: '!volume 50',
    description: 'Sets the volume of the songs that are being played',
    execute(msg, args, serverQueue){
        msg.channel.bulkDelete(1);
        const voiceChannel = msg.member.voiceChannel;
        if (msg.author.username !== 'Layon'){
        if(!voiceChannel) return msg.reply('Prisijunkite prie **Music** kanalo!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Jūs turite būti **Music** kanale!');
        }
        if(!serverQueue) return msg.reply(`Dabar niekas negroja!`);
        if(!args[1]) return msg.channel.send(`Dabartinis garsas yra - **${serverQueue.volume}**`);
        if(isNaN(args[1])) return msg.reply(`${args[1]} nėra skaičius! Prašome pasirinkti nuo 1 iki 200.`);
        if(args[1] < 1 || args[1] > 200) return msg.reply(`Skaičius turi būti nuo 1 iki 200!`);

        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolume(serverQueue.volume/100);
        msg.channel.send(`**${msg.author.username}** sekmingai pakeitėte dainos garsą.`);

        return;
    } 
};