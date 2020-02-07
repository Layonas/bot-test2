module.exports = {
    name: 'cooldown', 
    description: 'Making a player timeout so he couldnt write messages till the time runs out.',
    execute(msg, args, CommandCooldown)
    {  
         console.log(args[2]);     
        if (args[1])
        {
            const user = msg.mentions.users.first();
            if (user)
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
                               
                               msg.reply ('Sėkmingai pridėtas vartotojas prie sąrašo.')
                               console.log(user.id + ' Id was added to wait list.');
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
}