// eslint-disable-next-line no-unused-vars
const { Player } = require("discord-music-player");
// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");
module.exports = {
    name: "splay",
    alias: ["splay", "select", "sp", "selectplay"],
    usage: "!<alias> song_name",
    example: "!selectplay robinzonas",
    description: "Selection of videos if the video name is just a random guess",
    /**
     * Command to list first 10 songs in the youtube search that can later be chosen
     * @param {Discord.Message} msg
     * @param {Array<string>} args
     * @param {Discord.Client} bot
     * @param {Discord.CommandInteraction} interaction
     * @param {Player} player
     * @returns
     */
    async execute(msg, args, bot, interaction, player) {
        const Youtube = require("simple-youtube-api");
        const youtube = new Youtube(process.env.YOUTUBE_API_KEY);

        const guildID = msg.guildId;
        const userID = msg.member.id;

        const voiceChannel = bot.guilds.cache.get(guildID).members.cache.get(userID)
            .voice.channelId;

        if (!voiceChannel) return await msg.reply("You have to be in a voice channel!");

        if (!args[1]) return msg.reply("Jūs turite pridėti dainos pavadinimą!");

        const searchString = msg.content.substring(1).split(" ").slice(1).join(" ");

        try {
            var videos = await youtube.searchVideos(searchString, 10);
            msg.channel.send(`__***Song selection!***__
${videos.map((val, index) => `**${++index}** ${val.title}`).join("\n")}

__Prašome pasirinkti vaizdo įraša, kurį norite leisti, prašome atrašyti su skaičiumi nuo 1 iki 10!__`);

            try {
                const filter = (msg2) => msg2.content > 0 && msg2.content < 11;
                var response = await msg.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 10000,
                    errors: ["time"],
                });
            } catch (error) {
                console.error(error);
                return msg.channel.send(
                    "Nebuvo teisingai pasirinktas skaičius arba išseko laikas!"
                );
            }

            const videoIndex = parseInt(response.first().content);

            var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
            console.error(err);
            return msg.reply("Nepavyko rasti muzikos, kurios norėjote, prašome bandyti dar kartą!");
        }

        msg.content = "!p " + video.url;
        msg.channel.send(`**${video.title}** has been added to the queue.`);
        return bot.commands.get("play").execute(msg, args, bot, interaction, player);
    },
};
