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

console.log(info)

const { exception } = require("console");
const Discord = require("discord.js");
const { exit } = require("process");
const config = require("./config.json")
const client = new Discord.Client();

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
});

client.on("message", function(message) { 
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();

        if (command === "ping") {
                const timeTaken = Date.now() - message.createdTimestamp;
                message.channel.send(`> 🏓 > **Pong!** I recorded ${timeTaken}ms.`);
        }
        if (command === "about") {
                message.channel.send(`https://github.com/Hyperfresh/CAutomator/blob/dev/resources/logo.png?raw=true`);
                message.channel.send(`> 👋 > **Hello! I am CAutomator, the Calculated Anarchy Automator!**\nI am a bot built by @Hyperfresh#8080, tasked to automate some tasks and make things a little easier on this server!\nYou can find more information on my GitHub: https://github.com/Hyperfresh/CAutomator\nAlso, thanks to https://github.com/iwa for some errands :)\n\n*This program is licensed under AGPLv3. See https://github.com/Hyperfresh/CAutomator/blob/dev/LICENSE*`);
        }
        if (command === "time") {
                var utcSeconds = (Date.now()/1000);
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(utcSeconds);
                message.channel.send(String(d));
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
});         
client.login(config.BOT_TOKEN);