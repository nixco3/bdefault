const { Image, decode, GIF, Frame } = require("imagescript");

const { findImage } = require("../../utils/findImage.js"),
  fetch = require("node-fetch");

const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "fun",
  description: 'Comandos "divertidos".',
  options: [
    {
      type: 1,
      name: "fdp",
      description:
        'Pone la foto de perfil de alguien en el meme "foto do perfil / vida real".',
      options: [
        {
          type: 6,
          name: "usuario",
          description: "Usuario a trolear. *rie*",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "tkm",
      description: 'Agrega el tag de alguien al meme de "te quiero mucho".',
      options: [
        {
          name: "usuario",
          description: "El usuario que quieres mucho.",
          type: 6,
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "spin",
      description: "Hace girar una imagen.",
      options: [
        {
          name: "usuario",
          description: "(Opcional) hacer girar la imagen de un usuario.",
          type: 6,
        },
      ],
    },
  ],
  async execute(client, interaction, embed) {
    await interaction.deferReply();

    const command = interaction.options.getSubcommand("fun"),
      usuario = interaction.options.getUser("usuario");

    if (command === "fdp") {
      const ppc = await fetch(
        "https://cdn.discordapp.com/attachments/842117298645893160/865229132857081896/158_sin_titulo_20210714221155.png"
      )
        .then((x) => x.arrayBuffer())
        .then(decode);

      const ava = await fetch(usuario.displayAvatarURL({ format: "png" }))
        .then((c) => c.arrayBuffer())
        .then(decode)
        .then((f) => f.resize(648, 573));

      ppc.composite(ava, 0, 0);

      const imagen = new MessageAttachment(
        Buffer.from(await ppc.encode()),
        "fotodoperfil.png"
      );
      return await interaction.followUp({
        files: [imagen],
      });
    } else if (command === "tkm") {
      try {
        let font = await fetch(
          "https://cdn.discordapp.com/attachments/856247511311581195/891325732729544714/Impact.ttf"
        )
          .then((r) => r.arrayBuffer())
          .then((b) => new Uint8Array(b));
        let img = await fetch(
          "https://media.discordapp.net/attachments/856247511311581195/943494488091918376/91_sin_titulo_20220216100957.png"
        )
          .then((x) => x.arrayBuffer())
          .then(decode);

        let name = "";

        if (usuario.username.length > 12) {
          name = usuario.username.match(/.{1,12}/g).join("\n");
        } else {
          name = usuario.username;
        }

        let avv = await fetch(usuario.displayAvatarURL({ format: "png" }))
          .then((x) => x.arrayBuffer())
          .then(decode)
          .then((c) => c.resize(256, 256));
        let avv2 = await fetch(usuario.displayAvatarURL({ format: "png" }))
          .then((x) => x.arrayBuffer())
          .then(decode)
          .then((c) => c.resize(256, 256));

        img.composite(
          await Image.renderText(font, 60, name, 0x000000ff),
          name.length >= 12 ? img.width / name.length : 85,
          80
        );
        img.composite(avv2.fill(0xffffffff).cropCircle(), img.width / 1.7, 100);
        img.composite(avv.cropCircle(), img.width / 1.7, 100);

        const att = new MessageAttachment(
          Buffer.from(await img.encode()),
          "tkm.png"
        );
        await interaction.followUp({
          files: [att],
        });
      } catch (err) {
        await interaction.followUp({
          content: "Ha ocurrido un error generando esta imagen.",
        });
        console.log(err);
      }
    } else if (command === "spin") {
     (async() => {
       let imageurl = await findImage(interaction);
        let a = await fetch(imageurl).then((x) => x.arrayBuffer()).then(decode);
      let f = [];

      for (let i = 0; i < 360 / 20; i++) {
        f.push(
          Frame.from(
            a
              .cropCircle()
              .clone()
              .rotate(i * 20 + 1, false),
            1,
            1,
            1,
            Frame.DISPOSAL_BACKGROUND
          )
        );
      }

      f.pop();

      return await interaction.followUp({
        files: [new MessageAttachment(
        Buffer.from(await new GIF(f).encode()),
        "a.gif"
      )],
      });
     })();
    }
  },
  category: "funs",
};

/*   const canvas = createCanvas(512, 512),
          ctx = canvas.getContext("2d");

      const ppc = await loadImage('https://cdn.discordapp.com/attachments/842117298645893160/865229132857081896/158_sin_titulo_20210714221155.png');
      ctx.drawImage(ppc, 0, 0, canvas.width, canvas.height)

      const avatar = await loadImage(usuario.displayAvatarURL({ format: "png"}))
      ctx.drawImage(avatar, 0, 0, 304, 260)
 */
