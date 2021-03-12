// _ _                                        
//  |   _ _   _   _   _ _|_
// _|_ | | | |_| |_| |   |  
//           | 

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

//  ___
// |__      _   _ _|_ *  _   _
// |   |_| | | |_  |  | |_| | | 

function createServerBadges(id,roles) /* Create server badges for embeds & database. */ {
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

function createPrideBadges(r) /* Create pride badges for embeds & database. */ {
    // Declare variable types.
    let badgesToAdd = []
    let fullList = /* This list is the full resolve for each pride badge. */ [
        "<:enby:798917920674676756>","<:pan:798918319238545418>","<:nd:798918686676353034>",
        "<:les1:798920011145281556>","<:les2:798920322828861460>","<:bi:798919094194798622>",
        "<:ace:798919222843146270>","<:gq:798919345836785664>","<:aro:798919620840652870>",
        ":transgender_flag:"
    ]
    let found;
    try { // Is this function being used to construct pride badges for the embed or the database?
        found = fullList.filter(function (elem) {
            return r.indexOf(elem) > -1;
        }).length == r.length
    } catch {
        badgesToAdd = "No pride badges assigned" // If r is null, this is just a "last resort" measure
        return badgesToAdd
    }
        if (found) { // Function being used to construct pride badges for embed.
            // Convert constructed badges from database to badge types
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
                if (Element == ":transgender_flag:") temp.push("trans")
                if (Element == ":rainbow_flag:") temp.push('gay')
            })
            r = temp
        }
    
    let prideBadgeEmoji = ['enby','pan','nd','les1','les2','bi','ace','gq','aro'] // Badge types
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
    if (r.includes("trans")) {
        badgesToAdd.push(':transgender_flag:')
    }
    if (r.includes("gay")) {
        badgesToAdd.push(':rainbow_flag:')
    }
    if (badgesToAdd.length == 0) badgesToAdd = "No pride badges assigned"
    return badgesToAdd
}

function createEmbed(search) /* Create the profile card. */ {
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
    let yep = db.get('members')
        .find({memberid: search})
        .value()
    return yep
}

function dbUpdate(search, update) /* Update details on the database. */ {
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
        let search = dbSearch(message.author.id) // Create search.
        if (args == "") {
            if (search) { // Did something come back?
                let embed = createEmbed(search)
                message.channel.send(embed)
            } else message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)

        } else if (args[0] == "register") { // Register a user on the database.
            if (!search) { // Make sure they're not already on the database
                let pronoun = []
                let memberroles = message.member._roles
                if (memberroles.includes("754901377406337085")) pronoun.push("he/him")
                if (memberroles.includes("754901568624525372")) pronoun.push("she/her")
                if (memberroles.includes("754901688669700106")) pronoun.push("they/them")
                if (memberroles.includes("754901986205237358")) pronoun.push("other")
                
                if (pronoun.length >= 1) {
                    let pronouns = ""
                    pronoun.forEach(Element => {
                        pronouns = `${Element}, ${pronouns}`
                    })
                    pronoun = pronouns
                } else {
                    message.reply('looks like you need to assign yourself a pronoun! You can do that in #roles.')
                    return
                }
                db.get('members') // Push into the database.
                    .push({
                    memberid: message.author.id, // User who requested to register.
                    username: `${message.author.username}#${message.author.discriminator}`, // eg Hyperfresh#8080
                    name: "Anonymous",
                    bday: "--",
                    switch: "--",
                    pronouns: pronoun, // See above
                    bio: null,
                    sbadges: createServerBadges(message.author.id,message.member._roles), // check if there's any mod roles
                    pbadges: null,
                    colour: message.member.displayColor,
                    tz: null,
                    data: message.member._roles, // This just stores their roles to make things easier later.
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

        } else if (args [0] == "update") { // Update user info on the database. For example, Discord username.
            if (search) {
                let pronoun = []
                let memberroles = message.member._roles
                if (memberroles.includes("754901377406337085")) pronoun.push("he/him")
                if (memberroles.includes("754901568624525372")) pronoun.push("she/her")
                if (memberroles.includes("754901688669700106")) pronoun.push("they/them")
                if (memberroles.includes("754901986205237358")) pronoun.push("other")
                try { // User must have a pronoun to be in the database.
                    if (pronoun.length > 1) {
                        let pronouns = ""
                        pronoun.forEach(Element => {
                            pronouns = `${Element}, ${pronouns}`
                        })
                        pronoun = pronouns
                    }
                } catch { // No pronouns?
                    message.reply('looks like you need to assign yourself a pronoun! You can do that in #roles.')
                    return
                }
                db.get('members')
                    .find({memberid: message.author.id})
                    .update({
                        username: `${message.author.username}#${message.author.discriminator}`,
                        pronouns: pronoun,
                        sbadges: createServerBadges(message.author.id,message.member._roles), // check if there's any mod roles
                        data: message.member._roles, // This just stores their roles to make things easier later.
                        avatar: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.member.user.avatar}.png`
                    })
                search = dbSearch(message.author.id) // Refresh the search result
                let embed = createEmbed(search)
                message.channel.send(embed)
            }

        } else if (args[0] == "edit") { // Edit data on the database.
            if (search) {
                // Edit name
                if (args[1] == "name") {
                    let name = ""
                    for (let i = 1; i < ((args.length)-1); i++) {
                        name = `${name} ${args[1+i]}`
                    }
                    dbUpdate(message.author.id,{name: name})

                // Edit birthday
                } else if (args[1] == ("bday" || "birthday")) {
                    try {
                        var test = String(`${args[2]} ${args[3]}`)
                        if (!/^((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)$/.test(test)) throw new Error()
                    } catch {
                        message.channel.send('Check your birthdate, ensure it\'s in the format `12 Aug(ust)`.')
                        return
                    }
                    dbUpdate(message.author.id,{bday: test})

                // Edit bio
                } else if (args[1] == "bio") {
                    let text = ""
                    for (let i = 1; i < ((args.length)-1); i++) {
                        if (args[i+1] == "|") {
                            var title = text
                            text = ""
                        } else text = `${text} ${args[i+1]}`
                    }
                    dbUpdate(message.author.id,{bio: {title: title, desc: text}})

                // Edit embed colour
                } else if (args[1] == ("colour" || "color")) {
                    try {
                        if (args[2].test(/^#(?:[0-9a-fA-F]{3}){1,2}$/)) {
                            dbUpdate(message.author.id,{colour: parseInt(args[2], 16)})
                        }
                    } catch {
                        message.reply('seems you forgot to specify a colour to assign!')
                        return
                    }
                // Edit bio image
                } else if (args[1] == "image") {
                    if (img(args[2])) {
                        dbUpdate(message.author.id,{image: args[2]})
                    } else {
                        message.reply('you might want to check that URL again.')
                        return
                    }
                } else if (args[1] == "badges") {
                    dbUpdate(message.author.id,{pbadges: createPrideBadges(args)})
                } else {
                    message.reply('you can\'t edit this! Here\'s what your profile currently looks like.')
                }
                search = dbSearch(message.author.id)
                let embed = createEmbed(search)
                message.channel.send(embed)

            } else message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
        } else if (args[0] == "search") {
            if (args[1] == "name") {
                let name = ""
                for (let i = 1; i < ((args.length)-1); i++) {
                    name = `${name} ${args[1+i]}`
                }
                search = db.get('members')
                    .find({name: name})
                    .value()
            } else if (args[1] == "username") {
                search = db.get('members')
                    .find({username: args[2]})
                    .value()
            }
            else if (args[1] == "memberid") {
                search = dbSearch(args[2])
            }
            if (search) {
                let embed = createEmbed(search)
                message.channel.send(embed)
            } else message.reply("I didn't find anything. Sorry.")
        } else {
            let user = getUserFromMention(args[0]);
            try { search = dbSearch(user.id) }
            catch {
                message.reply('I think you messed up your command somewhere. Try again.')
                return
            }
            if (search) {
                let embed = createEmbed(search)
                message.channel.send(embed)
            } else message.reply("I didn't find anything. Sorry.")
        }
    } 
}