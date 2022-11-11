const Discord = require("discord.js"); // hola
const express = require("express");
const client = new Discord.Client({
    ws: {
      properties: {
        $browser: "Discord Android",
      },
    },
    makeCache: Discord.Options.cacheWithLimits({
      ApplicationCommandManager: 0,
      BaseGuildEmojiManager: 0,
      ChannelManager: Infinity,
      GuildChannelManager: Infinity,
      GuildBanManager: 0,
      GuildInviteManager: 0,
      GuildManager: Infinity,
      GuildMemberManager: Infinity,
      GuildStickerManager: 0,
      GuildScheduledEventManager: 0,
      MessageManager: 30,
      PermissionOverwriteManager: Infinity,
      PresenceManager: Infinity,
      ReactionManager: 0,
      ReactionUserManager: 0,
      RoleManager: Infinity,
      StageInstanceManager: 0,
      ThreadManager: 0,
      ThreadMemberManager: 0,
      UserManager: Infinity,
      VoiceStateManager: 0,
    }),
    intents: 1899,
    
    allowedMentions: {
      repliedUser: false,
    }
  }),
  fs = require("fs");

express()
  .get("/", (request, response) =>
    response.status(200).redirect("https://google.com")
  )
  .listen(process.env.PORT);

client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();

["event-handler", "command-handler", "slashCmds-handler"].forEach(
  (handler) => {
    require(`./handlers/${handler}`)(client, fs);
  }
);

client.des = (str) => {
  if(!str) throw new ReferenceError("Introduce un texto.");
  
  let txt = str.split(" ");
  let newStr = [];
  
  for(let i = 0; i < str.split(" ").length; i++) {
    let n = Math.floor(Math.random() * txt.length);
    let ind = txt.indexOf(txt[n])
    
    newStr.push(txt[n])
    txt.splice(ind, 1)
  }
  
  return newStr.join(" ")
};


// LOGIN
client.login(process.env.TOKEN);
