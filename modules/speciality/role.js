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
            for (let x = 1; x < (args.length); x++) {
                rolename = `${rolename} ${args[x]}`
            }
            if (/^(?:[0-9a-fA-F]{3}){1,2}$/.test(args[0])) {
                let rolecolour = parseInt(args[0], 16)
                let role = message.guild.roles.create({
                    data: {
                      name: rolename,
                      color: rolecolour,
                      hoist: true
                    },
                  })
                    .then(role => {
                        db.get('roles')
                            .push({memberid: message.author.id, roleid: role.id})
                            .write()
                        message.member.roles.add(role.id)
                        message.reply(`Role given: <@&${role.id}>`)
                    })
                    .catch(console.error);
            }
        }
    }
}