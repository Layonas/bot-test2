module.exports = {
    name: 'play',
    description: 'Get Youtube music and plays it in the server.',
    execute(msg, args, ytdl, servers)
    {
        function play(connection, msg){
            var server = servers[msg.guild.id];
            server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
            server.queue.shift();
            server.dispatcher.on("end", function(){
                if(server.queue[0]){
                    play(connection, msg);
                }
                else {
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

         if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection){
             play(connection, msg);
         })
    } 
}