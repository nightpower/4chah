const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const config = require("./data.json")
bot.prefix = config.prefix;

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

module.exports.bot = bot;
bot.commands = new Discord.Collection();
for (file of fs.readdirSync('./cmds/').filter(i => i.endsWith('.js'))) {
    let props = require('./cmds/' + file)
    console.log('[START] ' + file.split('.')[0])
    bot.commands.set(props.help.name, props)
}

bot.login(config.token)