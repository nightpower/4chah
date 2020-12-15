const { MessageEmbed } = require("discord.js");
const clandata = require("../dataclan.json");
const fs = require("fs");
module.exports = {
    help: {
        name: "setting",
        dscr: "Настройки клана",
        use: "!setting <avatar,descr,name,usersize,public> []"
    },
    async run(bot, message, args) {
        let embed = new MessageEmbed().setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
        );
        let search = clandata.data.find(x => x.members.find(x => x.member == message.author.id))
        if (search.members.find(x => x.member == message.author.id).owner == false || !search)
            return message.channel.send(
                embed
                    .setAuthor(
                        "Клан не обнаружен или вы не являетесь создателём данного клана !",
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(
                        `Для настройки гилдии нужно её создать !\n> ${client.prefix}create-clan <название клана> <@упоминание роли роли> <URL аватара>`
                    )
            );
        let command = args[0],
            argument = args.splice(1).join(" ");
        switch (command) {
            case "avatar":
                search.avatar = argument;
                message.channel.send(
                    embed.setDescription("Аватарка была успешно изменена !")
                );
                break;
            case "descr":
                if (argument.length < 10) return message.channel.send(embed.setDescription("Слишком короткое описание гильдии"))
                search.dscr = argument;
                break;
            case "name":
                if (argument.length < 2) return message.channel.send(embed.setDescription("Слишком короткое название гильдии"))
                search.name = argument;
                break;
            case "usersize":
                if (!isFinite(argument))
                    return message.channel.send(
                        embed.setDescription(
                            "Введите максимальное число пользователей в вашей гильдии"
                        )
                    );
                search.maxsize = argument;
                break;
            case "public":
                if (argument !== "true" || "false")
                    return message.channel.send(
                        embed.setDescription("Введите значение true или false")
                    );
                search.public = argument;
                break;
            default:
                break;
        }
        fs.writeFile("./dataclan.json", JSON.stringify(clandata), (err) => {
            if (err) console.log(err);
        });
    }
}