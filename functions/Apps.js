module.exports = {
    name: 'Apps',
    description: 'Sets slash commands for discord server',
    async execute(bot) {

        // new funciont from here
        const getApp = (guildID) => {
            const app = bot.api.applications(bot.user.id);
            if(guildID)
                app.guilds(guildID);
            return app;
        };
        
        var commands = await getApp(process.env.GUILD).commands.get();
        var CommandNames = [];

        commands.forEach(element => {
            CommandNames.push(element.name);
        }); 

        //await getApp(process.env.GUILD).commands('866745477021696020').delete();
        //delete apps

        // create commands with discord api
        if(!CommandNames.includes('play'))
            await getApp(process.env.GUILD).commands.post({
                data: {
                    name: 'play',
                    description: 'Requested the bot to play any song in youtube with url or the name of the song',
                    options: [
                        {
                            name: 'input',
                            description: 'URL or the name of the song',
                            required: true,
                            type: 3, // string
                        }
                    ]
                }
            });
        
        if(!CommandNames.includes('playing'))
            await getApp(process.env.GUILD).commands.post({
                data: {
                    name: 'playing',
                    description: 'Checks what song is currently playing',
                }
            });

        if(!CommandNames.includes('add_role'))
            await getApp(process.env.GUILD).commands.post({
                data:{
                    name: 'add_role',
                    description: 'Adds new roles to the database',
                    options:[
                        {
                            name: 'role_name',
                            description: 'The name of the new role',
                            required: true,
                            type: 3,
                        },
                        {
                            name: 'level_from',
                            description: 'From what level will people get this role',
                            required: true,
                            type: 4,
                        },
                        {
                            name: 'level_to',
                            description: 'Till what level this role will will be',
                            required: true,
                            type: 4,
                        },
                        {
                            name: 'color',
                            description: 'The color of the role (has to be in html code)',
                            required: true,
                            type: 3,
                        }
                    ]
                }
            });

        if(!CommandNames.includes('help'))
            await getApp(process.env.GUILD).commands.post({
                data:{
                    name: 'help',
                    description: 'Puls information about all commands',
                    options: [
                        {
                            name: 'command',
                            description: 'Name of command to check',
                            required: false,
                            type: 3,
                        }
                    ]
                }
            });

        if(!CommandNames.includes('suggest_role'))
            await getApp(process.env.GUILD).commands.post({
                data:{
                    name: 'suggest_role',
                    description: 'Suggest a role that could be added to roles',
                    options: [
                        {
                            name: 'name',
                            description: 'Role name',
                            required: true,
                            type: 3,
                        },
                        {
                            name: 'levelf',
                            description: 'The level that needs to be achieved to get this role',
                            required: true,
                            type: 4,
                        },
                        {
                            name: 'levelt',
                            description: 'The ending level of this role',
                            required: false,
                            type: 4,
                        }
                    ]
                }
            });

        if(!CommandNames.includes('playlist'))
            await getApp(process.env.GUILD).commands.post({
                data: {
                    name: 'playlist',
                    description: 'Gets the current playlist that is being played',
                }
            });

        if(!CommandNames.includes('roles'))
            await getApp(process.env.GUILD).commands.post({
                data:{
                    name: 'roles',
                    description: 'Check roles that are currently available for this server'
                }
            });

        if(!CommandNames.includes('skip'))
            await getApp(process.env.GUILD).commands.post({
                data: {
                    name: 'skip',
                    description: 'Skips a song or a number of songs',
                    options: [
                        {
                            name: 'number',
                            description: 'A number of songs to skip',
                            type: 4,
                            required: false,
                        }
                    ]
                }
            });

        if(!CommandNames.includes('stop'))
            await getApp(process.env.GUILD).commands.post({
                data: {
                    name: 'stop',
                    description: 'Stops the playlist'
                }
            });

        if(!CommandNames.includes('profile'))
            await getApp(process.env.GUILD).commands.post({
                data: {
                    name: 'profile',
                    description: 'Get the level status for your account',
                    options: [
                        {
                            name: 'get',
                            description: 'Gets information about your level or experience',
                            type: 2,
                            required: false,
                            options: [
                                {
                                    name: 'status',
                                    description: 'Shows an embed or an image of the progress towards level up',
                                    type: 1,
                                    required: false,
                                },
                                {
                                    name: 'experience',
                                    description: 'Displays your current experience (mark **true** if you wish to see this else **do not mark**)',
                                    type: 1,
                                    required: false
                                },
                                {
                                    name: 'level',
                                    description: 'Displays your current level (mark as **true** if you wish to see this else **do not mark**)',
                                    type: 1,
                                    required: false
                                },
                            ]
                        },
                        {
                            name: 'update',
                            description: 'Update your profile command looks',
                            type: 1,
                            required: false,
                            options: [
                                {
                                    name: 'link',
                                    description: 'Paste a link to update your image',
                                    type: 3,
                                    required: false,
                                },
                                {
                                    name: 'pc',
                                    description: 'Upload an image to the server (mark as **true** if you wish to see this else **do not mark**)',
                                    type: 5,
                                    required: false,
                                },
                                {
                                    name: 'remove',
                                    description: 'Removes the image (mark as **true** if you wish to see this else **do not mark**)',
                                    type: 5,

                                }
                            ]
                        },
                        {
                            name: 'embed',
                            description: 'Check your embed status and manage it',
                            type: 2,
                            required: false,
                            options: [
                                {
                                    name: 'status',
                                    description: 'Check your embed status',
                                    type: 1,
                                    required: false,
                                },
                                {
                                    name: 'set',
                                    description: 'Sets the state of embed to true or false',
                                    type: 1,
                                    required: false
                                }
                            ]
                        },
                        {
                            name: 'user',
                            description: 'Check another member in the guild for their status',
                            type: 1,
                            required: false,
                            options: [
                                {
                                    name: 'name',
                                    description: 'User name',
                                    type: 6,
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            });
    

        //-------------------------------------------------------------------------------------------------------------

        // Reading and printing commands from discord server
        commands = await getApp(process.env.GUILD).commands.get();
        commands.forEach(element => {
            console.log(`Command ID: ${element.id}, Command name: ${element.name}`);
        }); 


    }
};