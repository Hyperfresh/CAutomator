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
Copyright (C) 2020 Hyperfresh | https://github.com/Hyperfresh/CAutomator/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
`)

var profile_edit = 0

console.log(info)

const { exception, profile } = require("console");
const Discord = require("discord.js");
const { exit } = require("process");
const config = require("./data/config.json");
const client = new Discord.Client();
const zangodb = require("zangodb");
let profiles = zangodb.Db('profiles');
let db = zangodb.Db('db');

const prefix = "~";

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
        ready()
        while (true) {
                if (stop == 1) {
                        console.log("Shutdown requested!");
                        message.channel.send("🟥 > Shutting down.");
                        client.user.setPresence({status: "invisible"});
                        setTimeout(() => {
                                client.destroy();
                                throw new Error("🟥 > Bot has now shut down.");
                        }, 5000);
                }
        } 
});

client.on("message", function(message) { 
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) {
                if ("@someone" in message.content) {
                        user = choice(message.channel.guild.members);
                        while ("295463016248377344" in str(user.roles)) {
                                user = choice(message.channel.guild.members);
                        }
                        message.channel.send("I pick **" + String(user.mention) + "**!");
                } else return;
        }

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();

        if (command === "ping") {
                const timeTaken = Date.now() - message.createdTimestamp;
                message.channel.send(`> 🏓 > **Pong!** I recorded ${timeTaken}ms.`);
        }
        if (command === "about") {
                message.channel.send(`https://github.com/Hyperfresh/CAutomator/blob/dev/resources/logo.png?raw=true`);
                message.channel.send(`> 👋 > **Hello! I am CAutomator, the Calculated Anarchy Automator!**\n
                I am a bot built by @Hyperfresh#8080, tasked to automate some tasks and make things a little easier on this server!\n
                You can find more information on my GitHub: https://github.com/Hyperfresh/CAutomator\n
                Also, thanks to https://github.com/iwa for helping me with some things c:\n\n
                *I am licensed under AGPLv3. See https://github.com/Hyperfresh/CAutomator/blob/dev/LICENSE*`);
        }
        if (command === "time") {
                var utcSeconds = (Date.now()/1000);
                var d = new Date(0);
                d.setUTCSeconds(utcSeconds);
                message.channel.send(`It is **`,String(d),`**.`);
        }
        if (command === "stop") {
                if (!message.user == "Hyperfresh#8080") { return; }
                console.log("Shutdown requested!");
                message.channel.send("🟥 > Shutting down.");
                client.user.setPresence({status: "invisible"});
                setTimeout(() => {
                        client.destroy();
                        throw new Error("🟥 > Bot has now shut down.");
                }, 5000);
        }
        if (command === "reboot") {
                if (!message.user == "Hyperfresh#8080") { return; }
                console.log("Reboot requested!");
                message.channel.send("🟨 > Rebooting.");
                client.user.setPresence({
                        status:"dnd",activity:{
                                name:"Rebooting...",type:"PLAYING"
                        }
                });
                console.warn("🟨 > Bot is now rebooting.");
                setTimeout(() => {
                        client.destroy();
                        client.login(config.BOT_TOKEN);
                        console.log(info)
                        setTimeout(() => {
                                ready();
                        }, 3000);
                }, 5000);
                
        }
        // if (command === "register") {
        //         profiles.search(user)
        // }




        if (command === "role") {
                member = message.author;
                if ("547360918930194443" in str(member.roles)) {
        //     User = Query()
        //     result = db.search(User.memberId == member.id)

                        if(len(result) == 1) {
                                roleName = ""
                                for(x in range(0, len(args)-1)) {
                                        roleName = roleName + args[x] + " "
                                }
                                let re = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
                                hexColorMatch = re.match(args[length(args)-1])

                                if(hexColorMatch) {
                                        print('ROLE CHANGE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' with colour ' + str(roleColour))
                                        role = message.guild.get_role(result[0]['roleId'])
                                        role.edit({
                                                name: roleName,
                                                colour: args[len(args)-1]
                                        })
                                        message.channel.send("> :white_check_mark: > **Role edited**\n<@{0}>, I edited your role **<@&{1}>**".format(message.author.id, role.id))
                                } else {
                                        print('ROLE CHANGE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' without colour change')
                                        role = message.guild.get_role(result[0]['roleId'])
                                        role.edit({name: roleName})
                                        message.channel.send("> :white_check_mark: > **Role edited**\n<@{0}>, I edited your role **<@&{1}>**".format(message.author.id, role.id))
                                }
                        } else {
                                roleName = ""
                                for(x in range(0, len(args)-1)) {
                                        roleName = roleName + args[x] + " "
                                }
                                let re = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
                                hexColorMatch = re.match(args[length(args)-1])

                                if(hexColorMatch) {
                                print('ROLE CREATE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' with colour ' + str(roleColour))
                                
                                role = message.guild.create_role(name=roleName, colour=roleColour)
                                member.add_roles(new role(client, {
                                        name: roleName,
                                        colour: args[len(args)-1]
                                }))
                                db.insert({'memberId': member.id, 'roleId': role.id})
                                message.channel.send("> :white_check_mark: > **Role given**\n<@{0}>, I gave you the role **<@&{1}>**".format(message.author.id, role.id))
                                } else {
                                message.channel.send("> :x: > **Something went wrong**\n <@{.author.id}>, the colour hex code you entered is incorrect!\nDid you forget the `#` at the start of your hex code?".format(message))
                                }
                        }
                } else {
                        message.channel.send("> :x: > **You can't do that**\nThis is for Level 30+ use only.")
                }
        }
});         
client.login(config.BOT_TOKEN);