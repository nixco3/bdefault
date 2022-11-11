const gplay = require('google-play-scraper'),
      { MessageEmbed } = require("discord.js");

module.exports = {
  name: "google-play",
  description: "Busca una app o un juego en Google Play",
  options: [{
    name: "nombre",
    description: "El nombre de la app a buscar.",
    type: 3,
    required: true
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
  const busqueda = interaction.options.getString("nombre");
  
    let filter = i => i.author.id === interaction.user.id;
    
    let re = await gplay.search({
      term: busqueda,
      num: 10
    }),
      i = 1;
    
    if(!re.length) return await interaction.followUp({
      content: "No encontré ninguna app o juego con ese nombre."
    });
    
    embed.setDescription(re.map((r) => `\`[${i++}]\` ${r.title}`).join("\n"))
    embed.setAuthor({
      name: "Google Play Store",
      iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Arrow_logo.svg/1200px-Google_Play_Arrow_logo.svg.png"
    })
    embed.setFooter({
      text: "Tienes 15 segundos para elegir un resultado."
    })
    
    await interaction.followUp({
      embeds: [embed]
    }).then((msg) => {
        msg.channel.awaitMessages({filter, max: 1, time: 15000, errors: ["time"]}).then((m) => {
          let el = m.first().content;
          
          if(isNaN(el)) {
            return msg.edit({
              content: "Ingresa un resultado válido.",
              embeds: []
            })
          }
          
          if(parseInt(el - 1) > 9) return msg.edit({
            content: "Ingresa un resultado del 1 al 10.",
            embeds: []
          })
          
          let game = re[parseInt(el - 1)];
          
          const ee = new MessageEmbed()
          .setTitle(game.title)
          .setURL(game.url)
          .setDescription(game.summary || "El desarrollador no especificó información sobre el juego.")
          .setThumbnail(game.icon || null)
          .setTimestamp()
          .addField('Desarrollador', `Persona/Compañía: ${game.developer}\nID: ${game.developerId}`)
          .setColor(embed.color)
          .addField('Producto', `Precio: ${game.priceText.toLowerCase() === "free" ? `No tiene, es gratis.` : game.priceText}\nMoneda: ${game.currency || "No especificada."}\n`)
          
          if(game.scoreText) {
            ee.setFooter({
            text: `Puntuación: ${game.scoreText} ${game.score ? `(${game.score})` : '\u200b'}`,
            iconURL: "https://www.pngkit.com/png/full/508-5080817_ongoing-coaching-and-support-feedback-icon-white-png.png"
          })
          }
          
          msg.edit({
            embeds: [ee]
          })
          
        }).catch((err) => {
          msg.edit({
            content: "No elegiste ningún resultado.",
            embeds: [/*{description: "No elegiste ningún resultado.", color: "RED", timestamp: Date.now()}*/]
          })
        })
    })
  },
  category: "searchs"
}