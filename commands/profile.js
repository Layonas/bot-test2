module.exports = {
    name: 'profile',
    alias: ['profile', 'prof'],
    usage: '!<alias> (optional) <function> (optional) <link || function> (optional) <mode || image>',
    example: `!profile
!profile update || level || xp -- https://image.jpg
!profile update embed true || false`,
    description: 'Lets people see what level and other stuff they have like xp from the database',
    async execute(msg, args, BotID){
        //---------------------------------------------------------
        const { RichEmbed, Attachment } = require('discord.js');
        const { Client } = require('pg');
        const jsonfile = require('jsonfile'); // eslint-disable-line
        const jimp = require('jimp');
        //---------------------------------------------------------

        //---------------------------------------------------------
        // Connecting to the database
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        });

        client.connect();
        //---------------------------------------------------------

        //---------------------------------------------------------
        // Creating a table if there is none
        const table_photos = `CREATE TABLE IF NOT EXISTS photos(
            id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            data JSONB NOT NULL
        )`;

        client.query(table_photos);
        //---------------------------------------------------------

                    // Getting data about user photo
                    var { rows } = await client.query('SELECT data FROM photos'); // eslint-disable-line
                    var guild = rows[0].data;
                    // if(JSON.stringify(guild).length < 10) guild = {};
                    // else guild = JSON.parse(JSON.stringify(guild).slice(9, JSON.stringify(guild).length-2));
                    //---------------------------------------------------------------
        
                    if(msg.guild.id in guild === false) guild[msg.guild.id] = {
                        name: msg.guild.name,
                    };
        
                    var user = guild[msg.guild.id];
        
                    if(msg.author.id in user === false) 
                    {
                    user[msg.author.id] = {
                        name: msg.author.username,
                        user_id: msg.author.id,
                        photo: 'https://i.pinimg.com/474x/64/89/35/64893517cd0fad84c451c85b135ee091.jpg',
                        embed: true
                    };
                    await client.query("UPDATE photos SET data'" + JSON.stringify(guild) + "'").then(console.log('Succesfully added new user into table photos.')).catch(err => console.error(err));
                }
        
                    var photo = user[msg.author.id];
        //---------------------------------------------------------------

             //---------------------------------------------------------------
            // Getting statistic about player expierience
            var { rows } = await client.query('SELECT data FROM users'); //eslint-disable-line
            var stats = rows[0].data;
            //---------------------------------------------------------------

            var serverStats =  stats[msg.guild.id];
            var userStats = serverStats[msg.author.id];

            // Var for holding the earlier photo
            var check = photo.photo;
            

        if(!args[1]){

            if(photo.photo.endsWith('.gif') || photo.embed === true){
            //-------------------------------------------------------------------------------------------------------------------------
            // Making an Embed
            var embed = new RichEmbed()
            .setImage(photo.photo)
            .setAuthor(msg.author.username)
            .setColor('RANDOM')
            .setTitle('Informacija apie tave')
            .setThumbnail(msg.author.avatarURL)
            .addField('Dabartinis XP: ', userStats.CurrentXp, true).addField('Visas XP: ', userStats.OverallXp, true)
            .addField('Tavo dabartinis lygis yra: ', userStats.level, true)
            .addField('Iki kito lygio tau trūksta: ', userStats.xpToNextLevel, true)
            .setFooter('Tu gali pakeisti arba pašalinti didžiają nuotrauką! ', msg.guild.members.get(BotID).user.avatarURL);
            //-------------------------------------------------------------------------------------------------------------------------

            msg.channel.send(embed);

            return client.end();
            }

            //---------------------------------------------------------------------------------------------------------------------------
            // Loading in prefered image of a user and applying cover on to it
            await jimp.read(photo.photo, async (err, image) => {
                if(err) return msg.reply('Įvyko klaida!');
                //------------------------------------
                var percentage = userStats.CurrentXp * 100 / userStats.Next_Level_At;
                var text = `${Math.floor(percentage)}%`;
                //------------------------------------
                var font = await jimp.loadFont('./stuff/font.fnt');
                var font1 = await jimp.loadFont('./stuff/pepsi.fnt');
                var level_font = await jimp.loadFont('./stuff/level_font.fnt');
                var profile_image = await jimp.read(msg.author.avatarURL);
                var background = await jimp.read('./stuff/photoFrame.png');
                var line = await jimp.read('./stuff/purple.jpg');
                line.resize(percentage * 1.77, 14).opacity(0.75);
                profile_image.resize(80, 80);
                background.opacity(0.6).composite(line, 130, 21).composite(profile_image, 15, 15).print(font, 210, 20, text ,100 , 8).print(font1, 180, -2, msg.author.username).print(font, 185, 37, `${userStats.CurrentXp}/${userStats.Next_Level_At}`).print(level_font, 152, 40, `Level ${userStats.level}`);
                image
                .resize(480, 270)
                .composite(background, 20, 20)
                .getBufferAsync(jimp.MIME_PNG).then(pic => {let attachment = new Attachment(pic, 'test.png'); msg.channel.send(attachment);}).catch( err => {if(err) return msg.reply('Prisidėkite nuotrauką.');});
            }).catch(err => {if(err) return msg.reply('Įvyko klaida!');});

            return client.end();

        } else if(args[1].toLowerCase() === 'xp' || args[1].toLowerCase() === 'exp'){

            msg.reply(`Tu dabar turi **${userStats.CurrentXp}**, iš viso turi **${userStats.OverallXp}**`);

            return client.end();
        } else if(args[1].toLowerCase() === 'level' || args[1].toLowerCase() === 'lygis' || args[1].toLowerCase() === 'l' ||args[1].toLowerCase() === 'lvl'){

            msg.reply(`Tavo lygis yra **${userStats.level}**, tau trūksta dar **${userStats.xpToNextLevel}** iki kito lygio!`);

            return client.end();
        }else if(args[1].toLowerCase() === 'update' || args[1].toLowerCase() === '-u'){

            if(!args[2]) {
                msg.reply('Prašome pasirinkti kokią nuotrauką norite naudoti, nuotrauka turi būti iš interneto URL formatu.');
                return client.end();
            }

            else if(args[2].toLowerCase() === 'pc'){
                await msg.reply('Turi 15 sek idėti nuotrauką!');

                const filter = m => {
                    if(msg.author.id === m.author.id){
                        if(m.attachments.size === 1){
                        m.attachments.forEach( file => photo.photo = file.url);
                    } else m.reply('Turite pridėti nuotrauką.');
                }
                };

                await msg.channel.awaitMessages(filter, {max: 6, time: 15000});
            }

            else if(args[2].toLowerCase() === 'embed'){
                if(!args[3]) return msg.reply(`Statusas **${photo.embed}**`);
                if(args[3].toLowerCase() === 'true' || args[3].toLowerCase() === 'treu' || args[3].toLowerCase() === 't' || args[3].toLowerCase() === 'tru') photo.embed = true;
                else if(args[3].toLowerCase() === 'false' || args[3].toLowerCase() === 'fal' || args[3].toLowerCase() === 'f' || args[3].toLowerCase() === 'fals' || args[3].toLowerCase() === 'flase') photo.embed = false;

                await client.query("UPDATE photos SET data = '" + JSON.stringify(guild) + "'").then(console.log('Done')).catch(err => {
                    msg.reply('Atsiprašome kažkas nepavyko.');
                    console.log(err);
                    return client.end();
                });

                msg.reply(`Embed Pakeistas. Statusas **${photo.embed}**`);
                return client.end();
            }

            else if (args[2].toLowerCase() === 'remove' || args[2].toLowerCase() === '-r' || args[2].toLowerCase() === 'r' || args[2].toLowerCase() === 're' || args[2].toLowerCase() === 'rem'){

                photo.photo = '';
                
                await client.query("UPDATE photos SET data = '" + JSON.stringify(guild) + "'").then(console.log('Done')).catch(err => {
                    console.log(err);
                    msg.reply('Atsiprašome kažkas nepavyko.');
                    return client.end();
                });

                msg.reply('Jūsų nuotrauka pašalinta');

                return client.end();
            }

            else if(args[2].startsWith('https') && args[2].endsWith(`.jpg`) || args[2].startsWith('https') && args[2].endsWith(`.png`) || args[2].startsWith('https') && args[2].endsWith(`.gif`)) photo.photo = args[2];
                else {
                    msg.reply(`Netinkama nuoroda.`);
                    return client.end();
                }

                await client.query("UPDATE photos SET data = '" + JSON.stringify(guild) + "'").then(console.log('Done')).catch(err => {
                    msg.reply('Atsiprašome kažkas nepavyko.');
                    console.log(err);
                    return client.end();
                });

                if(check !== photo.photo){
                    if(args[2].toLowerCase() !== 'pc') await msg.channel.bulkDelete(1);
                msg.reply('Jūsų nuotrauka atnaujinta.');
            } else msg.reply('Nuotrauka liko tokia pati.');


            return client.end();
        }
        else if(args[1].startsWith('<@!' || args[1].startsWith('<@'))){
            try {
                const userCheck = serverStats[msg.mentions.users.first().id];
                const embed = new RichEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setColor('RANDOM')
                .setFooter(`Tikrinta: ${msg.createdAt.getHours()+3 + ':' + msg.createdAt.getMinutes() + ':' + msg.createdAt.getSeconds()}`, msg.guild.members.get(BotID).user.avatarURL)
                .setThumbnail(msg.guild.members.get(msg.mentions.users.first().id).user.avatarURL)
                .setTitle(`Informacija apie **${msg.mentions.users.first().username}**`)
                .addField('Vardas', userCheck.name, true)
                .addField('Lygis', userCheck.level, true)
                .addBlankField(true)
                .addField('Visas XP', userCheck.OverallXp, true)
                .addField('Išsiųsta žinučių', userCheck.MessagesSent, true);
                await msg.channel.send(embed);
            } catch (error) {
                msg.reply('Įvyko klaida. Pabandykite iš naujo.');
            }
        }
        else {
            msg.reply('Netinkamai suformuota komanda!');
            return client.end();
        }

    }
};