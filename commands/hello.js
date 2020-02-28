module.exports = {
    name: 'hello',
    description: 'says hello.',
    execute(msg){
        msg.channel.send('Hello there :), have a nice day!');
    }
}