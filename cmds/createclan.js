const { MessageEmbed } = require("discord.js");
const dataclan = require("../data/dataclan.json")
const fs = require("fs");

module.exports = {
    help: {
        name: "createclan",
        dscr: "Создать клан",
        use: `${bot.prefix}createclan <цвет роли> <название>`
    },
    async run(bot, message, args) {
        let name = args.splice(1).join(" "),
            color = args[0];
        if (!dataclan[message.author.id]) {
            message.guild.roles.create({
                data: {
                    name: name,
                    color: color
                }
            }).then(role => {
                dataclan[message.author.id] = {
                    name: name,
                    roleID: role.id,
                    avatar: "",
                    dscr: "",
                    public: false,
                    maxmembers: 20,
                    membersCLAN: [{ member: message.author.id, owner: true }]
                }
            })
        }
        else return message.channel.send()
    }
}