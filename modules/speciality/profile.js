// Importing discord.js for handling embeds
const Discord = require('discord.js')
const config = require('../../data/config.json');
let prefix = config.PREFIX

// Set up database based on lowdb.
const lowdb = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('../../database.json')
const db = lowdb(adapter)
db.defaults({ roles: {}, members: {}, count: 0 })
        .write()

// Check if url is valid and leads to image.
const img = require('is-image-url')

function createServerBadges(r) {
    let serverBadgeEmoji = ['star','wrench','crown','pushpin']
    let badgesToAdd = []
    let counter = 0
    serverBadgeNames.forEach(Element => {
        if (r.includes(Element)) {
            badgesToAdd.push(`:${serverBadgeEmoji[counter]}:`)
        }
        counter += 1
    })
    return badgesToAdd
}

function createPrideBadges(r) {
    let prideBadgeEmoji = ['enby','pan','nd','les1','les2','bi','ace','gq','aro']
    let prideBadgeEmoID = ['798917920674676756','798918319238545418','798918686676353034','798920011145281556','798920322828861460','798919094194798622','798919222843146270','798919345836785664','798919620840652870']
    let badgesToAdd = []
    let counter = 0
    prideBadgeEmoji.forEach(Element => {
            if (r.includes(Element)) {
                badgesToAdd.push(`<:${prideBadgeEmoji[counter]}:${prideBadgeEmoID[counter]}>`)
            }
            counter += 1
        })
    return badgesToAdd
}

function createEmbed(r) {
    let embed = new Discord.MessageEmbed()
        .setTitle(r.username)
        .setColor(r.colour)
        .setDescription(`**Name**: ${r.name}\n**Pronouns**: ${r.pronouns}\n**Birthday**: ${r.bday}\n**Switch FC**: ${r.switch}`)
        .setThumbnail()
        .setAuthor("Calculated Anarchy Profile",'https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png')
    /*
            .addField('Server Badges',createServerBadges(r.badges.server),true)
        .addField('Pride Badges',createPrideBadges(r.badges.pride),true)
        */
    if (r.bio !== null) embed.addField(r.bio.title,r.bio.desc,false)
    if (r.tz !== null) embed.addField('Time',`**Time zone**: ${r.tz}\n**Current time**: `,false)
    if (r.bio.image !== null) embed.setImage(r.bio.image)
    return embed
}

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

module.exports = {
    commands: 'profile',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, args) => {

        message.reply('this command is still being developed. Check back soon!')

        /* To enable this command, delete this line.

        let search = db.find('members',{memberid: message.author.id})
        if (args == "") {
            if (search.length() == 1) {
                let embed = createEmbed(search.value())
                message.channel.send(embed)
            } else  message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
        } else if (args == "register") {
            if (search.length() != 1) {
                let pronoun = []
                if ("754901377406337085" in member.roles) pronoun.push("he/him")
                if ("754901568624525372" in member.roles) pronoun.push("she/her")
                if ("754901688669700106" in member.roles) pronoun.push("they/them")
                if ("754901986205237358" in member.roles) pronoun.push("other")
                try {
                    if (pronoun.length() > 1) {
                        let pronouns = ""
                        pronoun.forEach(Element => {
                            pronouns = `${Element}, ${pronouns}`
                        })
                    }
                } catch {
                    message.reply('looks like you need to assign yourself a pronoun! You can do that in #roles.')
                    return
                }
                db.push('members', {
                    memberid: message.author.id,
                    username: `${message.author.name}#${message.author.discriminator}`,
                    name: "Anonymous",
                    bday: "--",
                    switch: "--",
                    pronouns: pronouns,
                    bio: null,
                    sbadges: createServerBadges(),
                    pbadges: null,
                    colour: 0,
                    tz: null
                })
                    .write()
                db.update('count', n => n + 1)
                    .write()
                let embed = createEmbed(search)
                message.channel.send('> ✅ > Your profile was created.',embed)
                    .send(`Check \`${prefix}help profile\` for help on setting up your profile.`)
            } else message.reply('looks like you\'ve already registered!') 
        } else if (args == "edit") {
            if (search.length() == 1) {
                if (args[1] == "name") {
                    let name = ""
                    for (const i in (args.length()-2)) name = name + args[1+i]
                    search.update({name: name})
                        .write()
                } else if (args[1] == "bday") {
                    try {
                        var test = args[1] + args[2]
                        if (!test.test(/^((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)$/)) throw new Error()
                    } catch {
                        message.channel.send('Check your birthdate, ensure it\'s in the format `12 Aug(ust)`.')
                        return
                    }
                    search.update({bday: `${test}`})
                            .write()
                } else if (args[1] == "bio") {
                    let text = ""
                    for (const i in (args.length()-2)) {
                        if (args[i+1] == "|") {
                            var title = text
                            text = ""
                        } else text = text + args[i+1] + " "
                    }
                    search.update({bio: {title: title, desc: text}})
                        .write()
                } else if (args[1] == ("colour" || "color")) {
                    if (args[2].test(/^(?:[0-9a-fA-F]{3}){1,2}$/)) {
                        search.update({colour: parseInt(args[2], 16)})
                            .write()
                    }
                } else if (args[1] == "image") {
                    const promise = new Promise((resolve, reject) => {
                        exec(`ping ${args[2]} -t 1`, (error, stdout, stderr) => {
                            if (error) {
                                reject(`Exec error: ${error.message}`)
                                message.channel.send(`Exec error: ${error.message}`)
                                return
                            }
                            if (stderr) {
                                reject(`Stderr error: ${stderr}`)
                                message.channel.send(`Stderr error: ${stderr}`)
                                return
                            }
                            console.log(`Stdout output: ${stdout}`)
                            resolve(stdout)
                        });
                    })
                    promise.then(res => {
                        if (img(args[2])) {
                            search.update({bio: {image: args[2]}})
                                .write()
                        } else message.reply('you might want to check that URL again.')
                    })
                } else if (args[1] == "badges") {
                    search.update({pbadges: createPrideBadges(args)})
                        .write()
                } else {
                    message.reply('you can\'t edit this!')
                }
            } else  message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
        } else if (args[0] == "search") {
            if (args[1] == "name") {
                let name = ""
                for (const i in (args.length()-2)) name = name + args[1+i]
                search = db.find('members',{name:name})
            } else if (args[1] == "username") search = db.find('members',{username:args[2]})
            else if (args[1] == "memberid") search = db.find('members',{memberid:args[2]})
            else continue
            if (!search.value()) createEmbed(search)
        } 

        To enable this command, delete this line. */

    } 
}