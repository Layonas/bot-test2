module.exports = {
    name: 'skip',
    description: 'Skips the current song to the next song in queue.',
    async execute(msg, serverQueue, args){
        msg.channel.bulkDelete(1);
        if(!msg.member.voiceChannel) return msg.reply('Tu negali praleisti muzikos, nes nesi kalbėjimo kanale!');
        if(msg.member.voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Tu turi būti **Music** kanale!');
        if(!serverQueue) return msg.reply('Nėra dainų, kurias būtu galima praleisti!');
        if(!args[1]){
        serverQueue.connection.dispatcher.end();
        msg.reply('Tu praleidai dainą!');
        return console.log('Skipped a song.');
        }
        if(isNaN(args[1])) return msg.reply(`${args[1]} nėra skaičius!`);

        try {
            for(var i = 0; i < parseInt(args[1]); i++)
            {
                await serverQueue.connection.dispatcher.end();
            }
            if (parseInt(args[1]) % 10 === 0 || parseInt(args[1]) >= 100) msg.channel.send(`${msg.author.username} praleido ${args[1]} dainų!`);
            else if (parseInt(args[1]) > 1 && parseInt(args[1]) < 100) msg.channel.send(`${msg.author.username} praleido ${args[1]} dainas!`);
            return console.log(`Skipped ${args[1]} songs.`)
        } catch (error) {
            console.error(error);
            return msg.reply(`Atsiprašome įvyko klaida, bandykite sumažinti skaičių arba bandykite vėliau!`);
        } 
    }
}