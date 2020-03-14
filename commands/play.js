module.exports ={
    name: 'play',
    description: 'Plays a song that a user inputs.',
    async execute(msg, args, ytdl, queue, serverQueue, youtube)
    {
        msg.channel.bulkDelete(1);
        if (!args[1]) return msg.reply('Add a link or just a name of a song!');
        const url = args[1];
        const searchString = args.slice(1).join(' ');
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel) return msg.reply('You have to be in a voice channel!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('You must be in **music** voice channel!');

        if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            const playlist = await youtube.getPlaylist(url);
            const videos  = await playlist.getVideos();
            for (const video of Object.values(videos)){
                const video2 = await youtube.getVideoByID(video.id); // eslint disable line no await in loop
                await handleVideo(video2, msg, voiceChannel, true); // eslint disable line no await in loop
            }
            msg.channel.send(`Playlist **__${playlist.title}__** has been added to the list!`);
        }else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 1);
                    var video  = await youtube.getVideoByID(videos[0].id);
                } catch (err) {
                    console.error(err);
                    return msg.reply('No video was found!');
                }
            }
            return handleVideo(video, msg, voiceChannel);
        }

   async function handleVideo (video, msg, voiceChannel , playlist = false){
            const song = {
                title: video.title,
                id: video.id,
                url: `https://www.youtube.com/watch?v=${video.id}`,
            }
    
            if (!serverQueue) 
            {
                const queueConstruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    playing: true
                };
                queue.set(msg.guild.id, queueConstruct);
                queueConstruct.songs.push(song);
    
                try {
                    var connection = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    play(msg.guild, queueConstruct.songs[0]);
                } catch (error) {
                    queue.delete(msg.guild.id);
                    console.error(error);
                }
            } else{
                        serverQueue.songs.push(song);
                        if (playlist) return;
                            else return msg.channel.send(`**${song.title}** added to the queue!`);
            }
        }



    function play (guild, song)
        {
            const serverQueue = queue.get(guild.id);
            
            if (!song)
            {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
            const dispatcher = serverQueue.connection.playStream(ytdl(song.url, {filter: "audioonly"}));
            dispatcher.on('end', () =>{
                          console.log('Song ended and shifted to the next one!');
                          serverQueue.songs.shift();
                          play(guild, serverQueue.songs[0]);
                      })
                      .on('error', error => console.error(error));

                      serverQueue.textChannel.send(`**${song.title}** started playing!`);
        }




    }
}