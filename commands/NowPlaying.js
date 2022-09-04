// eslint-disable-next-line no-unused-vars
const { Player } = require("discord-music-player");

module.exports = {
    name: "np",
    alias: ["np", "nowplaying", "now", "playing", "NowPlaying"],
    usage: "!<alias>",
    example: "!nowplaying",
    description: "Tells what is the song that is currently playing.",
    /**
     * Tells what is the song that is currently playing.
     * @param {Discord.Message} msg
     * @param {Array<string>} args
     * @param {Discord.Client} bot
     * @param {Discord.CommandInteraction} interaction
     * @param {Player} player
     * @returns
     */
    async execute(msg, args, bot, interaction, player) {
        // eslint-disable-line

        const Discord = require("discord.js");

        if (!interaction) {
            const guildQueue = player.getQueue(msg.guildId);
            if (!guildQueue) return msg.reply("Nothing is playing at the moment!");
        } else {
            const guildQueue = player.getQueue(interaction.guildId);
            if (!guildQueue) return interaction.editReply("Nothing is playing at the moment!");
        }

        if (interaction) {
            const guildQueue = player.getQueue(interaction.guildId);
            const ProgressBar = guildQueue.createProgressBar();
            const embed = new Discord.MessageEmbed()
                .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setTitle("Now playing")
                .setThumbnail(guildQueue.nowPlaying.thumbnail)
                .addField("Song name", guildQueue.nowPlaying.name)
                .addField("Song link", guildQueue.nowPlaying.url)
                .addField("Time left", ProgressBar.prettier);

            interaction.editReply({ embeds: [embed] });
        } else {
            const guildQueue = player.getQueue(msg.guildId);
            const ProgressBar = guildQueue.createProgressBar();
            const embed = new Discord.MessageEmbed()
                .setAuthor(msg.member.user.username, msg.member.user.avatarURL())
                .setTitle("Now playing")
                .setThumbnail(guildQueue.nowPlaying.thumbnail)
                .addField("Song name", guildQueue.nowPlaying.name)
                .addField("Song link", guildQueue.nowPlaying.url)
                .addField("Time left", ProgressBar.prettier);

            msg.reply({ embeds: [embed] });
        }
    },
};
