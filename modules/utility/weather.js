// Importing discord.js for handling embeds
const Discord = require('discord.js')

// da weather
const weather = require('weather-js')

// Time stuff
const {DateTime} = require('luxon')

// Set up database based on lowdb.
const { db } = require('../../index')
const client = require('../../index').client


function getUserFromMention(mention) /* Make a mention into a snowflake. */ {
	if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		return client.users.cache.get(mention);
	}
}

module.exports = { // Command
    commands: 'weather',
    minArgs: 0,
    maxArgs: 500,
    callback: (message, args) => {
        let city;
        if (args.length == 0) {
            let dbresult = db.get('profiles')
                .find({memberid: message.author.id})
                .value()
            if (dbresult) {
                let res = dbresult.tz
                let temp = res.split('/')
                city = `"${temp[1]}, ${temp[0]}"`
            } else city = 'Adelaide, South Australia'
        } else {
            if (/(<@[!]\d{18}>)/.test(args[0])) {
                let mention = getUserFromMention(args[0])
                let dbresult = db.get('profiles')
                    .find({memberid: mention.id})
                    .value()
                if (dbresult) {
                    let res = dbresult.tz
                    let temp = res.split('/')
                    city = `"${temp[1]}, ${temp[0]}"`
                } else {
                    message.reply("this user has not registered a location for their user.")
                    return
                }
            } else city = args.join(', ')
        }

        console.log(city)
        weather.find({search: city, degreeType: 'C'}, function(err, result) {
            if (!result || result == 0) {
                message.reply(`I couldn't find any weather details for ${city}. Try searching like "Adelaide, Australia".`)
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