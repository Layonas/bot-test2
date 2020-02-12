module.exports = {
    name: 'checking',
    description: 'checks if the server is online',
    execute(msg)
    {
        var a = 0;
        const ping = require('minecraft-server-util');
        ping('0o0o0o0o0o0o0o0o.aternos.me', 25565, (error, response) =>{
            if (error) throw error;
            if (response.version.slice(4) === 'Online')
            {
                if (a === 0)
                {
                    channel.send('The server is online! Join now at ' + response.host);
                    a++;
                }
                
            }
            else 
            {
                a = 0;
            }
            console.log(response.version.slice(4));
            
        })

    }

}