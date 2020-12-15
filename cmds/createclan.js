const { MessageEmbed } = require("discord.js");
const dataclan = require("../dataclan.json")
const fs = require("fs");

module.exports = {
    help: {
        name: "create-clan",
        dscr: "Создать клан",
        use: `!create-clan <цвет роли> <название>`
    },
    async run(bot, message, args) {
        let embed = new MessageEmbed().setColor(0x30f056);
        let name = args.splice(1).join(" "),
            color = args[0];
        if (!name) return message.channel.send(
            embed.setAuthor("Ошибка")
                .setDescription("Название клана отсутствует")
                .setColor(0xf04941))

        let search = dataclan.data.find(x => x.members.find(x => x.member == message.author.id))
        if (!search || !search.members.find(x => x.member == message.author.id)) {
            message.guild.roles.create({
                data: {
                    name: `${name}`,
                    color: color
                }
            }).then(async (role) => {
                message.guild.channels.create(name, {
                    type: "voice"
                }).then(chat => {
                    chat.createOverwrite(message.guild.roles.cache.find(x => x.name == '@everyone'), {
                        VIEW_CHANNEL: false, CONNECT: false, SPEAK: false,
                    });
                    chat.createOverwrite(message.guild.roles.cache.find(x => x.id == role.id), {
                        VIEW_CHANNEL: true, CONNECT: true, SPEAK: true,
                    });
                    chat.setParent(bot.clancategory)
                })
                dataclan.data.push({
                    guild: message.guild.id,
                    name: `${name}`,
                    createAt: Date.now(),
                    roleID: role.id,
                    avatar: "",
                    dscr: "",
                    public: false,
                    invited: [],
                    maxmembers: 20,
                    members: [{ member: message.author.id, owner: true }]
                })
                fs.writeFile("./dataclan.json", JSON.stringify(dataclan), (err) => {
                    if (err) console.log(err);
                });
                message.guild.roles.create({
                    data: {
                        name: `Owner - ${name}`,
                        color: color
                    }
                }).then(role => {
                    message.guild.member(message.author).roles.add(role)
                })
                message.guild.member(message.author).roles.add(role)
                message.channel.send(
                    embed.setAuthor("Клан был успешно создан! Наслаждайтесь общением",
                        message.author.displayAvatarURL({ dynamic: true }))
                        // .setThumbnail(dataclan[message.author.id].clanavatar)
                        .setDescription(
                            `Название клана: ${name
                            }\nКлановая роль: <@&${this.roleID}>`
                        )
                )
            })
        }
        else return message.channel.send(
            embed
                .setColor(0xf04941)
                .setAuthor(
                    "Ошибка",
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setDescription("Вы не можете создать более одного клана")
        );
    }
}
