module.exports = {
name: 'kick',
description: 'Kicking a member for bad behaviour',
execute (msg, args)
{
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
                    if (user)
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
                        msg.reply('Tokio žmogaus nėra!');
                    }
                    }
                    
                }
                else 
                {
                    msg.reply('Tu neturiu tokių teisių!');
                }
}

}