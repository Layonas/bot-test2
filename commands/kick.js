module.exports = {
name: 'kick',
alias: ['kick'],
usage: '!<alias> <@tag>',
example: '!kick @eligijus',
description: 'Kicking a member for bad behaviour',
execute (msg, args, BotID, CommandCooldown, commandFiles, queue, prefix, Ctime, ytdl, youtube, bot, ping, MessageEmbed, holder, OwnerID, serverQueue){ // eslint-disable-line
    
                const requester = msg.author.username;
                if (requester === 'Layon' || requester === 'TopperHarley')
                {
                    if (!args[1])
                    {
                        msg.reply('Prasau pažymėkite ką norite išmesti!');
                    }
                    else
                    {
                        const user = msg.mentions.users.first();
                    if (user && user.username !== 'Layon')
                    {
                        const member = msg.guild.member(user);
                        if (member)
                        {
                            member.kick('Tu buvai išmestas!').then(() =>{
                                msg.reply(`Sėkmingai pašalintas ${user}`);
                            }).catch(err  => {
                                msg.reply('Įvyko kažkokia klaida!');
                                console.log(err);
                            });
                        }
                    }
                    else {
                        msg.reply('Netinkamai įvestas žmogus!');
                    }
                    }
                    
                }
                else 
                {
                    msg.reply('Tu neturiu tokių teisių!');
                }
}

};