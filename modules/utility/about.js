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
    callback: (message) => {
        let member = message.guild.member(client.user.id)

        let ut_sec = os.uptime();
        let ut_min = ut_sec/60;
        let ut_hour = ut_min/60;
           
        ut_sec = Math.floor(ut_sec);
        ut_min = Math.floor(ut_min);
        ut_hour = Math.floor(ut_hour);
          
        ut_hour = ut_hour%60;
        ut_min = ut_min%60;
        ut_sec = ut_sec%60;

        let embed = new Discord.MessageEmbed()
            .setAuthor('About CAutomator')
            .setTitle(`CAutomator v${botinfo.version}`)
            .setColor(member.displayColor)
            .setURL(`https://github.com/Hyperfresh/CAutomator/releases/tag/v${botinfo.version}`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`)
            .setDescription('<:cautomator:798916996401594368> **CAutomator** is a custom-built Discord bot, built in <:nodejs:817518471226720256> node.js for the <:CalculatedAnarchy:584304539717599234> Calculated Anarchy server.\n[Learn more about me here!](http://github.com/hyperfresh/CAutomator)')
            .addField('Operating System',`> ${os.platform()} ${os.release()} ${os.arch()} (${os.version()}\n**CPU**: ${os.cpus()[0].model}\n**Memory**: ${(os.freemem()/1e+9).toFixed(2)}GB/${(os.totalmem()/1e+9).toFixed(2)}GB (${((os.freemem()/os.totalmem())*100).toFixed(2)}% free\n**Uptime**: ${ut_hour}h${ut_min}m${ut_sec}s)`,true)
            .addField('Node Installation',`> ${process.version}\n**Memory heap**: ${((process.memoryUsage().heapUsed)/1e+6).toFixed(2)}MB/${((process.memoryUsage().heapTotal)/1e+6).toFixed(2)}MB (${((process.memoryUsage().heapUsed/process.memoryUsage().heapTotal)*100).toFixed(2)}% free)`,true)
            .addField('Dependencies',`**discord.js**: ${Discord.version}\n**lowdb**: ${botinfo.dependencies.lowdb}\n**luxon**: ${luxonver}\n**moment-timezone**: ${timez.version}\n**weather-js**: ${botinfo.dependencies['weather-js']}\n**speedtest-net**: ${botinfo.dependencies['speedtest-net']}`,false)
            .setFooter('Created by Hyperfresh#8080','https://media.discordapp.net/attachments/634575479042474003/663591393754742794/emote.gif')
        message.channel.send(embed)
    },
}