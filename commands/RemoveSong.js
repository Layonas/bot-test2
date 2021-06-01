module.exports = {
name: 'RemoveSong',
alias: ['rs','removesong','removes','songremove'],
usage: '!<alias> (optional) <index>',
example: '!removesong',
description: 'Removes a specific song form a playlist you just have to choose it',
async execute(msg, args, serverQueue, OwnerID){

    msg.delete({timeout: 3000});
    //-------------------------------------------------------------------------------------------------------
    //Checking if a user is legal to use the command
    const voiceChannel = msg.member.voice.channel;
    if(!voiceChannel) return msg.reply('Prisijunkite prie **Music** kanalo!');
    if(msg.author.id !== OwnerID) return;
    //if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply(`Jūs turite būti **Music** kanale!`);
    //-------------------------------------------------------------------------------------------------------

        const Discord = require('discord.js');
        if(!serverQueue) return msg.reply('Šiuo metu niekas negroja.');
    //-------------------------------------------------------------------------------------------------------
    //Sending information about the queue
        try {
            msg.channel.send(`Pasirinkite, kurią dainą norite pašalinti,`);
                let embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setThumbnail(msg.author.avatarURL())
                .setDescription(`__**Playlist'as**__
                ${serverQueue.songs.map((song, index) => `**+${index+1}** ${song.title}`).join('\n')}`);
                await msg.channel.send(embed);
                //-------------------------------------------------------------------------------------------------------
                // Getting the response about which song to remove
                await msg.channel.awaitMessages(msg2 => msg2.content > 1 && msg2.content <= serverQueue.songs.length && msg.author.id === msg2.author.id, { max: 1 })
                .then(async collected => {
                    var remove = parseInt(collected.first().content);
                    collected.first().channel.send(`${collected.first().author.username} sėkmingai pašalino -- ${serverQueue.songs[remove-1].title}`);
                    return await serverQueue.songs.splice(remove-1, 1);
                })
                .catch(collected => collected.first().channel.send("Įvyko klaida."));
                //-------------------------------------------------------------------------------------------------------

        } catch (error1) {
                try {
                    console.error(error1);
                    //-------------------------------------------------------------------------------------------------------
                    //If there are to many songs send this
                        let holder = serverQueue.songs.slice(0, 30);
                        let embed = new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setThumbnail(msg.author.avatarURL())
                        .setDescription(`__**Playlist'as**__
                        ${holder.map((song, index) => `**+${index+1}** ${song.title}`).join('\n')}

Dabar yra **${serverQueue.songs.length}** dainų sąraše!`);
                    msg.channel.send(embed);
                    //-------------------------------------------------------------------------------------------------------

                    //-------------------------------------------------------------------------------------------------------
                    //Catch if the user wants to see page 2 etc. or to remove a song
                    await msg.channel.awaitMessages(msg2 => msg2.content > 1 && msg2.content <= 30 && msg.author.id === msg2.author.id, { max: 1 })
                    .then(async collected => {
                        var remove = parseInt(collected.first().content);
                        collected.first().channel.send(`${collected.first().author.username} sėkmingai pašalino -- ${serverQueue.songs[remove-1].title}`);
                        return await serverQueue.songs.splice(remove-1, 1);
                    })
                    .catch(collected => collected.first().channel.send("Įvyko klaida."));
                
}
catch(e){
    console.log(e);
    msg.reply('WTF');
}
}}
};