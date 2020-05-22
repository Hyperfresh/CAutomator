#discord.py
import discord
from discord.ext import commands
from discord.utils import get

#tinydb
from tinydb import TinyDB, Query
db = TinyDB('db.json')

#others
import time # for time...
import platform # for os info
import os #dotenv, running speedtest and os info
import sys # for restarting the bot
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

def readlog(logfile):
    logmessage = """"""
    log = open(logfile,'r')
    for line in log:
        logmessage = logmessage + line + """\n"""
    log.close
    return(logmessage)

linecount = 0
lvl30ID = 547360918930194443

bot = commands.Bot(command_prefix='-')

#the code
client = discord.Client()

UpdateTime(True)

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
        await message.channel.send('> :wave: > **Hello! I am CAutomator, the Calculated Anarchy Automator!**\nI am a bot built by @Hyperfresh#8080, tasked to automate some tasks and make things a little easier on this server!\nYou can find more information on my GitHub: https://github.com/Hyperfresh8080/CAutomator\n Also, thanks to https://github.com/iwa for some errands :)')

######################################################
# HELP MODULE now redirects to the bot's wiki on commands

    if message.content.startswith('-help'):
        await message.channel.send("> :information_source: > **Check here**\nhttps://github.com/Hyperfresh8080/CAutomator/wiki/Commands")

######################################################
# SHUTDOWN MODULE
    if message.content.startswith('-shutdown'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send(':wave: > See ya, ' + str(message.author) + '!')
            await client.change_presence(activity=None,status=discord.Status.offline)
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
                    downspeed = float(read_cell(lines-1,6))
                    upspeed = float(read_cell(lines-1,7))
                    downspeed = float(downspeed/1000000)
                    upspeed = float(upspeed/1000000)
                    downspeed = round(downspeed,2)
                    upspeed = round(upspeed,2)
                    
                    global SpeedPerformTime

                    await message.channel.send('> :white_check_mark: > **Results**\nPerformed: **' + str(SpeedPerformTime) + '** (South Australia Time)\nServer: **' + read_cell(lines-1, 1) + " " + read_cell(lines-1, 2)  + '**\nPing: **' + read_cell(lines-1,5) + " ms**\nDownload: **" + str(downspeed) + " Mbps**\nUpload: **" + str(upspeed) + " Mbps**\n\n*Conducted using Ookla's Speedtest CLI: https://speedtest.net\nSpeeds are converted from bits to megabits, and rounded to two decimal places.*")
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
                print(os.system('sh speed.sh')) # speed.cmd sets as process

######################################################
# CUSTOM ROLE MODULE
#
# Thanks to https://github.com/iwa for helping me out with this module :)

    global lvl30ID # used for -role and -delrole

    if message.content.startswith('-role'): # assign or edit role
        member = message.author
        #print("user has: " + str(member.roles))

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
        if len(args) == 1:
            await message.channel.send('> :ping_pong: > **Ping...**')
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            separator = " "
            pingme = separator.join(args)
            os.system('ping -c 4 ' + str(pingme) + ' > ping.txt')
        else:
            os.system('ping -c 1 discord.com > ping.txt')
        if len(args) == 0:
            await message.channel.send('> :ping_pong: > **Pong!** I recorded ' + str(bot.latency) + ' ms.')
        await message.channel.send('```' + str(readlog('ping.txt')) + '```')
        await client.change_presence(activity=discord.Game('-help'))

######################################################
# GET TIME MODULE
#
    global CurrentTime

    if message.content.startswith('-time'):
        UpdateTime(False)
        await message.channel.send('It is **' + str(CurrentTime) + '**, South Australia Time.')

######################################################
# GET OS MODULE
#      
    if message.content.startswith('-os'):
            await message.channel.send('I am running on **' + str(os.name) + " " + str(platform.system()) + " " + str(platform.release()) + '**.')

######################################################
# UPDATE MODULE
#

    if message.content.startswith('-update'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send('<a:Typing:459588536841011202> > Updating...')
            await client.change_presence(activity=discord.Game('Updating...'),status=discord.Status.idle)
            os.system('sh update.sh > update.log')
            await message.channel.send('```' + str(readlog('update.log')) + '```')
            time.sleep(3)
            await message.channel.send(':red_circle: > Restarting...')
            await client.change_presence(activity=discord.Game('Restarting...'),status=discord.Status.dnd)
            time.sleep(3)
            os.execl(sys.executable, sys.executable, * sys.argv)
        else:
            await message.channel.send(':x: > Only the bot author can do this.')
            
######################################################
# RESTART MODULE
#           
    
    if message.content.startswith('-rb'):
        if str(message.author) == 'Hyperfresh#8080':
            await message.channel.send(':red_circle: > Restarting...')
            await client.change_presence(activity=discord.Game('Restarting...'),status=discord.Status.dnd)
            time.sleep(3)
            os.execl(sys.executable, sys.executable, * sys.argv)
        else:
            await message.channel.send(':x: > Only the bot author can do this.')
            
            

######################################################
# shell
#
    if message.content.startswith('-sh'):
        if str(message.author) == 'Hyperfresh#8080':
            separator = " "
            code = separator.join(args)
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            print(os.system(str(code) + ' > sh.log'))
            try:
                await message.channel.send('```' + str(readlog('sh.log')) + '```')
            except Exception as e:
                await message.channel.send(':x: > Something went wrong when sending the output of the command here. Did it hit the 2000 character limit?\nError:```' + str(e) + "```Here's a copy of what was output:")
                await message.channel.send(file=discord.File('sh.log'))
            await client.change_presence(activity=discord.Game('-help'))
        else:
            await message.channel.send(':x: > Only the bot author can do this.')

######################################################
# Get a file on the HYWS
#

    if message.content.startswith('-file'):
        if str(message.author) == 'Hyperfresh#8080':
            if len(args) > 1:
                await message.channel.send(":x: > More than one argument was provided.")
            else:
                filesize = os.path.getsize(str(args[0]))
                try:
                    await message.channel.send(file=discord.File(str(args[0])))
                except Exception as e:
                    await message.channel.send(":x: > An error occurred when sending this file.\n```" + str(e) + "```")
        else:
            await message.channel.send(':x: > Only the bot author can do this.')

######################################################
# python
#
    if message.content.startswith('-py'):
        if str(message.author) == 'Hyperfresh#8080':
            separator = " "
            code = separator.join(args)
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            try:
                os.system('python3 -c "' + str(code) + '" > code.log')
                try:
                    await message.channel.send('```py\n' + str(readlog('code.log')) + '```')
                except Exception as e:
                    await message.channel.send(':x: > Something went wrong when sending the output of the command here. Did it hit the 2000 character limit?\nError:```' + str(e) + "```Here's a copy of what was output:")
                    await message.channel.send(file=discord.File('code.log'))
            except Exception as e:
                await message.channel.send(":x: > That didn't work.\n\nCode: ```" + str(code) + '```\nError:```' + str(e) + "```")
            await client.change_presence(activity=discord.Game('-help'))
        else:
            await message.channel.send(':x: > Only the bot author can do this.')

######################################################
# powershell
#
    if message.content.startswith('-ps'):
        if str(message.author) == 'Hyperfresh#8080':
            separator = " "
            code = separator.join(args)
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            try:
                os.system('powershell -c "' + str(code) + '" > code.log')
                try:
                    await message.channel.send('```powershell\n' + str(readlog('code.log')) + '```')
                except Exception as e:
                    await message.channel.send(':x: > Something went wrong when sending the output of the command here. Did it hit the 2000 character limit?\nError:```' + str(e) + "```Here's a copy of what was output:")
                    await message.channel.send(file=discord.File('code.log'))
            except Exception as e:
                await message.channel.send(":x: > That didn't work.\n\nCode: ```" + str(code) + '```\nError:```' + str(e) + "```")
            await client.change_presence(activity=discord.Game('-help'))
        else:
            await message.channel.send(':x: > Only the bot author can do this.')

######################################################
# Weather
#
    if message.content.startswith('-weather'):
        if len(args) == 0:
            await message.channel.send(":x: > You didn't specify a location.")
        else:
            await message.channel.send("Getting weather, please wait...")
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            separator = "%20"
            code = separator.join(args)
            print(os.system('curl wttr.in/' + str(code) + '.png > weather.png'))
            await message.channel.send(file=discord.File('weather.png'))
            await client.change_presence(activity=discord.Game('-help'))

######################################################
# Download music from YouTube
#
    if message.content.startswith('-ytdl'):
        if len(args) == 0:
            await message.channel.send(":x: > You didn't specify a video.")
        elif len(args) > 2:
            await message.channel.send(":x: > More than one argument was provided.")
        elif "list" in args:
            await message.channel.send(":x: > This seems to be (linked to) a playlist, which is not supported right now.")
        elif args[1] != "mp3" or "mp4":
            await message.channel.send(":x: > Unrecognised file format. `mp3` or `mp4` only.")
        else:
            await message.channel.send("Downloading now, please wait...")
            await client.change_presence(activity=discord.Game('Busy, please wait...'),status=discord.Status.dnd)
            if args[1] == "mp4":
                print(os.system('rm file.mp3'))
                print(os.system('youtube-dl -o file.mp4 ' + str(args[0]) + ' > sh.log'))
                await message.channel.send("```" + str(readlog('sh.log')) + "```\nTrying to upload...")
                try:
                    await message.channel.send(file=discord.File('file.mp4'))
                    await client.change_presence(activity=discord.Game('-help'))
                except:
                    await message.channel.send(":compression: > Video failed to upload (it's probably too big).\nCompressing using HandBrake to try lower the file size...")
                    print(os.system('rm file_compress.mp4'))
                    print(os.system('HandBrakeCLI -z "Discord Nitro Small 10-20 Minutes 480p30" -i file.mp4 -o file_compress.mp4 > sh.log'))
                    await message.channel.send("```" + str(readlog('sh.log')) + "```\nTrying to upload...")
                    try:
                        await message.channel.send(file=discord.File('file_compress.mp4'))
                        await client.change_presence(activity=discord.Game('-help'))
                    except:
                        await message.channel.send(":x: > File still too large. Must be a really long video.")
                        await client.change_presence(activity=discord.Game('-help'))
            else:        
                print(os.system('rm file.mp3'))
                print(os.system('youtube-dl -x --audio-format mp3 -o file.mp3 ' + str(args[0]) + ' > sh.log'))
                await message.channel.send("```" + str(readlog('sh.log')) + "```\nTrying to upload...")
                try:
                    await message.channel.send(file=discord.File('file.mp3'))
                    await client.change_presence(activity=discord.Game('-help'))
                except:
                    await message.channel.send(":x: > Audio failed to upload (it's probably too big).")
                    await client.change_presence(activity=discord.Game('-help'))



client.run(TOKEN)

