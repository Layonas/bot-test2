module.exports = {
    name: 'DeleteMessageLogs',
    description: 'Deletes messages from logs channel with an interval that is set',
    async execute(bot){
    //----------------------------------------------------------------
    const ChatChannel = bot.guilds.cache.get(process.env.LOG_GUILD).channels.cache.get(process.env.LOG_CHANNEL);

    setInterval(() => {
        ChatChannel.messages.fetch({cache:true})
        .then(messages => {
        messages.each(async m =>{
        if(Date.now() - m.createdAt.getTime() >= 10*60*1000)
            await m.delete({timeout: 100}).catch(err => console.log(`Hard to delete. \n` + err));
        });
    }).catch(err => console.log(`Error fetching messages. \n` + err));
    }, 10*60*1000);
    //----------------------------------------------------------------
    }
};