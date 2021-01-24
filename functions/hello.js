module.exports ={
    name: 'hello',
    alias: ['hello'],
    execute(msg){
        if (msg.content.toLowerCase() === 'hello') return msg.channel.send('Hey you should have a really nice day:).');
        if(msg.content.toLowerCase() === 'pilam') return msg.channel.send(`${msg.guild.emojis.cache.find(e => e.name === 'pilam')}`);
        if(msg.content.toLowerCase() === 'kek') return msg.channel.send(`${msg.guild.emojis.cache.find(e => e.name === 'kekw')}`);
        if(!msg.mentions.users.first()) return;
        if(msg.mentions.users.first().id === process.env.USER_BOT && msg.content.toLowerCase().includes('sw')) return msg.channel.send('Zdarowa ^^');
    }
};
