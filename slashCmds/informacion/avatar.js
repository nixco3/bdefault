const ImageScript = require('imagescript');
const {
  MessageAttachment
} = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  name: "avatar",
  description: "ver el avatar de alguien, puede ser mencionandolo o colocando su id.",
  options: [{
    name: "usuario",
    description: "el usuario al que le vas a robar el avatar.",
    type: "USER",
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    let usuario = interaction.options.getUser("usuario") || interaction.user;

    let a = await fetch(usuario.displayAvatarURL({
      format: 'png',
      size: 512
    })).then(e => e.arrayBuffer()).then(ImageScript.decode);

    embed.setDescription(`[Avatar](${usuario.displayAvatarURL({ dynamic: true, size: 1024 })})`)
    embed.setImage(usuario.displayAvatarURL({
      dynamic: true,
      size: 1024
    }))
    embed.setAuthor({
      name: usuario.tag,
      iconURL: usuario.displayAvatarURL({
        dynamic: true
      })
    })
    embed.setColor(a.averageColor().toString(16).slice(0, 6) || embed.color)

    await interaction.followUp({
      embeds: [embed]
    })


  },
  category: "infos"
}