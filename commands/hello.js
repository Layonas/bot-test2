module.exports ={
    name: 'hello',
    alias: ['hello'],
    execute(msg){
        msg.channel.send('Hey you should have a really nice day:).');
    }
 };
 
// module.exports.run = (msg) =>{
//     msg.channel.send(`veikia`);
// };

// module.exports.help = {
//     name: 'hello'
// };