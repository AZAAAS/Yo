const express = require('express');
const app = express();
const { Client, Intents, Collection, Interaction  } = require('discord.js')
const discord = require("discord.js")
const fs = require('fs')
const config = require("./config.json")
const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});

module.exports = client;

client.on("ready", () => {
  console.log(`Bot made by NxS#0001`.green)
  console.log(`Logged in as ${client.user.tag}`.cyan)
  client.user.setActivity("Gemeente Request", {
    type: "WATCHING",
  });
});

//new collections
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.categories = fs.readdirSync('./commands');

//load the files
['command', 'slashCommand'].forEach((handler) => {
    require(`./handler/${handler}`)(client)
});


app.listen(8083, () => {
  console.log('Listening on port 8083')
});

app.get('/', (req, res) => {
  res.send(`<h2>Discord.js v13 Quick.db Ticket bot is alive!<h2>`)
});

client.on("guildMemberAdd", member => {

  var role = member.guild.roles.cache.get(config.role);

  if (!role) return;

  member.roles.add(role);

  let { MessageEmbed } = require("discord.js")
  console.log(`${member.user.tag} is ${config.servernaam} gejoined!`);
  var botEmbed = new discord.MessageEmbed()
      .setColor("#319CF3")
      .setTitle("👋 Welkom in De Gemeente Request!")
      .setDescription(`Hallo <@${member.id}>, Welkom in **Request Roleplay™**!`)
      .setThumbnail('https://cdn.discordapp.com/attachments/967150027325710367/986706353437437982/logo-requestrp2.png', ({ dynamic: true, size: 4096 }))
      .setTimestamp()
      .setFooter(`2022 © Request Roleplay`, `${client.user.displayAvatarURL()}`)
      .addFields(
          { name: "__Members__:", value: `> We hebben nu : **${member.guild.memberCount.toString()}**Inwoners!` }
      )


  member.guild.channels.cache.get(config.welcome).send({
      content: `<@${member.id}>`,
      embeds: [botEmbed],
  })

});


client.login(config.token)