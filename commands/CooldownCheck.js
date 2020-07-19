module.exports = {
    name: 'CooldownCheck',
    alias: ['cc', 'cooldowncheck', 'checkcooldown', 'checkc', 'ColldownCheck'],
    execute(msg, args, CommandCooldown, OwnerID, Ctime){

        const user = msg.mentions.users.first();
        const member = msg.guild.member(user);
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        var seconds = new Date().getSeconds();

        if(msg.author.id === OwnerID){ 
        if(!args[1]) return msg.reply(`Prašau pasirink kurį žmogu tikrinsi.`);

        if(member) {
            if(CommandCooldown.has(user.id)){
                var time = 0;
                for(var i = 0; i < Ctime.length; i++){
                    if(Ctime[i].ID === user.id) time = Ctime[i].length - ((hours - Ctime[i].addHours) * 3600 + (minutes - Ctime[i].addMinutes) * 60 + (seconds - Ctime[i].addSeconds)); 
                }
                return msg.channel.send(`${args[1]} dar turi ${time}s laukti, kol galės rašyti.`);
            }
            else return msg.reply(`${args[1]} nėra sąraše.`); 
        }
        else return msg.reply(`${args[1]} nėra šio kanalo narys.`);
        }else return msg.reply('Git gut');
    } 
};