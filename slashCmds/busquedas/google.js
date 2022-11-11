const googleIt = require("google-it-safesearch"),
      { GOOGLE_IMG_SCRAP } = require("google-img-scrap"),
      { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "google",
  description: "Realizas una búsqueda en Google.",
  options: [{
    type: 1,
    name: "search",
    description: "Una busqueda común con un mapeado de resultados.",
    options: [{
      name: "busqueda",
      description: "Lo que vas a buscar.",
      type: 3,
      required: true
    }]
  }, {
    name: "images",
    type: 1,
    description: "Realizas una búsqueda en Google Imágenes",
    options: [{
      name: "busqueda",
      description: "Lo que vas a buscar.",
      type: 3,
      required: true
    }]
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    
    const command = interaction.options.getSubcommand("google"),
          busqueda = interaction.options.getString("busqueda");
    
    if(command === "search") {
      let res = await googleIt({
        query: busqueda,
        limit: 10,
        disableConsole: true
      });
      
      if(!res.length) return await interaction.editReply({
        content: "No pude encontrar algo relacionado a tu búsqueda.",
        ephemeral: true
      });
      
      embed.setDescription(res.map((result) => `**[${result.title}](${result.link})**\n${result.snippet}`).join("\n\n"));
      embed.setAuthor({
        name: "Google",
        iconURL: "http://assets.stickpng.com/images/5847f9cbcef1014c0b5e48c8.png"
      });
      embed.setTimestamp();
      
      await interaction.followUp({
        embeds: [embed]
      })
      
    } else if (command === "images") {

      
      let inf = await GOOGLE_IMG_SCRAP({
        search: busqueda,
        safeSearch: !interaction.channel.nsfw,
        limit: 100,
        execute: function(element){
            if(!element.url.match('gstatic.com')) return element;
        }
      });
      
      if(!inf.result.length || busqueda.length > 100) {
        return await interaction.editReply({
          content: "No encontré ninguna imagen relacionada a tu búsqueda.",
          ephemeral: true
        });
      }
      let max = inf.result.length - 1,
          i = 0,
          filter = (i) => i.user.id === interaction.user.id;
      
      embed.setImage(inf.result[i].url || null)
      embed.addField(`Información`, `
      Búsqueda: **${busqueda}**
      Resultado actual: **${i + 1}**`)
      embed.setTimestamp()
            embed.setFooter({
              text: `Resultados ${inf.result.length}`
            })
      embed.setAuthor({
        name: "Google",
        iconURL: "http://assets.stickpng.com/images/5847f9cbcef1014c0b5e48c8.png"
      });
      
      const btn0 = new MessageButton()
      .setCustomId("BACK")
      .setStyle("PRIMARY")
      .setEmoji("945809313937645598"),
       btn = new MessageButton()
      .setCustomId("NOTHING")
      .setStyle("SECONDARY")
      .setDisabled("true")
      .setLabel("\u200b"),
      btn2 = new MessageButton()
      .setCustomId("STOP")
      .setStyle("PRIMARY")
      .setEmoji("945809315225296906"),
      btn3 = new MessageButton()
      .setCustomId("NOTHING2")
      .setDisabled(true)
      .setStyle("SECONDARY")
      .setLabel("\u200b"),
      btn4 = new MessageButton()
      .setCustomId("NEXT")
      .setStyle("PRIMARY")
      .setEmoji("945809314667458580");
      
      const msg = await interaction.followUp({
        embeds: [embed],
        components: [new MessageActionRow().addComponents(btn0, btn, btn2, btn3, btn4)]
      })
      
      const collector = msg.createMessageComponentCollector({filter, idle: 30000});
      
      collector.on("collect", async(int) => {
        if(int.isButton()) {
          await int.deferUpdate()
          
          if(int.customId === "BACK") {
            if(i == 0) return;
            i--
            embed.fields[0] = {
              name: `Información`, 
              value: `
      Búsqueda: **${busqueda}**
Resultado actual: **${i + 1}**`
            }
            embed.setImage(inf.result[i].url || null)
            embed.setFooter({
              text: `Resultados ${inf.result.length}`
            })
            await int.editReply({
              embeds: [embed]
            })
          }
          
          if(int.customId === "STOP") {
            await int.editReply({
              embeds: [embed],
              components: []
            })
            
            collector.stop("stopped")
          }
          
          if(int.customId === "NEXT") {
            if(i === max) return;
            i++
            embed.setImage(inf.result[i].url || null)
            embed.setFooter({
              text: `Resultados ${inf.result.length}`
            })
            embed.fields[0] = {
              name: `Información`, 
              value: `
      Búsqueda: **${busqueda}**
Resultado actual: **${i + 1}**`
            }
            await int.editReply({
              embeds: [embed]
            })
          }
          
          
        }
      });
      
      collector.on("end", async(d, r) => {
        if(r !== "stopped") {
          await interaction.editReply({
            embeds: [embed],
            components: []
          })
        }
      });
      
    }
      
      
  },
  category: "searchs"
}