// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");
module.exports = {
    name: "RoleChecker",
    alias: ["roles", "checkroles", "RoleChecker", "Roles", "rolec"],
    usage: "!<alias>",
    example: "!RoleChecker",
    description: "Checks the roles and send them to the channel.",
    /**
     * Command to view all the roles in the database
     * @param {Discord.Message} msg
     * @param {Array<string>} args
     * @param {Discord.Client} bot
     * @param {Discord.CommandInteraction} interaction
     * @returns
     */
    async execute(msg, args, bot, interaction) {
        const { Client } = require("pg");
        const Discord = require("discord.js");

        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        client.connect();

        const { rows } = await client.query("SELECT * FROM Roles");

        const Role_info = rows[0].roles;

        var Roles = [];
        Object.keys(Role_info).forEach((role) => Roles.push(role));

        var count = Math.ceil(Roles.length / 30);

        var channel;
        var authorId;
        if (interaction) {
            await interaction.editReply(`There are currently ${count} pages.
            Choose which page you want to see:`);
            channel = interaction.channel;
            authorId = interaction.member.id;
        } else {
            await msg.reply(
                `There are currently ${count} pages.
Choose which page you want to see:`
            );
            channel = msg.channel;
            authorId = msg.author.id;
        }

        const filter = (message) =>
            message.author.id === authorId && message.content > 0 && message.content <= count;

        const response = await channel.awaitMessages({ filter, max: 1, time: 10000 });

        if (!response) return;

        let rolesHold = Roles.slice(
            0 + 30 * (response.first().content - 1),
            30 * response.first().content
        );

        let embed = new Discord.MessageEmbed()
            .setThumbnail(
                interaction ? interaction.member.user.avatarURL() : msg.author.avatarURL()
            )
            .setTitle("Roles")
            .setFooter(
                "More roles can be added so you can suggest with /suggest_role",
                bot.user.avatarURL()
            )
            .setColor("RANDOM")
            .setDescription(
                `${rolesHold
                    .map(
                        (roles, index) =>
                            `**${index + 1}.** **${Role_info[roles].name}** nuo **${
                                Role_info[roles].min_level
                            }** iki **${Role_info[roles].max_level}** lygio`
                    )
                    .join("\n")}`
            )
            .setAuthor(
                bot.users.cache.get(process.env.USER_OWNER).username,
                bot.users.cache.get(process.env.USER_OWNER).avatarURL()
            );

        await channel.send({ embeds: [embed] });

        return client.end();
    },
};
