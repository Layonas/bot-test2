module.exports = {
    name: "Apps",
    description: "Sets slash commands for discord server",
    async execute() {
    const { SlashCommandBuilder } = require("@discordjs/builders");
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");

    const commands = [
        new SlashCommandBuilder()
        .setName("play")
        .setDescription("Command to add a song to a queue.")
        .addStringOption((option) =>
            option
            .setName("song")
            .setDescription("Title or song URL.")
            .setRequired(true)
        ),

        new SlashCommandBuilder()
        .setName("playing")
        .setDescription("Name of the song that is currently playing"),

        new SlashCommandBuilder()
        .setName("add_role")
        .setDescription("Add a role to the server database")
        .addStringOption(option => 
          option
          .setName("role_name")
          .setDescription("The name of a new role")
          .setRequired(true))
        .addIntegerOption(option =>
          option
          .setName("from")
          .setDescription("The start level of the role")
          .setRequired(true))
        .addIntegerOption(option =>
          option
          .setName("to")
          .setDescription("The end of the level for the role")
          .setRequired(true))
        .addStringOption(option => 
          option
          .setName("color")
          .setDescription("Color in hex for the role")
          .setRequired(true)),
  
          new SlashCommandBuilder()
          .setName("suggest_role")
          .setDescription("Suggest a role to the server")
          .addStringOption(option => 
            option
            .setName("role_name")
            .setDescription("The name of a new role")
            .setRequired(true))
          .addIntegerOption(option =>
            option
            .setName("from")
            .setDescription("The start level of the role")
            .setRequired(true))
          .addIntegerOption(option =>
            option
            .setName("to")
            .setDescription("The end of the level for the role")
            .setRequired(true)),

          new SlashCommandBuilder()
          .setName("roles")
          .setDescription("Display roles that are currently on the server."),

          new SlashCommandBuilder() // profile user commands
          .setName("profile")
          .setDescription("Command used to check your or others profile status and update: picture, embed etc.")
          .addSubcommand(command =>
            command
            .setName("check")
            .setDescription("Check user stats.")
            .addUserOption(option =>
              option
              .setName("user")
              .setDescription("User that you want to check.")
              .setRequired(true))
            .addBooleanOption(option =>
              option
              .setName("profile")
              .setDescription("Check your profile picture or embed stats.")
              .setRequired(true)))
          .addSubcommand(command =>
            command
            .setName("update")
            .setDescription("Update the picture of your profile stats.")
            .addStringOption(option =>
              option
              .setName("link")
              .setDescription("Link to the photo you want to update (has to end with .png|.jpg|.gif)")
              .setRequired(true))
            .addBooleanOption(option =>
              option
              .setName("pc")
              .setDescription("Update the photo by uploading a picture.")
              .setRequired(true))
            .addBooleanOption(option =>
              option
              .setName("remove")
              .setDescription("Remove the current photo and set it to default.")
              .setRequired(true)))
            .addSubcommand(command =>
              command
              .setName("embed")
              .setDescription("Used to update embed.")
              .addBooleanOption(option =>
                option
                .setName("status")
                .setDescription("Check the status of the embed.")
                .setRequired(true))
              .addBooleanOption(option =>
                option
                .setName("set")
                .setDescription("Set the embed to true of false")
                .setRequired(true)))

    ].map((command) => command.toJSON());

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    await rest.put(Routes.applicationGuildCommands(process.env.USER_BOT, process.env.GUILD), { body: commands })
          .then(() => console.log('\nSuccessfully registered application commands.'))
          .catch(console.error);

  
    commands.map(command => console.log(command.name));
    return;
    //-------------------------------------------------------------------------------------------------------------
  },
};
