const { MessageEmbed } = require("discord.js");
const prompter = require("discordjs-prompter")
const clandata = require("../dataclan.json");
const fs = require("fs");
module.exports = {
    help: {
        name: "invite",
        dscr: "Пригласить пользователя",
        use: "!invite <@user>"
    },
    async run(bot, message, args) {
        function sendX(member, name) {
            let embed = new MessageEmbed()
            prompter.reaction(bot.channels.cache.get(bot.sendinvite), {
                question: embed.setDescription(`Пользователь <@${member.id}> был приглашён в клан ${name} !`), // текст пригл
                userId: member.id
            }).then(response => {
                if (!response) return message.channel.send();
                if (response == 'yes') {
                    let clanData = clandata.data.find(x => x.invited.find(x => x.member == member.id));
                    clanData.invited.pop({ member: member.id })
                    clanData.members.push({ member: member.id, owner: false });
                    member.roles.add(clanData.roleID)
                    fs.writeFile("./dataclan.json", JSON.stringify(clandata), (err) => {
                        if (err) console.log(err);
                    });
                }
                if (response == 'no') {
                    return message.delete();
                }

            })
        }
        let embed = new MessageEmbed()
        const iuser = message.mentions.members.first();
        let search = clandata.data.find(x => x.members.find(x => x.member == message.author.id))
        let searchinv = clandata.data.find(x => x.members.find(x => x.member == iuser.id))
        if (!searchinv) {
            if (clandata.data.find(x => x.invited.find(x => x.member == iuser.id))) return message.channel.send(embed.setDescription("Пользоватьель был преглашон !"))
            search.invited.push({ member: iuser.id, inviter: message.author.id });
            sendX(iuser, search.name);
            iuser.send(embed.setDescription(`Добрий день/вечер/ночь вы были приглашены в клан ${search.name}.\nЧтобы принять приглашение зайдите в чат <#${bot.sendinvite}>`).setThumbnail(search.avatar))
            fs.writeFile("./dataclan.json", JSON.stringify(clandata), (err) => {
                if (err) console.log(err);
            });
        } else return message.channel.send(embed
            .setAuthor(
                "Вы не состоите в клане ! Или пользователь уже состоит в клане !",
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
                `Для приглашение в клан его нужно создать !\n> ${bot.prefix}create-clan <название клана> \<#цветроли\>`
            ))
    }
}