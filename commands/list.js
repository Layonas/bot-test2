// eslint-disable-next-line no-unused-vars
const { Player } = require("discord-music-player");
const Discord = require("discord.js");
module.exports = {
    name: "playlist",
    alias: ["playlist", "pl", "play list", "list"],
    usage: "!<alias>",
    example: "!playlist",
    description: "Full list of songs that are currently in the queue.",
    /**
     * Lists first 20 songs in the list of songs
     * @param {Discord.Message} msg
     * @param {Array<string>} args
     * @param {Discord.Client} bot
     * @param {Discord.CommandInteraction} interaction
     * @param {Player} player
     * @returns
     */
    async execute(msg, args, bot, interaction, player) {
        let embed = new Discord.MessageEmbed();
        var PlayListLenght = 0;

        const guildID = msg.guildId;

        const guildQueue = player.getQueue(guildID);

        if (!guildQueue) msg.reply("Nothing is playing!");

        for (var i = 0; i < guildQueue.songs.length; i++) {
            PlayListLenght += guildQueue.songs[i].milliseconds / 1000;
        }

        var PlayListLenghtMinutes = Math.floor(PlayListLenght / 60);
        var PlayListLenghtseconds = PlayListLenght - PlayListLenghtMinutes * 60;

        if (guildQueue.songs.length < 20) {
            embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(msg.author.avatarURL()).setDescription(`__**Playlist'as**__
                ${guildQueue.songs
                    .map((song, index) => `**+${index + 1}** ${song.name}`)
                    .join("\n")}
Dabar yra **${guildQueue.songs.length}** dainų saraše!
**__Dabar groja:__**  ${guildQueue.songs[0].name}
**__Grojamos dainos linkas__** <${guildQueue.songs[0].url}>
**__Dainą užsakė__** ${guildQueue.songs[0].requestedBy.username}
**__Apytiksli trukmė__**  **${PlayListLenghtMinutes + "min " + PlayListLenghtseconds + "s"}**`);
        } else {
            let holder = guildQueue.songs.slice(0, 20);
            embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(msg.author.avatarURL()).setDescription(`__**Playlist'as**__
        ${holder.map((song, index) => `**+${index + 1}** ${song.name}`).join("\n")}
Dainų sąraše yra tik 20 dainų, tačiau tai ne visos!        
Dabar yra **${guildQueue.songs.length}** dainų sąraše!
**__Dabar groja:__**  ${holder[0].name}
**__Grojamos dainos linkas__** <${guildQueue.songs[0].url}>
**__Dainą užsakė__** ${guildQueue.songs[0].requestedBy.username}
**__Apytiksli trukmė__**  **${PlayListLenghtMinutes + "min" + PlayListLenghtseconds + "s"}**`);
        }
        return msg.channel.send({ embeds: [embed] }).catch((error) => {
            console.log(error);
            msg.channel.send("Ups, paslydau.");
        });
    },
};
