// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
module.exports = {
    name: 'Attachments',
    description: 'Checks whether photos or videos are sent. Also logs chat.',
    /**
     * 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} msg 
     * @returns 
     */
    async execute(bot, msg){
        const PhotoChannel = bot.guilds.cache.get(process.env.LOG_GUILD).channels.cache.get(process.env.LOG_CHANNEL_AT);
        const ChatChannel = bot.guilds.cache.get(process.env.LOG_GUILD).channels.cache.get(process.env.LOG_CHANNEL);
        if (msg.attachments.size > 0){
            if(msg.attachments.forEach(async files => {
                if(files.url.toLowerCase().endsWith('.gif') || files.url.toLowerCase().endsWith('.png') || files.url.toLowerCase().endsWith('.jpg') || files.url.toLowerCase().endsWith('.mp4') || files.url.toLowerCase().endsWith('.webm') || files.url.toLowerCase().endsWith('.jpeg') || files.url.toLowerCase().endsWith('.mp3')) {
                    if(files.url.endsWith('test.png')) return;
                    ChatChannel.send(`**${msg.author.username}**`+ 
                    files.url);
                    return PhotoChannel.send(`**${msg.author.username}**  išsiuntė - ${msg.createdAt} __+3h in LT__
${files.url}`);
}}));
}


        let ids = [];
        let names = [];
        let user = (await bot.guilds.cache.get(process.env.GUILD).members.fetch(process.env.USER_OWNER));
        user.roles.cache.each(r =>{ids.push(r.id); names.push(r.name);});
        ids.push(user.id); names.push(user.user.username);

        let message = "";
        ids.forEach(id => {
            message = msg.content.replace(`<@!${id}>`, names[ids.indexOf(id)]);
            message = msg.content.replace(`<@&${id}>`, names[ids.indexOf(id)]);
        });
        

        if(msg.author.id === process.env.USER_OWNER || msg.author.id === process.env.USER_BOT) return;
        return ChatChannel.send(`**${msg.author.username} sent** ${message}`)
        .catch(err => console.log(`Error while logging a message, probably a spam.(await removed)\n`+err));

    }
};