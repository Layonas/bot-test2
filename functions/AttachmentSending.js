module.exports = {
    name: 'Attachments',
    description: 'Checks whether photos or videos are sent',
    execute(bot, msg){
        const channel = bot.guilds.cache.get('672837775569190922').channels.cache.get('718514256932372561');
        if (msg.attachments.size > 0){
            if(msg.attachments.forEach(files => {
                if(files.url.toLowerCase().endsWith('.png') || files.url.toLowerCase().endsWith('.jpg') || files.url.toLowerCase().endsWith('.mp4') || files.url.toLowerCase().endsWith('.webm') || files.url.toLowerCase().endsWith('.jpeg') || files.url.toLowerCase().endsWith('.mp3')) {
                    if(files.url.endsWith('test.png')) return;
                    return channel.send(`**${msg.author.username}**  išsiuntė - ${msg.createdAt} __+3h in LT__
${files.url}`);
}}));
        }
    }

};