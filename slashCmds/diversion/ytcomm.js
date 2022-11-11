const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js");

module.exports = {
  name: "yt-comment",
  description: "Haces un comentario fake de YouTube.",
  options: [
    {
      name: "usuario",
      type: 6,
      required: true,
      description: "El usuario que va a comentar.",
    },
    {
      name: "comentario",
      description: "Lo que va a comentar.",
      type: 3,
      required: true,
    },
  ],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const user = interaction.options.getUser("usuario"),
          text = interaction.options.getString("comentario");
    
    fetch(`https://some-random-api.ml/canvas/youtube-comment?avatar=${user.displayAvatarURL({format: "png"})}&comment=${encodeURIComponent(text)}&username=${encodeURIComponent(user.username)}`)
    .then((c) => c.buffer())
    .then(async (data) => {
        
      const att = new MessageAttachment(data, "comentario.png");
      
      await interaction.followUp({
        files: [att]
      })
      
    }).catch(async (err) => {
      await interaction.followUp({
        content: "Ocurrió un error generando esta imagen."
      })
      console.log(err.message)
    })
  },
  category: "funs"
};
