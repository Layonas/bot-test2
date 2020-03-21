module.exports = {
    name: 'instaPlay',
    description: 'Adds a song second in the queue no matter the length of a queue',
    async execute(msg, args, ytdl, queue, youtube){
        msg.channel.bulkDelete(1);
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel) return msg.reply('Prisijunkite prie **Music** kanalo!');
        if(voiceChannel.name.toLowerCase() !== 'music') return msg.reply('Jūs turite būti **Music** kanale!');
        if (!args[1]) return msg.reply('Jūs turite pridėti dainos pavadinimą!');
        const searchString = args.slice(1).join(' ');
        const url = args[1];

        try {
            var video = await youtube.getVideo(url);
        } catch (error) {
            
            try {
                var videos = await youtube.searchVideos(searchString, 10);
                msg.channel.send(`__***Song selection!***__
${videos.map((val, index) => `**${++index}** ${val.title}`).join('\n')}
                
__Prašome pasirinkti vaizdo įraša, kurį norite leisti, prašome atrašyti su skaičiumi nuo 1 iki 10!__`);

try {
    var respone = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
        maxMatches: 1,
        time: 10000,
        errors: ['time']
    });

} catch (error) {
    console.error(error);
    return msg.channel.send('Nebuvo teisingai pasirinktas skaičius arba išseko laikas!');    
}
        const videoIndex = parseInt(respone.first().content);
        var video  = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                return msg.reply('Nepavyko rasti muzikos, kurios norėjote, prašome bandyti dar kartą!');
            }
        }

    
    console.log(`Video has been added.`)
    return handleVideo(video, msg, voiceChannel);
    


async function handleVideo (video, msg, voiceChannel , playlist = false){
const serverQueue = queue.get(msg.guild.id);
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
console.log(`Queue has been made!`);
queue.set(msg.guild.id, queueConstruct);
queueConstruct.songs.push(song);

try {
    var connection = await voiceChannel.join();
    queueConstruct.connection = connection;
    await play(msg.guild, queueConstruct.songs[0]);
} catch (error) {
    queue.delete(msg.guild.id);
    console.error(error);
}
} else{
await serverQueue.songs.splice(1, 0, song);
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
play(guild, serverQueue.songs[0]);
})
        .on('error', error => console.error(error));
        serverQueue.textChannel.send(`**${song.title}** pradėjo groti!`);
}
    }
}
