const Imagescript = require('imagescript');
const fetch = require("node-fetch")

module.exports = {
  name: "banner",
  description: "retorna el banner de un usuario",
  options: [{
    name: "usuario",
    description: "usuario al que le vas a robar el banner",
    type: "USER"
  }],

  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const usuario = interaction.options.getUser("usuario") || interaction.user;

    fetch(`https://discord.com/api/v9/users/${usuario.id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bot ${client.token}`,
        "Content-Type": `application/json`
      }
    }).then((res) => res.json()).then(async (info) => {
      if (!info.banner && info.banner_color) {
        embed.setImage(`https://singlecolorimage.com/get/${info.banner_color.startsWith("#") ? info.banner_color.slice(1) : info.banner_color}/600x240`)
        embed.setColor(info.banner_color)
        embed.setAuthor({
          name: usuario.tag,
          iconURL: usuario.displayAvatarURL({
            dynamic: true
          })
        })

        await interaction.followUp({
          embeds: [
            embed
          ]
        })

          return;
      } else if (!info.banner && !info.banner_color ) {
        await interaction.followUp({
          content: 'Este usuario no tiene un banner. :('
        })

          return;
      }

      if (info.banner) {
        let a = await fetch(`https://cdn.discordapp.com/banners/${usuario.id}/${info.banner}.png?size=512`).then(e => e.arrayBuffer()).then(Imagescript.decode),
          extension = info.banner.startsWith('a_') ? '.gif' : '.png';


        embed.setAuthor({
          name: usuario.tag,
          iconURL: usuario.displayAvatarURL({
            dynamic: true
          })
        })
        embed.setImage(`https://cdn.discordapp.com/banners/${usuario.id}/${info.banner}${extension}?size=512`)
        embed.setColor(a.averageColor().toString(16).slice(0, 6) || embed.color)
        embed.setDescription(`[Banner](https://cdn.discordapp.com/banners/${usuario.id}/${info.banner}${extension}?size=512)`)
        
        await interaction.followUp({
          embeds: [embed]
        })
      }
    })
  },
  category: "infos"

}