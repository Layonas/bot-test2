module.exports = {
    name: 'checking',
    description: 'checks if the server is online',
    async execute(bot){
var a = 0;
setInterval( async () => {

//var room =  bot.channels.get('543849764219781131');
var room = await bot.channels.get('672837776672030774'); 
const ping = require('minecraft-server-util');
const {Client, RichEmbed} = require('discord.js');
        
await  ping('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>{
if (error) throw error;
if (response.version.slice(4) === 'Online' && a === 0)
{           
    const embed = new RichEmbed()
    .setColor('GREEN')
    .setThumbnail('https://wallpapercave.com/wp/NjGW245.jpg')
    .setTitle('**Server is Online**')
    .addField('IP', response.host, true)
    .setDescription('**Join Now!**')
    room.send(embed);
    a = a + 1;
}else if (response.version.slice(4) === 'Online'){ 
    room.send(`Checked ${a}`);
    a++;
}else {
    room.send('Offline');
    a = 0;
} 

})

}, 1000*60*30);

}
  
}