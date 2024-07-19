const events = require("../lib/event");
const { pnix, isPrivate, tiny, serif_B, clockString } = require("../lib");
const { OWNER_NAME, BOT_NAME } = require("../config");
const { hostname } = require("os");
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
let botStartTime = new Date();

pnix(
  {
    pattern: "menu",
    fromMe: isPrivate,
    type: "main",
    desc: "Show All commands",
  },
  async (message, match, m) => {
  message.client.sendMessage(message.jid, { react: { text: "☘️", key: m.key } });
    if (match) {
      for (let i of events.commands) {
        if (i.pattern.test(message.prefix + match))
          message.reply(
            `\`\`\`Command : ${message.prefix}${match.trim()}
Description : ${i.desc}\`\`\``
          );
      }
    } else {
      let { prefix } = message;
      let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        .split(",");
      let currentTime = new Date();
      let runtime = clockString(currentTime - botStartTime);

      let menu = `╭───❮ *${BOT_NAME}* ❯
│ *ᴏᴡɴᴇʀ* :  ${OWNER_NAME}
│ *ᴘʀᴇғɪx* : ${prefix}
│ *ᴘʟᴀᴛғᴏʀᴍ* : ${hostname().split("-")[0]}
│ *ᴘʟᴜɢɪɴs* : ${events.commands.length} 
│ *ʀᴜɴᴛɪᴍᴇ* : ${runtime} 
╰─────────────⦁\n`;
      let cmnd = [];
      let cmd;
      let category = [];
      events.commands.map((command, num) => {
        if (command.pattern) {
          cmd = command.pattern
            .toString()
            .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
        }

        if (!command.dontAddCommandList && cmd !== undefined) {
          let type;
          if (!command.type) {
            type = "misc";
          } else {
            type = command.type.toLowerCase();
          }

          cmnd.push({ cmd, type: type });

          if (!category.includes(type)) category.push(type);
        }
      });
      cmnd.sort();
      category.sort().forEach((cmmd) => {
        menu += `╭───❮ *${cmmd}* ❯`;
        let comad = cmnd.filter(({ type }) => type == cmmd);
        comad.forEach(({ cmd }, num) => {
          menu += `\n│  ${cmd.trim()}`;
        });
        menu += `\n╰─────────────⦁\n`;
      });

      menu += ``;
      return await message.client.sendMessage(message.jid, {
        image: { url: `https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg` },
        caption: tiny(menu),
        footer: tiny(
          `Phoenix-MD\nVersion : ${require("../package.json").version}`
        ),
      });
    }
  }
);
