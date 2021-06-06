/* 
                        PLEASE READ THIS FIRST.

    This command provides a user with the latest commit of CAutomator
    as seen on https://github.com/hyperfresh/CAutomator, as well as
    zipping ALL FILES WITHIN THIS BOT (if it has changed since cloning)
    and providing it to the user in a private DM.

    This command also depends with the 'zip-source.sh' file located at
    the root of CAutomator.

    As stated in Chapter 13 in the AGPL, which CAutomator is licensed on,
    you are to provide users with the source code if you have modified
    the code. This command allows that to happen by providing both the 
    original source code, and your modified source code if available,
    complying with this requirement.

    UNLESS you have read the LICENSE file, and you know what you're doing,
    you should NOT MODIFY this command NOR the 'zip-source.sh' file. Leave
    this file alone to comply with AGPL requirements.

                    READ THE ABOVE BEFORE PROCEEDING.
*/
const { exec } = require('child_process');
const shell = require('shelljs')
const config = require('../../data/config.json')
const pkg = require('../../package.json')
module.exports = {
    commands: 'source',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        let d = config.DIR
        let name = pkg.name
        let ver = pkg.version
        let des = pkg.description
        let defaultErr = 'Seems I can\'t give you my source code at the moment - please DM the bot owner instead.'
        console.log(`${message.author.username}#${message.author.discriminator} requested your source code.`)
        message.channel.send(`This bot is built on CAutomator. The latest source code is available at http://github.com/hyperfresh/CAutomator (the CAutomator GitHub).`);
        message.channel.send(`As CAutomator is licensed under the GNU Affero General Public License (which you can view at https://www.gnu.org/licenses/agpl-3.0.html), you may also see the source code of THIS bot if it has been modified since the latest commit on the CAutomator GitHub.\n> 🗜 > I'll zip up my source code and upload it shortly.`);
        if (!shell.which('zip')) {
            console.warn(`Looks like deb package 'zip' is not installed - please install it when you can!`)
            console.log('This is so I can zip up your source code for distribution, and to comply with AGPL.')
            message.channel.send(defaultErr)
            return
        }
        const promise = new Promise((resolve, reject) => {
            console.log('Removing old zip, if any')
            shell.rm(`${d}/data/${name}_${ver}_source.zip`)
            console.log('Attempting to zip source code.')
            exec(`sh ${d}/zip-source.sh ${d} ${name} ${ver} ${des}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Exec error: ${error.message}`)
                    message.channel.send(defaultErr)
                    return
                }
                if (stderr) {
                    reject(`Stderr error: ${stderr}`)
                    message.channel.send(defaultErr)
                    return
                }
                console.log(`Stdout output: ${stdout}`)
                resolve()
            });
        })
        try {
            promise.then(res => {
                console.log('Attempting to upload the source code to Discord.')
                message.channel.send('> 📤 > **ZIP complete.** Uploading to Discord.')
                message.channel.send('Here\'s the source code.', { files: [`${d}/data/${name}_${ver}_source.zip`] });
            }).catch(err => {
                console.warn(`Something really bad happened. ${err}`)
                message.channel.send(`> 🛑 > Something really bad happened.\nPlease report the following error to my bot owner: \`\`\`${err}\`\`\``)
            });
        } catch (AbortError) {
            console.warn(`Something really bad happened. ${error}`)
            message.channel.send(`> 🛑 > Something really bad happened.\nPlease report the following error to my bot owner: \`\`\`${error}\`\`\``)
            return
        }
    }
}