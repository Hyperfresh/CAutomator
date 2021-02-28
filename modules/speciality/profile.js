// Importing discord.js for handling embeds
const Discord = require('discord.js')
const config = require('../../data/config.json');
const client = require('../../index').client
let prefix = config.PREFIX

// Set up database based on lowdb.
const lowdb = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${config.DIR}/data/database.json`)
const db = lowdb(adapter)
db.defaults({ roles: [], members: [], count: 0 })
        .write()

// Check if url is valid and leads to image.
const img = require('is-image-url')

// Required for uploading
const {exec} = require('child_process');

function createServerBadges(id,roles) {
    let serverBadgeEmoji = ['star','wrench','crown','pushpin']
    let badgesToAdd = []
    let r = []

    if (config.MAINTAINERID == id) r.push('wrench')
    if (config.OWNERID == id) r.push("crown")
    if (roles.includes(config.PINNER)) r.push("pushpin")
    if (roles.includes(config.ADMIN)) r.push("star")

    let counter = 0
    serverBadgeEmoji.forEach(Element => {
        if (r.includes(Element)) {
            badgesToAdd.push(`:${serverBadgeEmoji[counter]}:`)
        }
        counter += 1
    })
    if (badgesToAdd.length == 0) badgesToAdd = "No server badges"
    return badgesToAdd
}

function createPrideBadges(r) {
    let badgesToAdd = []
    let fullList = [
        "<:enby:798917920674676756>","<:pan:798918319238545418>","<:nd:798918686676353034>",
        "<:les1:798920011145281556>","<:les2:798920322828861460>","<:bi:798919094194798622>",
        "<:ace:798919222843146270>","<:gq:798919345836785664>","<:aro:798919620840652870>"
    ]
    let found;
    try {
        found = fullList.filter(function (elem) {
            return r.indexOf(elem) > -1;
        }).length == r.length
    } catch {
        badgesToAdd = "No pride badges assigned"
        return badgesToAdd
    }
        if (found) {
            let temp = []
            r.forEach(Element => {
                if (Element == "<:enby:798917920674676756>") temp.push("enby")
                if (Element == "<:pan:798918319238545418>") temp.push("pan")
                if (Element == "<:nd:798918686676353034>") temp.push("nd")
                if (Element == "<:les1:798920011145281556>") temp.push("les1")
                if (Element == "<:les2:798920322828861460>") temp.push("les2")
                if (Element == "<:bi:798919094194798622>") temp.push("bi")
                if (Element == "<:ace:798919222843146270>") temp.push("ace")
                if (Element == "<:gq:798919345836785664>") temp.push("gq")
                if (Element == "<:aro:798919620840652870>") temp.push("aro")
            })
            r = temp
        }
    
    let prideBadgeEmoji = ['enby','pan','nd','les1','les2','bi','ace','gq','aro']
    let prideBadgeEmoID = ['798917920674676756','798918319238545418','798918686676353034','798920011145281556','798920322828861460','798919094194798622','798919222843146270','798919345836785664','798919620840652870']
    let counter = 0
    try {
        prideBadgeEmoji.forEach(Element => {
                if (r.includes(Element)) {
                    badgesToAdd.push(`<:${prideBadgeEmoji[counter]}:${prideBadgeEmoID[counter]}>`)
                }
                counter += 1
            })
    } catch {
        badgesToAdd = "No pride badges assigned"
    }
    return badgesToAdd
}

function createEmbed(search) {
    let r = search
    let embed = new Discord.MessageEmbed()
        .setTitle(r.username)
        .setColor(r.colour)
        .setDescription(`**Name**: ${r.name}\n**Pronouns**: ${r.pronouns}\n**Birthday**: ${r.bday}\n**Switch FC**: ${r.switch}`)
        .setThumbnail(r.avatar)
        .setAuthor("Calculated Anarchy Profile",'https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png')
        .addField('Server Badges',String(createServerBadges(r.memberid,r.data)),true)
        .addField('Pride Badges',String(createPrideBadges(r.pbadges)),true)
        .setFooter(`Member ID: ${r.memberid}`)
    if (r.bio !== null) embed.addField(r.bio.title,r.bio.desc,false)
    if (r.tz !== null) embed.addField('Time',`**Time zone**: ${r.tz}\n**Current time**: `,false)
    try {
        if (r.image !== null) embed.setImage(r.image)
    } catch {
        console.log('No bio image!')
    }
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

function dbSearch(search) {
    let yep = db.get('members')
        .find({memberid: search})
        .value()
    return yep
}

function dbUpdate(search, update) {
    db.get('members')
        .find({memberid: search})
        .assign(update)
        .write()
}

module.exports = {
    commands: 'profile',
    minArgs: 0,
    maxArgs: 500,
    callback: (message, args) => {

        // message.reply('this command is still being developed. Check back soon!')

        let search = dbSearch(message.author.id)
        if (args == "") {
            if (search) {
                let embed = createEmbed(search)
                message.channel.send(embed)
            } else message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
        } else if (args[0] == "register") {
            if (!search) {
                let pronoun = []
                let memberroles = message.member._roles
                if (memberroles.includes("754901377406337085")) pronoun.push("he/him")
                if (memberroles.includes("754901568624525372")) pronoun.push("she/her")
                if (memberroles.includes("754901688669700106")) pronoun.push("they/them")
                if (memberroles.includes("754901986205237358")) pronoun.push("other")
                try {
                    if (pronoun.length > 1) {
                        let pronouns = ""
                        pronoun.forEach(Element => {
                            pronouns = `${Element}, ${pronouns}`
                        })
                        pronoun = pronouns
                    }
                } catch {
                    message.reply('looks like you need to assign yourself a pronoun! You can do that in #roles.')
                    return
                }
                db.get('members')
                    .push({
                    memberid: message.author.id,
                    username: `${message.author.username}#${message.author.discriminator}`,
                    name: "Anonymous",
                    bday: "--",
                    switch: "--",
                    pronouns: pronoun,
                    bio: null,
                    sbadges: createServerBadges(message.author.id,message.member._roles),
                    pbadges: null,
                    colour: message.member.displayColor,
                    tz: null,
                    data: message.member._roles,
                    avatar: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.member.user.avatar}.png`
                })
                    .write()
                db.update('count', n => n + 1)
                    .write()
                search = dbSearch(message.author.id)
                let embed = createEmbed(search)
                message.channel.send('> ✅ > Your profile was created.',embed)
                message.channel.send(`Check \`${prefix}help profile\` for help on setting up your profile.`)
            } else message.reply('looks like you\'ve already registered!') 
        } else if (args[0] == "edit") {
            if (search) {
                if (args[1] == "name") {
                    let name = ""
                    for (let i = 1; i < ((args.length)-1); i++) {
                        name = `${name} ${args[1+i]}`
                    }
                    dbUpdate(message.author.id,{name: name})
                } else if (args[1] == "bday") {
                    try {
                        var test = String(`${args[2]} ${args[3]}`)
                        if (!/^((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)$/.test(test)) throw new Error()
                    } catch {
                        message.channel.send('Check your birthdate, ensure it\'s in the format `12 Aug(ust)`.')
                        return
                    }
                    dbUpdate(message.author.id,{bday: test})
                } else if (args[1] == "bio") {
                    let text = ""
                    for (let i = 1; i < ((args.length)-1); i++) {
                        if (args[i+1] == "|") {
                            var title = text
                            text = ""
                        } else text = `${text} ${args[i+1]}`
                    }
                    dbUpdate(message.author.id,{bio: {title: title, desc: text}})
                } else if (args[1] == ("colour" || "color")) {
                    if (args[2].test(/^(?:[0-9a-fA-F]{3}){1,2}$/)) {
                        dbUpdate(message.author.id,{colour: parseInt(args[2], 16)})
                    }
                } else if (args[1] == "image") {
                    if (img(args[2])) {
                        dbUpdate(message.author.id,{image: args[2]})
                    } else message.reply('you might want to check that URL again.')
                } else if (args[1] == "badges") {
                    dbUpdate(message.author.id,{pbadges: createPrideBadges(args)})
                } else {
                    message.reply('you can\'t edit this! Here\'s what your profile currently looks like.')
                }
                search = dbSearch(message.author.id)
                let embed = createEmbed(search)
                message.channel.send(embed)
            } else  message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
        } else if (args[0] == "search") {
            if (args[1] == "name") {
                let name = ""
                for (const i in (args.length()-2)) name = name + args[1+i]
                search = db.find('members',{name:name})
            } else if (args[1] == "username") search = db.find('members',{username: args[2]})
            else if (args[1] == "memberid") search = db.find('members',{memberid: args[2]})
            if (!search.value()) createEmbed(search)
        } else {
            const user = getUserFromMention(args[1]);
            search = db.find('members',{memberid: user})
            if (!search.value()) createEmbed(search)
        }
    } 
}