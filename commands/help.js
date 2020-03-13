module.exports = {
    name: 'help',
    description: 'send all available commands',
    execute(msg, args){
        msg.reply('!server, !info, !play, !stop, !skip, !playlist, !nowplaying, !pause !resume');
    }
}