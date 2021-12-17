module.exports = {
    name: 'HandleCommands',
    description: 'Handles all commands that are presented to the bot so that the main test.js would look cleaner',
    async execute(msg, args, bot, interaction, player){
    
        if(interaction){

            const name = interaction.commandName;
        
            await interaction.deferReply();
        
            switch (name) {
                case 'play':
                    await bot.commands.get('play').execute('', '', bot, interaction, player);                    
                break;

                case 'playing':
                    await bot.commands.get('NowPlaying').execute('', '', bot, interaction, player);
                break;

                case 'add_role':
                    await bot.commands.get('addRole').execute(bot, interaction);
                break;

                case 'suggest_role':
                    await bot.commands.get('levelrole').execute(bot, interaction);
                break;

                case 'roles':
                    await bot.commands.get('RoleChecker').execute('', '', bot, interaction, player);
                break;
                
                case 'profile':
                    await bot.commands.get('profile').execute('', '', bot, interaction, player);
                break;
            
                default:
                    break;
            }   
                
        }else {

            if (!msg.content.startsWith('!')) return;

            //-----------------------------------------------------------------------
        
            if(args[0].toLowerCase() === 'clear') {
                if (msg.author.username == "Layon")
                {
                if (!args[1]) return msg.reply('Please choose how much you want to delete');
                if (isNaN(args[1])) return msg.reply(`<${args[1]}> is not a number`);
                msg.channel.bulkDelete(parseInt(args[1])+1);
                }
                else msg.reply('No.');
            }
        
                if(args[0].match(/\W/g))
                    return;
        
             //--------------------------------------------------------------------
        
            const command = args[0].toLowerCase();
            bot.commands.get(command).execute(msg, args, bot, null, player);
            return;

        }
    }
};