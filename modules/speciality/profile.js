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
db.defaults({ roles: [], rcount: 0, profiles : [], pcount: 0 })
        .write()

// Times
const { DateTime } = require('luxon')
const timezone = require('moment-timezone')

// Check if url is valid and leads to image.
const img = require('is-image-url')

//  ___
// |__      _   _ _|_ *  _   _
// |   |_| | | |_  |  | |_| | | 

function createServerBadges(id) /* Create server badges for embeds & database. */ {
    let serverBadgeEmoji = [
        'star','wrench','crown','pushpin','video_game',
        'see_no_evil','one','two','three','five','six'
    ]
    let badgesToAdd = []
    let r = []

    let user = client.users.cache.get(id)
    let roles = user.lastMessage.guild.member(user)._roles

    // Moderation badges
    if (config.MAINTAINERID == id) r.push('wrench') // Bot Maintainer
    if (config.OWNERID == id) r.push("crown") // Server Owner
    if (roles.includes(config.PINNER)) r.push("pushpin") // Media Pinner
    if (roles.includes(config.ADMIN)) r.push("star") // Admin
    if (roles.includes('741595848743452763')) r.push('video_game') // Game Day Coordinator
    if (roles.includes('804971962346110976')) r.push('speech_balloon') // RP Moderator
    if (roles.includes('547613236640350228')) r.push('see_no_evil') // NSFW Moderator

    // Level badges
    if (roles.includes('321506876632203264')) r.push('one')
    if (roles.includes('321506989895319553')) r.push('two')
    if (roles.includes('547360918930194443')) r.push('three')
    if (roles.includes('321507123424919555')) r.push('five')
    if (roles.includes('776045687203692566')) r.push('six')

    let counter = 0
    serverBadgeEmoji.forEach(Element => {
        if (r.includes(Element)) {
            badgesToAdd.push(`:${serverBadgeEmoji[counter]}:`)
        }
        counter += 1
    })
    if (badgesToAdd.length == 0) badgesToAdd = ["No server badges"]
    return badgesToAdd
}

function createPrideBadges(r) /* Create pride badges for embeds & database. */ {
    // Declare variable types.
    let badgesToAdd = []
    let fullList = /* This list is the full resolve for each pride badge. */ [
        "<:enby:798917920674676756>","<:pan:798918319238545418>","<:nd:798918686676353034>",
        "<:les1:798920011145281556>","<:les2:798920322828861460>","<:bi:798919094194798622>",
        "<:ace:798919222843146270>","<:gq:798919345836785664>","<:aro:798919620840652870>",
        ":transgender_flag:",":rainbow_flag:"
    ]
    let found;
    try { // Is this function being used to construct pride badges for the embed or the database?
        found = fullList.filter(function (elem) {
            return r.indexOf(elem) > -1;
        }).length == r.length
    } catch {
        badgesToAdd = ["No pride badges"] // If r is null, this is just a "last resort" measure
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
        badgesToAdd = ["No pride badges"]
    }
    if (r.includes("trans")) {
        badgesToAdd.push(':transgender_flag:')
    }
    if (r.includes("gay")) {
        badgesToAdd.push(':rainbow_flag:')
    }
    if (badgesToAdd.length == 0) badgesToAdd = ["No pride badges"]
    return badgesToAdd
}

function createInterestBadges(r) {
    // Declare variable types.
    let badgesToAdd = []
    let fullList = /* This list is the full resolve for each interest badge. */ [
        '<:minecraft:817185848373542963>',
        '<:amogus:817207798583525386>',
        '<:splatoon:817209133526024243>',
        '<:animalcrossing:817207987240304690>',
        '<:terraria:817186008750751754>',
        ':video_game:', ':musical_note:', ':paintbrush:'
    ]
    let found;
    try { // Is this function being used to construct interest badges for the embed or the database?
        found = fullList.filter(function (elem) {
            return r.indexOf(elem) > -1;
        }).length == r.length
    } catch {
        badgesToAdd = ['No interest badges'] // If r is null, this is just a "last resort" measure
        return badgesToAdd
    }
        if (found) { // Function being used to construct interest badges for embed.
            // Convert constructed badges from database to badge types
            let temp = []
            r.forEach(Element => {
                if (Element == "<:minecraft:817185848373542963>") temp.push("minecraft")
                if (Element == "<:amogus:817207798583525386>") temp.push("amogus")
                if (Element == "<:splatoon:817209133526024243>") temp.push("splatoon")
                if (Element == "<:animalcrossing:817207987240304690>") temp.push("animalcrossing")
                if (Element == "<:terraria:817186008750751754>") temp.push("terraria")
                if (Element == ":musical_note:") temp.push("musician")
                if (Element == ":video_game:") temp.push("gameday")
                if (Element == ":paintbrush:") temp.push("artist")
            })
            r = temp
        }
    
    let prideBadgeEmoji = ['minecraft','amogus','splatoon','animalcrossing','terraria'] // Badge types
    let prideBadgeEmoID = ['817185848373542963','817207798583525386','817209133526024243','817207987240304690','817186008750751754']
    let counter = 0
    try {
        prideBadgeEmoji.forEach(Element => {
                if (r.includes(Element)) {
                    badgesToAdd.push(`<:${prideBadgeEmoji[counter]}:${prideBadgeEmoID[counter]}>`)
                }
                counter += 1
            })
    } catch {
        badgesToAdd = ['No interest badges']
    }
    if (r.includes("musician")) {
        badgesToAdd.push(':musical_note:')
    }
    if (r.includes("gameday")) {
        badgesToAdd.push(':video_game:')
    }
    if (r.includes("artist")) {
        badgesToAdd.push(":paintbrush:")
    }
    if (badgesToAdd.length == 0) badgesToAdd = ['No interest badges']
    return badgesToAdd
}

function spaceout(args) {
    let yes = '';
    for (let i = 0; i < (args.length); i++) {
        yes = `${yes} ${args[i]}`
    }
    return yes
}

function createEmbed(r) /* Create the profile card. */ {
    let time = DateTime.now().setZone(r.tz).toLocaleString(DateTime.DATETIME_MED)
    let user = client.users.cache.get(r.memberid)
    let embed = new Discord.MessageEmbed()
        .setTitle(r.username)
        .setURL(`https://discord.com/users/${r.memberid}`)
        .setColor(r.colour)
        .setDescription(`**Name**: ${r.name}\n**Pronouns**: ${r.pronouns}\n**Birthday**: ${r.bday}\n**Switch FC**: ${r.switch}`)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${r.memberid}/${user.avatar}.png?size=1024`)
        .setAuthor("Calculated Anarchy Profile",'https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png')
        .addField('Interest Badges',spaceout(createInterestBadges(r.ibadges)))
        .addField('Server Badges',spaceout(createServerBadges(r.memberid)),true)
        .addField('Pride Badges',spaceout(createPrideBadges(r.pbadges)),true)
        .setFooter(`Member ID: ${r.memberid}`)
    if (r.tz !== null) embed.addField(`The time for me is ${time}.`,`**Time zone**: ${r.tz}`,false)
    if (r.bio !== null) embed.addField(r.bio.title,r.bio.desc,false)
    try {
        if (r.image !== null) embed.setImage(r.image)
    } catch {
        console.log('No bio image!')
    }
    return embed
}

function helpModule(args) {
    let types = ['badges','basic','register','edit','search']

    let badges = new Discord.MessageEmbed()
        .setAuthor('CAutomator Profile System Help','https://github.com/Hyperfresh/CAutomator/blob/master/resources/icon.png?raw=true')
        .setTitle('Badge Definition')
        .setDescription(`> ** Server badges**
:crown: Server owner/founder
:star: Server admin
:wrench: Bot maintainer
:video_game: Game Day Coordinator
:see_no_evil: NSFW Moderator
:speech_balloon: Roleplay Moderator
:pushpin: Media pinner
:one: Reached Level 10+!
:two: Reached Level 20+!
:three: Reached Level 30+!
:five: Reached Level 50+!
:six: REACHED LEVEL SIXTY NINE.
        
> **Interest badges**
<:minecraft:817185848373542963> Minecraft
<:amogus:817207798583525386> Among Us
<:splatoon:817209133526024243> Splatoon
<:animalcrossing:817207987240304690> Animal Crossing
<:terraria:817186008750751754> Terraria
:video_game: Game Day
:musical_note: Musician
:paintbrush: Artist

> **Pride badges**
<:enby:798917920674676756> Non-Binary
<:pan:798918319238545418> Pansexual
<:nd:798918686676353034> Neurodivergent
<:les1:798920011145281556> Lesbian (flag 1)
<:les2:798920322828861460> Lesbian (flag 2)
<:bi:798919094194798622> Bisexual
<:ace:798919222843146270> Asexual
<:gq:798919345836785664> Genderqueer
<:aro:798919620840652870> Aromantic
:transgender_flag: Transgender
:rainbow_flag: Gay`)

    let basic = new Discord.MessageEmbed()
        .setAuthor('CAutomator Profile System Help','https://github.com/Hyperfresh/CAutomator/blob/master/resources/icon.png?raw=true')
        .setTitle('Basic Profile System Modules')
        .setDescription(`To learn more about a module, run \`${prefix}profile help <command>\`.\nTo learn about badges, run \`${prefix}profile help badges\`.`)
        .addField('register','Register onto the Database, if you haven\'t already.',true)
        .addField('edit','Edit your profile.',true)
        .addField('search','Advanced search for a user.',true)
        .addField('help','This message.',true)
        .addField('(no module)','Search for a user using a @mention, eg `profile <@352668050111201291>`',true)

    let register = new Discord.MessageEmbed()
        .setAuthor('CAutomator Profile System Help','https://github.com/Hyperfresh/CAutomator/blob/master/resources/icon.png?raw=true')
        .setTitle(`${prefix}profile register`)
        .setDescription(`This command does not take any arguments. Just run the command to create an entry on the database.`)

    let edit = new Discord.MessageEmbed()
        .setAuthor('CAutomator Profile System Help','https://github.com/Hyperfresh/CAutomator/blob/master/resources/icon.png?raw=true')
        .setTitle('Edit your profile card.')
        .setDescription('**Usage**: `profile edit ...`\n\n> **Arguments available**:')
        .addField('bio','Add a bio.\n`...bio title | description`',true)
        .addField('badges','Add pride badges.\n`...badges enby nd trans`\n> Badges available:\n<:enby:798917920674676756> <:pan:798918319238545418> <:nd:798918686676353034> <:les1:798920011145281556> <:les2:798920322828861460> <:bi:798919094194798622> <:ace:798919222843146270> <:gq:798919345836785664> <:aro:798919620840652870> (:transgender_flag: `trans`) (:rainbow_flag: `gay`)',true)
        .addField('interest','Add interest badges.\n`...interest splatoon amogus artist`\n> Badges available:\n<:minecraft:817185848373542963> <:amogus:817207798583525386> <:splatoon:817209133526024243> <:animalcrossing:817207987240304690> <:terraria:817186008750751754> (:video_game: `gameday`) (:musical_note: `musician`) (:paintbrush: `artist`)',true)
        .addField('name','Add your IRL name.\n`...name Paul "Hy" Asencion`',true)
        .addField('bday','Add your birthday.\n`...bday 12 Aug`',true)
        .addField('timezone','Add your time zone so people know what time it is for you.\n`...timezone Australia/Adelaide`',true)
        .addField('colour','Set your profile card\'s colour.\n`...colour 00ff00`',true)
        .addField('image','Set featured image, like a piece of art or just something cool!\n`...image <link>`',true)
        .addField('switch','Add your Switch friend code.\n`...switch SW-1234-1234-1234-1234`')

    let search = new Discord.MessageEmbed()
        .setAuthor('CAutomator Profile System Help','https://github.com/Hyperfresh/CAutomator/blob/master/resources/icon.png?raw=true')
        .setTitle('Search the database.')
        .setDescription('**Usage**: `profile search ...`\n\n> **Arguments available**:')
        .addField('name','Search by IRL name.\n`...name Paul ("Hy" Asencion)`',true)
        .addField('username','Search by Discord username.\n`...username Hyperfresh(#8080)`',true)
        .addField('memberid','Search by Discord member id.\n`...memberid 352668050111201291`',true)
        .addField('(no argument)','Search by Discord mention.\n`...<@352668050111201291>`',true)

    if (args == 'badges') return badges
    else if (args == 'register') return register
    else if (args == 'edit') return edit
    else if (args == 'search') return search
    else return basic
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
    let yep = db.get('profiles')
        .find({memberid: search})
        .value()
    return yep
}

function dbUpdate(search, update) /* Update details on the database. */ {
    db.get('profiles')
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
        } else if (args[0] == "help") {
            message.channel.send(helpModule(args[1]))
        } else if (args[0] == "register") { // Register a user on the database.
            if (!search) { // Make sure they're not already on the database
                let pronoun = []
                let memberroles = message.member._roles
                if (memberroles.includes("754901377406337085")) pronoun.push("he/him")
                if (memberroles.includes("754901568624525372")) pronoun.push("she/her")
                if (memberroles.includes("754901688669700106")) pronoun.push("they/them")
                if (memberroles.includes("754901986205237358")) pronoun.push("other")
                
                if (pronoun.length == 0) {
                    message.reply('looks like you need to assign yourself a pronoun! You can do that in #roles.')
                    return
                }
                db.get('profiles') // Push into the database.
                    .push({
                    memberid: message.author.id, // User who requested to register.
                    username: `${message.author.username}#${message.author.discriminator}`,
                    name: "Anonymous",
                    bday: "--",
                    switch: "--",
                    pronouns: String(pronoun), // See above
                    bio: null,
                    pbadges: null,
                    ibadges: null,
                    colour: message.member.displayColor,
                    tz: null,
                })
                    .write()
                db.update('pcount', n => n + 1)
                    .write()
                search = dbSearch(message.author.id)
                let embed = createEmbed(search)
                message.channel.send('> ✅ > Your profile was created.',embed)
                message.channel.send(`Here's what you can edit:`,helpModule('basic'))
            } else message.reply('looks like you\'ve already registered!') 

        } else if (args [0] == "update") { // Update user info on the database. For example, Discord username.
            if (search) {
                let pronoun = []
                let memberroles = message.member._roles
                if (memberroles.includes("754901377406337085")) pronoun.push("he/him")
                if (memberroles.includes("754901568624525372")) pronoun.push("she/her")
                if (memberroles.includes("754901688669700106")) pronoun.push("they/them")
                if (memberroles.includes("754901986205237358")) pronoun.push("other")
                if (pronoun.length == 0) {
                    message.reply('looks like you need to assign yourself a pronoun! You can do that in #roles.')
                    return
                }
                db.get('profiles')
                    .find({memberid: message.author.id})
                    .assign({
                        username: `${message.author.username}#${message.author.discriminator}`,
                        pronouns: String(pronoun)
                    })
                    .write()
                search = dbSearch(message.author.id) // Refresh the search result
                let embed = createEmbed(search)
                message.channel.send('Profile card updated.',embed)
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
                } else if (args[1] == "bday" || args[1] == "birthday") {
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
                } else if (args[1] == "colour" || args[1] == "color") {
                    try {
                        if (/^(?:[0-9a-fA-F]{3}){1,2}$/.test(args[2])) {
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
                } else if (args[1] == "interest") {
                    dbUpdate(message.author.id,{ibadges: createInterestBadges(args)})
                } else if (args[1] == "timezone") {
                    if (!timezone.tz.zone(args[2])) {
                        let helpembed = new Discord.MessageEmbed()
                            .setTitle('Click here to see all valid time zones.')
                            .setDescription('Time zone names are case sensitive.')
                            .setURL('https://en.wikipedia.org/wiki/List_of_tz_database_time_zones')
                        message.reply('I don\'t recognise this time zone.',helpembed)
                        return
                    }
                    dbUpdate(message.author.id,{tz: args[2]})
                } else if (args[1] == "switch") {
                    if (/(SW-[0-9]{4}-[0-9]{4}-[0-9]{4})/.test(args[2])) dbUpdate(message.author.id,{switch: args[2]})
                    else message.reply('seems you messed up somewhere... Try again, in the format of `SW-1234-1234-1234-1234`.')
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
                search = db.get('profiles')
                    .find({name: name})
                    .value()
            } else if (args[1] == "username") {
                search = db.get('profiles')
                    .find({username: args[2]})
                    .value()
            }
            else if (args[1] == "memberid") {
                search = dbSearch(args[2])
            }
            else {
                let user = getUserFromMention(args[1]);
                try { search = dbSearch(user.id) }
                catch {
                    message.reply('I think you messed up your command somewhere. Try again.')
                    return
                }
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