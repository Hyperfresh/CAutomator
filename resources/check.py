log = open('check.log','w')
info = """
          _
     /\__| |_/\ 
     \   ___  / ___                 _                                     _
   /\/  /   \  /   \              _| |_                                 _| |_
   \   /      /  .  \     _   _  |_   _|  _____   _________   _____ _  |_   _|  _____   _____
   /   \____ /  /_\  \   | | | |   | |   |  _  | |  _   _  | |  _  | |   | |   |  _  | |  ___|
   \/\_____ /  /___\  \  | |_| |   | |   | |_| | | | | | | | | |_|   |   | |   | |_| | | |
           /__/     \__\ |_____|   |_|   |_____| |_| |_| |_| |_____|_|   |_|   |_____| |_|
                                     __       __  __      __ ___      __
                                    |   |__| |__ |   |_/ |__  |  |   |__
                                    |__ |  | |__ |__ | \ |   _|_ |__ |__

CAutomator - the custom-built Discord bot, coded in Python
Copyright (C) 2020 Hyperfresh | https://github.com/Hyperfresh8080/CAutomator/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

"""
print(info)
print('\nPlease wait while requirements for running CAutomator are being checked.\n')
import os
import platform
import time
log.write(' -- START OF LOG -- \n')
log.write(time.strftime("%d %b %Y %H:%M:%S", time.localtime())+"\n")

log.write(str(os.name)+" "+str(platform.system())+" "+str(platform.release())+"\n")

nocolour = False
try:
    from termcolor import colored
except Exception as e:
    log.write("WARN > Termcolor import error. Detail:\n"+str(e)+'\n')
    nocolour = True
    print('WARN > It seems that the termcolor pypi is not installed, or you have a problem with your termcolor install.')
    print('However, termcolor is not a required library for CAutomator and is only used for this check file.')
    print('Checking can continue but coloured output will not be used for the duration of the check.\nMore details are in log. Check will now continue.')

def message(t,s): # null = none, 0 = done, -1 = fatal, 1 = warn
    if t == None:
        print(s)
    else:
        if t == 0: t = "DONE"
        elif t == -1: t = "FATAL"
        elif t == 1: t = "WARN"
        else: return

        if nocolour == True:
            print(str(t)+" > "+str(s))
        else:
            if t == "DONE":
                print(colored(str(t),"green")+" > "+str(s))
            elif t == "FATAL":
                print(colored(str(t),"red")+" > "+str(s))
            elif t == "WARN":
                print(colored(str(t),"yellow")+" > "+str(s))
            else: return

    

if os.name == "nt":
    log.write("FATAL > Attempted to run on Windows system.\n")
    message(-1,"You are running Windows, which is not supported. Please use Windows Subsystem for Linux.\nFor install instructions, see http://aka.ms/wsl. Check CAN NOT CONTINUE and will now STOP.")
    log.write("\n -- END OF LOG -- ")
    log.close
    input("Press enter to exit.")
    exit()

try:
    import discord
    log.write('discord.py was imported\n')
except Exception as e:
    log.write("FATAL > Discord.py import error. Detail:\n"+str(e))
    message(-1,"The discord library could not be imported. This library may not be install, so please install it using pip.\nMore details are in log. Check CAN NOT CONTINUE and will now STOP.")
    log.write("\n -- END OF LOG -- ")
    log.close
    input("Press enter to exit.")
    exit()

try:
    import dotenv
    log.write('dotenv was imported\n')
except Exception as e:
    log.write("FATAL > Dotenv import error. Detail:\n"+str(e))
    message(-1,"The dotenv library could not be imported. This library may not be installed, so please install it using pip.\nMore details are in log. Check CAN NOT CONTINUE and will now STOP.")
    log.write("\n -- END OF LOG -- ")
    log.close
    input("Press enter to exit.")
    exit()

try:
    import tinydb
    log.write('tinydb was imported\n')
except Exception as e:
    log.write("WARN > TinyDB import error. Detail:\n"+str(e))
    message(1,"The tinydb library could not be imported. The -role command may not function.\nMore details are in log. Check will now continue.")

try:
    import imgkit
    log.write('imgkit was impoted\n')
    message(1,"The imgkit library requires an external package. A check for this package may be performed after the initial library check.")
except Exception as e:
    log.write("WARN > imgkit import error. Detail:\n"+str(e))
    message(1,"The imgkit library could not be imported. Some commands may not function.\nMore details are in log. Check will now continue.")

try:
    import speedtest
    log.write('speedtest was imported\n')
except Exception as e:
    log.write("WARN > speedtest import error. Detail:\n"+str(e))
    message(1,"The speedtest library could not be imported. The -speed command may not function.\nMore details are in log. Check will now continue.")

log.write("DONE > Initial library check.\n")
message(0,"Initial library check complete. A package check can now be performed.")
print("The package check MAY install missing packages for you, but this may require your su password.\n")
def check():
    e = input("To perform package check, please enter 'pack'.\nTo skip package check and close this program, please enter 'stop'. ")
    if e == "stop":
        log.write("\n -- END OF LOG -- ")
        log.close
        print("Exiting.")
        exit()
    elif e == "pack": return
    else: check()
check()

if platform.system() == "Darwin":
    try:
        os.remove("brew.log")
    except: pass
    os.system("which brew >> brew.log")
    print("\n")
    message(1," THIS IS IMPORTANT. Do you see a directory or 'no brew'?")
    def check2():
        e = input("enter 'dir' or 'not' ")
        if e == "not":
            message(-1,"You indicated that 'brew' does not exist. Please install Homebrew at http://brew.sh.\nCheck CAN NOT CONTINUE and will now STOP.")
            log.write("FATAL > User indicated no Homebrew\n")
            log.write("\n -- END OF LOG -- ")
            log.close
            exit()
        elif e == "dir": return
        else: check2()
    check2()
    print("Brew will now check for installed packages.")
    message(1,"If there's no output after indicating which formulae/cask brew is looking for, it's probably installed!")

    print("Checking for cask wkhtmltopdf. Required for library imgkit.")
    os.system('brew cask list wkhtmltopdf >> brew.log')
    log.write("BREW > wkhtmltopdf\n")
    def check3():
        e = input("install this formulae/cask? (y/n) ")
        if e not in "ynYN": check3()
        else:
            if e in "yY": e = True
            else: e = False 
            return e
    if check3() == True:
        log.write("BREW > wkhtmltopdf installing\n")
        os.system("brew cask install wkhtmltopdf >> brew.log")
    else:
        log.write("BREW > wkhtmltopdf not installing\n")

    print("Checking for formulae youtube-dl. Required for command -ytdl.")
    os.system('brew list youtube-dl >> brew.log')
    log.write("BREW > youtube-dl\n")
    if check3() == True:
        log.write("BREW > youtube-dl installing\n")
        os.system("brew install youtube-dl >> brew.log")
    else:
        log.write("BREW > youtube-dl not installing\n")
    
    print("Checking for formulae handbrake. Required for command -ytdl.")
    os.system('brew list handbrake >> brew.log')
    os.system("mdfind -name 'kMDItemFSName==\"HandBrake.app\"' >> brew.log")
    log.write("BREW > handbrake\n")
    message(1,"If you have installed the HandBrake GUI from http://handbrake.fr,\nyou may interfere with your current HandBrake installation\nby installing the brew version of HandBrake. Proceed at own risk!")
    if check3() == True:
        log.write("BREW > handbrake installing\n")
        os.system("brew install handbrake >> brew.log")
    else:
        log.write("BREW > handbrake not installing\n")
    
    print("Checking for formulae git. Required for command -update.")
    os.system('brew list git >> brew.log')
    log.write("BREW > git\n")
    if check3() == True:
        log.write("BREW > git installing\n")
        os.system("brew install git >> brew.log")
    else:
        log.write("BREW > git not installing\n")

    print("Checking for formulae python3. Required for command -py.")
    os.system('brew list python3 >> brew.log')
    log.write("BREW > python3\n")
    if check3() == True:
        log.write("BREW > python3 installing\n")
        os.system("brew install python3 >> brew.log")
    else:
        log.write("BREW > python3 not installing\n")
    
    print("Checking for cask powershell. Required for command -ps.")
    os.system('brew cask list powershell >> brew.log')
    log.write("BREW > powershell\n")
    if check3() == True:
        log.write("BREW > powershell installing\n")
        os.system("brew cask install powershell >> brew.log")
    else:
        log.write("BREW > powershell not installing\n")

elif platform.system() == "Linux":
    message(1," THIS IS IMPORTANT. Are you using Ubuntu/Debian?")
    def check2():
        e = input("enter 'y' or 'n' ")
        if e in 'nN':
            message(-1,"You indicated that you're not using Ubuntu/Debian. Check cannot install packages for you.")
            message(1,"Please install the following packages: [ 'wkhtmltopdf', 'youtube-dl', 'git', 'python3', 'powershell' ].")
            log.write('FATAL > User indicated non-Debian distro\n')
            log.write("\n -- END OF LOG -- ")
            log.close
            input("Press enter to exit.")
            exit()
        elif e in 'Yy': return
        else: check2()
    check2()
    try:
        os.remove("apt.log")
    except: pass
    print("Apt will now update package list.")
    os.system('sudo apt update >> apt.log')
    print("Apt will now check for installed packages.")
    message(1,"If there's no output after indicating which package apt is looking for, it's probably installed!")
    print("Checking for package wkhtmltopdf. Required for library imgkit.")
    os.system('dpkg -l wkhtmltopdf >> apt.log')
    log.write("APT > wkhtmltopdf\n")
    def check3():
        e = input("install this package? (y/n) ")
        if e not in "ynYN": check3()
        else:
            if e in "yY": e = True
            else: e = False 
            return e
    if check3() == True:
        log.write("APT > wkhtmltopdf install redirected\n")
        import webbrowser
        webbrowser.open('https://wkhtmltopdf.org/downloads.html')
    else:
        log.write("APT > wkhtmltopdf not installing\n")

    print("Checking for package youtube-dl. Required for command -ytdl.")
    os.system('dpkg -l youtube-dl >> apt.log')
    log.write("APT > youtube-dl\n")
    if check3() == True:
        log.write("APT > youtube-dl installing\n")
        os.system("sudo apt -y install youtube-dl >> apt.log")
    else:
        log.write("APT > youtube-dl not installing\n")
    
    print("Checking for package handbrake. Required for command -ytdl.")
    os.system('dpkg -l handbrake-cli >> apt.log')
    log.write("APT > handbrake\n")
    if check3() == True:
        log.write("APT > handbrake installing\n")
        os.system("sudo apt -y install handbrake-cli >> apt.log")
    else:
        log.write("APT > handbrake not installing\n")
    
    print("Checking for package git. Required for command -update.")
    os.system('dpkg -l git-all >> apt.log')
    log.write("APT > git\n")
    if check3() == True:
        log.write("APT > git installing\n")
        os.system("sudo apt -y install git-all >> apt.log")
    else:
        log.write("APT > git not installing\n")

    print("Checking for package python3. Required for command -py.")
    os.system('dpkg -l python3 >> apt.log')
    log.write("APT > python3\n")
    if check3() == True:
        log.write("APT > python3 installing\n")
        os.system("sudo apt -y install python3 >> apt.log")
    else:
        log.write("APT > python3 not installing\n")
    
    print("Checking for snap powershell. Required for command -ps.")
    os.system('snap list powershell >> snap.log')
    log.write("SNAP > powershell\n")
    if check3() == True:
        log.write("SNAP > powershell installing\n")
        os.system("snap install powershell-classic >> snap.log")
    else:
        log.write("SNAP > powershell not installing\n")
else:
    message(-1,"Check has concluded that you are not running a *nix or nt system, and cannot install packages for you.")
    message(-1,"Check will also assume that you're running an OS that CAutomator may not support. Please proceed at own risk.\n")
    message(1,"Please install the following packages: [ 'wkhtmltopdf', 'youtube-dl', 'git', 'python3', 'powershell' ].")
    log.write('FATAL > Check indicated non-normal OS\n')
    log.write("\n -- END OF LOG -- ")
    log.close
    input("Press enter to exit.")
    exit()

message(0,"Check has completed.")
log.write('All checks completed.\n')
log.write("\n -- END OF LOG -- ")
log.close
input("Press enter to exit.")
exit()