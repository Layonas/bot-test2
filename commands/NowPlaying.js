module.exports = {
    name: 'NowPlaying',
    description: 'Tells what is the song that is currently playing.',
    execute(msg, serverQueue){
        msg.channel.bulkDelete(1);
        var minutes = new Date();
        var seconds = new Date();
        var sekundes;
        var min = 0;
        if((serverQueue.songs[0].msgMinutes+serverQueue.songs[0].minutes) > 60){
            sekundes = ((serverQueue.songs[0].msgMinutes+serverQueue.songs[0].minutes) -60)*60 - minutes.getMinutes() * 60 + serverQueue.songs[0].msgSeconds + serverQueue.songs[0].seconds - seconds.getSeconds();
        }else sekundes = (serverQueue.songs[0].msgMinutes+serverQueue.songs[0].minutes) *60 - minutes.getMinutes() * 60 + serverQueue.songs[0].msgSeconds + serverQueue.songs[0].seconds - seconds.getSeconds();

        if(!serverQueue) return msg.reply('Dabar niekas negroja!');
        if(serverQueue.songs[0].hours === 0){
                while(sekundes > 60){
                    min++;
                    sekundes = sekundes - 60;
                }
            return msg.reply(`Dabar groja **${serverQueue.songs[0].title}**
__Dainos nuoroda__ <${serverQueue.songs[0].url}>
__Dainos ilgis__ ${serverQueue.songs[0].minutes}min ${serverQueue.songs[0].seconds}s
__Daina dar truks__ ${min}min ${sekundes}s`);
        }

        if(serverQueue.songs[0].hours === 0){
            if(serverQueue.songs[0].minutes === 0){
return msg.reply(`Dabar groja **${serverQueue.songs[0].title}**
__Dainos nuoroda__ <${serverQueue.songs[0].url}>
__Dainos ilgis__ ${serverQueue.songs[0].seconds}s
__Daina dar truks__ ${sekundes}s`);
            }
        }

            return msg.reply(`Dabar groja **${serverQueue.songs[0].title}**
__Dainos nuoroda__ <${serverQueue.songs[0].url}>
__Dainos ilgis__ ${serverQueue.songs[0].hours}h ${serverQueue.songs[0].minutes}min ${serverQueue.songs[0].seconds}s`);
    
}
};