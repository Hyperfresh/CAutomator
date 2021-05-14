<div align="center">
  
> Built in Node.js from the ground-up from its [Python ancestor](https://github.com/hyperfresh/CAutomator-Legacy), CAutomator can control custom roles for each user to help users stand out, manage server-side profile cards to help users with IRL identity, find the time and weather across the globe, and manage invites into the server.

# Code quality
## [SonarCloud](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator)
SonarCloud code scanning is also paired with [SonarLint](https://sonarlint.com) in Visual Studio Code.
|Quality Gate|Measures|
|---|---|
|[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=Hyperfresh_CAutomator)](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator)|[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Hyperfresh_CAutomator&metric=ncloc)](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator)<br>[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Hyperfresh_CAutomator&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator)<br>[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Hyperfresh_CAutomator&metric=sqale_index)](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator)|

## Other Code Quality scanners
*\*Better Code does not have an option to make its dashboard publicly viewable. The hyperlink leads to Better Code's main website.*
|[Better Code](https://bettercodehub.com/)\*|[Semmle LGTM](https://lgtm.com/projects/g/Hyperfresh/CAutomator/)|
|---|---|
|[![BCH compliance](https://bettercodehub.com/edge/badge/Hyperfresh/CAutomator?branch=master)](https://bettercodehub.com/)|[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Hyperfresh/CAutomator.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Hyperfresh/CAutomator/context:javascript) [![Total alerts](https://img.shields.io/lgtm/alerts/g/Hyperfresh/CAutomator.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Hyperfresh/CAutomator/alerts/)|

# Security
Security always comes first. While CAutomator is built for one server and a specific purposes, personal data may be stored by cloned running copies of the bot. [Check the security dashboard of this repository](https://github.com/Hyperfresh/CAutomator/security) for more details.
|[SonarCloud](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator)|[Snyk](https://snyk.io/test/github/Hyperfresh/CAutomator)|[CodeQL](https://github.com/Hyperfresh/CAutomator/actions/workflows/codeql-analysis.yml)|
|----------|----|------|
|[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Hyperfresh_CAutomator&metric=security_rating)](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Hyperfresh_CAutomator&metric=bugs)](https://sonarcloud.io/dashboard?id=Hyperfresh_CAutomator)|[![Known Vulnerabilities](https://snyk.io/test/github/Hyperfresh/CAutomator/badge.svg)](https://snyk.io/test/github/Hyperfresh/CAutomator)|[![CodeQL](https://github.com/Hyperfresh/CAutomator/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Hyperfresh/CAutomator/actions/workflows/codeql-analysis.yml)|

</div>

# Features
## Profile system
A common problem within the Calculated Anarchy server is IRL identities. CAutomator fixes this problem with the **CAutomator Profile System**.

The way it used to work was the server #namelist, where people had to manually check the details of each user. Additionally, the namelist would only be updated every so often that when it was used to check the details of a user, it would be severely out of date.

Enter the **CAutomator Profile System**:

![Profile system example](https://media.discordapp.net/attachments/822673098637574184/823117284741611550/unknown.png?width=346&height=585)

The CAutomator profile system is able to show the user's IRL name, pronouns, birthday, Switch friend code, pride badges and interests. It also has the ability to show the user's time and time zone, as well show a brief "about me"!

### Usage
```
-profile register: register your details onto the database.
-profile edit: edit your details.
-profile search: make an advanced search.
-profile help: this, but in embed form.
-profile update: update your username and pronouns.
```
**Edit a profile**

![image](https://user-images.githubusercontent.com/31476608/111900408-5c120b00-8a82-11eb-92b6-c8321167ff4f.png)

**Advanced search**

![image](https://user-images.githubusercontent.com/31476608/111900435-7fd55100-8a82-11eb-9d9d-d37c556b7c3c.png)

*To learn more about the code, [look at the old code](https://github.com/Hyperfresh/CAutomator-Legacy/blob/61fff2e08117440ec8b0cda4a2126d0b32b5db43/bot.py#L1037) or look at `modules/speciality/profile.js`.*

## Custom role management
A key reason for the creation of CAutomator is custom role management. On the Calculated Anarchy server, users who reached Level 30+ would be eligible for a custom role on the server. This process used to be done manually, [before I created CAutomator](https://github.com/hyperfresh/cautomator-legacy) and [before iwa helped me with the code](https://github.com/iwa).

In the Node.js rewrite, **CAutomator** can assign and edit roles, and position them automatically - from first user who reached Level 30+ afterwards.

![Custom role example](https://user-images.githubusercontent.com/31476608/111900062-43a0f100-8a80-11eb-9a00-0c64411e65f8.png)

### Usage
*You need Level 30+ to run this command.*
- `-role <hex colour> <role name>` (example: `-role 00ff00 Hy's Role`)
- `-role remove`

*To learn more about the code, [look at the old code](https://github.com/Hyperfresh/CAutomator-Legacy/blob/61fff2e08117440ec8b0cda4a2126d0b32b5db43/bot.py#L573) or look at `modules/speciality/role.js`.*

## Time and weather
The Calculated Anarchy server has members from all around the globe: some in Europe, some in America, and most of us in Australia. CAutomator uses `weather-js` to fetch the weather around the globe, and uses `luxon` and `moment-timezone` to fetch time around the globe.

![Weather example](https://user-images.githubusercontent.com/31476608/111900171-e9546000-8a80-11eb-8b6e-7776f8b0dab1.png)
![Time example](https://user-images.githubusercontent.com/31476608/111900178-f3765e80-8a80-11eb-8c6c-d42a65aac6ea.png)

### Usage
- `-weather [location]` (example: `-weather Adelaide`)
- `-time [tz]` (example: `-time Australia/Adelaide`, uses `moment-timezone` and [the tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) to verify timezone)

*To learn more about the code, look at:*
- [*original code for weather*](https://github.com/Hyperfresh/CAutomator-Legacy/blob/61fff2e08117440ec8b0cda4a2126d0b32b5db43/bot.py#L195)
- *`modules/utility/weather.js`*
- *`modules/utility/time.js`*

## Invite management
CAutomator can manage invites into the server, by limiting who can create an invite, how many the invite can allow in, and how long they have to wait until they can invite another user.

![Invite example](https://user-images.githubusercontent.com/31476608/111900331-e5750d80-8a81-11eb-97c4-c706699dc7f0.png)

### Usage
*You need Level 10+ to run this command. You also need DMs open, and you can only run this command once at least every 24 hours.*
`-invite`

*To learn more about the code, look at `modules/speciality/invite.js`*

## More features are coming soon!
