module.exports = {
    name: 'Rudeness',
    description: 'Sends messages back to user who swears.',
    async execute(arg, msg, CommandCooldown, Ctime){
        const random = require('random');

        const filter1 = msg2 => msg2.author.id !== '672836310175711273';

        let msg1 = [];
        arg.forEach(element => {
            msg1 = element.toLowerCase();
        });
    
        if(msg1.includes('duhas') || msg1.includes('duhai') || msg1.includes('suka') || msg1.includes('daunas') || msg1.includes('daunai') || msg1.includes('kekse') || msg1.includes('jibanas') || msg1.includes('pydaras') || msg1.includes('kurwa')){
            {
                var result = (Math.floor(Math.random() * 3) + 1); // eslint-disable-line
                msg.channel.startTyping();
                if (result === 1) msg.reply(`Jopštararai seniukas!!`);
                else if (result === 2) msg.reply(`I vėl bazarini ane??`);
                else msg.reply(`vovo nusiramink biški.`);
                msg.channel.stopTyping();
        } 
        
        try{
            var respone =  await msg.channel.awaitMessages(filter1 , { // eslint-disable-line
            max: 6, // skaicius -1, tiek zinuciu bus gauta
            maxMatches: 5,
            time: 5000,
        });
        
    }catch(e){
        //console.error('Gave up!');
        
        return;
    }
        respone.forEach(async m => {
            msg.channel.startTyping();
            var msg3 = m.content.toLowerCase();
            if(msg3.includes(`pasli nx`) || msg3.includes('eik nx') || msg3.includes('pashli'))
            if(msg.author.id === m.author.id){
                var num = random.int(1, 4);
                if(num === 1) m.reply(`Tu gal pats ir eik vaikeli..`);
                else if(num === 2) m.reply(`Tavo vardas pats kaip nx.`);
                else if(num === 3) m.reply(`SHUT THE FUCK UP BITCH.`);
                else {
                    m.reply('Tu cia raunies??');
                    var response2 = await m.channel.awaitMessages(msg5 => m.author.id === msg5.author.id, { max: 3, time: 4000});
                    response2.forEach(m1 => {
                        msg.channel.startTyping();
                        var msg6 = m1.content.toLowerCase();
                        if(msg6.includes(`o taip`) || msg6.includes('taip') || msg6.includes('yes') || msg6.includes('y') || msg6.includes('aha')){
                            m1.reply(`Dabar nebe LOL :)`);
                            CommandCooldown.add(m1.author.id);
                            var time = 30;
                            Ctime.push({ID: m1.author.id, addHours: m1.createdAt.getHours(), addMinutes: m1.createdAt.getMinutes(), addSeconds: m1.createdAt.getSeconds(), length: time});
                            setTimeout(() => {
                             CommandCooldown.delete(m1.author.id);
                             for(var i = 0; i < Ctime.length; i++){
                                 if(Ctime[i].ID === m1.author.id) Ctime.splice(i, 1);
                             }
                            }, time*1000); // laikas sekundemis xD
                            msg.channel.stopTyping();

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
                    response1.forEach(mm =>{
                        msg.channel.startTyping();
                        var msg7 = mm.content.toLowerCase();
                        if(msg7.includes(`sorry`) || msg7.includes('soriukas') || msg7.includes(`sorri`) || msg7.includes(`srr`) || msg7.includes(`sori`) || msg7.includes(`sory`)) mm.reply('Know your place dog!');
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
                            msg.channel.stopTyping();
                        }
                        msg.channel.stopTyping();
                    });
                }
                msg.channel.stopTyping();
            }
        });
        return msg.channel.stopTyping();
        //console.log(respone.forEach( m=> console.log(m.content)));
        //if(respone.first().content.toLowerCase() === 'eik nx') respone.first().channel.send('Pats eik nx');
    }
    }
};