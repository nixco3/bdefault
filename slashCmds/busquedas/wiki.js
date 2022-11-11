const wtf = require("wtf_wikipedia");

module.exports = {
  name: "wikipedia",
  description: "Buscas algo en wikipedia.",
  options: [{
    name: "busqueda",
    description: "Lo que vas a buscar.",
    required: true,
    type: 3
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply({
      fetchReply: true
    });
    
    let doc = await wtf.fetch(interaction.options.getString("busqueda"), 'es')
        
        try {

        embed.setTitle(`Resultados para: **${interaction.options.getString("busqueda")}.**`)
        embed.setTimestamp()
        embed.setAuthor({
          name: "Wikipedia",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Wikipedia_logo_%28svg%29.svg/1250px-Wikipedia_logo_%28svg%29.svg.png"
        })
           
          for(let i = 1; i < doc.sections().length; i++) {
            if(i === 20) break;
            embed.addField(doc.section(i).title(), doc.sentences()[i - 1].text())
          }
       /*   
        if(doc.section(3)) {
            embed.addField(doc.section(3).title(), doc.sentences()[2].text())
        }

        if(doc.section(4)) {
            embed.addField(doc.section(4).title(), doc.sentences()[3].text())
        }

        if(doc.section(5)) {
            embed.addField(doc.section(5).title(), doc.sentences()[4].text())
        }

        if(doc.section(6)) {
            embed.addField(doc.section(6).title(), doc.sentences()[5].text())
        }*/

        await interaction.followUp({embeds: [embed]})
} catch (err) {
  console.log(err)
  await interaction.followUp({
    content: "No se encontraron resultados.",
    ephemeral: true
  })
  
}
  }, 
  category: "searchs"
}