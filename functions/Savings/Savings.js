// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");

async function CreateSavingsStatus() {
    const { Client } = require("pg");

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();
    //-----------------------------------------------------------------------------------

    // const table = `CREATE table if not exists savings(
    //     money int,
    //     hourly int,
    //     hourlyClaimed bool,
    //     daily int,
    //     dailyClaimed bool,
    //     weakly int,
    //     weaklyClaimed bool,
    //     level int,
    //     gambled float,
    //     won int,
    //     lost int,
    //     playerId varchar(255)
    //     )`;

    // await client.query(table).catch((err) => console.log(err));

    // await client.query(`alter table savings add column dailyClaimedTime int, add column hourlyClaimedTime int, add column weaklyClaimedTime int, add column lastClaimedHourly float,
    // add column lastClaimedDaily float, add column lastClaimedWeakly float`);
    //await client.query(`alter table savings add column timesPlayed int`);
    //await client.query(`alter table savings add column biggestBet float`);
    //await client.query(`alter table savings alter column gambled type float`);
    //await client.query(`alter table savings alter column lost type float, alter column won type float`).catch(err => console.error(err));

    client.end();
}
/**
 *
 * @param {string} playerId
 * @param {Discord.Message} msg
 */
async function UpdateLevel(playerId, msg) {
    const { Client } = require("pg");

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    const { rows } = await client.query(`select * from savings where playerId = '${playerId}'`);
    let player = rows[0];

    const nextLevel = Math.pow(2, player.level - 1) * 1000;

    if (player.gambled >= nextLevel) {
        player.level++;
        player.hourly = player.hourly * 1.5;
        player.hourlyclaimed = false;
        player.daily = player.daily * 1.5;
        player.dailyclaimed = false;
        player.weakly = player.weakly * 1.5;
        player.weaklyclaimed = false;

        await client.query(
            `update savings set level = ${player.level}, hourly = ${player.hourly}, hourlyClaimed = false, 
            daily = ${player.daily}, dailyClaimed = false, weakly = ${player.weakly}, weaklyClaimed = false where playerId = '${playerId}'`
        );

        msg.channel.send(
            `You have been promoted to level **${player.level}**!\nYour reward have now been increased!\n
            **You can now claim your rewards again!**`
        );
        msg.channel.send(`**Please don't waste your valuable money and just write !claim**`);
    }

    return client.end();
}

/**
 *
 * @param {string} playerId
 * @param {Discord.Message} msg
 */
async function Claim(playerId, msg){
    
    const { Client } = require("pg");

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    const { rows } = await client.query(`select * from savings where playerId = '${playerId}'`);
    let player = rows[0];

    if(!player){
        await client.query(
            `insert into savings(money, hourly, hourlyClaimed, daily, dailyClaimed, weakly, weaklyClaimed, level, gambled, won, lost, playerId, timesPlayed) 
            values(1000, 200, false, 1000, false, 10000, false, 1, 0, 0, 0, '${msg.author.id}', 0)`
        );

        const { rows } = await client.query(`select * from savings where playerId = '${playerId}'`);
        player = rows[0];
    }

    const date = new Date(Date.now());

    if(player.hourlyclaimedtime !== date.getHours() || player.lastclaimedhourly+60*60*1000 < date.getTime()){
        player.hourlyclaimed = false;
        player.hourlyclaimedtime = date.getHours();
    }
    if(player.dailyclaimedtime !== date.getDay() || player.lastclaimeddaily+3600*1000*24 < date.getTime()){
        player.dailyclaimed = false;
        player.dailyclaimedtime = date.getDay();
    }

    if(player.weaklyclaimedtime !== date.getDate()){
        const d = new Date(player.lastclaimedweakly);
        if(d.getDay() >= date.getDay() || player.weaklyclaimedtime+7 <= date.getDate()){
            player.weaklyclaimed = false;
            player.weaklyclaimedtime = date.getDate();
        }
    }

    let claims = {
        hourly: false,
        daily: false,
        weakly: false
    };

    if(!player.hourlyclaimed){
        claims.hourly = true;
        player.money += player.hourly;
        player.hourlyclaimed = true;
        player.lastclaimedhourly = date.getTime();
    }
    if(!player.dailyclaimed){
        claims.daily = true;
        player.money += player.daily;
        player.dailyclaimed = true;
        player.lastclaimeddaily = date.getTime();
    }
    if(!player.weaklyclaimed){
        claims.weakly = true;
        player.money += player.weakly;
        player.weaklyclaimed = true;
        player.lastclaimedweakly = date.getTime();
    }

    const e = new Discord.MessageEmbed()
    .setAuthor(msg.author.username, msg.author.avatarURL())
    .setImage(msg.author.avatarURL())
    .setColor('RANDOM')
    .setTimestamp(msg.createdTimestamp)
    .setTitle('Claim')
    .addField('Hourly:', `${claims.hourly ? separator(player.hourly.toString()) : 'Nothing'}`)
    .addField('Daily:', `${claims.daily ? separator(player.daily.toString()) : 'Nothing'}`)
    .addField('Weekly:' , `${claims.weakly ? separator(player.weakly.toString()) : 'Nothing'}`);

    msg.channel.send({embeds : [e]});

    await client.query(`update savings set hourlyClaimed = true, dailyClaimed = true, weaklyClaimed = true, money = ${player.money}, 
    hourlyClaimedTime = ${player.hourlyclaimedtime}, dailyClaimedTime = ${player.dailyclaimedtime}, weaklyClaimedTime = ${player.weaklyclaimedtime},
    lastClaimedHourly = ${player.lastclaimedhourly}, lastClaimedDaily = ${player.lastclaimeddaily}, lastClaimedWeakly = ${player.lastclaimedweakly}
    where playerId = '${playerId}'`);

    return client.end();
}

/**
 * 
 * @param {string} id 
 * @param {Discord.Message} msg 
 */
async function Profile(playerId, msg){

    const { Client } = require("pg");

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    const { rows } = await client.query(`select * from savings where playerId = '${playerId}'`);
    let player = rows[0];

    const e = new Discord.MessageEmbed()
    .setTitle('Profile')
    .setColor('RANDOM')
    .setAuthor(msg.author.username, msg.author.avatarURL())
    .setThumbnail(msg.author.avatarURL())
    .setFooter(`Powered by the power of love<3`, msg.guild.members.cache.get(process.env.USER_BOT).user.avatarURL())
    .setTimestamp(msg.createdTimestamp)
    .addField(`Balance`, `${separator(player.money)}`)
    .addField(`Times played`, `${separator(player.timesplayed)}`)
    .addField('You gambled total', `${separator(player.gambled)}`)
    .addField(`You won`, `${separator(player.won)}`, true)
    .addField('\u200B', '\u200B', true)
    .addField(`You lost`, `${separator(player.lost)}`, true)
    .addField(`Next level at`, `${separator(Math.pow(2, player.level - 1) * 1000)}`, true)
    .addField('\u200B', '\u200B', true)
    .addField(`Your biggest bet`, `${separator(player.biggestbet)}`, true);

    msg.channel.send({embeds: [e]});

    return client.end();
}

/**
 * 
 * @param {string} playerId Player id to give the money
 * @param {Discord.Message} msg
 * @param {number} amount
 * @param {Discord.Client} bot 
 */
async function Give(playerId, msg, amount, bot){

    const { Client } = require("pg");

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    const { rows } = await client.query(`select * from savings where playerId = '${playerId}'`);
    let player = rows[0];

    if(msg.author.id !== process.env.USER_OWNER){
        msg.reply(`You have no authorities!`);
        return client.end();
    }


    player.money = parseInt(player.money) + parseInt(amount);

    await client.query(`update savings set money = ${player.money} where playerId = '${playerId}'`);

    msg.channel.send(`Users: **${(await bot.users.fetch(playerId)).username}** new balance is *${player.money}*`);

    return client.end();
}

/**
 * 
 * @param {string} playerId
 * @param {number} amount
 * @param {Discord.Message} msg 
 */
async function Tip(playerId, amount, msg){

    const { Client } = require("pg");

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    if(isNaN(amount)){
        if(amount.toLowerCase().endsWith('k')){
            amount = parseFloat(amount.substring(0, amount.length)) * 1000;
        } else if(amount.toLowerCase().endsWith('m')){
            amount = parseFloat(amount.substring(0, amount.length)) * 1000000;
        } else{
            return msg.reply("Bet amount needs to be a valid number!");
        }
    } else{
        amount = parseInt(amount);
    }

    if(msg.mentions.users.first())
        playerId = msg.mentions.users.first().id;

    let playerGet = await (await client.query(`select * from savings where playerId = '${playerId}'`)).rows[0];
    let playerGive = await (await client.query(`select * from savings where playerId = '${msg.author.id}'`)).rows[0];
    
    if (playerGive.money < amount)
        return msg.reply(`You don't have enough funds to give away!`);

    if(!playerGet)
        return msg.reply(`Confirm the player id and try again!`);

    playerGive.money = parseInt(playerGive.money) - parseInt(amount);
    playerGet.money = parseInt(playerGet.money) + parseInt(amount);

    await client.query(`update savings set money = ${playerGet.money} where playerId = '${playerId}'`);
    await client.query(`update savings set money = ${playerGive.money} where playerId = '${msg.author.id}'`);

    return msg.channel.send(`You have successfully tipped ${separator(amount)} dollars to ${(await msg.guild.members.fetch(playerId)).user.username}!`);
}

/**
 * 
 * @param {string} playerId 
 * @param {Discord.Message} msg 
 */
async function Balance(playerId, msg){

    const { Client } = require("pg");

    //-----------------------------------------------------------------------------------
    // Connecting to the database
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    const { rows } = await client.query(`select * from savings where playerId = '${playerId}'`); 
    let player = rows[0];

    if(!player)
        return msg.reply(`Please use !claim first before using this command!`);

    const e = new Discord.MessageEmbed()
    .setTitle('Profile')
    .setColor('RANDOM')
    .setAuthor(msg.author.username, msg.author.avatarURL())
    .setThumbnail(msg.author.avatarURL())
    .setFooter(`Powered by the power of love<3`, msg.guild.members.cache.get(process.env.USER_BOT).user.avatarURL())
    .setTimestamp(msg.createdTimestamp)
    .addField(`Balance`, `${separator(player.money)}`);

    msg.channel.send({embeds: [e]});

    return client.end();
}



/**
 * 
 * @param {number} num 
 * @returns string of numbers that are sorted
 */
function separator(num){

    if(!num || num === 0)
        return 0;

    let str = num.toString();

    let c = str.split('');

    const div = str.length % 3;
    let newNum = [];

    if(str.length !== 0){
        if (div === 0){
            for(let i = 0; i < str.length/3; i++){
                let p = c.join('').substring(3*i, 3*(i+1));
                newNum.push(p);                    
            }
        } else{
            let p = c.join('').substring(0, div);
            c.reverse();
            for(let i = 0; i < div; i++)
                c.pop();
            c.reverse();
            newNum.push(p);
            for(let i = 0; i < c.length/3; i++){
                p = c.join('').substring(3*i, 3*(i+1));
                newNum.push(p);
            }
        }
    }

    return newNum.join(' ');
}

module.exports = {
    name: "Savings",
    description: "Database information associated with savings",
    CreateSavingsStatus,
    UpdateLevel,
    Claim,
    Profile,
    Give,
    Tip,
    Balance
};
