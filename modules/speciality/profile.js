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
const { db } = require('../../index')

// Cropping into circle

// Times
const { DateTime } = require('luxon')
const timezone = require('moment-timezone')

// Check if url is valid and leads to image.
const img = require('is-image-url')

//  ___
// |__      _   _ _|_ *  _   _
// |   |_| | | |_  |  | |_| | | 

function createServerBadges(id,guild) /* Create server badges for embeds & database. */ {
    let serverBadgeEmoji = [
        'star','wrench','crown','pushpin','video_game',
        'see_no_evil','one','two','three','five','six'
    ]
    let badgesToAdd = []
    let r = []

    let user = client.users.cache.get(id)
    let roles = guild.member(user)._roles

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

function parseBadges(name,id,badges) {
    let counter = 0
    let badgesToAdd = [];
    try {
        name.forEach(Element => {
                if (badges.includes(Element)) {
                    badgesToAdd.push(`<:${name[counter]}:${id[counter]}>`)
                }
                counter += 1
            })
    } catch (err) {
        console.log('Nothing to parse:',err)
        return "noBadge"
    }
    return badgesToAdd
}

function construct(r,list) {
    if (r == null) return "noBadge"
    return list.filter(function (elem) {
        return r.indexOf(elem) > -1
    }).length
}

function createPrideBadges(r) { // Create pride badges for embeds & database.
    // Declare variable types.
    let badgesToAdd = []
    let fullList = [ // This list is the full resolve for each pride badge.
        "<:enby:798917920674676756>","<:pan:798918319238545418>","<:nd:798918686676353034>",
        "<:les1:798920011145281556>","<:les2:798920322828861460>","<:bi:798919094194798622>",
        "<:ace:798919222843146270>","<:gq:798919345836785664>","<:aro:798919620840652870>",
        ":transgender_flag:",":rainbow_flag:"
    ]
    let prideBadgeEmoji = ['enby','pan','nd','les1','les2','bi','ace','gq','aro'] // Badge types
    let prideBadgeEmoID = ['798917920674676756','798918319238545418','798918686676353034','798920011145281556','798920322828861460','798919094194798622','798919222843146270','798919345836785664','798919620840652870']

    let found = construct(r,fullList)
    if (found == "noBadge") {
        badgesToAdd = ["No pride badges"]
        return badgesToAdd
    }
    if (found) { // Function being used to construct pride badges for embed.
        // Convert constructed badges from database to badge types
        let temp = []
        for (let i = 0; i < fullList.length; i++) {
            if (r.includes(fullList[i])) temp.push(prideBadgeEmoji[i])
        }
        r = temp
    }
    
    badgesToAdd = parseBadges(prideBadgeEmoji,prideBadgeEmoID,r)
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
    let fullList = [ // This list is the full resolve for each interest badge.
        '<:minecraft:817185848373542963>',
        '<:amogus:817207798583525386>',
        '<:splatoon:817209133526024243>',
        '<:animalcrossing:817207987240304690>',
        '<:terraria:817186008750751754>',
        ':video_game:', ':musical_note:', ':paintbrush:'
    ]
    let interestBadgeEmoji = ['minecraft','amogus','splatoon','animalcrossing','terraria'] // Badge types
    let interestBadgeEmoID = ['817185848373542963','817207798583525386','817209133526024243','817207987240304690','817186008750751754']

    let found = construct(r,fullList)
    if (found == "noBadge") {
        badgesToAdd = ["No interest badges"]
        return badgesToAdd
    }
    if (found) { // Function being used to construct interest badges for embed.
        // Convert constructed badges from database to badge types
        let temp = []
        for (let i = 0; i < r.length; i++) {
            if (fullList.includes(r[i])) temp.push(interestBadgeEmoji[i])
        }
        r = temp
    }
    
    badgesToAdd = parseBadges(interestBadgeEmoji,interestBadgeEmoID,r)
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
    if (/^(No)\s(\w+)\s(badges)$/.test(args[0])) return args[0]
    for (let value of args) {
        yes = `${yes} ${value}`
    }
    return yes
}

function createEmbed(r,user,guild) /* Create the profile card. */ {
    let time = DateTime.now().setZone(r.tz).toLocaleString(DateTime.DATETIME_MED)
    console.log(spaceout(createInterestBadges(r.ibadges)))

    let embed = new Discord.MessageEmbed()
        .setTitle(r.username)
        .setURL(`https://discord.com/users/${r.memberid}`)
        .setColor(r.colour)
        .setDescription(`**Name**: ${r.name}\n**Pronouns**: ${r.pronouns}\n**Birthday**: ${r.bday}\n**Switch FC**: ${r.switch}`)
        .setThumbnail(user.avatarURL({dynamic: true, size: 1024}))
        .setAuthor("Calculated Anarchy Profile",'https://media.discordapp.net/attachments/634575479042474003/641812026267795476/dsadsa.png')
        .addField('Interest Badges',spaceout(createInterestBadges(r.ibadges)))
        .addField('Server Badges',spaceout(createServerBadges(r.memberid,guild)),true)
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
    return db.get('profiles').find({memberid: search}).value()
}

function dbUpdate(search, update) /* Update details on the database. */ {
    db.get('profiles')
        .find({memberid: search})
        .assign(update)
        .write()
}

/*
 __ __
|  |  |  __   __|      |   __   __
|  |  | |  | |  | |  | |  |__| |__
|  |  | |__| |__| |__| |  |__   __|
*/

function registerUser() {
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
    let search = dbSearch(message.author.id)
    let embed = createEmbed(search,client.users.cache.get(search.memberid),message.guild)
    message.channel.send('> ✅ > Your profile was created.',embed)
    message.channel.send(`Here's what you can edit:`,helpModule('basic'))
}

function updateUser() {
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
    let search = dbSearch(message.author.id) // Refresh the search result
    let embed = createEmbed(search,client.users.cache.get(search.memberid),message.guild)
    message.channel.send('Profile card updated.',embed)
}

function editUser(message,args) {
    let temp;
    switch (args[1]) {
        case "name":
            let name = ""
            for (let i = 1; i < ((args.length)-1); i++) {
                name = `${name} ${args[1+i]}`
            }
            dbUpdate(message.author.id,{name: name})
            break
        case "bday":
        case "birthday":
            try {
                var test = String(`${args[2]} ${args[3]}`)
                if (!/^((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)$/.test(test)) throw new Error()
            } catch {
                message.channel.send('Check your birthdate, ensure it\'s in the format `12 Aug(ust)`.')
                return
            }
            dbUpdate(message.author.id,{bday: test})
            break
        case "bio":
            let text = ""
            for (let i = 1; i < ((args.length)-1); i++) {
                if (args[i+1] == "|") {
                    var title = text
                    text = ""
                } else text = `${text} ${args[i+1]}`
            }
            dbUpdate(message.author.id,{bio: {title: title, desc: text}})
            break
        case "colour":
        case "color":
            try {
                if (/^(?:[0-9a-fA-F]{3}){1,2}$/.test(args[2])) dbUpdate(message.author.id,{colour: parseInt(args[2], 16)})
            } catch {
                message.reply('seems you forgot to specify a colour to assign!')
                return
            }
            break
        case "image":
            if (img(args[2])) dbUpdate(message.author.id,{image: args[2]})
            else {
                message.reply('you might want to check that URL again.')
                return
            }
            break
        case "badges":
        case "pride":
            temp = args.splice(2)
            dbUpdate(message.author.id,{pbadges: createPrideBadges(temp)})
            break
        case "interest":
        case "interests":
            temp = args.splice(2)
            dbUpdate(message.author.id,{ibadges: createInterestBadges(temp)})
            break
        case "tz":
        case "timezone":
        case "timezones":
            if (!timezone.tz.zone(args[2])) {
                let helpembed = new Discord.MessageEmbed()
                    .setTitle('Click here to see all valid time zones.')
                    .setDescription('Time zone names are case sensitive.')
                    .setURL('https://en.wikipedia.org/wiki/List_of_tz_database_time_zones')
                message.reply('I don\'t recognise this time zone.',helpembed)
                return
            }
            dbUpdate(message.author.id,{tz: args[2]})
            break
        case "fc":
        case "switch":
            if (/(SW-[0-9]{4}-[0-9]{4}-[0-9]{4})/.test(args[2])) dbUpdate(message.author.id,{switch: args[2]})
            else message.reply('seems you messed up somewhere... Try again, in the format of `SW-1234-1234-1234-1234`.')
            break
        default:
            message.reply('you can\'t edit this! Here\'s what your profile currently looks like.')
            break
    }
}

function searchUser(type,search) {
    switch (type) {
        case "name":
            let name = ""
            for (let i = 0; i < (search.length); i++) {
                name = `${name} ${search[1+i]}`
            }
            return db.get('profiles')
                .find({name: name})
                .value()
        case "username":
            return db.get('profiles')
                .find({username: search[0]})
                .value()
        case "memberid":
            return dbSearch(search[0])
    }
}

module.exports = {
    commands: 'profile',
    minArgs: 0,
    maxArgs: 500,
    callback: (message, args) => {
        let search = dbSearch(message.author.id) // Create search.
        switch (args[0]) {
            case "help":
                message.channel.send(helpModule(args[1]))
                break
            case "register":
                if (!search) { // Make sure they're not already on the database
                    registerUser()
                } else message.reply('looks like you\'ve already registered!') 
                break
            case "update":
                if (search) {
                    updateUser()
                } else message.reply(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
                break
            case "edit":
                if (search) {
                    editUser(message,args)
                    search = dbSearch(message.author.id)
                    let embed = createEmbed(search,client.users.cache.get(search.memberid),message.guild)
                    message.channel.send(embed)
                } else message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
                break
            case "search":
                let searchTypes = ['name','memberid','username']
                let result
                let type = args.shift()
                if (type.includes(searchTypes)) result = searchUser(type,args)
                if (!result) {
                    let user = getUserFromMention(args[1]);
                    try { result = dbSearch(user.id) }
                    catch {
                        message.reply('I think you messed up your command somewhere. Try again.')
                        return
                    }
                }
                if (result) {
                    let embed
                    try { embed = createEmbed(result,client.users.cache.get(resuslt.memberid),message.guild) }
                    catch {
                        message.reply('sorry, but something *really bad* happened when I tried to get a result. Try searching with their @ instead.')
                        return
                    }                
                message.channel.send(embed)
                } else message.reply("I didn't find anything. Sorry.")
                break
            default:
                if (args[0]) {
                    let user = getUserFromMention(args[0]);
                    try { search = dbSearch(user.id) }
                    catch {
                        message.reply('I think you messed up your command somewhere. Try again.')
                        return
                    }
                    if (search) {
                        let embed
                        try { embed = createEmbed(search,user,message.guild) }
                        catch {
                        message.reply('sorry, but something *really bad* happened when I tried to get a result. Try searching with their @ instead.')
                        return
                        }
                        message.channel.send(embed)
                    } else message.reply("I didn't find anything. Sorry.")
                    return
                }
                if (search) { // Did something come back?
                    let embed = createEmbed(search,client.users.cache.get(search.memberid),message.guild)
                    message.channel.send(embed)
                } else message.channel.send(`Seems you aren't on the database. Run \`${prefix}profile register\` to do that!`)
                break
        }
    } 
}