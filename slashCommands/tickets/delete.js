const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const db = require('quick.db');
const discordTranscripts = require('discord-html-transcripts');
const moment = require('moment');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Verwijder de ticket'),
    async execute(client, interaction) {
      let errorEmbed = new MessageEmbed()
        .setColor("#fa0505")
        .setAuthor("Ontbrekende Permissies", client.user.displayAvatarURL())
        .setDescription("Je hebt geen permissies voor dit commando!")

      if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ embeds: [errorEmbed] })

      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor('#0473F3')
        .setDescription('Deze ticket wordt verwijderd in een aantal seconden')
      ] });
  
      setTimeout(() => {
        interaction.channel.delete();
      }, 5000)
      db.delete(`ticket-${interaction.channel.id}_${interaction.guild.id}`)
      
      const transcriptType = await db.fetch(`transcriptType_${interaction.guild.id}`);
      const transcriptChannel = await db.fetch(`ticketTranscript_${interaction.guild.id}`);
      
      if(transcriptType === 'html') {
      const attachment = await discordTranscripts.createTranscript(interaction.channel);
      await client.channels.cache.get(transcriptChannel).send({ content: `**Ticket Transcript - ${interaction.channel.name}**`, files: [attachment] });
      } else if(transcriptType === 'text') {
          let messages = await interaction.channel.messages.fetch();
          messages = messages.map(m => moment(m.createdTimestamp).format("YYYY-MM-DD hh:mm:ss") +" | "+ m.author.tag + ": " + m.cleanContent).join("\n") || "No messages were in the ticket/Failed logging transcript!";
          const txt = new MessageAttachment(Buffer.from(messages), `transcript_${interaction.channel.id}.txt`)
         client.channels.cache.get(transcriptChannel).send({ content: `**Ticket Transcript - ${interaction.channel.name}**`, files: [txt] })
      } else {
        return;
      }
    }
}