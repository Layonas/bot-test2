module.exports ={
    name: 'play',
    description: 'Plays a song that a user inputs.',
    async execute(msg, args, ytdl, queue, serverQueue, youtube)
    {
        msg.channel.bulkDelete(1);
        const voiceChannel = msg.member.voiceChannel;
        console.log(msg.author.id);
        if (msg.author.username !== 'Layon'){
        if(!voiceChannel) return msg.reply('Prisijunkite prie **Music** kanalo!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Jūs turite būti **Music** kanale!');
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
                    try {
                        const video2 = await youtube.getVideoByID(video.id); // eslint disable line no await in loop
                        await handleVideo(video2, msg, voiceChannel, true); // eslint disable line no await in loop
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
            msg.channel.send(`Playlist'as **__${playlist.title}__** buvo pridėtas prie sąrašo eilės!`);
            console.log(`Playlist has been added with ${videos.length} songs in the queue!`);
        }else{
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                
                try {
                    var videos = await youtube.searchVideos(searchString, 1);
                    var video  = await youtube.getVideoByID(videos[0].id); //eslint-disable-line
                } catch (err) {
                    console.error(err);
                    return msg.reply('Nepavyko rasti muzikos, kurios norėjote, prašome bandyti dar kartą!');
                }
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
    };
    
    if (!serverQueue) 
    {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            requester: [],
            connection: null,
            songs: [],
            playing: true
        };
        console.log(`Queue has been made!`);
        queue.set(msg.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        queueConstruct.requester.push(msg.author.username);// kas pirmas papraso to visada raso
    
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
        else return msg.channel.send(`**${song.title}** pridėta prie sąrašo!`);
        }
return undefined;
}



async function play (guild, song){
    const serverQueue = queue.get(guild.id);
            
    if (!song){
    await serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
}
    const dispatcher = await serverQueue.connection.playStream(ytdl(song.url, {filter: "audioonly"}));
    dispatcher.on('end', () =>{
         console.log('Song ended and shifted to the next one!');
        serverQueue.songs.shift();
        serverQueue.requester.shift();
        play(guild, serverQueue.songs[0]);
    })
                .on('error', error => console.error(error));
                serverQueue.textChannel.send(`**${song.title}** pradėjo groti!`);
}
}
};