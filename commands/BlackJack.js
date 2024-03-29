const Savings = require("../functions/Savings/Savings");

module.exports = {
    name: "BlackJack",
    description: "Play BlackJack with no worries about loses!",
    alias: ["bj", "blackjack", "BlackJack", "ca", "claim", "give", "tip", "bal", "balance"],
    usage: "!<alias> <amount>",
    example: "!bj 1000",

    /**
     * Blackjack command to play blackjack, to see balance, to claim money, to tip, to give
     * Contains an easter egg which lets you win easily but incredibly rarely :)
     * @param {Discord.Message} msg
     * @param {Array<string>} args
     * @param {Discord.Client} bot
     * @returns
     */
    async execute(msg, args, bot) {
        const { Client } = require("pg");
        const { BlackJack } = require("../functions/BlackJack/BlackJack");
        const Discord = require("discord.js");
        const bj = new BlackJack();
        const embed = new Discord.MessageEmbed();

        // Connecting to the database
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        /**
         *
         * @param {string | {value: string, type: string}} card
         * @returns An emoji
         */
        function GetEmoji(card) {
            if (!card) return;

            if (typeof card === "string")
                return bot.guilds.cache
                    .get(process.env.LOG_GUILD)
                    .emojis.cache.find((emoji) => emoji.name === card);

            if (!card.value.match(/[QJK]/))
                if (card.value === "A" && card.type === "Spades") card.type = "Clubs";
                else if (parseInt(card.value) < 7 && card.type === "Spades") card.type = "Clubs";

            return bot.guilds.cache
                .get(process.env.LOG_GUILD)
                .emojis.cache.find(
                    (emoji) =>
                        emoji.name ===
                        `${parseInt(card.value) === 1 ? "A" : card.value}${card.type.toLowerCase()}`
                );
        }

        /**
         *
         * @param {{value: string, type: string}} card
         * @returns Total value of a card
         */
        function CalculateCardValue(card) {
            return parseInt(
                card.value.match(/[QKJ]/) ? 10 : card.value.match(/[A]/) ? 11 : card.value
            );
        }

        if (args[0] === "ca" || args[0] === "claim") {
            return Savings.Claim(msg.author.id, msg);
        }

        if (args[1] === "p" || args[1] === "-p" || args[1] === "profile") {
            return Savings.Profile(msg.author.id, msg);
        }

        if (args[0] === "give") {
            return Savings.Give(args[1], msg, args[2], bot);
        }

        if (args[0] === "tip") {
            return Savings.Tip(args[1], args[2], msg);
        }

        if (args[0].match(/bal|balance/gi)) {
            return Savings.Balance(msg.author.id, msg);
        }

        const table = `CREATE TABLE IF NOT EXISTS blackjack(
            playerId varchar(255),
            amount int,
            playerCards json,
            playerValue int,
            dealerCards json,
            dealerValue int,
            emojis text[],
            embed json
            )`;

        await client.connect();

        await client.query(table).catch((err) => console.error(err));

        //await client.query(`DELETE FROM blackjack WHERE playerId = '${msg.author.id}'`);

        const { rows } = await client.query(
            `SELECT * FROM blackjack WHERE playerId = '${msg.author.id}'`
        ); // database information

        let Player = rows[0];

        const SavingsAcount = await client.query(
            `select * from savings where playerId = '${msg.author.id}'`
        );

        let savings = SavingsAcount.rows[0];

        if (!Player) {
            if (!args[1]) return msg.reply("You need to specify an amount!");

            let amount = 0;
            if (isNaN(args[1])) {
                if (args[1].toLowerCase().endsWith("k")) {
                    amount = parseFloat(args[1].substring(0, args[1].length)) * 1000;
                } else if (args[1].toLowerCase().endsWith("m")) {
                    amount = parseFloat(args[1].substring(0, args[1].length)) * 1000000;
                } else {
                    return msg.reply("Bet amount needs to be a valid number!");
                }
            } else {
                amount = parseFloat(args[1]);
            }

            amount = parseFloat(amount);

            if (!savings) {
                await client.query(
                    `insert into savings(money, hourly, hourlyClaimed, daily, dailyClaimed, weakly, weaklyClaimed, level, gambled, won, lost, playerId, timesPlayed, biggestBet) 
                    values(1000, 200, false, 1000, false, 10000, false, 1, 0, 0, 0, '${msg.author.id}', 0, 0)`
                );

                const { rows } = await client.query(
                    `select * from savings where playerId = '${msg.author.id}'`
                );

                savings = rows[0];
            }

            if (parseFloat(savings.money) < amount)
                return msg.reply(`You cannot bet more than you have!`);

            const playerCards = bj.PlayerCards();
            var fpcard = playerCards.firstCard;
            var spcard = playerCards.secondCard;
            var PCards = [fpcard, spcard];
            let playerValue = CalculateCardValue(fpcard) + CalculateCardValue(spcard);

            const dealerCards = bj.DealerCards();
            var fcard = dealerCards.firstCard;
            var scard = dealerCards.secondCard;
            var DCards = [fcard, scard];
            let dealerValue = CalculateCardValue(fcard);

            Player = {
                playerid: msg.author.id,
                amount: amount,
                playercards: PCards,
                playervalue: playerValue,
                dealercards: DCards,
                dealervalue: dealerValue,
                emojis:
                    parseFloat(savings.money) >= amount * 2
                        ? ["hit", "stand", "double"]
                        : ["hit", "stand"],
                embed: Discord.MessageEmbed,
            };

            //Triggers if the player gets instant 21 from both cards
            //Dont need to check dealer card
            //It is always triggered if the player write !bj for the first time so no database interference
            if (Player.playervalue === 21) {
                embed
                    .setAuthor(msg.author.username)
                    .setColor("ORANGE")
                    .setTitle("BlackJack")
                    .setThumbnail(msg.author.avatarURL())
                    .setTimestamp(msg.createdTimestamp)
                    .addField(
                        "You have | " + Player.playervalue,
                        `${GetEmoji(fpcard)}${GetEmoji(spcard)}`
                    )
                    .addField(
                        "Dealers has | " + Player.dealervalue,
                        `${GetEmoji(fcard)}${GetEmoji("back")}`
                    )
                    .addField(
                        "You won!",
                        `Your bet * 1.5 = ${Player.amount * 1.5}\nYou now have: ${Math.floor(
                            savings.money + Player.amount * 1.5
                        )}`
                    );

                await client.query(
                    `update savings set money = ${Math.floor(
                        savings.money + Player.amount * 1.5
                    )}, won = ${Math.floor(
                        savings.won + Player.amount * 1.5
                    )}, gambled = ${Math.floor(
                        savings.gambled + Player.amount * 1.5
                    )} where playerId = '${msg.author.id}'`
                );

                client.end();
                return msg.channel.send({ embeds: [embed] });
            }

            //If the player did not get 21 in his first 2 cards
            embed
                .setAuthor(msg.author.username)
                .setColor("ORANGE")
                .setTitle("BlackJack")
                .setThumbnail(msg.author.avatarURL())
                .setTimestamp(msg.createdTimestamp)
                .addField(
                    "You have | " + Player.playervalue,
                    `${GetEmoji(fpcard)}${GetEmoji(spcard)}`
                )
                .addField(
                    "Dealers has | " + Player.dealervalue,
                    `${GetEmoji(fcard)}${GetEmoji("back")}`
                );

            Player.embed = embed;
            var Playing = false;

            await client.query(`INSERT INTO blackjack VALUES(${Player.playerid}, ${
                Player.amount
            },'${JSON.stringify(Player.playercards)}', ${Player.playervalue},
            '${JSON.stringify(Player.dealercards)}', ${Player.dealervalue}, '{"${Player.emojis.join(
                `","`
            )}"}', '${JSON.stringify(Player.embed)}')`);
        }

        var playerEmojies = [];
        var dealerEmojies = [];

        msg.channel.send({ embeds: [Player.embed] }).then(async (message) => {
            const emojies = [];
            Player.emojis.forEach((emoji) => {
                emojies.push(emoji);
                message.react(GetEmoji(emoji));
            });

            if (!emojies.includes("stand")) message.react(GetEmoji("stand"));

            Playing = true;

            var DealerPlayingCardValue = 0;
            Player.dealercards.forEach(
                (card) => (DealerPlayingCardValue += CalculateCardValue(card))
            );

            var WinLoss;

            while (Playing) {
                await message
                    .awaitReactions({
                        filter: (reaction, user) =>
                            user.id === msg.author.id &&
                            reaction.emoji.name.match(/hit|double|stand/gi) != null,
                        max: 1,
                    })
                    .then(async (colleted) => {
                        const command = colleted.first().emoji.name;
                        var card;
                        var e;

                        switch (command) {
                            case "hit":
                                // Player.playercards.forEach((card) =>
                                //     !playerEmojies.includes(GetEmoji(card))
                                //         ? playerEmojies.push(GetEmoji(card))
                                //         : card
                                // );
                                playerEmojies = [];
                                Player.playercards.forEach((card) =>
                                    playerEmojies.push(GetEmoji(card))
                                );
                                card = bj.Hit();
                                Player.playervalue = Player.playervalue + CalculateCardValue(card);
                                Player.playercards.push(card);
                                playerEmojies.push(GetEmoji(card));
                                e = new Discord.MessageEmbed();
                                if (Player.emojis.indexOf("double") > 0)
                                    Player.emojis.splice(Player.emojis.indexOf("double"), 1);

                                if (Player.playervalue > 21) {
                                    [Player.playercards, Player.playervalue] = CalculateAce(
                                        Player.playercards,
                                        Player.playervalue
                                    );
                                }

                                if (Player.playervalue > 21) {
                                    e.setAuthor(msg.author.username)
                                        .setColor("RED")
                                        .setTitle("BlackJack")
                                        .setThumbnail(msg.author.avatarURL())
                                        .setTimestamp(msg.createdTimestamp)
                                        .addField(
                                            "You have | " + Player.playervalue,
                                            `${playerEmojies.join(" ")}`
                                        )
                                        .addField(
                                            "Dealers has | " + Player.dealervalue,
                                            `${GetEmoji(Player.dealercards[0])}${GetEmoji("back")}`
                                        )
                                        .addField(
                                            "You Lost!",
                                            `Your bet = ${Player.amount}\nYou now have: ${
                                                savings.money - Player.amount
                                            }`
                                        );

                                    message.edit({ embeds: [e] });

                                    Playing = false;

                                    WinLoss = parseFloat(Player.amount) * -1;
                                } else if (Player.playervalue === 21) {
                                    // After a Hit got 21

                                    Player.dealercards.forEach((card) =>
                                        dealerEmojies.push(GetEmoji(card))
                                    );

                                    if (DealerPlayingCardValue !== 21) {
                                        e.setAuthor(msg.author.username)
                                            .setColor("GREEN")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + DealerPlayingCardValue,
                                                `${dealerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "You Won!",
                                                `Your bet = ${Player.amount}\nYou now have: ${
                                                    savings.money + Player.amount
                                                }`
                                            );

                                        message.edit({ embeds: [e] });

                                        WinLoss = parseFloat(Player.amount);
                                        Playing = false;
                                    } else {
                                        e.setAuthor(msg.author.username)
                                            .setColor("RED")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + DealerPlayingCardValue,
                                                `${dealerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "You Tied!",
                                                `You now have: ${savings.money}`
                                            );

                                        message.edit({ embeds: [e] });

                                        Playing = false;
                                        WinLoss = 0;
                                    }

                                    Playing = false;
                                } else if (Player.playercards.length === 5) {
                                    if (Player.playervalue <= 21) {
                                        e.setAuthor(msg.author.username)
                                            .setColor("GREEN")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + Player.dealervalue,
                                                `${GetEmoji(Player.dealercards[0])}${GetEmoji(
                                                    "back"
                                                )}`
                                            )
                                            .addField(
                                                "You Won!",
                                                `Your bet * 1.5 = ${Math.floor(
                                                    Player.amount * 1.5
                                                )}\nYou now have: ${Math.floor(
                                                    savings.money + Player.amount * 1.5
                                                )}`
                                            );

                                        message.edit({ embeds: [e] });

                                        WinLoss = Math.floor(parseFloat(Player.amount) * 1.5);
                                        Player.amount = Math.floor(Player.amount * 1.5);

                                        Playing = false;
                                    }
                                } else {
                                    e.setAuthor(msg.author.username)
                                        .setColor("ORANGE")
                                        .setTitle("BlackJack")
                                        .setThumbnail(msg.author.avatarURL())
                                        .setTimestamp(msg.createdTimestamp)
                                        .addField(
                                            "You have | " + Player.playervalue,
                                            `${playerEmojies.join(" ")}`
                                        )
                                        .addField(
                                            "Dealers has | " + Player.dealervalue,
                                            `${GetEmoji(Player.dealercards[0])}${GetEmoji("back")}`
                                        );

                                    Player.embed = e;

                                    message.edit({ embeds: [e] });
                                }

                                await client.query(`UPDATE blackjack SET playerCards = '${JSON.stringify(
                                    Player.playercards
                                )}',
                                playerValue = ${Player.playervalue},
                                dealerCards = '${JSON.stringify(Player.dealercards)}',
                                dealerValue = ${Player.dealervalue},
                                emojis = '{"${Player.emojis.join(`","`)}"}',
                                embed = '${JSON.stringify(Player.embed)}' WHERE playerId = '${
                                    Player.playerid
                                }'`);

                                break;

                            case "double":
                                playerEmojies = [];
                                Player.playercards.forEach((card) =>
                                    playerEmojies.push(GetEmoji(card))
                                );
                                dealerEmojies = [];
                                Player.dealercards.forEach((card) =>
                                    dealerEmojies.push(GetEmoji(card))
                                );

                                card = bj.Hit();
                                Player.playervalue = Player.playervalue + CalculateCardValue(card);
                                Player.playercards.push(card);
                                // Player.playercards.forEach((card) =>
                                //     !playerEmojies.includes(GetEmoji(card))
                                //         ? playerEmojies.push(GetEmoji(card))
                                //         : card
                                // );
                                playerEmojies.push(GetEmoji(card));
                                // Player.dealercards.forEach((card) =>
                                //     !dealerEmojies.includes(GetEmoji(card))
                                //         ? dealerEmojies.push(GetEmoji(card))
                                //         : card
                                // );
                                e = new Discord.MessageEmbed();

                                if (Player.playervalue > 21) {
                                    [Player.playercards, Player.playervalue] = CalculateAce(
                                        Player.playercards,
                                        Player.playervalue
                                    );
                                }

                                if (Player.playervalue > 21) {
                                    e.setAuthor(msg.author.username)
                                        .setColor("RED")
                                        .setTitle("BlackJack")
                                        .setThumbnail(msg.author.avatarURL())
                                        .setTimestamp(msg.createdTimestamp)
                                        .addField(
                                            "You have | " + Player.playervalue,
                                            `${playerEmojies.join(" ")}`
                                        )
                                        .addField(
                                            "Dealers has | " + Player.dealervalue,
                                            `${GetEmoji(fcard)}${GetEmoji("back")}`
                                        )
                                        .addField(
                                            "You Lost!",
                                            `Your bet * 2 = ${Player.amount * 2}\nYou now have: ${
                                                savings.money - Player.amount * 2
                                            }`
                                        );

                                    message.edit({ embeds: [e] });

                                    Playing = false;

                                    WinLoss = parseFloat(Player.amount) * -2;
                                    Player.amount *= 2;
                                } else if (Player.playervalue === 21) {
                                    Player.dealercards.forEach((card) =>
                                        dealerEmojies.push(GetEmoji(card))
                                    );

                                    if (DealerPlayingCardValue !== 21) {
                                        e.setAuthor(msg.author.username)
                                            .setColor("GREEN")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + DealerPlayingCardValue,
                                                `${dealerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "You Won!",
                                                `Your bet * 2 = ${
                                                    Player.amount * 2
                                                }\nYou now have: ${
                                                    savings.money + Player.amount * 2
                                                }`
                                            );

                                        message.edit({ embeds: [e] });

                                        WinLoss = parseFloat(Player.amount) * 2;
                                        Player.amount *= 2;

                                        Playing = false;
                                    } else {
                                        e.setAuthor(msg.author.username)
                                            .setColor("RED")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + DealerPlayingCardValue,
                                                `${dealerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "You Tied!",
                                                `You now have: ${savings.money}`
                                            );

                                        message.edit({ embeds: [e] });

                                        Playing = false;
                                        WinLoss = 0;
                                    }
                                } else if (Player.dealervalue < 17) {
                                    if (DealerPlayingCardValue >= 17) {
                                        if (DealerPlayingCardValue > Player.playervalue) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("RED")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Lost!",
                                                    `Your bet * 2 = ${
                                                        Player.amount * 2
                                                    }\nYou now have: ${
                                                        savings.money - Player.amount * 2
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount) * -2;
                                            Player.amount *= 2;

                                            Playing = false;
                                        } else if (DealerPlayingCardValue === Player.playervalue) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("ORANGE")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Tied!",
                                                    `You now have: ${savings.money}`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = 0;

                                            Playing = false;
                                        } else {
                                            e.setAuthor(msg.author.username)
                                                .setColor("GREEN")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Won!",
                                                    `Your bet *2 = ${
                                                        Player.amount * 2
                                                    }\nYou now have: ${
                                                        savings.money + Player.amount * 2
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount) * 2;
                                            Player.amount *= 2;

                                            Playing = false;
                                        }
                                    }

                                    while (DealerPlayingCardValue < 17) {
                                        card = bj.Hit();
                                        Player.dealercards.push(card);
                                        dealerEmojies.push(GetEmoji(card));
                                        DealerPlayingCardValue =
                                            DealerPlayingCardValue + CalculateCardValue(card);

                                        if (DealerPlayingCardValue > 21) {
                                            [Player.dealercards, DealerPlayingCardValue] =
                                                CalculateAce(
                                                    Player.dealercards,
                                                    DealerPlayingCardValue
                                                );
                                        }

                                        if (DealerPlayingCardValue > 21) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("GREEN")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Won!",
                                                    `Your bet * 2= ${
                                                        Player.amount * 2
                                                    }\nYou now have: ${
                                                        savings.money + Player.amount * 2
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount) * 2;
                                            Player.amount *= 2;

                                            Playing = false;
                                        } else if (
                                            DealerPlayingCardValue >= 17 &&
                                            DealerPlayingCardValue > Player.playervalue
                                        ) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("RED")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Lost!",
                                                    `Your bet * 2 = ${
                                                        Player.amount * 2
                                                    }\nYou now have: ${
                                                        savings.money - Player.amount * 2
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount) * -2;
                                            Player.amount *= 2;

                                            Playing = false;
                                        } else if (
                                            DealerPlayingCardValue >= 17 &&
                                            DealerPlayingCardValue < Player.playervalue
                                        ) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("GREEN")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Won!",
                                                    `Your bet * 2= ${
                                                        Player.amount * 2
                                                    }\nYou now have: ${
                                                        savings.money + Player.amount * 2
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount) * 2;
                                            Player.amount *= 2;

                                            Playing = false;
                                        } else if (
                                            DealerPlayingCardValue >= 17 &&
                                            DealerPlayingCardValue === Player.playervalue
                                        ) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("ORANGE")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Tied!",
                                                    `You now have: ${savings.money}`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = 0;

                                            Playing = false;
                                        }
                                    }
                                }

                                break;

                            case "stand":
                                e = new Discord.MessageEmbed();

                                playerEmojies = [];
                                Player.playercards.forEach((card) =>
                                    playerEmojies.push(GetEmoji(card))
                                );
                                dealerEmojies = [];
                                Player.dealercards.forEach((card) =>
                                    dealerEmojies.push(GetEmoji(card))
                                );

                                if (DealerPlayingCardValue > 21) {
                                    [Player.dealercards, DealerPlayingCardValue] = CalculateAce(
                                        Player.dealercards,
                                        DealerPlayingCardValue
                                    );
                                }
                                // Player.playercards.forEach((card) =>
                                //     !playerEmojies.includes(GetEmoji(card))
                                //         ? playerEmojies.push(GetEmoji(card))
                                //         : card
                                // );
                                // Player.dealercards.forEach((card) =>
                                //     !dealerEmojies.includes(GetEmoji(card))
                                //         ? dealerEmojies.push(GetEmoji(card))
                                //         : card
                                // );

                                if (DealerPlayingCardValue >= 17) {
                                    if (Player.playervalue > DealerPlayingCardValue) {
                                        e.setAuthor(msg.author.username)
                                            .setColor("GREEN")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + DealerPlayingCardValue,
                                                `${dealerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "You Won!",
                                                `Your bet = ${Player.amount}\nYou now have: ${
                                                    savings.money + Player.amount
                                                }`
                                            );

                                        message.edit({ embeds: [e] });

                                        WinLoss = parseFloat(Player.amount);

                                        Playing = false;
                                    } else if (Player.playervalue < DealerPlayingCardValue) {
                                        e.setAuthor(msg.author.username)
                                            .setColor("RED")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + DealerPlayingCardValue,
                                                `${dealerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "You Lost!",
                                                `Your bet = ${Player.amount}\nYou now have: ${
                                                    savings.money - Player.amount
                                                }`
                                            );

                                        message.edit({ embeds: [e] });

                                        WinLoss = parseFloat(Player.amount) * -1;

                                        Playing = false;
                                    } else if (Player.playervalue === DealerPlayingCardValue) {
                                        e.setAuthor(msg.author.username)
                                            .setColor("ORANGE")
                                            .setTitle("BlackJack")
                                            .setThumbnail(msg.author.avatarURL())
                                            .setTimestamp(msg.createdTimestamp)
                                            .addField(
                                                "You have | " + Player.playervalue,
                                                `${playerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "Dealers has | " + DealerPlayingCardValue,
                                                `${dealerEmojies.join(" ")}`
                                            )
                                            .addField(
                                                "You Tied!",
                                                `You now have: ${savings.money}`
                                            );

                                        message.edit({ embeds: [e] });

                                        WinLoss = 0;

                                        Playing = false;
                                    }
                                } else {
                                    while (DealerPlayingCardValue < 17) {
                                        card = bj.Hit();
                                        Player.dealercards.push(card);
                                        dealerEmojies.push(GetEmoji(card));
                                        DealerPlayingCardValue =
                                            DealerPlayingCardValue + CalculateCardValue(card);

                                        if (DealerPlayingCardValue > 21) {
                                            [Player.dealercards, DealerPlayingCardValue] =
                                                CalculateAce(
                                                    Player.dealercards,
                                                    DealerPlayingCardValue
                                                );
                                        }

                                        if (DealerPlayingCardValue > 21) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("GREEN")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Won!",
                                                    `Your bet = ${Player.amount}\nYou now have: ${
                                                        savings.money + Player.amount
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount);

                                            Playing = false;
                                        } else if (
                                            DealerPlayingCardValue >= 17 &&
                                            DealerPlayingCardValue > Player.playervalue
                                        ) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("RED")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Lost!",
                                                    `Your bet = ${Player.amount}\nYou now have: ${
                                                        savings.money - Player.amount
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount) * -1;

                                            Playing = false;
                                        } else if (
                                            DealerPlayingCardValue >= 17 &&
                                            DealerPlayingCardValue < Player.playervalue
                                        ) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("GREEN")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Won!",
                                                    `Your bet = ${Player.amount}\nYou now have: ${
                                                        savings.money + Player.amount
                                                    }`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = parseFloat(Player.amount);

                                            Playing = false;
                                        } else if (
                                            DealerPlayingCardValue >= 17 &&
                                            DealerPlayingCardValue === Player.playervalue
                                        ) {
                                            e.setAuthor(msg.author.username)
                                                .setColor("ORANGE")
                                                .setTitle("BlackJack")
                                                .setThumbnail(msg.author.avatarURL())
                                                .setTimestamp(msg.createdTimestamp)
                                                .addField(
                                                    "You have | " + Player.playervalue,
                                                    `${playerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "Dealers has | " + DealerPlayingCardValue,
                                                    `${dealerEmojies.join(" ")}`
                                                )
                                                .addField(
                                                    "You Tied!",
                                                    `You now have: ${savings.money}`
                                                );

                                            message.edit({ embeds: [e] });

                                            WinLoss = 0;

                                            Playing = false;
                                        }
                                    }
                                }

                                break;

                            default:
                                break;
                        }
                    });

                message.reactions.removeAll();

                if (!Playing) {
                    if (Player.amount > savings.biggestbet) savings.biggestbet = Player.amount;
                    if (WinLoss > 0) {
                        await client.query(
                            `update savings set money = ${savings.money + WinLoss}, won = ${
                                savings.won + WinLoss
                            }, gambled = ${
                                savings.gambled + Player.amount
                            }, timesPlayed = ${++savings.timesplayed},
                                biggestBet = ${savings.biggestbet} where playerId = '${
                                msg.author.id
                            }'`
                        );
                    } else {
                        await client.query(
                            `update savings set money = ${savings.money + WinLoss}, lost = ${
                                savings.lost + WinLoss
                            }, gambled = ${
                                savings.gambled + Player.amount
                            }, timesPlayed = ${++savings.timesplayed},
                                biggestBet = ${savings.biggestbet} where playerId = '${
                                msg.author.id
                            }'`
                        );
                    }
                    await client
                        .query(`DELETE FROM blackjack WHERE playerId = '${Player.playerid}'`)
                        .then(`Deleted - ${Player.playerid}`);
                    await client.end();

                    Savings.UpdateLevel(msg.author.id, msg);

                    return;
                }

                const emojies = [];
                Player.emojis.forEach((emoji) => {
                    emojies.push(emoji);
                    message.react(GetEmoji(emoji));
                });

                if (!emojies.includes("stand")) message.react(GetEmoji("stand"));
            }

            return;
        });

        /**
         *
         * @param {Array<string>} arr
         * @param {number} val
         * @returns array and value
         */
        function CalculateAce(arr, val) {
            arr.forEach((card) => {
                if (val > 21) {
                    if (card.value === "A") {
                        card.value = "1";
                        val -= 10;
                    }
                }
            });
            return [arr, val];
        }
    },
};
