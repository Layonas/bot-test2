module.exports = {
    name: 'Rudeness',
    description: 'Sends messages back to user who swears.',
    async execute(arg, msg, CommandCooldown, Ctime, Owner, BotID){
        const random = require('random');

        if(msg.content.startsWith('!')) return;

        const filter1 = msg2 => msg2.author.id !== '672836310175711273';

        var Hate1 = ['Jopštararai seniukas!!','I vėl bazarini ane??','Vovo nusiramink biški.','Ramiakas.','Toli neskrisi su tokiais žodžiais.','Eik minecrafta atsipalaidavimui.','Lola judėk geriau nei čia keikies.','Reikia pachilinti seniuk.','Stop raging brather.'];
        var Hate2 = ['Tu cia raunies??','Tu gal pats ir eik vaikeli..','Tavo vardas pats kaip nx.','SHUT THE FUCK UP BITCH.','Tau mentus iškviesiu bledes.','Nesuprantu retardu kalbos.','Alio?'];

        if(msg.author.id === Owner || msg.author.id === BotID) return;
        
        var flag = false;
        let message = [];
        message = msg.content.toLowerCase().split(/[\s.,;:'"!?]/);
        for(const m of message)
            if(m.match(/^duhas$|^duhai$|^suka$|^sukos$|^daunas$|^daunai$|^kekse$|^jibanas$|^jibanai$|^pydaras$|^pydarai$/gi))
            {
                    console.log('Hate speech detected');
                    flag = true;
                    var result = (random.int(0, Hate1.length)); // eslint-disable-line
                    msg.channel.startTyping();
                    await msg.channel.send(Hate1[result]);
                    await msg.channel.stopTyping();
                    break;
            }
        
        if(!flag) return console.log('returned because no hate speech'); 
        
        try{
            var respone =  await msg.channel.awaitMessages(filter1 , { 
            max: 6, // skaicius -1, tiek zinuciu bus gauta
            maxMatches: 5,
            time: 5000,
            errors: ['time'],
        });
        
    }catch(e){
        const emoji = msg.guild.emojis.cache.find(e => e.name === 'kekw');
        await msg.channel.send(`${emoji}`);
        await msg.channel.send('biatch');
        return;
    }
        respone.forEach(async m => {
            msg.channel.startTyping();
            var msg3 = m.content.toLowerCase();
            if(msg3.match(/eik nx|pashol|pashol nx|pisk nx|pisk|atsipisk/gi))
            if(msg.author.id === m.author.id){
                var num = random.int(0, Hate2.length);
                await m.reply(Hate2[num]);
                if(num === 0) {
                    var response2 = await m.channel.awaitMessages(msg5 => m.author.id === msg5.author.id, { max: 3, time: 4000});
                    response2.forEach(async m1 => {
                        msg.channel.startTyping();
                        var msg6 = m1.content.toLowerCase();
                        if(msg6.includes(`o taip`) || msg6.includes('taip') || msg6.includes('yes') || msg6.includes('y') || msg6.includes('aha')){
                            await m1.reply(`Dabar nebe LOL :)`);
                            CommandCooldown.add(m1.author.id);
                            var time = 30;
                            Ctime.push({ID: m1.author.id, addHours: m1.createdAt.getHours(), addMinutes: m1.createdAt.getMinutes(), addSeconds: m1.createdAt.getSeconds(), length: time});
                            setTimeout(() => {
                            CommandCooldown.delete(m1.author.id);
                            for(var i = 0; i < Ctime.length; i++){
                                if(Ctime[i].ID === m1.author.id) Ctime.splice(i, 1);
                            }
                            }, time*1000); // laikas sekundemis xD
                            await msg.channel.stopTyping();
                        } else m1.reply(`Kita karta patylėk geriau...`);
                    });
                }
                
            } else if(msg3.includes(`tylek`)){
                var n = random.int(1, 3);
                msg.channel.startTyping();
                if(n === 1) msg3.reply(`Pats tylėk lopeta!`);
                else if (n === 2) msg3.reply(`Kramtyk ką šneki...`);
                else {
                    msg3.reply(`Atsirado matai dar prašnekėk ir pailsėsi!`);
                    var response1 = await msg.channel.awaitMessages(msg4 => msg4.author.id === m.author.id, { max: 3, time: 4000 });
                    response1.forEach(async mm =>{
                        msg.channel.startTyping();
                        var msg7 = mm.content.toLowerCase();
                        if(msg7.match(/sorry|sory|sori|sorri|soriukas|srr|nepyk|atiprasau/gi)) mm.reply('Know your place dog!');
                        else {
                            CommandCooldown.add(mm.author.id);
                            var time = 30;
                            Ctime.push({ID: mm.author.id, addHours: mm.createdAt.getHours(), addMinutes: mm.createdAt.getMinutes(), addSeconds: mm.createdAt.getSeconds(), length: time});
                            setTimeout(() => {
                            CommandCooldown.delete(mm.author.id);
                            for(var i = 0; i < Ctime.length; i++){
                                if(Ctime[i].ID === mm.author.id) Ctime.splice(i, 1);
                            }
                            }, time*1000); // laikas sekundemis xD
                            await msg.channel.stopTyping();
                        }
                        await msg.channel.stopTyping();
                    });
                }
                await msg.channel.stopTyping();
            }
        });
        return await msg.channel.stopTyping();
    }
};
