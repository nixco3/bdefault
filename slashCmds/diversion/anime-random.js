const translate = require('@iamtraction/google-translate');
const r = require('anime-pictures');

module.exports = {
  name: "anime-random",
  description: "obtienes información de un anime aleatorio.",
    async execute(client, interaction, embed) {
      await interaction.deferReply();
      
    const p = await r.random();
    const promises = [
      translate(p.desc, {
        to: 'es'
      }),
      translate(p.gender, {
        to: 'es'
      })
    ];


    Promise.all(promises).then(async (result) => {
      embed.setTitle(`Anime: ${p.origin}`)
      embed.setDescription(`**Personaje:** ${p.name}`)
      embed.addField('Descripción:', result[0].text)
      embed.setThumbnail(p.anime_image)
      embed.setColor('#5865f2')

      if (interaction.channel.nsfw) {
        embed.setImage(p.character_image)
      }

      interaction.followUp({
        embeds: [
          embed
        ]
      });

    })
  },
  category: "funs"
}