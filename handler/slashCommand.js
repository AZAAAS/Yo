const fs = require('fs');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const config = require("../config.json")
const application_id = "1019946572416552960"
const guild = "974181461450186832";

module.exports = (client) => {

const slashCommands = [];

fs.readdirSync('./slashCommands/').forEach(dir => {
const slashCommandFiles = fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
	const slashCommand = require(`../slashCommands/${dir}/${file}`);
	slashCommands.push(slashCommand.data.toJSON());
  if(slashCommand.data.name) {
          client.slashCommands.set(slashCommand.data.name, slashCommand)
          console.log(file, '- Success')
        } else {
          console.log(file, '- Error')
        }
}
});
    

    const rest = new REST({ version: "9" }).setToken(config.token);

    (async () => {
      try {
        console.log("Started registering application (/) commands.");

        await rest.put(
          guild
            ? Routes.applicationGuildCommands(application_id, guild)
            : Routes.applicationCommands(application_id),
          {
            body: slashCommands,
          }
        );

        console.log(
          "Successfully registered application (/) commands."
        );
      } catch (error) {
        console.error(error);
      }
    })();


}