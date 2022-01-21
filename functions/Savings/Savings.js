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

    const table = `CREATE table if not exists savings(
        money int,
        hourly int,
        hourlyClaimed bool,
        daily int,
        dailyClaimed bool,
        weakly int,
        weaklyClaimed bool,
        level int,
        gambled int,
        won int,
        lost int,
        playerId varchar(255)
        )`;

    await client.query(table).catch((err) => console.log(err));

    // await client.query(`alter table savings add column dailyClaimedTime int, add column hourlyClaimedTime int, add column weaklyClaimedTime int, add column lastClaimedHourly float,
    // add column lastClaimedDaily float, add column lastClaimedWeakly float`);

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
            `You have been promoted to level **${player.level}**!\nYour reward have now been increased!`
        );
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
    .addField('Hourly:', `${claims.hourly ? player.hourly.toString() : 'Nothing'}`)
    .addField('Daily:', `${claims.daily ? player.daily.toString() : 'Nothing'}`)
    .addField('Weakly:' , `${claims.weakly ? player.weakly.toString() : 'Nothing'}`);

    msg.channel.send({embeds : [e]});

    await client.query(`update savings set hourlyClaimed = true, dailyClaimed = true, weaklyClaimed = true, money = ${player.money}, 
    hourlyClaimedTime = ${player.hourlyclaimedtime}, dailyClaimedTime = ${player.dailyclaimedtime}, weaklyClaimedTime = ${player.weaklyclaimedtime},
    lastClaimedHourly = ${player.lastclaimedhourly}, lastClaimedDaily = ${player.lastclaimeddaily}, lastClaimedWeakly = ${player.lastclaimedweakly}
    where playerId = '${playerId}'`);

    return client.end();
}

module.exports = {
    name: "Savings",
    description: "Database information associated with savings",
    CreateSavingsStatus,
    UpdateLevel,
    Claim
};
