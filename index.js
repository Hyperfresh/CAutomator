//        _
//   /\__| |__/\ 
//   \   ___   / __                 _                                     _
//  _/  /   \  \/  \              _| |_                                 _| |_
// |_  |     \ /    \     _   _  |_   _|  _____   _________   _____ _  |_   _|  _____   _____
//  _\  \_____/  /\  \   | | | |   | |   |  _  | |  _   _  | |  _  | |   | |   |  _  | |  ___|
//  \________/  /__\  \  | |_| |   | |   | |_| | | | | | | | | |_|   |   | |   | |_| | | |
//          /__/    \__\ |_____|   |_|   |_____| |_| |_| |_| |_____|_|   |_|   |_____| |_|

var info = String(`
CAutomator - the custom-built Discord bot, coded in discord.js / node.js
Copyright (C) 2021 Hyperfresh | https://github.com/Hyperfresh/CAutomator/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
`)

console.log(info)

if (!/^(v([1-9][2-9]+\.)?(\d+\.)?(\d+))$/.test(process.version)) { // Version check
        throw new Error(`CAutomator requires Node.js v12.*.* or higher to run properly. You have ${process}. Please upgrade your Node install.`)
}

const { exception, profile } = require("console");
const Discord = require("discord.js");
const { exit } = require("process");
const fs = require('fs')
const path = require('path')
const config = require("./data/config.json");
const client = new Discord.Client();

const lowdb = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${config.DIR}/data/database.json`)
const db = lowdb(adapter)
db.defaults({ roles: [], rcount: 0, profiles : [], pcount: 0 })
        .write()

const prefix = config.PREFIX;

function ready() {
        var play = String(prefix+"help");
        client.user.setPresence({
                status: "online",activity:{
                        name:play,type:"PLAYING"
                }
        });
        console.log("🟩 >",client.user.tag,"is now online.");
}

client.on("ready", function() {
        const baseFile = 'base.js'
        const commandBase = require(`./modules/${baseFile}`)

        function readCommands(dir) {
                const files = fs.readdirSync(path.join(__dirname, dir));
                for (let file of files) {
                        const stat = fs.lstatSync(path.join(__dirname, dir, file));
                        if (stat.isDirectory()) {
                                readCommands(path.join(dir, file));
                        } else if (file !== baseFile) {
                                const option = require(path.join(__dirname, dir, file));
                                commandBase(client, option);
                        }
                }
        }
        readCommands('modules');
        ready()
});
                 
client.login(config.TOKEN);

module.exports.client = client;
module.exports.db = db