const { evaluate } = require("mathjs"),
      translate = require("@iamtraction/google-translate");

module.exports = {
  name: "math",
  description: "Resuelve operaciones matemáticas (no es muy inteligente)",
  options: [{
    name: "operacion",
    description: "La operación que quieres que el bot resuelva.",
    required: true,
    type: 3
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const operation = interaction.options.getString("operacion");
    
    try {
      let result = await evaluate(operation)
      
      embed.addField('Operación', `\`\`\`fix\n${operation}\`\`\``)
      embed.addField('Resultado', `\`\`\`fix\n${result}\`\`\``)
      embed.setThumbnail("https://storage.googleapis.com/multi-static-content/previews/artage-io-thumb-403d6fde1e7fd71ca61768d2caec383b.png")
      embed.setTimestamp()
      
      await interaction.followUp({
        embeds: [embed]
      })
    } catch(err) {
      // const traducido = await translate(err.message, {to: "es"});
      
      embed.setDescription(`\`\`\`\nSyntax Error: ${err.message}\`\`\``);
      embed.setColor("RED")
      embed.setTimestamp()
      
      await interaction.followUp({
        embeds: [embed]
      })
    }
    
  },
  category: "utilitys"
}