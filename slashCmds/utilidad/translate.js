const translate = require("@iamtraction/google-translate");

module.exports = {
  "name": "translate",
  "description": "Traduce un texto a otro idioma.",
  "options": [
    {
      "type": 3,
      "name": "texto",
      "description": "El texto a traducir.",
      "required": true
    },
    {
      "type": 3,
      "name": "idioma",
      "description": "Idioma al que el texto se traducirá, por defecto es español. Debes usar el código ISO del idioma."
    }
  ],
    async execute(client, interaction, embed) {
        await interaction.deferReply();
        const texto = interaction.options.getString("texto"),
            idioma = interaction.options.getString("idioma");

        if(!idioma) {
           let tr = await translate(texto, {to: 'es', from: 'auto'});
                if(tr.from.language.iso !== 'es') {

                    embed.setTimestamp()
            embed.setDescription(tr.text)
            embed.setAuthor({
                name: "Google Translate",
                iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/1024px-Google_Translate_logo.svg.png"
            })
                    
                    return await interaction.followUp({
                        embeds: [embed]
                    })
                } else {
                    let tr2 = await translate(texto, {to: 'en', from: 'auto'});

                    embed.setTimestamp()
            embed.setDescription(tr2.text)
            embed.setAuthor({
                name: "Google Translate",
                iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/1024px-Google_Translate_logo.svg.png"
            })
                    
                    return await interaction.followUp({
                        embeds: [embed]
                    })
                }
        }

        try {
            if(idioma && require("@iamtraction/google-translate").languages.isSupported(idioma)) {
            let tr = await translate(texto, {to: idioma, from: 'auto'});

            embed.setTimestamp()
            embed.setDescription(tr.text)
            embed.setAuthor({
                name: "Google Translate",
                iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/1024px-Google_Translate_logo.svg.png"
            })
            embed.setTitle()
        
            return await interaction.followUp({
                embeds: [embed]
            })
        } else {
            return await interaction.followUp({
                    content: "Ingresa un idioma válido."
            })
        }
        } catch(err) {
                await interaction.followUp({
                content: "Ha ocurrido un error intentando ejecutar el comando."
            })
            console.log(err)
        }
    },
  category: "utilitys"
}