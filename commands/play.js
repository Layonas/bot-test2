module.exports ={
    name: 'play',
    alias: ['play', 'p', 'pla', 'plai'],
    usage: '!<alias> <song_name || song_url>',
    example: '!play some random song',
    description: 'Plays a song that a user inputs.',
    async execute(msg, args, ytdl, queue, serverQueue, youtube)
    {
        await msg.delete({timeout: 3000});
        var voiceChannel = msg.member.voice.channel;
        if (msg.author.username !== 'Layon'){
            if(!voiceChannel) return msg.reply('Prisijunkite prie **Music** kanalo!');
            if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Jūs turite būti **Music** kanale!');
        }
        else{
            if(!msg.guild.members.cache.get(process.env.USER_BOT).voice.channel){
                voiceChannel = msg.guild.channels.cache.get('543848191435603979');
            }
        }
        if (!args[1]) return msg.reply('Jūs turite pridėti dainos pavadinima arba dainos nuorodą!');
        const url = args[1];
        const searchString = args.slice(1).join(' ');
        console.log(`Order was requested.`);
        
        if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            const playlist = await youtube.getPlaylist(url);
            const videos  = await playlist.getVideos();
            //return console.log(videos.length) //veikia
            for (const video of Object.values(videos)){
                try {
                    const video2 = await youtube.getVideoByID(video.id); // eslint disable line no await in loop
                    await handleVideo(video2, msg, voiceChannel, true); // eslint disable line no await in loop
                } catch (error) {
                    console.log('Song error in the Playlist. Song is either deleted or private.');
                    // try {
                    //     const video2 = await youtube.getVideoByID(video.id); // eslint disable line no await in loop
                    //     await handleVideo(video2, msg, voiceChannel, true); // eslint disable line no await in loop
                    // } catch (err) {
                    //     console.log(err);
                    // }
                }
            }
            msg.channel.send(`Playlist'as **__${playlist.title}__** buvo pridėtas su **${videos.length}** dainų prie sąrašo eilės!`);
            console.log(`Playlist has been added with **${videos.length}** songs in the queue!`);
        }else{
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {               
                //console.log(err1 + ' Tai ne URL! ');
                try {
                    var videos = await youtube.searchVideos(searchString, 1);
                    var video  = await youtube.getVideoByID(videos[0].id); //eslint-disable-line
                } catch (err) {
                    console.log(err);
                    return msg.reply('Nepavyko rasti muzikos, kurios norėjote, prašome bandyti dar kartą!');
                }
                
            }
            var stringCheck = video.title.toLowerCase();
            if(stringCheck.match(/krsna|kr\$na|krisna|kri\$na/gi))
            {
                var videos = await youtube.searchVideos('Dj Rimvis - Pashol v Pizdu', 1); //eslint-disable-line
                var video  = await youtube.getVideoByID(videos[0].id); //eslint-disable-line
                return handleVideo(video, msg, voiceChannel);
            }
            console.log(`Video has been added.`);
            return handleVideo(video, msg, voiceChannel);
            
        }

async function handleVideo (video, msg, voiceChannel , playlist = false){
    const serverQueue = queue.get(msg.guild.id);
    const song = {
        title: video.title,
        id: video.id,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        hours: video.duration.hours,
        minutes: video.duration.minutes,
        seconds: video.duration.seconds,
        msgHours: null,
        msgMinutes: null,
        msgSeconds: null,
    };
    
    if (!serverQueue) 
    {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            requester: [],
            connection: null,
            songs: [],
            playing: true,
            volume: 100,
        };
        console.log(`Queue has been made!`);
        await queue.set(msg.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        queueConstruct.requester.push(msg.author.username); 
    
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            await play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            queue.delete(msg.guild.id);
            console.error(error);
        }

    } else{
        await serverQueue.songs.push(song);
        await serverQueue.requester.push(msg.author.username);
        //console.log(serverQueue.songs);
        if (playlist) return;//console.log(serverQueue.songs.length);
        else return await msg.channel.send(`**${song.title}** pridėta prie sąrašo, jos vieta **${serverQueue.songs.length}**!
        Dainos trukmė: **${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}**`);
        }
return undefined;
}



async function play (guild, song){
    const serverQueue = await queue.get(guild.id);
            
    if (!song){
    await serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
}
    const dispatcher = await serverQueue.connection.play(ytdl(song.url, {filter: "audioonly"}));
    dispatcher.on('finish', () =>{
        console.log('Song ended and shifted to the next one!');
        serverQueue.songs.shift();
        serverQueue.requester.shift();
        play(guild, serverQueue.songs[0]);
    })
        .on('error', error => console.error(error));

    dispatcher.setVolume(serverQueue.volume/100);
    
    const filter = m => m.author.id === process.env.USER_BOT;
    const collector = msg.channel.createMessageCollector(filter, { time: 3000 });

collector.on('collect', m => {
    console.log(`Got the time.`);
    serverQueue.songs[0].msgHours = m.createdAt.getHours();
    serverQueue.songs[0].msgMinutes = m.createdAt.getMinutes();
    serverQueue.songs[0].msgSeconds = m.createdAt.getSeconds();
});
collector.on('end', collected => { // eslint-disable-line
	console.log(`Shutting down!`);
});

serverQueue.textChannel.send(`**${song.title}** pradėjo groti!`);

}
    }
};
