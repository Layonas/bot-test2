module.exports ={
    name: 'play',
    description: 'Plays a song that a user inputs.',
    async execute(msg, args, ytdl, queue, serverQueue)
    {
        msg.channel.bulkDelete(1);
        if (!args[1]) return msg.reply('Add a link!');
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel) return msg.reply('You have to be in a voice channel!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('You must be in **music** voice channel!');

        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url
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
                   return msg.channel.send(`**${song.title}** added to the queue!`);
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