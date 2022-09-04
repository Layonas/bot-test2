// eslint-disable-next-line no-unused-vars
const { Player } = require("discord-music-player");
// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");
module.exports = {
    name: "skip",
    alias: ["skip", "sk", "ski"],
    usage: "!<alias>",
    example: "!skip",
    description: "Skips the current song to the next song in queue.",
    /**
     * Skips the current song
     * @param {Discord.Message} msg
     * @param {Array<string>} args
     * @param {Discord.Client} bot
     * @param {Discord.CommandInteraction} interaction
     * @param {Player} player
     * @returns
     */
    async execute(msg, args, bot, interaction, player) {
        const channel = msg.channel;
        const guildID = msg.guildId;
        const userID = msg.member.id;
        const guild = msg.guild;

        const voiceChannel = bot.guilds.cache.get(guildID).members.cache.get(userID)
            .voice.channelId;

        const guildQueue = player.getQueue(guildID);

        if (!guildQueue) return await msg.reply("There is no queue!");

        if (!voiceChannel) return await msg.reply("You have to be in a voice channel!");

        if (guild.members.cache.get(process.env.USER_BOT).voice.channelId !== voiceChannel)
            return await msg.reply("You have to be in the same voice channel!");

        channel.send("You have skipped a song!");

        return guildQueue.skip();
    },
};
