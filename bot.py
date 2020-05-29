#discord.py
import discord
from discord.ext import commands
from discord.utils import get

#tinydb
from tinydb import TinyDB, Query

#other modules
import platform # for os info
import os #dotenv and os info

import sys # for restarting the bot

import subprocess

from dotenv import load_dotenv #dotenv thing which has discord token
load_dotenv()

# Variable declaration
db = TinyDB('db.json')
TOKEN = os.getenv('DISCORD_TOKEN') # CHECK YOUR .env FILE!
CurrentTime = ""
SpeedPerformTime = ""
results = {}
testing = False
convert = ""
downloading = False
upload = []
ytdl_options = []
getbom = False
notbom = False

import csv #for reading speedtest results
import re #regular expression

# So commands don't hang the bot.
import asyncio
from concurrent.futures import ThreadPoolExecutor

def read_cell(row, col): # Getting name of entry. Thanks @GradyDal on Repl.it
	with open('speeds.csv', 'r') as f:
		data=list(csv.reader(f))
		return(data[int(row)][int(col)])

def crashcrash(): # closes the program (yeah, not intuitive.)
    exit()
    crashcrash()

import time
def UpdateTime(speed):
    global CurrentTime
    global SpeedPerformTime
    CurrentTime = (time.strftime("%d %b %Y %H:%M:%S", time.localtime()))
    if speed == True:
        SpeedPerformTime = CurrentTime

import speedtest
def TestSpeed():
    global results
    UpdateTime(True)
    s = speedtest.Speedtest()
    s.get_best_server()
    s.download(threads=None)
    s.upload(threads=None)
    s.results.share()
    results = s.results.dict()

import glob
def ytdl():
    global upload
    global ytdl_options

    dltype = str(ytdl_options[1])
    video = str(ytdl_options[0])

    os.system('rm -rf ~/CAutomator/yt-pl')
    os.system('rm ~/CAutomator/output.*')
    if dltype == "list":
        print("converting list to mp3 zips")
        subprocess.run(['youtube-dl','-x','-o','~/CAutomator/yt-pl/%(title)s.%(ext)s',str(video)])  
        print("zipping")      
        subprocess.run(['zip','-r','~/CAutomator/output.zip','"~/CAutomator/yt-pl/"']) 
        print("complete")       
    elif dltype == "aud":
        print("downloading to mp3")
        subprocess.run(['youtube-dl','--no-playlist','-x','--audio-format','mp3','-o','~/CAutomator/output.%(ext)s',str(video)])
        print("complete")
        upload = glob.glob('/home/hyperfresh/CAutomator/output.*')   
    else:
        print("downloading to mp4")
        subprocess.run(['youtube-dl','--no-playlist','-o','~/CAutomator/output.%(ext)s',str(video)])   
        print("complete")     
        upload = glob.glob('/home/hyperfresh/CAutomator/output.*')
        
def conv():
    global upload
    global ytdl_options

    dltype = str(ytdl_options[1])
    
    os.system('rm ~/CAutomator/compress.mp4 ~/CAutomator/audio.mp3')
    if dltype == "aud":
        print("converting to mp3")
        subprocess.run(['ffmpeg','-i',str(upload[0]),'-map','0:a:0','-b:a','96k','/home/hyperfresh/CAutomator/audio.mp3'])
        print("completed")
    else:
        print("compressing")
        subprocess.run(['HandBrakeCLI','-Z',"Discord Tiny 5 Minutes 240p30",'-i',str(upload[0]),'-o','/home/hyperfresh/CAutomator/compress.mp4'])
        print("completed")

import imgkit
def wttr():
    global location
    global getbom
    global notbom
    print("getting weather")

    au_cities = ['adelaide','perth','sydney','darwin','canberra','melbourne','brisbane','hobart']
    au_states = ['sa','wa','nsw','nt','act','vic','qld','tas']
    notbom = False

    if getbom == True:
        if location in au_cities:
            print("au location detected")
            forecast = au_cities.index(location)
            imgkit.from_url('http://bom.gov.au/'+str(au_states[forecast])+'/forecasts/'+str(au_cities[forecast])+'.shtml', 'weather.png')
            print("got results from bom")
            return
        elif location in au_states:
            print("au location detected")
            forecast = au_states.index(location)
            imgkit.from_url('http://bom.gov.au/'+str(au_states[forecast])+'/forecasts/'+str(au_cities[forecast])+'.shtml', 'weather.png')
            print("got results from bom")
            return
        else:
            notbom = True
            return

    subprocess.run(['curl','wttr.in/'+str(location)+'.png','--output','weather.png'])
    print("completed")


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
    global SpeedPerformTime
    global results
    global testing

    if message.content.startswith('-speed'):
        if testing == False:
            testing = True
            await message.channel.send('> :bullettrain_side: > **Testing speed...**\nI\'ll send results shortly!')
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(ThreadPoolExecutor(), TestSpeed)
            downspeed = float((results['download'])/1000000)
            upspeed = float((results['upload'])/1000000)
            downspeed = round(downspeed,2)
            upspeed = round(upspeed,2)
            await message.channel.send('> :white_check_mark: > **Results**\nPerformed: **' + str(SpeedPerformTime) + '** (South Australia Time)\nServer: **' + str(results['server']['sponsor']) + " " + str(results['server']['name'])  + '**\nPing: **' + str(results['ping']) + " ms**\nDownload: **" + str(downspeed) + " Mbps**\nUpload: **" + str(upspeed) + " Mbps**\n\n*Conducted using Ookla's Speedtest CLI: https://speedtest.net\nSpeeds are converted from bits to megabits, and rounded to two decimal places.*")
            testing = False
        else:
            await message.channel.send(':x: > I\'m still testing speed! Please be patient.')


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
            print('Preparing to restart...')
            time.sleep(3)
            print('Restarting...')
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
                await message.channel.send("Attempting to upload...")
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
    global location
    global getbom
    global notbom

    if message.content.startswith('-weather'):
        if len(args) == 0:
            await message.channel.send(":x: > You didn't specify a location.")
        else:
            await message.channel.send("Getting weather, please wait...")
            separator = "%20"
            location = separator.join(args)
            loop = asyncio.get_event_loop()
            getbom = False
            if str(args[-1]) == "-bom":
                getbom = True
                location = str(args[0])
            await loop.run_in_executor(ThreadPoolExecutor(), wttr)
            if notbom == True:
                await message.channel.send("This isn't a location where I can get weather from BOM.")
                return
            try:
                await message.channel.send(file=discord.File('weather.png'))
            except Exception as e:
                await message.channel.send(":x: > Can't get weather. Is http://wttr.in out of queries?\n\nError: ```" + str(e) + "```")

######################################################
# Download music from YouTube
#
    global upload
    global downloading
    global ytdl_options
    global convert

    if message.content.startswith('-ytdl'): # -ytdl <video> <mp4/mp3>
        if downloading == True: await message.channel.send(":x: > In the process of downloading something. Please try again later.")
        if len(args) > 2: await message.channel.send(":x: > Too many arguments provided.")
        else:
            downloading = True
            if len(args) == 1: args = [str(args[0]), "mp3"]
            if("list" in str(args[0]) and "watch" not in str(args[0])):
                await message.channel.send("Downloading playlist as a zip of MP3s.")
                await client.change_presence(activity=discord.Game(name='Downloading...'))
                ytdl_options = [str(args[0]),'list']
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(ThreadPoolExecutor(), ytdl)
                await client.change_presence(activity=discord.Game(name='Uploading...'))
                await message.channel.send("Downloaded playlist. Uploading to Discord...")
                try:
                    await message.channel.send(file=discord.File('output.zip'))
                except Exception as e:
                    await message.channel.send(":x: > Upload failed. The ZIP might be too big to upload here.\n\nError: ```" + str(e) + "```")
                await client.change_presence(activity=discord.Game(name='-help'))
                downloading = False
            elif str(args[1]) == "mp3":
                await message.channel.send("Downloading video as audio.")
                await client.change_presence(activity=discord.Game(name='Downloading...'))
                ytdl_options = [str(args[0]),'aud']
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(ThreadPoolExecutor(), ytdl)
                #await message.channel.send("Converting audio to mp3...")
                #await client.change_presence(activity=discord.Game(name='Converting...')) # Don't need the convert anymore
                #await loop.run_in_executor(ThreadPoolExecutor(), conv)
                await message.channel.send("Uploading to Discord...")
                await client.change_presence(activity=discord.Game(name='Uploading...'))
                print("attempting to upload")
                try:
                    print("upload")
                    await message.channel.send(file=discord.File('output.mp3'))
                    print("done")
                except Exception as e:
                    print("fail")
                    await message.channel.send(":x: > Upload failed. The file might be too big to upload here.\n\nError: ```" + str(e) + "```")
                    print("done")
                await client.change_presence(activity=discord.Game(name='-help'))
                downloading = False
            else:
                await message.channel.send("Downloading and compressing video.")
                await client.change_presence(activity=discord.Game(name='Downloading...'))
                ytdl_options = [str(args[0]),'vid']
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(ThreadPoolExecutor(), ytdl)
                await message.channel.send("Compressing video...")
                await client.change_presence(activity=discord.Game(name='Compressing...'))
                await loop.run_in_executor(ThreadPoolExecutor(), conv)
                await message.channel.send("Uploading to Discord...")
                await client.change_presence(activity=discord.Game(name='Uploading...'))
                try:
                    await message.channel.send(file=discord.File('compress.mp4'))
                except Exception as e:
                    await message.channel.send(":x: > Upload failed. The file might be too big to upload here.\n\nError: ```" + str(e) + "```")
                await client.change_presence(activity=discord.Game(name='-help'))
                downloading = False
                
client.run(TOKEN) #the bot that runs it all