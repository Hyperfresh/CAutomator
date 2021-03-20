// Importing discord.js for handling embeds
const Discord = require('discord.js')

// da weather
const weather = require('weather-js')

// Time stuff
const {DateTime} = require('luxon')

module.exports = { // Command
    commands: 'weather',
    minArgs: 0,
    maxArgs: 500,
    callback: (message, args) => {
        let city;
        if (args.length == 0) city = 'Adelaide, South Australia'
        else city = args.join(', ')

        weather.find({search: city, degreeType: 'C'}, function(err, result) {
            if (!result) {
                message.reply(`I couldn't find any weather details for ${city}.`)
                return
            }

            if (err) {
                message.reply(`something terrible happened. Please report this to the bot author: \`\`\`${err}\`\`\``)
                return
            }
           
            let current = result[0].current
            let location = result[0].location
            let forecast = result[0].forecast

            let embed = new Discord.MessageEmbed()
                .setAuthor(`Weather in ${location.name}`)
                .setTitle(`${current.skytext}, ${current.temperature}°${location.degreetype}`)
                .setThumbnail(current.imageUrl)
                .setDescription("Here's the forecast for the next five days.")
                .setFooter('Source: weather.service.msn.com')
                .setTimestamp(DateTime.now().toMillis())
            for (let i = 0; i <= 4; i++) {
                let precip;
                if (!forecast[i].precip) precip = "0"
                else precip = forecast[i].precip
                embed.addField(forecast[i].day,`> **${forecast[i].skytextday}**\n**High**: ${forecast[i].high}°${location.degreetype}\n**Low**: ${forecast[i].low}°${location.degreetype}\n**Chance of rain**: ${precip}%`,true)
            }
            message.channel.send(embed)
          });
    },
}