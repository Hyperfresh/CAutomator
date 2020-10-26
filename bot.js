/*
       _
  /\__| |__/\ 
  \   ___   / __                 _                                     _
 _/  /   \  \/  \              _| |_                                 _| |_
|_  |     \ /    \     _   _  |_   _|  _____   _________   _____ _  |_   _|  _____   _____
 _\  \_____/  /\  \   | | | |   | |   |  _  | |  _   _  | |  _  | |   | |   |  _  | |  ___|
 \________/  /__\  \  | |_| |   | |   | |_| | | | | | | | | |_|   |   | |   | |_| | | |
         /__/    \__\ |_____|   |_|   |_____| |_| |_| |_| |_____|_|   |_|   |_____| |_|
         
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

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see https://www.gnu.org/licenses/.
*/

const Discord = require("discord.js");
const config = require("./config.json")
const client = new Discord.Client();

const prefix = "~";

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
                message.channel.send(`
                > 👋 > **Hello! I am CAutomator, the Calculated Anarchy Automator!**\n
                I am a bot built by @Hyperfresh#8080, tasked to automate some tasks and make things a little easier on this server!\n
                You can find more information on my GitHub: https://github.com/Hyperfresh/CAutomator\n
                Also, thanks to https://github.com/iwa for some errands :)
                
                *This program is licensed under AGPLv3. See https://www.gnu.org/licenses*`);
        }
});         
client.login(config.BOT_TOKEN);