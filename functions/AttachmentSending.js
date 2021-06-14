module.exports = {
    name: 'Attachments',
    description: 'Checks whether photos or videos are sent. Also logs chat.',
    async execute(bot, msg){
        const PhotoChannel = bot.guilds.cache.get('672837775569190922').channels.cache.get('718514256932372561');
        const ChatChannel = bot.guilds.cache.get('672837775569190922').channels.cache.get('853982351535898634');
        if (msg.attachments.size > 0){
            if(msg.attachments.forEach(async files => {
                if(files.url.toLowerCase().endsWith('.gif') || files.url.toLowerCase().endsWith('.png') || files.url.toLowerCase().endsWith('.jpg') || files.url.toLowerCase().endsWith('.mp4') || files.url.toLowerCase().endsWith('.webm') || files.url.toLowerCase().endsWith('.jpeg') || files.url.toLowerCase().endsWith('.mp3')) {
                    if(files.url.endsWith('test.png')) return;
                    await ChatChannel.send(files.url);
                    return PhotoChannel.send(`**${msg.author.username}**  išsiuntė - ${msg.createdAt} __+3h in LT__
${files.url}`);
}}));
        }

        if(msg.author.id === process.env.USER_OWNER || msg.author.id === process.env.USER_BOT) return;
        if(msg.content !== 0) await ChatChannel.send(msg);
        ChatChannel.messages.fetch()
        .then(messages => messages.each(async m => {
            if(Date.now()-m.createdAt.getTime()>= 10*60*1000)
            {
                await m.delete().catch(err => console.log('Hard to delete \n' + err));
            }
        }))
        .catch(err => console.log('Something happened with message logging \n' + err));

    }
};