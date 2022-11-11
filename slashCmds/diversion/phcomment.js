const fetch = require('node-fetch');
const { decode } = require("imagescript");

const {
  MessageAttachment
} = require('discord.js');

module.exports = {
  name: "ph-comment",
  description: "haces que alguien comente en ph",
  options: [{
    name: "usuario",
    description: "la persona que va a comentar, puedes mencionarla o ingresar su id.",
    type: "USER",
    required: true
  }, {
    name: "comentario",
    description: "lo que va a comentar",
    type: "STRING",
    required: true
  }],
  async execute(client, interaction, embed) {
    await interaction.deferReply()
    const usuario = interaction.options.getUser("usuario");
    const comentario = interaction.options.getString("comentario")

    fetch(`https://nekobot.xyz/api/imagegen?type=phcomment&image=${usuario.displayAvatarURL({format: 'png'})}&username=${encodeURIComponent(usuario.username)}&text=${encodeURIComponent(comentario)}`).then(c => c.json()).then(async (pp) => {
        const image = await fetch(pp.message).then(x => x.arrayBuffer()).then(decode);

        let p = await image.crop(0, 0, image.width, image.height - 120).encode();

        
      const att = new MessageAttachment(Buffer.from(p), 'comment.png');

      await interaction.followUp({
        files: [att]
      })
    }).catch(async (err) => {
        console.log(err)
      await interaction.followUp({
        content: "Ocurrió un error."
      })
    })
  },
  category: "funs"
}