const fetch = require("node-fetch"),
      moment = require("moment");
moment.locale("es")

module.exports = {
  name: "npm",
  description: "Buscas un módulo.",
  options: [{
    type: 3,
    name: "nombre",
    description: "Nombre del módulo a buscar.",
    required: true
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    
    fetch(`https://registry.npmjs.org/${encodeURIComponent(interaction.options.getString("nombre").split(" ").join("-"))}`)
    .then((res) => res.json())
    .then(async (d) => {
      if(d.error) {
        return await interaction.editReply({
          content: "No pude encontrar esa npm."
        })
      }
      
      embed.setAuthor({
        name: d.name,
        iconURL: "https://cdn-images-1.medium.com/max/1200/1*xkrs6-ROrUypMcoczYiuwQ.png",
        url: `https://npmjs.com/package/${encodeURIComponent(interaction.options.getString("nombre").split(" ").join("-"))}`
      })
      embed.setDescription(d.description || "\u200b")
      embed.addField('Información general', `Licencia: ${d.license || "No tiene."}\nCreado: ${moment(d.time.created).format("LLLL")} (${moment(d.time.created).fromNow()})\nModificado: ${moment(d.time.modified).format("LLLL")} (${moment(d.time.modified).fromNow()})`)
      embed.addField('Colaboradores', `${d.maintainers.length > 30 ? d.maintainers.map(v => v.name).slice(0, 30).join(", ") : d.maintainers.map(v => v.name).join(", ")}`)
      embed.addField('Palabras clave', d.keywords.join(", ") || "No especificadas.")
      
      await interaction.editReply({
        embeds: [embed]
      })
    }).catch(async (err) => {
      await interaction.editReply({
        content: "Ocurrió un error buscando ese módulo.s"
      })
    })
  },
  category: "searchs"
}