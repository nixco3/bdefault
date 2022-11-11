const { encode, decode } = require("morsee");

module.exports = {
  name: "morse",
  description: "Codificar o decodifica código morse.",
  options: [{
    name: "encode",
    description: "Codifica un texto a código morse.",
    type: 1,
    options: [{
      name: "texto",
      description: "Texto a codificar.",
      type: 3,
      required: true
    }]
  }, {
    name: "decode",
    description: "Decodifica un texto a código morse.",
    type: 1,
    options: [{
      name: "texto",
      description: "Texto a decodificar.",
      type: 3,
      required: true
    }]
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand("morse"),
          texto = interaction.options.getString("texto");
    
    if(command === "encode") {
       const traducido = await encode(texto);

      if(traducido.length > 4000) {
        traducido = traducido.toString().slice(0, 4000) + '...'
      }
      
      
      embed.setDescription(traducido)
      embed.setTimestamp()
      
      await interaction.followUp({
        embeds: [embed]
      })
    } else if (command === "decode") {
      const traducido = await decode(texto);

      if(traducido.length > 4000) {
        traducido = traducido.toString().slice(0, 4000) + '...'
      }
      
      embed.setDescription(traducido)
      embed.setTimestamp()
      
      await interaction.followUp({
        embeds: [embed]
      })
    }
    
  },
  category: "utilitys"
}