const { decode } = require("imagescript"),
      { MessageAttachment } = require("discord.js"),
      fetch = require("node-fetch");

module.exports = {
  name: "whatsapp",
  description: "Whatsapeas a una persona.",
  options: [
    {
      name: "usuario",
      description: "Usuario a whatsapear.",
      type: 6,
      required: true
    }
  ],
  async execute(client, interaction, embed) {
    await interaction.deferReply()
    let user = interaction.options.getUser("usuario");
    
    let a = await fetch(user.displayAvatarURL({ format: "png" })).then((c) => c.arrayBuffer()).then(decode).then(x => x.resize(512, 512))
    let a2 = await fetch("https://es.logodownload.org/wp-content/uploads/2018/10/whatsapp-logo-11.png").then((d) => d.arrayBuffer()).then(decode).then(c => c.resize(128, 128));
    
    a.green(2.5)
    a.composite(a2, 15, a.height / 1.4)
    
    let s = await a.encode();
    
    await interaction.followUp({
      files: [{name: "wsp.png", attachment: Buffer.from(s)}]
    })
  },
  category: "funs"
}