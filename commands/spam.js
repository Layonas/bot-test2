module.exports = {
    name: 'spam',
    alias: ['spam'],
    usage: '!<alias> <@tag> <times> <message>',
    example: '!spam @eligijus 10 atsiliepk velniaz',
    description: 'Spams messages that user says',
   async execute(msg, args){
       if(msg.author.username !== 'Layon') return msg.reply('Pisk nx');
       var a = 1;
       var limit = args[2];
       var attack =  setInterval(spam, 3000);

        async function spam() {
            if(a >= limit) 
            {
                clearInterval(attack);
            }
            else a++;

            try {
                var user = msg.mentions.users.first();
                var message = args.slice(3).join(' ');
    
                msg.channel.send(`<@${user.id}> ${message}!`);
            } catch (error) {
                var role = msg.mentions.roles.first(); // eslint-disable-line
                var message = args.slice(3).join(' '); // eslint-disable-line
    
                msg.channel.send(`<@&${role.id}> ${message}!`);
            }

        }
}
};