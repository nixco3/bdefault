const ud = require("urban-dictionary"),
  Discord = require("discord.js"),
      translate = require("@iamtraction/google-translate");

module.exports = {
  name: "urban-dictionary",
  description: "Comandos relacionados al diccionario urbano.",
  options: [
    {
      type: 1,
      name: "search",
      description: "Buscas una palbra en este mismo.",
      options: [
        {
          type: 3,
          name: "palabra",
          description: "La palabra a buscar en el diccionario urbano.",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "random",
      description: "Obtienes una definición aleatoria del diccionario urbano.",
      options: [],
    },
    {
      type: 1,
      name: "wotd",
      description:
        "Obtienes las 10 palabras del día y sus definiciones. (Words Of The Day)",
      options: [],
    },
  ],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand();
    
    let filter2 = i => i.user.id === interaction.user.id;
    
    switch(command) {
      case "search": {
        let busq = await interaction.options.getString("palabra");
          let re;
        try {
          re = await ud.define(busq)
        } catch(err) {
          return await interaction.followUp({
            content: "No encontré resultados sobre tu búsqueda."
          })  
        }
        
        let filter = i => i.author.id === interaction.user.id;
        
       /* if(typeof re != "object") return await interaction.followUp({
          content: "No encontré esa palabra."
        })*/
        let i = 1;
        
        embed.setDescription(re.map(c => `\`[${i++}]\` ${c.word}`).join("\n"))
        embed.setAuthor({
          name: "Urban Dictionary",
          iconURL: "https://apprecs.org/gp/images/app-icons/300/28/xyz.sayangoswami.urbandictionary.jpg"
        })
        embed.setFooter({
          text: "Tienes 15 segundos para elegir un resultado."
        })
        
        await interaction.followUp({
          embeds: [embed]
        }).then((msg) => {
          msg.channel.awaitMessages({filter, max: 1, time: 15000, errors: ["time"]}).then(async (m) => {
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
          
          let w = re[parseInt(el - 1)];
        
        const traduci = await translate(w.example, {to: "es"}),
         traduci2 = await translate(w.definition, {to: "es"});
            
         
        const ee = new Discord.MessageEmbed()
        .setDescription(w.definition.length >= 4000 ? w.definition.slice(0, 4000) : w.definition)
        .setTitle(w.word)
        .setURL(w.permalink)
        .setAuthor({
          name: "Urban Dictionary",
          iconURL: "https://apprecs.org/gp/images/app-icons/300/28/xyz.sayangoswami.urbandictionary.jpg"
        })
        .setColor(embed.color)
        .setFooter({
          text: `👍 ${w.thumbs_up} · 👎 ${w.thumbs_down}`
        })
        .addField('Ejemplo', `${w.example ? w.example.length >= 1000 ? w.example.slice(0, 1000) : w.example : "No especificado."}`)
        .addField('Autor', `Nombre de usuario: ${w.author}\nPublicó esto el ${require("moment")(w.written_on).format("LLLL")}`)
          
       
          msg.edit({
            embeds: [ee],
          })
          
        }).catch((err) => {
          msg.edit({
            content: "No elegiste ningún resultado.",
            embeds: [/*{description: "No elegiste ningún resultado.", color: "RED", timestamp: Date.now()}*/]
          })
        })
        })
      }
        break;
      case "random": {
        let re = await ud.random()
        
        if(!re.length) return await interaction.followUp({
          content: "Ocurrió un error ejecutando este comando."
        })
        let w = re[0];
        
        const ee = new Discord.MessageEmbed()
        .setDescription(w.definition.length >= 4000 ? w.definition.slice(0, 4000) : w.definition)
        .setTitle(w.word)
        .setURL(w.permalink)
        .setAuthor({
          name: "Urban Dictionary",
          iconURL: "https://apprecs.org/gp/images/app-icons/300/28/xyz.sayangoswami.urbandictionary.jpg"
        })
        .setColor(embed.color)
        .setFooter({
          text: `👍 ${w.thumbs_up} · 👎 ${w.thumbs_down}`
        })
        .addField('Ejemplo', `${w.example ? w.example.length >= 1000 ? w.example.slice(0, 1000) : w.example : "No especificado."}`)
        .addField('Autor', `Nombre de usuario: ${w.author}\nPublicó esto el ${require("moment")(w.written_on).format("LLLL")}`)
          
         
        await interaction.followUp({
          embeds: [ee],
        })
      }
        break;
      case "wotd": {
        let re = await ud.wordsOfTheDay()
        
        if(!re.length) return await interaction.followUp({
          content: "No encontré esa palabra."
        })
        let i = 1;
        
        embed.setDescription(re.map(c => `\`[${i++}]\` [${c.word}](${c.permalink}) | 👍 ${c.thumbs_up} · 👎 ${c.thumbs_down}\n${c.definition.length > 250 ? c.definition.slice(0, 250) : c.definition}`).join("\n\n"))
        embed.setAuthor({
          name: "Urban Dictionary",
          iconURL: "https://apprecs.org/gp/images/app-icons/300/28/xyz.sayangoswami.urbandictionary.jpg"
        })
        
        await interaction.followUp({
          embeds: [embed]
        })
      }  
    }
  },
  category: "searchs"
}
