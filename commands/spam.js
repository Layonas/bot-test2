// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");
module.exports = {
    name: "spam",
    alias: ["spam"],
    usage: "!<alias> <@tag> <times> <message>",
    example: "!spam @eligijus 10 atsiliepk velniaz",
    description: "Spams messages that user says",
    /**
     * Spam messages
     * @param {Discord.Message} msg
     * @param {Array<string>} args
     * @returns
     */
    async execute(msg, args) {
        if (msg.author.id !== process.env.USER_OWNER) return msg.reply("Pisk nx");
        var a = 1;
        var limit = args[2];
        var limit1 = args[1];
        var attack = setInterval(spam, 3000);

        async function spam() {
            if (a >= limit || a >= limit1) {
                clearInterval(attack);
            } else a++;

            if (!isNaN(args[1])) {
                try {
                    var message = args.slice(2).join(" ");
                    msg.channel.send(message);
                } catch (error) {
                    msg.channel.send("Plese check how you spelled it");
                    clearInterval(attack);
                }
            } else {
                try {
                    var user = msg.mentions.users.first();
                    var message = args.slice(3).join(" "); // eslint-disable-line

                    msg.channel.send(`<@${user.id}> ${message}!`);
                } catch (error) {
                    var role = msg.mentions.roles.first(); // eslint-disable-line
                    var message = args.slice(3).join(" "); // eslint-disable-line

                    msg.channel.send(`<@&${role.id}> ${message}!`);
                }
            }
        }
    },
};
