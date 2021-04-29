// Importing discord.js for handling embeds
const Discord = require('discord.js')

// Time stuff
const {DateTime} = require('luxon')
const timezone = require('moment-timezone');
const { db } = require('../..');
const {client} = require('../..')

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

function dbSearch(search) /* Search for a user via memberid. */ {
    return db.get('profiles')
        .find({memberid: search})
        .value()
}

module.exports = { // Command
    commands: 'time',
    minArgs: 0,
    maxArgs: 1,
    callback: (message, args) => {
        let user;
        let search;
        if (!args[0]) {
            search = dbSearch(message.author.id)
            if (search.tz) {
                args = search.tz
                user = `${search.username}'s`
            } else {
                args = 'Australia/Adelaide'
                user = 'Default'
            }
        } else if (!timezone.tz.zone(args[0])) {
            let member = getUserFromMention(args[0])
            try {
                let result = dbSearch(member.id)
                if (!result) throw new Error()
                args = result.tz
                user = `${result.username}'s`
            } catch {
                let helpembed = new Discord.MessageEmbed()
                .setTitle('Click here to see all valid time zones.')
                .setDescription('Time zone names are case sensitive.')
                .setURL('https://en.wikipedia.org/wiki/List_of_tz_database_time_zones')
                message.reply('I don\'t recognise this time zone.',helpembed)
                return
            }
        } 
        let embed = new Discord.MessageEmbed()
            .setAuthor('The time is')
            .setTitle(DateTime.now().setZone(args).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY))
            .setDescription(`in **${args}**`)
            .setFooter(`${user} time`)
        message.channel.send(embed)
    },
}