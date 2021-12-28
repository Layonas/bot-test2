module.exports = {
    name: 'Rudeness',
    description: 'Sends messages back to user who swears.',
    // eslint-disable-next-line no-unused-vars
    async execute(msg, args){

        const Quotes = require('../node_modules/inspirational-quotes/data/data.json');

        const random = require('random');

        if(msg.content.startsWith('!')) return;

        const H1 = ['My brother stop and listen to this:', 'You can always be mad but just listen:', 'Its okay we now you had a bad day but listen:', 'Stop for a brief moment for this:'];
        // var Hate1 = ['Jopštararai seniukas!!','I vėl bazarini ane??','Vovo nusiramink biški.','Ramiakas.','Toli neskrisi su tokiais žodžiais.','Eik minecrafta atsipalaidavimui.','Lola judėk geriau nei čia keikies.','Reikia pachilinti seniuk.','Stop raging brather.'];
        // var Hate2 = ['Tu cia raunies??','Tu gal pats ir eik vaikeli..','Tavo vardas pats kaip nx.','SHUT THE FUCK UP BITCH.','Tau mentus iškviesiu bledes.','Nesuprantu retardu kalbos.','Alio?'];
        // var Bitching = ["Biatch", "Prasileidai seniuk", "Apsiramino pacas", "MUAHHAHAHHAHHAHHHAHHAHHAHHHAHAHHHAHAHHHAH", "I WIN", "One tappinau", "Nebekviesk dofkos lolo palost"];
        // var Emojies = [
        //     msg.guild.emojis.cache.find(e => e.name === 'kekw'),
        //     msg.guild.emojis.cache.find(e => e.name === 'pilam'),
        //     msg.guild.emojis.cache.find(e => e.name === 'PogGabris'),
        //     msg.guild.emojis.cache.find(e => e.name === 'malding'),
        //     msg.guild.emojis.cache.find(e => e.name === 'toomad'),
        //     msg.guild.emojis.cache.find(e => e.name === 'emoji_46')
        // ];
        
        if(msg.author.id === process.env.USER_OWNER || msg.author.id === process.env.USER_BOT) return;
        
        let message = [];
        message = msg.content.toLowerCase().split(/[\s.,;:'"!?]/);
        for(const m of message)
            if(m.match(/^duha[sie]?$|^suk[aos]+$|^daun[asie]+$|^kekse$|^jiban[asie]+$|^pydar[asie]+$|^debila?s?i?e?(iukas)?$|^dalbajob[aesi]+$/gi))
            {
                await msg.channel.sendTyping();
                const num = random.int(0, H1.length-1);
                const qnum = random.int(0, Quotes.length);
                msg.reply(H1[num] + '\n' + Quotes[qnum].text);
                break;
            }
        
    }
};
