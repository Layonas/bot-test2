module.exports = {
    name: 'play',
    description: 'Get Youtube music and plays it in the server.',
    execute(msg, args, ytdl, servers)
    {
        msg.channel.bulkDelete(1);
                            function play(connection, msg){
                                var k = 0;
                                var server = servers[msg.guild.id];
                                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
                                const stream = ytdl(server.queue[0]);
                                stream.on('info', (info) => {
                                    console.log(info.title);   
                                    console.log(info.video_url); 
                                    msg.channel.send(`Now playing - ${info.title}`);
                                    // make an embed and send to a server 
                                });
                                server.queue.shift();
                                
                                if (k === 0) 
                                {
                                    console.log('Started playing a song!');
                                    k++;
                                }
                                server.dispatcher.on("end", function(){
                                    console.log('Song ended.');
                                    if(server.queue[0]){
                                        console.log('Playing the next song.');
                                        play(connection, msg);
                                    }
                                    else {
                                        console.log('Disconnected from the voice channel.');
                                        connection.disconnect();
                                    }
                                })
                                                         }

        if (!args[1]) 
         {
             msg.channel.send('Add link pls');
             return;
         }
         if (!msg.member.voiceChannel)
         {
             msg.reply('Go to voice channel');
             return;
         }

         if(!servers[msg.guild.id]) servers[msg.guild.id] = {
             queue: []
         }
         var server = servers[msg.guild.id];

         server.queue.push(args[1]);
         const stream = ytdl(args[1]);
         stream.on('info', (info) => {
            console.log(`--------------- ${info.title} ----------- added to queue!`);
            msg.channel.send(`${info.title} added to the queue!`);
         })

         if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection){
             play(connection, msg);
         })
    } 
}