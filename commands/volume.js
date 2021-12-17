module.exports = {
    name: 'volume',
    alias: ['vol', 'volume', 'v', 'vo', 'volum'],
    usage: '!<alias> <number>',
    example: '!volume 50',
    description: 'Sets the volume of the songs that are being played',
    async execute(msg, args, bot, interaction, player){ // eslint-disable-line

        const channel = msg.channel;
        const guildID = msg.guildId;
        const userID = msg.member.id;
        const guild = msg.guild;

        const voiceChannel = bot.guilds.cache.get(guildID).members.cache.get(userID)
        .voice.channelId;

        const guildQueue = player.getQueue(guildID);

        if(!guildQueue)
            return await msg.reply('There is no queue!');

        if(!voiceChannel)
            return await msg.reply('You have to be in a voice channel!');

        if(guild.members.cache.get(process.env.USER_BOT).voice.channelId !== voiceChannel)
            return await msg.reply("You have to be in the same voice channel!");

        if(!args[1])
            return await channel.send('Current volume is: **' + guildQueue.volume + '**');

        await guildQueue.setVolume(parseInt(args[1]));

        await channel.send('Player volume has been set to: **' + guildQueue.volume + '**');

        return;
    } 
};