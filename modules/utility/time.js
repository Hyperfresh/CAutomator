// Importing discord.js for handling embeds
const Discord = require('discord.js')

// Time stuff
const {DateTime} = require('luxon')
const timezone = require('moment-timezone')

module.exports = { // Command
    commands: 'time',
    minArgs: 0,
    maxArgs: 1,
    callback: (message, args) => {
        if (!args[0]) args = ['Australia/Adelaide']
        if (!timezone.tz.zone(args[0])) {
            let helpembed = new Discord.MessageEmbed()
                .setTitle('Click here to see all valid time zones.')
                .setDescription('Time zone names are case sensitive.')
                .setURL('https://en.wikipedia.org/wiki/List_of_tz_database_time_zones')
            message.reply('I don\'t recognise this time zone.',helpembed)
            return
        }
        let embed = new Discord.MessageEmbed()
            .setAuthor('The time is')
            .setTitle(DateTime.now().setZone(args[0]).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY))
            .setDescription(`in **${args[0]}**`)
        message.channel.send(embed)
    },
}