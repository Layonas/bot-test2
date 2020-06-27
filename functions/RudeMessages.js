module.exports = {
    name: 'Rudeness',
    description: 'Sends messages back to user who swears.',
    async execute(arg, msg){
        const filter = msg2 =>{
            if(msg2.author.id !== '672836310175711273'){
                if(msg2.content.toLowerCase() === 'eik nx'){
                    var a1 = 'Pats eik';
                    var a2 = 'Nepyk seniuk';
                    var a3 = 'Raminkis blt';
                    var result = (Math.floor(Math.random() * 3) + 1);
                    if (result === 1) msg2.channel.send(a1);
                    else if (result === 2) msg2.channel.send(a2);
                    else msg2.channel.send(a3); 
                } 
            }
        };
    
        if(arg.includes('duhas') || arg.includes('duhai') || arg.includes('suka') || arg.includes('daunas') || arg.includes('daunai') || arg.includes('kekse') || arg.includes('jibanas') || arg.includes('pydaras') || arg.includes('kurwa')){
            {
                var result = (Math.floor(Math.random() * 3) + 1); // eslint-disable-line
                if (result === 1) msg.reply(`Jopštararai seniukasĄĄ`);
                else if (result === 2) msg.reply(`I vėl bazarini ane??`);
                else msg.reply(`vovo nusiramink biški.`);
        }
        try{
            var respone =  await msg.channel.awaitMessages(filter , { // eslint-disable-line
            max: 6, // skaicius -1, tiek zinuciu bus gauta
            maxMatches: 5,
            time: 10000,
            errors: ['time']
        });
    }catch(e){
        //console.error('Gave up!');
        return;
    }
        //console.log(respone.forEach( m=> console.log(m.content)));
        //if(respone.first().content.toLowerCase() === 'eik nx') respone.first().channel.send('Pats eik nx');
    }
    }
};