const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const config = require("./data.json")
bot.prefix = process.env.prefix || config.prefix;
bot.clancategory = process.env.clcat || config.clcat;
bot.sendinvite = process.env.clinvite || config.invitechannel

module.exports.bot = bot;
bot.commands = new Discord.Collection();
for (file of fs.readdirSync('./cmds/').filter(i => i.endsWith('.js'))) {
    let props = require('./cmds/' + file)
    console.log('[START] ' + file.split('.')[0])
    bot.commands.set(props.help.name, props)
}

bot.on("ready", function () {
    console.log("Ready")
    bot.user.setPresence({
        game: {
            name: `${bot.user.tag}`,
            type: "STREAM",
            url: ""
        }
    })
})

bot.on("message", message => {
    if (message.author.bot) return;
    let args = message.content.trim().slice(bot.prefix.length).split(" ");
    let command = args.shift();
    if (message.content.startsWith(bot.prefix)) {
        let cmd = bot.commands.get(command);
        if (cmd) cmd.run(bot, message, args);
    }
});

bot.login(process.env.token || config.token)