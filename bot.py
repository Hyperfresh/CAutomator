#discord.py
import discord
from discord.ext import commands
from discord.utils import get

#tinydb
from tinydb import TinyDB, Query
db = TinyDB('db.json')

#others
import time # for time...
import os #dotenv and running speedtest
from dotenv import load_dotenv #dotenv thing which has discord token
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN') # CHECK YOUR .env FILE!

import csv #for reading speedtest results
import re #regular expression

def read_cell(row, col): # Getting name of entry. Thanks @GradyDal on Repl.it
	with open('speeds.csv', 'r') as f:
		data=list(csv.reader(f))
		return(data[int(row)][int(col)])

def crashcrash(): # closes the program (yeah, not intuitive.)
    exit()
    crashcrash()

def UpdateTime(speed):
    global CurrentTime
    global SpeedPerformTime
    CurrentTime = (time.strftime("%d %b %Y %H:%M:%S", time.localtime()))
    if speed == True:
        SpeedPerformTime = CurrentTime

linecount = 0
lvl30ID = 547360918930194443

bot = commands.Bot(command_prefix='-')

#the code
client = discord.Client()

@client.event
async def on_ready():
    await client.change_presence(activity=discord.Game(name='-help'))
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):

    if message.author.bot: return #avoid every bot instead of only itself

    if(not message.content.startswith('-')): return

    args = message.content.split()
    args.pop(0) # removes the command from arguments

######################################################
# ABOUT MODULE

    if message.content.startswith('-about'):
        await message.channel.send(file=discord.File('cautomator.png'))
        await message.channel.send('> :wave: > **Hello! I am CAutomator, the Calculated Anarchy Automator!**\nI am a bot built by @Hyperfresh#8080, tasked to automate some tasks and make things a little easier on this server!\nYou can find more information on my GitHub: https://github.com/Hyperfresh8080/CAutomator\n Also, thanks to https://github.com/iwaQwQ for some errands :)')

######################################################
# HELP MODULE now redirects to the bot's wiki on commands

    if message.content.startswith('-help'):
        await message.channel.send("> :information_source: > **Check here**\nhttps://github.com/Hyperfresh8080/CAutomator/wiki/Commands")

######################################################
# SHUTDOWN MODULE
    if message.content.startswith('-shutdown'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send(':wave: > See ya, ' + str(message.author) + '!')
            await client.change_presence(activity=None)
            crashcrash()
        else:
            await message.channel.send(':x: > Nice try, ' + str(message.author) + ". <:squinteyes:563998593460076544>")

######################################################
# ABOUT SPEEDTEST MODULE
    if message.content.startswith('-abspeed'):
        speedabout = '''**Speedtest CLI by Ookla** (speedtest.exe) is the official command line client for testing the speed and performance of an internet connection, provided by Ookla.
Your use of the `-speed` command is subject to the Speedtest End User License Agreement, Terms of Use and Privacy Policy at these URLs:
        https://www.speedtest.net/about/eula
        https://www.speedtest.net/about/terms
        https://www.speedtest.net/about/privacy
        '''
        await message.channel.send(str(speedabout))

######################################################
# SPEEDTEST MODULE
#
# ATT - The following code won't work unless you have Speedtest CLI installed somewhere
# Okay... this is a lil janky so hear me out. This will be optimised later, don't worry.
# The reason why I did it the way I did it was because this was the most "efficient" way.
# I do not know a way for it to check constantly whether the speedtest has completed.
# The way it was working before was that "/wait" was implied at the speed.cmd batch which
# basically froze this up. My way on fixing this was... echo whether the command was used

    global linecount # used for -speed
    global SpeedPerformTime

    if message.content.startswith('-speed'):
        speeder = open("inprocess.txt", 'r') # open process txt
        for line in speeder:
            if 'Process' in line: # this would've changed by cmd
                count = open('speeds.csv','r') # counts lines in speed csv
                lines = 0
                for line in count:
                    lines = lines + 1
                count.close
                if lines == linecount: # compares to when run before, if different, don't continue
                    speeder.close
                    print('SPEED TEST REQUESTED BUT DENIED - IN PROCESS')
                    await message.channel.send("> :x: > **I'm still testing speed!**\n Please wait a bit longer.")           
                else: # print results
                    speeder.close
                    downspeed = int(read_cell(lines-1,5))
                    upspeed = int(read_cell(lines-1,6))
                    downspeed = float(downspeed/100000)
                    upspeed = float(upspeed/100000)
                    downspeed = round(downspeed,2)
                    upspeed = round(upspeed,2)
                    await message.channel.send('> :white_check_mark: > **Results**\nPerformed: **' + str(SpeedPerformTime) + '** (South Australia Time)\nServer: **' + read_cell(lines-1, 0) + '**\nPing: **' + read_cell(lines-1,2) + " ms**\nDownload: **" + str(downspeed) + " Mbps**\nUpload: **" + str(upspeed) + " Mbps**\n\n*Conducted using Ookla's Speedtest CLI: https://speedtest.net\nSpeeds are converted from bits to megabits, and rounded to two decimal places.*")
                    speeder = open('inprocess.txt','w')
                    speeder.write('Idle')
                    speeder.close

            elif 'Idle' in line: # would've been set to idle by discord.py
                linecount = 0
                speeder.close
                count = open('speeds.csv','r') # count lines first
                lines = 0
                for line in count:
                    lines = lines + 1
                count.close
                linecount = lines # set line count to compare when run again
                UpdateTime(True) # set time this test was performed
                await message.channel.send('> :bullettrain_side: > **Testing speed...**\nRun this command again in two minutes to see results!')
                print('SPEED TEST REQUESTED:')
                print(os.system('speed.cmd')) # speed.cmd sets as process

######################################################
# CUSTOM ROLE MODULE
#
# Thanks to http://github.com/iwaQwQ for helping me out with this module :)
# His Q-Bot is much more amazing than mine, you should definitely check it.

    global lvl30ID # used for -role and -delrole

    if message.content.startswith('-role'): # assign or edit role
        member = message.author
        print("user has: " + str(member.roles))

        if str(lvl30ID) in str(member.roles): # check if the member has level 30 role


            User = Query()
            result = db.search(User.memberId == member.id)

            if(len(result) == 1): # edit exisiting role
                roleName = ""
                for x in range(0, len(args)-1):
                    roleName = roleName + args[x] + " "

                hexColorMatch = re.search(r'^#(?:[0-9a-fA-F]{3}){1,2}$', args[len(args)-1]) # check if hex can be parsed

                if hexColorMatch:
                    roleColour = discord.Colour(int(args[len(args)-1][1:], 16))
                    print('ROLE CHANGE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' with colour ' + str(roleColour))
                    role = message.guild.get_role(result[0]['roleId'])
                    await role.edit(name=roleName, colour=roleColour)
                    await message.channel.send("> :white_check_mark: > **Role edited**\n<@{0}>, I edited your role **<@&{1}>**".format(message.author.id, role.id))
                else:
                    print('ROLE CHANGE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' without colour change')
                    role = message.guild.get_role(result[0]['roleId'])
                    roleName = roleName + args[len(args)-1]
                    await role.edit(name=roleName)
                    await message.channel.send("> :white_check_mark: > **Role edited**\n<@{0}>, I edited your role **<@&{1}>**".format(message.author.id, role.id))
            else: # assign new role
                roleName = ""
                for x in range(0, len(args)-1):
                    roleName = roleName + args[x] + " "

                hexColorMatch = re.search(r'^#(?:[0-9a-fA-F]{3}){1,2}$', args[len(args)-1]) # check if hex can be parsed

                if hexColorMatch:
                    roleColour = discord.Colour(int(args[len(args)-1][1:], 16))
                    print('ROLE CHANGE REQUESTED for ' + member.name + "#" + member.discriminator + ': ' + str(roleName) + ' with colour ' + str(roleColour))
                    role = await message.guild.create_role(name=roleName, colour=roleColour)
                    await member.add_roles(role)
                    db.insert({'memberId': member.id, 'roleId': role.id})
                    await message.channel.send("> :white_check_mark: > **Role given**\n<@{0}>, I gave you the role **<@&{1}>**".format(message.author.id, role.id))
                else:
                    await message.channel.send("> :x: > **Something went wrong**\n <@{.author.id}>, the colour hex code you entered is incorrect!\nDid you forget the `#` at the start of your hex code?".format(message))
        else:
            await message.channel.send("> :x: > **You can't do that**\nThis is for Level 30+ use only.")

    if message.content.startswith('-delrole'):
        member = message.author
        if str(lvl30ID) in str(member.roles): # check if the member has level 30 role

            User = Query()
            result = db.search(User.memberId == member.id)

            if(len(result) == 1):

                print('ROLE DELETION REQUESTED for ' + member.name + "#" + member.discriminator)

                role = message.guild.get_role(result[0]['roleId'])
                await member.remove_roles(role)
                await message.channel.send("> :white_check_mark: > **Role removed**\n<@{0}>, I removed your custom role.\nDo `-role` to create a new custom role".format(member.id))
            else:
                await message.channel.send("> :x: > **You can't do that**\n<@{0}>, you don't have any custom role!".format(member.id))
        else:
            await message.channel.send("> :x: > **You can't do that**\nThis is for Level 30+ use only.")

######################################################
# PING DISCORD MODULE
#
    if message.content.startswith('-ping'):
        os.system('ping -n 1 discord.com > ping.txt')
        pingmessage = """"""
        ping = open('ping.txt','r')
        await message.channel.send('> :ping_pong: > **Pong!**')
        for line in ping:
            pingmessage = line + """\n"""
        ping.close
        await message.channel.send(str(pingmessage))

######################################################
# GET TIME MODULE
#
    global CurrentTime

    if message.content.startswith('-time'):
        UpdateTime(False)
        await message.channel.send('It is **' + str(CurrentTime) + '**, South Australia Time.')
        

client.run(TOKEN)