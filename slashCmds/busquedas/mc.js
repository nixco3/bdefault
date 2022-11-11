const fetch = require("node-fetch");
const {
  MessageAttachment
} = require("discord.js");

module.exports = {
  "name": "minecraft",
  "description": "Cosas sobre minecraft.",
  "options": [{
    "type": 1,
    "name": "avatar",
    "description": "Ver el avatar de un usuario de minecraft.",
    "options": [{
      "type": "STRING",
      "name": "apodo",
      "description": "El nombre del usuario que quieres buscar.",
      "required": true
    }]
  }, {
    "type": 1,
    "name": "body",
    "description": "El cuerpo completo de una skin de Minecraft.",
    "options": [{
      "type": "STRING",
      "name": "apodo",
      "description": "El nombre del usuario que quieres buscar.",
      "required": true
    }, {
      "type": "STRING",
      "name": "tipo",
      "description": "Elige como quieres que salga el cuerpo de la skin.",
      "choices": [{
        "name": "Full de frente",
        "value": "frontFull",
      }, {
        "name": "Full en 3D",
        "value": "full"
      }]
    }]
  }, {
    "type": 1,
    "name": "skin",
    "description": "Obtienes la skin para descargar y usar de un jugador de Minecraft.",
    "options": [{
      "type": "STRING",
      "name": "apodo",
      "description": "El nombre del jugador a buscar su skin.",
      "required": true
    }, ]
  }, {
    "type": 1,
    "name": "head",
    "description": "La cabeza de una skin de Minecraft en 3D.",
    "options": [{
      "type": "STRING",
      "name": "apodo",
      "description": "El nombre del jugador a buscar la cabeza de su skin.",
      "required": true
    }]
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand("minecraft"),
      usuario = interaction.options.getString("apodo");

    if (command === "avatar") {
      fetch(`https://some-random-api.ml/mc?username=${encodeURIComponent(usuario)}`).then(c => c.json()).then(async (d) => {
        if (!d.uuid) return await interaction.followUp({
          content: "No encontré a ese jugador."
        })


        const att = new MessageAttachment(`https://visage.surgeplay.com/face/512/${d.uuid}.png`, 'avatar.png')
          
        embed.setDescription(`[${d.username}](https://visage.surgeplay.com/face/512/${d.uuid})`)
        embed.setImage('attachment://avatar.png')
        embed.setTimestamp()

        return await interaction.followUp({
          embeds: [embed],
          files: [att]
        })
      });
    } else if (command === "head") {
      fetch(`https://some-random-api.ml/mc?username=${encodeURIComponent(usuario)}`).then(c => c.json()).then(async (d) => {
        if (!d.uuid) return await interaction.followUp({
          content: "No encontré la skin de ese jugador."
        })


        const att = new MessageAttachment(`https://visage.surgeplay.com/head/512/${d.uuid}.png`, 'head.png')

        embed.setDescription(`[${d.username}](https://visage.surgeplay.com/head/512/${d.uuid})`)
        embed.setImage('attachment://head.png')
        embed.setTimestamp()

        return await interaction.followUp({
          embeds: [embed],
          files: [att]
        })
      });
    } else if (command === "skin") {
      fetch(`https://some-random-api.ml/mc?username=${encodeURIComponent(usuario)}`).then(c => c.json()).then(async (d) => {
        if (!d.uuid) return await interaction.followUp({
          content: "No encontré la skin de ese jugador."
        })


        const att = new MessageAttachment(`https://visage.surgeplay.com/skin/512/${d.uuid}.png`, 'head.png')

        embed.setDescription(`[${d.username}](https://visage.surgeplay.com/skin/512/${d.uuid})`)
        embed.setImage('attachment://head.png')
        embed.setTimestamp()

        return await interaction.followUp({
          embeds: [embed],
          files: [att]
        })
      });
    } else if (command === "body") {
      fetch(`https://some-random-api.ml/mc?username=${encodeURIComponent(usuario)}`).then(c => c.json()).then(async (d) => {
        if (!d.uuid) return await interaction.followUp({
          content: "No encontré la skin de ese jugador."
        })

        let url;

        if (interaction.options.get("tipo")) {
          if (interaction.options.get("tipo").value === "frontFull") {
        url 
= `https://visage.surgeplay.com/frontfull/512/${d.uuid}.png`
          } else {
            url = `https://visage.surgeplay.com/full/512/${d.uuid}.png`
          }
        } else {
          url = `https://visage.surgeplay.com/full/512/${d.uuid}.png`
        }
        const att = new MessageAttachment(url, 'head.png')

        embed.setDescription(`[${d.username}](https://visage.surgeplay.com/full/512/${d.uuid})`)
        embed.setImage('attachment://head.png')
        embed.setTimestamp()

        return await interaction.followUp({
          embeds: [embed],
          files: [att]
        })
      });
    }
  },
  category: "searchs"

}