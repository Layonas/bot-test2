module.exports = {
    name: 'help',
    alias: ['help'],
    description: 'send all available commands',
    execute(msg, args){
const DC = require('discord.js');
const owner = msg.guild.members.get('279665080000315393');
       if (!args[1]){
        msg.reply('!server, !play, !splay, !instaplay, !stop, !skip, !playlist, !np, !pause, !resume, !kick, !cooldown, !volume, !profile, !rs, !levelRole');
        msg.reply(`Dėl papildomos informacijos, kaip veikia komanda, prašome parašyti
**!help <komandos_pavadinimas>**
__Pavyzdys__ -- !help info`);
let embed = new DC.RichEmbed()// eslint-disable-line
.setColor('BLUE')
.setThumbnail(owner.user.avatarURL)
.setTitle('Information')
.setDescription(`Kūrėjas: **${owner.user.username}**
Boto pavadinimas: **${msg.guild.members.get('672836310175711273').user.username}**
Versija: **1.1.6**`); 
        msg.channel.send(embed);
       } 

switch(args[1]){
    case 'server':
        msg.reply('Pažiūri ar minecraft serveris yra įjungtas, ar ne ir gražina informaciją apie jį.');
    break;
    
    case 'play':
        msg.reply(`Įėjus į **Music** kalbėjimo kanalą galima paprašyti boto užklausos dėl dainos, kurią jis paleis arba pridės prie eilės. Galima pridėti po vieną dainą arba galima pridėti visą __playlistą__
**Naudoti** __!play <URL>__ **arba** __!play <pavadinimas>__ **arba**
**Pavyzdys playlisto** __!play <https://www.youtube.com/playlist?list=PLOh0cbfmptuIKR2BTscm4deobDJGsDzWf>__
**Pavyzdys dainos tik url** __!play <https://www.youtube.com/watch?v=scq68KbF4Gk>__
**Pavyzdys dainos tik su pavadinimu** __!play justin bieber baby__`);
    break;

    case 'splay':
        msg.reply(`Jeigu nežinai, kaip tiksliai vadinasi daina gali pamėginti padaryti dainos paiešką, ši komanda gražins pirmas 10 dainų ir leis pasirinkti!
**Naudojimas** __!splay <pavadinimas>__
**Pavyzdys**  __!splay justin bieber baby__`);
    break;

    case 'instaplay':
        msg.reply(`Prideda dainą be eilės iš kart į antrą vietą, kad nereikėtų stabdyti dainų ir naikinti eilės.
**Naudojimas**  __!instaplay <pavadinimas>__ arba  __!instaplay <url>__
**Pavyzdys dainos tik su pavadinimu**  __!instaplay justin bieber baby__
**Pavyzdys dainos tik su url**  __!instaplay <https://www.youtube.com/watch?v=scq68KbF4Gk>__`);
    break;
    case 'stop':
        msg.reply('Sustabdo visas dainos, kurios gros ir kuri groja ir panaikina muzikos eilę.');
    break;

    case 'skip':
        msg.reply(`Praleidžia dabar grojančią dainą arba galima nurodyti antrą argumentą ir praleisti tiek dainų kiek nurodoma.
**Naudoti**  __!skip__  **arba**  __!skip <skaičius>__
**Pavyzdys** *Praleidžia tik vieną dainą* __!skip__
**Pavyzdys** *Praledžia 5 dainas*  __!skip 5__`);
    break;

    case 'playlist':
        msg.reply(`Parodo kokios dainos yra sąraše.`);
    break;

    case 'np':
        msg.reply('Parodo dabar grojančią dainą.');
    break;

    case 'pause':
        msg.reply('Pristabdo dabar grojančią dainą, kurią galimą pratęsti su !resume.');
    break;

    case 'resume':
        msg.reply('Pratęsia pristabdytą dainą.');
    break;

    case 'kick':
        msg.reply(`Pašaliną pasirinktą narį iš kanalo
**Naudojimas** __!kick @user__
**Pavyzdys** __!kick @Layon__`);
    break;

    case 'cooldown':
        msg.reply(`Uždeda timeoutą nariui kanale ir padaro, kad jo žinutės būtu ištryntos pasirinktą laiko tarpą, laikas matuojamas sekundėmis
**Naudojimas** __!cooldown @user <time>__
**Pavyzdys** __!cooldown @Layon 10__`);
    break;

    case 'volume':
        msg.reply(`Nustatomas muzikos grojimo garsas nuo 1 - 200:
**Naudojimas**  __!volume <amount>__
**Pavyzdys**  __!volume 100__`);
    break;

    case 'profile':
        msg.reply(`Pažiūri kiek laiko turi cooldown.
*Papildomos profiliaus komandos*:
**!profile level**
**!profile xp**
**!profile update** --- __*!profile update <URL.png>*__  --- __*!profile update remove*__  ---  __*!profile update pc*__  ---  __*!profile update embed <State(True or False)>*__
**!profile**`);
    break;

    case 'rs':
        msg.reply(`Pašaliną dainą iš sąrašo.
**Naudojimas** __!rs <number>__`);
    break;

    case 'levelRole':
        msg.reply(`Dabar yra:
__Crook__ *5-10lvl*
__Pawn__ *10-15lvl*
__Worker__ *15-20lvl*
__Išlaikytas lietuvių egzaminas__ *21lvl*
__Gali dirbti mokytoju__ *22lvl*
__Kažkada norėjai būti didžėjum__ *23lvl*
__Normalus__ *24lvl*
__Chad__ *25lvl*
**Jei nori pasiūlyti roliu rašyk !levelRole <Pavadinimas (jei ne vienas žodis vietoj tarpo dėk _  - pvz *juodas_pirneas*)> <Lygis>**`);
    break;
    }

return;
}
};