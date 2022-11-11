const fetch = require("node-fetch"),
  { MessageAttachment } = require("discord.js"),
  translate = require("@iamtraction/google-translate");

module.exports = {
  name: "wikihow",
  description: "Devuelve pasos aleatorios de Wikihow o una imagen.",
  options: [
    {
      name: "tipo",
      type: 3,
      required: true,
      description: "Lo que quieres que devuelva.",
      choices: [
        {
          name: "Pasos",
          value: "steps",
        },
        {
          name: "Imagen",
          value: "image",
        },
      ],
    },
  ],
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const value = interaction.options.get("tipo").value;
    
    if (value === "image") {
      fetch(`https://hargrimm-wikihow-v1.p.rapidapi.com/images?count=1`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.rapidapi,
          "x-rapidapi-host": process.env.rapihost,
        },
      })
        .then((res) => res.json())
        .then(async (x) => {
          let img = Object.values(x);

          embed.setImage(img.toString());
          embed.setFooter({
            text:
              "Imagen aleatoria de WikiHow #" +
              Math.floor(Math.random() * 7000),
          });
          embed.setTimestamp();
          embed.setAuthor({
            name: "WikiHow",
            iconURL:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpuvAGWuqfR9nMFtqPE6BLSU66EUpsANune3d5IecpK9c-b9D4_Wly5Yz7_h_y_plPAXM&usqp=CAU",
          });

          await interaction.followUp({
            embeds: [embed],
          });
        });
    } else if (value === "steps") {
      const ver = Math.floor(Math.random() * 25 + 2);
      fetch(`https://hargrimm-wikihow-v1.p.rapidapi.com/steps?count=${ver}`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.rapidapi,
          "x-rapidapi-host": process.env.rapihost,
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          const traducidos = await translate(Object.values(data), { to: "es" });

          let c = 1;
          embed.setDescription(
            traducidos.text
              .split(/\.\s?,/gi)
              .map((c, i) => `\`${i++}.\` ${c.trim()}`)
              .join("\n")
          );
          embed.setAuthor({
            name: "WikiHow",
            iconURL:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpuvAGWuqfR9nMFtqPE6BLSU66EUpsANune3d5IecpK9c-b9D4_Wly5Yz7_h_y_plPAXM&usqp=CAU",
          });
          embed.setTimestamp();

          await interaction.followUp({
            embeds: [embed],
          });
        });
    }
  },
  category: "funs"
};
