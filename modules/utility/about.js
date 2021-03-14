// Importing discord.js for handling embeds
const Discord = require('discord.js')

// Get info on bot details
const botinfo = require('../../package.json')
const process = require('process')
const os = require('os')

module.exports = {
    commands: 'about',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, text) => {
        let embed = new Discord.MessageEmbed()
            .setAuthor('About CAutomator','https://github.com/Hyperfresh/CAutomator/blob/master/resources/icon.png?raw=true')
            .setTitle(`CAutomator v${botinfo.version}`)
            .setDescription('CAutomator is a custom-built bot for this server. [Learn more here!](http://github.com/hyperfresh/CAutomator)')
            .addField('OS & Node Installation',`**OS**: ${os.version()}\n**Node**: ${process.version}`,true)
            .addField('Main dependencies',`**discord.js**: ${Discord.version}\n**lowdb**: ${botinfo.dependencies.lowdb}\n**shell.js**: ${botinfo.dependencies.shelljs}`,true)
            .setFooter('Created by Hyperfresh#8080','https://media.discordapp.net/attachments/634575479042474003/663591393754742794/emote.gif')
        message.channel.send(embed)
    },
}