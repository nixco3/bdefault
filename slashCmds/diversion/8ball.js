const {
  Constants
} = require('discord.js');

module.exports = {
  name: "8ball",
  description: "Le haces una pregunta a la bola del 8.",
  options: [{
    name: "pregunta",
    description: "la pregunta que le vas a hacer qué más sería si no",
    required: true,
    type: 3
  }],
  async execute(client, interaction, embed) {
    const rtas = ["Sí.", "No.", "Definitivamente.", "Definitivamente no.", "No entendí..", "Capaz..", "Tal vez.", "Uhmm. ¿Puedes repetir la pregunta?", "¡Claro que sí!", "Claro.", "Claro que no.", "Seguro.", "Ni lo dudes.", "¡Si!", "NO.", "¡Tenlo por seguro!", "Deberías tener en cuenta otras cosas.", "No tengo palabras.", "Nada que decir."];
    const rta = rtas[Math.floor(Math.random() * rtas.length)],
      pregunta = interaction.options.getString("pregunta");

    embed.addField(':sparkles: - Pregunta', `${pregunta.replace(/\?+/gi, '?').replace(/¿+/gi, '¿')}`)
    embed.addField(':8ball: - Respuesta', `${rta}`)
    embed.setTimestamp()
    embed.setThumbnail("https://www.pngmart.com/files/3/8-Ball-Pool-PNG-Photos.png")

    await interaction.reply({
      embeds: [embed]
    })

  },
  category: "funs"
}