module.exports = {
    name: 'cooldown', 
    description: 'Making a player timeout so he couldnt write messages till the time runs out.',
    execute(msg, args, CommandCooldown)
    {  
    if (msg.author.username === 'Layon' || msg.author.username === 'TopperHarley') 
    {    
        if (args[1])
        {
            const user = msg.mentions.users.first();
            if (user && user.username !== 'Layon')
            {
               const member = msg.guild.member(user);
                if (member)
                {
                    if (!args[2])
                    {
                        
                     msg.reply("Prašau pasirink kiek laiko uždėti timeout'a");
                     }
                  else  {
                           const time = args[2];
                           if (CommandCooldown.has(user))
                           {
                               msg.reply('Vartotojas jau yra cooldown sąraše.')
                           }
                           else
                           {
                               
                               msg.channel.send (`Sėkmingai pridėtas vartotojas prie sąrašo. ${user.username}`)
                               console.log(user.id + ' Id was added to wait list.');
                               console.log(user.username + ' Šis žmogus pridėtas prie sąrašo.');
                           CommandCooldown.add(user.id);
                           setTimeout(() => {
                            CommandCooldown.delete(user.id);
                           }, time*1000);

                           }
                        }
                }else{
                    msg.reply('Tokio žmogaus nėra šiame pokalbyje');
                }
                 
            }else{
                msg.reply('Prašau tinkamą pasirinkite žmogų.');
            }

        }
        else
        {
            msg.reply('Neteisingai parašyta formuluote reikia rašyti "!cooldown @user seconds" !');
        }

    }
    else {
        msg.reply('Tu neturi tokiu teisiu!');
    }
}

}