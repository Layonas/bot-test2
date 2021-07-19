module.exports = {
   name: 'np',
   alias: ['np', 'nowplaying', 'now', 'playing'],
   usage: '!<alias>',
   example: '!nowplaying',
   description: 'Tells what is the song that is currently playing.',
   async execute(msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
      if(holder !== true)
         msg.delete({timeout: 3000});
      var Hours = new Date();
      var minutes = new Date();
      var seconds = new Date();
      var sekundes;
      var min = 0;
      var h = 0;
      if(!serverQueue) 
         if(holder === true)
            return bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
               content: 'Dabar niekas negroja!'
            }}});
         else return msg.reply('Dabar niekas negroja!');

      sekundes = (serverQueue.songs[0].msgHours + serverQueue.songs[0].hours - Hours.getHours()) * 3600 + (serverQueue.songs[0].msgMinutes + serverQueue.songs[0].minutes - minutes.getMinutes()) * 60 + (serverQueue.songs[0].msgSeconds + serverQueue.songs[0].seconds - seconds.getSeconds()) ;
      var ho = 0;
         if(sekundes > 3600){
            min = sekundes / 60;
            h  = min / 60;
            ho = h.toString().slice(0,1);
            min = min - ho*60;
         } else if(sekundes > 60){
            min = sekundes / 60;
         }
         if (min >= 10) var m = min.toString().slice(0,2);
         else var m = min.toString().slice(0,1); // eslint-disable-line

         sekundes = sekundes - ho*3600 - m*60;

         if(holder === true)
            return bot.api.interactions(msg.interaction.id, msg.interaction.token).callback.post({data: {type: 4, data: {
               content: `Dabar groja **${serverQueue.songs[0].title}**
__Dainos nuoroda__ <${serverQueue.songs[0].url}>
__Dainos ilgis__ ${serverQueue.songs[0].hours}h ${serverQueue.songs[0].minutes}min ${serverQueue.songs[0].seconds}s
__Daina dar truks__ ${ho}h ${m}m ${sekundes}s
__Dainos garsas__ **${serverQueue.volume}**`
            }}});

         else return msg.reply(`Dabar groja **${serverQueue.songs[0].title}**
__Dainos nuoroda__ <${serverQueue.songs[0].url}>
__Dainos ilgis__ ${serverQueue.songs[0].hours}h ${serverQueue.songs[0].minutes}min ${serverQueue.songs[0].seconds}s
__Daina dar truks__ ${ho}h ${m}m ${sekundes}s
__Dainos garsas__ **${serverQueue.volume}**`);
}
};