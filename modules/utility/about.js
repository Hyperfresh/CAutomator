// Importing discord.js for handling embeds
const Discord = require('discord.js')
const client = require('../../index').client

// Get info on bot details
const botinfo = require('../../package.json')
const process = require('process')
const os = require('os')

const {DateTime} = require('luxon')
const luxonver = require('luxon').VERSION
const timez = require('moment-timezone')

module.exports = {
    commands: 'about',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, text) => {
        let member = message.guild.member(client.user.id)

        let embed = new Discord.MessageEmbed()
            .setAuthor('About CAutomator')
            .setTitle(`CAutomator v${botinfo.version}`)
            .setColor(member.displayColor)
            .setURL(`https://github.com/Hyperfresh/CAutomator/releases/tag/v${botinfo.version}`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`)
            .setDescription('<:cautomator:798916996401594368> **CAutomator** is a custom-built Discord bot, built in <:nodejs:817518471226720256> node.js for the <:CalculatedAnarchy:584304539717599234> Calculated Anarchy server.\n[Learn more about me here!](http://github.com/hyperfresh/CAutomator)')
            .addField('OS & Node Installation',`**OS**: ${os.version()}\n**Node**: ${process.version}`,true)
            .addField('Main dependencies',`**discord.js**: ${Discord.version}\n**lowdb**: ${botinfo.dependencies.lowdb}\n**shell.js**: ${botinfo.dependencies.shelljs}\n**luxon**: ${luxonver}\n**moment-timezone**: ${timez.version}`,true)
            .addField('Server time',DateTime.now().toLocaleString(DateTime.DATETIME_HUGE))
            .setFooter('Created by Hyperfresh#8080','https://media.discordapp.net/attachments/634575479042474003/663591393754742794/emote.gif')
        message.channel.send(embed)
    },
}