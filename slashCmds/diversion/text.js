const emoj = require("../../utils/emojis.js");
const PasteClient = require('pastebin-api').default;

module.exports = {
  "name": "text",
  "description": "Modifica texto de alguna forma (comando gracioso)",
  "options": [{
    "type": 1,
    "name": "emojify",
    "description": "Añade emojis entre las palabras del texto introducido.",
    "options": [{
      "type": 3,
      "name": "texto",
      "description": "El texto a modificar.",
      "required": true
    }]
  }, {
    "type": 1,
    "name": "clap",
    "description": "Añade emojis de aplausos entre las palabras del texto introducido.",
    "options": [{
      "type": 3,
      "name": "texto",
      "description": "El texto a ser modificado.",
      "required": true
    }]
  }, {
    "type": 1,
    "name": "unscramble",
    "description": "Desordena un texto.",
    "options": [{
      "type": 3,
      "name": "texto",
      "description": "El texto a ser modificado.",
      "required": true
    }]
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();

    const chars = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890";
    let namePasta = "";

    for (let i = 0; i < Math.floor(Math.random() * 50) + 1; i++) {
      namePasta += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    let result;
        const command = interaction.options.getSubcommand("text");
    if (command === "clap") {
      result = interaction.options.getString("texto").split(" ").join(" 👏 ")
    } else if (command === "emojify") {
        result = interaction.options.getString("texto").split(" ").map(c => `${c}${[1, 2][Math.floor(Math.random() * 2)] === 1 ? "" : emoj[Math.floor(Math.random() * emoj.length)]} `).join("")
    } else if (command === "unscramble") {
      result = client.des(interaction.options.getString("texto"))
    }

    if (interaction.options.getString("texto").split(" ").length < 2) {
      return await interaction.followUp({
        content: "El texto debe tener más de 2 palabras.",
        ephemeral: true
      })
    }

    if (result.length >= 2000) {
      if (result.length >= 4000) {
        try {
          const client = new PasteClient(process.env.PASTEBIN);

          const url = await client.createPaste({
            code: result,
            expireDate: "1D",
            name: namePasta,
            publicity: 1,
          });

          return await interaction.followUp({
            content: `La longitud de este texto es mayor a 4000 así que puedes verlo completo aquí:\n<${url}>`
          })
        } catch (err) {
          await interaction.followUp({
            content: "Ha ocurrido un error intentando transformar este texto."
          })
        }

      }

      embed.setDescription(`\`\`\`\n${result}\`\`\``)
      embed.setColor("6f1bfd")
      embed.setTimestamp()

      return await interaction.followUp({
        embeds: [embed]
      })
    }

    await interaction.followUp({
      content: `\`\`\`\n${result}\`\`\``
    })
  },
  category: "funs"
}