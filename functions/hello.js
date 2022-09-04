// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");
module.exports = {
    name: "hello",
    alias: ["hello"],
    /**
     * Messing around function
     * @param {Discord.Message} msg
     * @returns
     */
    execute(msg) {
        //jiglis norejo kad taip padaryciau
        if (msg.content.toLowerCase().split(" ").includes("dilgeles"))
            return msg.channel.send(
                "https://sveikas.info/wp-content/uploads/2011/05/dilgeles2.jpg"
            );
        //rokis norejo kad taip padaryciau
        if (msg.content.toLowerCase().split(" ").includes("garsva"))
            return msg.channel.send(
                "https://manoukis.lt/media/public/3e/62/3e624e41-6b5e-4056-9f9e-29b1b839ae2b/kanapes_jolantos_bulotienes_nuotrauka.jpg"
            );
        if (
            msg.content.match(/nig?g[ersia]+|negra[is]+|nibba/gi) &&
            msg.author.id !== "354659679634456577"
        )
            return msg.reply(
                "https://cdn.discordapp.com/attachments/543849764219781131/930823618726854726/racist_level.png"
            );

        if (msg.content.toLowerCase() === "hello")
            return msg.channel.send("Hey you should have a really nice day:).");
        if (msg.content.toLowerCase().split(" ").includes("pilam"))
            return msg.channel.send(`${msg.guild.emojis.cache.find((e) => e.name === "pilam")}`);
        if (msg.content.toLowerCase() === "kek")
            return msg.channel.send(`${msg.guild.emojis.cache.find((e) => e.name === "kekw")}`);
        if (!msg.mentions.users.first()) return;
        if (
            msg.mentions.users.first().id === process.env.USER_BOT &&
            msg.content.toLowerCase().includes("sw")
        )
            return msg.channel.send("Zdarowa ^^");
    },
};
