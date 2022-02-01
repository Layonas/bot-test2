// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const {Player} = require('discord-music-player');
module.exports = {
    name: "play",
    alias: ["play", "p", "pla", "plai", "seek", "setloop"],
    usage: "!<alias> <song_name || song_url>",
    example: "!play some random song",
    description: "Plays a song that a user inputs.",
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {Array<string>} args 
     * @param {Discord.Client} bot 
     * @param {Discord.CommandInteraction} interaction 
     * @param {Player} player 
     * @returns 
     */
    async execute(msg, args, bot, interaction, player) {
        // eslint-disable-line

        // const ytdl = require("ytdl-core");
        // const Youtube = require('simple-youtube-api');
        // const youtube = new Youtube(process.env.YOUTUBE_API_KEY);
        // const { Client } = require('pg');
        // const { joinVoiceChannel, VoiceConnection, AudioPlayer } = require('@discordjs/voice');

        if(!interaction && (!args[1] && args[0] !== 'setloop')){
            return msg.reply('No arguments specified!');
        }

        //------------------------------------------------------------------------------------------------
        // Variable creation
        var guildID;
        var input;
        var userID;
        var channel;
        try {
            if (interaction) {
                channel = interaction.channel;
                guildID = interaction.guildId;
                input = interaction.options.data[0].value;
                userID = interaction.member.id;
            } else {
                channel = msg.channel;
                guildID = msg.guildId;
                input = msg.content.substring(1).split(" ").slice(1).join(" ");
                userID = msg.member.id;
            }
        } catch (error) {
            return await channel.send("Invalid arguments!\n" + this.usage);
        }

        const voiceChannel = bot.guilds.cache.get(guildID).members.cache.get(userID)
            .voice.channelId;
        if (!voiceChannel)
            return interaction
                ? interaction.editReply("You have to be in a voice channel!")
                : msg.reply("You have to be in a voice channel!");
        //------------------------------------------------------------------------------------------------


        const guildQueue = player.createQueue(guildID); // If I can save the player to DB then do so
                                                        // If I cant save the player maybe I can save the queue
        await guildQueue.join(voiceChannel);

        if(args[0] === 'seek'){
            if(!isNaN(args[1]))
                return guildQueue.seek(parseInt(args[1]) * 1000);
        }
        if(args[0] === 'setloop'){
            if(!args[1])
                return msg.reply(`Please specify to loop a song or a playlist.`);
            else if(args[1] === 'song'){
                guildQueue.setRepeatMode(1);
                return msg.reply('Song loop toggled!');
            }
            else if(args[1] === 'playlist'){
                guildQueue.setRepeatMode(2);
                return msg.reply('Playlist loop toggled!');
            }
            else if(args[1] === 'stop'){
                guildQueue.setRepeatMode(0);
                return msg.reply('Song loop has been stopped!');
            }

        }
        
        if(input.match(/playlist\?list/gi)){

            // eslint-disable-next-line no-unused-vars
            const song = await guildQueue.playlist(input, {
                'requestedBy': bot.users.cache.get(userID), 
                'data': {
                    channel: channel, 
                    interaction: interaction, 
                    msg: msg
                }
            }).catch(() => {
                if(!guildQueue)
                    guildQueue.stop();
            }); // At worst I could save songs in DB and add song again to the queue

        } else{

            // eslint-disable-next-line no-unused-vars
            const song = await guildQueue.play(input, {
                'requestedBy': bot.users.cache.get(userID), 
                'data': {
                    channel: channel, 
                    interaction: interaction, 
                    msg: msg
                }
            }).catch(() => {
                if(!guildQueue)
                    guildQueue.stop();
            }); // At worst I could save songs in DB and add song again to the queue
            
        }



        //         //-----------------------------------------------------------------------------------
        //         //-----------------------------------------------------------------------------------
        //         // Connecting to the database
        //         const client = new Client({
        //         connectionString: process.env.DATABASE_URL,
        //         ssl: {
        //             rejectUnauthorized: false
        //         }
        //         });

        //         await client.connect();
        //         //-----------------------------------------------------------------------------------
        //         const createTable = `CREATE TABLE IF NOT EXISTS queue(
        //             GuildID varchar(255),
        //             Queue json NOT NULL
        //         )`;

        //         await client.query(createTable).catch(err => console.error(err));

        //         const queue = new Map(); // Create DB table with possible information about queue

        //         var voiceChannel, input, voiceID;

        //         if(interaction){
        // console.log('interaction detected');
        //             if(!interaction.channel.name.includes('music'))
        //                 return interaction.reply('You have to be in a music channel for the command to work!');

        //             voiceChannel = bot.guilds.cache.get(interaction.guildId).members.cache.get(interaction.member.id).voice.channel;
        //             voiceID = bot.guilds.cache.get(interaction.guildId).members.cache.get(interaction.member.id).voice.channelId;

        //             if(!voiceChannel)
        //                 return interaction.reply('You have to be in a voice channel!');

        //             input = interaction.options.data[0].value;

        //         } else{
        //             if(!msg.channel.name.includes('music'))
        //                 return msg.reply('You have to be in a music channel for the command to work!');

        //             voiceChannel = bot.guilds.cache.get(msg.guildId).members.cache.get(msg.author.id).voice.channel;
        //             voiceID = bot.guilds.cache.get(msg.guildId).members.cache.get(msg.author.id).voice.channelId;

        //             if(!voiceChannel)
        //                 return msg.reply('You have to be in a voice channel!');

        //             input = args.slice(1).join(' ');
        //         }

        //         GetVideo(input);

        // async function handleVideo (video, msg, playlist = false){

        //     // if queue exists then serverQueue will get info about the queue
        //     //JSON.parse
        //     await client.query(`DELETE FROM queue WHERE GuildID='${msg.guildId}'`).then(console.log('Deleted queue'));
        //     try {
        //         var serverQueue = (await client.query(`SELECT Queue FROM queue WHERE GuildID='${msg.guildId}'`)).rows[0].queue;    //queue.get(msg.guild.id);
        //     } catch (error) {
        //         serverQueue = null;
        //     }

        //     console.log(serverQueue);
        //     //return await client.end().then(console.log('logging'));
        //     const regex = /['"/\\`]*/;
        //     const song = {
        //         title: video.title.replace(regex, " "),
        //         id: video.id,
        //         url: `https://www.youtube.com/watch?v=${video.id}`,
        //         thumbnail: video.thumbnails,
        //         hours: video.duration.hours,
        //         minutes: video.duration.minutes,
        //         seconds: video.duration.seconds,
        //         msgHours: null,
        //         msgMinutes: null,
        //         msgSeconds: null,
        //     };

        //     if (!serverQueue) // if there is no queue already
        //     {

        //         const queueConstruct = {
        //             guild: msg.guild,
        //             textChannel: msg.channel,
        //             voiceChannelID: voiceID,
        //             requester: [],
        //             songs: [],
        //             playing: true,
        //             volume: 100,
        //         };

        //         console.log(`Queue has been made!`);
        //         await queue.set(msg.guildId, queueConstruct);
        //         queueConstruct.songs.push(song);
        //         if(interaction)
        //             queueConstruct.requester.push(interaction.user.username);
        //         else
        //             queueConstruct.requester.push(msg.author.username);

        //         try {

        //             // Insert into DB if queue does not already exist
        //             await client.query("INSERT INTO queue(GuildID, Queue) VALUES('" + msg.guildId + "', '" + JSON.stringify(queueConstruct) + "')")
        //             .then(console.log('Successfully inserted new guild into DB.'));
        //             await client.end();

        //             if(interaction){
        //                 interaction.channel.send(`**${queueConstruct.songs[0].title}** pridėtas ir tuoj pradės groti!`);
        //                 await play(interaction.guild, queueConstruct.songs[0]);
        //             }
        //             else{
        //                 msg.channel.send(`**${queueConstruct.songs[0].title}** pridėtas ir tuoj pradės groti!`);
        //                 await play(msg.guild, queueConstruct.songs[0]);
        //             }

        //         } catch (error) {

        //             await client.end();
        //             if(interaction)
        //                 queue.delete(interaction.guildId);
        //             else
        //                 queue.delete(msg.guildId);
        //             console.error(error);
        //         }

        //     } else{ // If DB holds the serverQueue

        //         await serverQueue.songs.push(song);
        //         if(interaction)
        //             await serverQueue.requester.push(interaction.user.username);
        //         else
        //             await serverQueue.requester.push(msg.author.username);

        //         await client.query(`UPDATE queue SET Queue = '${JSON.stringify(serverQueue)}'`).then(console.log('Updated DB.'));
        //         await client.end();

        //         if (playlist) return;

        //         else if(interaction)
        //             return await interaction.channel.send(`**${song.title}** pridėta prie sąrašo, jos vieta **${serverQueue.songs.length}**!
        //             Dainos trukmė: **${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}**`);

        //         else return await msg.channel.send(`**${song.title}** pridėta prie sąrašo, jos vieta **${serverQueue.songs.length}**!
        //         Dainos trukmė: **${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}**`);
        //     }
        // return undefined;
        // }

        // async function play (guild, song){

        //     const client = new Client({
        //         connectionString: process.env.DATABASE_URL,
        //         ssl: {
        //             rejectUnauthorized: false
        //         }
        //         });
        //     //get queue from DB
        //     await client.connect().then(console.log('on'));
        //     const serverQueue =  await client.query(`SELECT Queue FROM queue WHERE GuildID='${guild.id}'`);//await queue.get(guild.id);

        //     //doesnt connect
        //     joinVoiceChannel({
        //         channelId: serverQueue.voiceChannelID,
        //         guildId: serverQueue.guild.id,
        //         adapterCreator: serverQueue.guild.voiceAdapterCreator
        //     });

        //     if (!song){
        //     voiceChannel.disconnect();
        //     await client.query(`DELETE FROM queue WHERE GuildID='${guild.id}'`).then(console.log('Deleted queue'));
        //     await client.end().then(console.log('off'));
        //     queue.delete(guild.id);
        //     return;
        // }
        //     //const dispatcher = await serverQueue.connection.play(ytdl(song.url, {filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25}));
        //     const dispatcher = voiceChannel.dispatchAudio(ytdl(song.url, {filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25}));

        //     dispatcher.on('finish', async () =>{
        //         // if(!serverQueue){
        //         //     await client.connect();
        //         //     var serverQueue = await client.query(``);//await queue.get(guild.id);   //get queue from DB
        //         // }

        //         serverQueue.songs.shift();
        //         serverQueue.requester.shift();
        //         play(serverQueue.guild, serverQueue.songs[0]);
        //     })
        //         .on('error', error => console.error(error));

        //     dispatcher.setVolume(serverQueue.volume/100);

        //     const filter = m => m.author.id === process.env.USER_BOT;
        //     const collector = msg.channel.createMessageCollector(filter, { time: 3000 });

        // collector.on('collect', m => {
        //     console.log(`Got the time.`);
        //     serverQueue.songs[0].msgHours = m.createdAt.getHours();
        //     serverQueue.songs[0].msgMinutes = m.createdAt.getMinutes();
        //     serverQueue.songs[0].msgSeconds = m.createdAt.getSeconds();
        // });
        // collector.on('end', collected => { // eslint-disable-line
        // 	console.log(`Shutting down!`);
        // });

        // serverQueue.textChannel.send(`**${song.title}** pradėjo groti!`);

        // await client.query(`UPDATE queue SET Queue='${JSON.stringify(serverQueue)}' WHERE GuildID='${guild.id}'`);
        // await client.end().then(console.log('off'));

        // }

        // async function GetVideo(search){

        //     if(search.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){ // If it is a playlist

        //         const playlist = await youtube.getPlaylist(search);
        //         const videos  = await playlist.getVideos();

        //         for (const video of Object.values(videos)){

        //             try {
        //                 const video2 = await youtube.getVideoByID(video.id); // eslint disable line no await in loop
        //                 if(interaction)
        //                     await handleVideo(video2, interaction, true);
        //                 else
        //                     await handleVideo(video2, msg, true); // eslint disable line no await in loop
        //             } catch (error) {
        //                 console.log('Song error in the Playlist. Song is either deleted or private.');
        //             }

        //         }

        //         if(interaction)
        //             interaction.channel.send(`Playlist'as **__${playlist.title}__** buvo pridėtas su **${videos.length}** dainų prie sąrašo eilės!`);
        //         else
        //             msg.channel.send(`Playlist'as **__${playlist.title}__** buvo pridėtas su **${videos.length}** dainų prie sąrašo eilės!`);

        //         console.log(`Playlist has been added with **${videos.length}** songs in the queue!`);

        //     }else if(search.match(/^https?:\/\/(www.youtube.com|youtube.com).*/gm)){ // If this is a url

        //         try {
        //             var video = await youtube.getVideo(search);
        //         } catch (error) {
        //             if(interaction)
        //                 return interaction.channel.send('Could not get the song!');
        //             else
        //                 return msg.channel.send('Could not get the song!');
        //         }

        //         const stringCheck = video.title.toLowerCase();

        //         if(stringCheck.match(/krsna|kr\$na|krisna|kri\$na|despacito 2/gi))
        //         {
        //             var videos = await youtube.searchVideos('Dj Rimvis - Pashol v Pizdu', 1); //eslint-disable-line
        //             var video  = await youtube.getVideoByID(videos[0].id); //eslint-disable-line
        //             return handleVideo(video, msg); // possible error msg instead of interaction
        //         }

        //         return handleVideo(video, msg);// possible error msg instead of interaction
        //     } else{

        //         try {
        //             const videos = await youtube.searchVideos(search, 1);
        //             var video  = await youtube.getVideoByID(videos[0].id); //eslint-disable-line
        //         } catch (err) {

        //             if(interaction)
        //                 return interaction.channel.send('Could not load the video!');
        //             else
        //                 return msg.channel.send('Could not load the video!');
        //         }

        //         const stringCheck = video.title.toLowerCase();

        //         if(stringCheck.match(/krsna|kr\$na|krisna|kri\$na|despacito 2/gi))
        //         {
        //             var videos = await youtube.searchVideos('Dj Rimvis - Pashol v Pizdu', 1); //eslint-disable-line
        //             var video  = await youtube.getVideoByID(videos[0].id); //eslint-disable-line
        //             return handleVideo(video, msg);// possible error msg instead of interaction
        //         }

        //         if(interaction)
        //             return handleVideo(video, interaction);
        //         else
        //             return handleVideo(video, msg);

        //     }
        // }
    },
};
