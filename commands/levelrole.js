// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");

module.exports = {
    name: "levelRole",
    alias: ["lr", "levelRole", "levelrole", "levelr", "suggestRole", "sr", "suggest_role"],
    usage: "!<alias> <pavadinimas> <lygis> (optional) <lygis>",
    example: "!lr juodas_batas 2000",
    description: "Suggests what roles users wants to add.",
    /**
     * Sends the owner of the bot what roles to add to the database
     * @param {Discord.Client} bot
     * @param {Discord.CommandInteraction} interaction
     * @returns
     */
    async execute(bot, interaction) {
        return await (
            await bot.users.fetch(process.env.USER_OWNER)
        ).send(`Naują rolę pasiūlė ***${interaction.member.user.username}*** 
        Rolės pavadinimas **${interaction.options.data[0].value}** Rolės lygis nuo **${interaction.options.data[1].value}** iki **${interaction.options.data[2].value}**`);
    },
};
