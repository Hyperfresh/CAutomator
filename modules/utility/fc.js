const { db } = require('../..');
const {client} = require('../..')
const prefix = require('../../data/config.json').PREFIX

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
    commands: 'fc',
    minArgs: 0,
    maxArgs: 1,
    callback: (message, args) => {
        let res;
        let user;
        let search;
        if (!args[0]) {
            search = dbSearch(message.author.id)
            if (search.switch) {
                res = search.switch
                user = `${search.username}`
            } else {
                message.reply(`it seems you have not registered a Switch Friend Code.\nYou can do so with \`${prefix}profile register\`, followed by \`${prefix}profile edit fc <friend code>\`.`)
                return
            }
        } else {
            if (!/(<@[!]\d{18}>)/.test(args[0])) {
                message.reply('This doesn\'t seem to be a valid mention.')
                return
            }
            let member = getUserFromMention(args[0])
            let result = dbSearch(member.id)
            if (!result) {
                message.reply('This user doesn\'t seem to be on the database.')
                return
            }
            res = result.switch
            user = `${result.username}`
        } 
        message.channel.send(`> **${user}'s Friend Code**\n${res}`)
    }
}