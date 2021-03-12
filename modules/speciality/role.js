// Taken from the Custom Role system in CAutomator.py and enhanced a bit.
// Thanks to http://github.com/iwa for the original code!

// Importing prefix
const config = require('../../data/config.json');
let prefix = config.PREFIX

// Set up database based on lowdb.
const lowdb = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${config.DIR}/data/database.json`)
const db = lowdb(adapter)
db.defaults({ roles: [], members: [], count: 0 })
        .write()

module.exports = {
    commands: 'role',
    minArgs: 0,
    maxArgs: 500,
    callback: (message, args) => {
        let rolename = "";
        let search = db.get('roles')
            .find({memberid: message.author.id})
            .value()
        if (!search) {
            for (let x = 0; x > ((args.length)-1); x++) {
                rolename = `${rolename} ${args[x]}`
            }
            if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(args[((args.length)-1)])) {
                let rolecolour = parseInt(args[((args.length)-1)], 16)
                let y = message.guild.roles.cache.find((role) => {
                    return role.id === '547360918930194443'
                })
                /*let role = message.guild.roles.create({
                    data: {
                      name: rolename,
                      color: rolecolour,
                      hoist: true,
                      position: ((message.guild.roles.fetch(547360918930194443).members.length)+13)
                    },
                  })
                    .then(console.log)
                    .catch(console.error);
                db.get('roles')
                  .push({memberid: message.author.id, roleid: role.id})
                  .write()
                message.member._roles.add(role.id)*/
                console.log(y)
                message.reply(`Role given.`)
            }
        }
    }
}