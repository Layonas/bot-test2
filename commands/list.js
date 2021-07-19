const Discord = require('discord.js');
module.exports = {
        name: 'playlist',
        alias: ['playlist', 'pl', 'play list', 'list'],
        usage: '!<alias>',
        example: '!playlist',
        description: 'Full list of songs that are currently in the queue.',
        async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
        
        let checker = holder;
        let embed = new Discord.MessageEmbed();
        var PlayListLenght = 0;

        if(!serverQueue) 
        if(checker === true)
                return  await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                                content: `Šiuo metu niekas negroja.`
                        }}});
        else        
                return msg.reply('Šiuo metu niekas negroja.');

        for(var i = 0; i < serverQueue.songs.length; i++)
        {
                PlayListLenght += serverQueue.songs[i].hours*3600 + serverQueue.songs[i].minutes*60+serverQueue.songs[i].seconds;    
        }

        var PlayListLenghtMinutes = Math.floor(PlayListLenght/60); 
        var PlayListLenghtseconds = PlayListLenght - PlayListLenghtMinutes*60; 

        if(serverQueue.songs.length < 20){
                embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setThumbnail(msg.author.avatarURL())
                .setDescription(`__**Playlist'as**__
                ${serverQueue.songs.map((song, index) => 

`**+${index+1}** ${song.title}`).join('\n')}
Dabar yra **${serverQueue.songs.length}** dainų saraše!
**__Dabar groja:__**  ${serverQueue.songs[0].title}
**__Grojamos dainos linkas__** <${serverQueue.songs[0].url}>
**__Dainą užsakė__** ${serverQueue.requester[0]}
**__Dainos garsas__**  **${serverQueue.volume}**
**__Apytiksli trukmė__**  **${PlayListLenghtMinutes + 'min ' + PlayListLenghtseconds + 's'}**`);

        }
        else{               
                let holder = serverQueue.songs.slice(0, 20);
                embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setThumbnail(msg.author.avatarURL())
                .setDescription(`__**Playlist'as**__
                ${holder.map((song, index) =>

`**+${index+1}** ${song.title}`).join('\n')}
Dainų sąraše yra tik 20 dainų, tačiau tai ne visos!        
Dabar yra **${serverQueue.songs.length}** dainų sąraše!
**__Dabar groja:__**  ${holder[0].title}
**__Grojamos dainos linkas__** <${serverQueue.songs[0].url}>
**__Dainą užsakė__** ${serverQueue.requester[0]}
**__Dainos garsas__**  **${serverQueue.volume}**
**__Apytiksli trukmė__**  **${PlayListLenghtMinutes + 'min' + PlayListLenghtseconds + 's'}**`);

        } 

        if(checker === true){
                await bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
                        content: `Dainų sąrašas:`
                }}});
                return msg.channel.send(embed).catch(error => {console.log(error); msg.channel.send('Ups, paslydau.');});
        }
        else {
                msg.delete({timeout: 3000});
                return msg.channel.send(embed).catch(error => {console.log(error); msg.channel.send('Ups, paslydau.');});
        }

}
};