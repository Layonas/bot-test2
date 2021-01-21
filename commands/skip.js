module.exports = {
    name: 'skip',
    alias: ['skip', 'sk', 'ski'],
    usage: '!<alias>',
    example: '!skip',
    description: 'Skips the current song to the next song in queue.',
    async execute(msg, serverQueue, args){
        await msg.delete({timeout: 3000});
        if(!msg.member.voice.channel) return msg.reply('Tu negali praleisti muzikos, nes nesi kalbėjimo kanale!');
        if(msg.member.voice.channel.id !== process.env.MUSIC_CHANNEL) return msg.reply('Tu turi būti **Music** kanale!');
        if(!serverQueue) return msg.reply('Nėra dainų, kurias būtu galima praleisti!');
        if(!args[1]){
        serverQueue.connection.dispatcher.end();
        msg.reply('Tu praleidai dainą!');
        return console.log('Skipped a song.');
        }
        if(isNaN(args[1])) return msg.reply(`${args[1]} nėra skaičius!`);

        try {
                serverQueue.songs.splice(0, parseInt(args[1])-1);
                await serverQueue.connection.dispatcher.end();

            if (parseInt(args[1]) % 10 === 0 || parseInt(args[1]) >= 100) msg.channel.send(`${msg.author.username} praleido ${args[1]} dainų!`);
            else if (parseInt(args[1]) > 1 && parseInt(args[1]) < 100) msg.channel.send(`${msg.author.username} praleido ${args[1]} dainas!`);
            return console.log(`Skipped ${args[1]} songs.`);
        } catch (error) {
            console.error(error);
            return msg.reply(`Atsiprašome įvyko klaida, bandykite sumažinti skaičių arba bandykite vėliau!`);
        } 
    }
};