<div align="center">
  <p align="center">
    <img src="https://github.com/Hyperfresh/CAutomator-Legacy/blob/main/resources/logo.png?raw=true" alt="logo"/>
  </p>
</div>

**CAutomator Legacy** is an unsupported Discord bot coded in Python, which has now been succeeded by [CAutomator (Node.js)](https://github.com/hyperfresh/cautomator).
CAutomator Legacy managed user profile cards and custom roles, fetched the weather, got comments from a Google Doc, fetched Minecraft Skins, downloaded videos and did speedtests.
However, due to the limitations of the Python wrapper of the Discord API, CAutomator Legacy was rewritten in Node.js from the ground up to create the new CAutomator.

The new version of CAutomator provides enhanced stability and reliability, and brings more features to the table than what was possible in the Python version of CAutomator, as well as being easily managable and highly configurable.

# Features
## Profile system *(before Node.js rewrite)*
A common problem within the Calculated Anarchy server is IRL identities. CAutomator Legacy fixed this problem with the **CAutomator Profile System**.

The way it used to work was the server #namelist, where people had to manually check the details of each user. Additionally, the namelist would only be updated every so often that when it was used to check the details of a user, it would be severely out of date.

Enter the **CAutomator Legacy Profile System**:
![profile system example](https://user-images.githubusercontent.com/31476608/111932427-4bf33d80-8b0d-11eb-9f5a-8ec408d5269d.png)

The CAutomator Legacy profile system is able to show the user's IRL name, pronouns, birthday, Switch friend code, as well show a brief "about me" of the user. The new version of CAutomator is able to show the timezone of a user, pride and interest badges, as well as a bio image.

*To learn more about how the module worked before the rewrite, [look here.](https://github.com/Hyperfresh/CAutomator-Legacy/blob/61fff2e08117440ec8b0cda4a2126d0b32b5db43/bot.py#L1037).*

## Custom role management
A key reason for the creation of CAutomator is custom role management. On the Calculated Anarchy server, users who reached Level 30+ would be eligible for a custom role on the server. This process used to be done manually, [before I created CAutomator](https://github.com/hyperfresh/cautomator-legacy) and [before iwa helped me with the code](https://github.com/iwa).

**CAutomator Legacy** could assign and edit roles for Level 30+ users. The way the module works in Python is similar to the Node.js rewrite, however, the rewrite is also able to position users automatically - from first user who reached Level 30+ afterwards.

![Custom role example](https://user-images.githubusercontent.com/31476608/111900062-43a0f100-8a80-11eb-9a00-0c64411e65f8.png)

*To learn more about the how the module worked before the rewrite, [look here.](https://github.com/Hyperfresh/CAutomator-Legacy/blob/61fff2e08117440ec8b0cda4a2126d0b32b5db43/bot.py#L573)

## Weather
The Calculated Anarchy server has members from all around the globe: some in Europe, some in America, and most of us in Australia. CAutomator Legacy used `wttr.in` via `curl` to fetch global weather and `bom.gov.au` via `imgkit` to fetch national weather.

![wttr.in example](https://user-images.githubusercontent.com/31476608/111933462-71814680-8b0f-11eb-93c2-d449d1432297.png)
![bom.gov.au example](https://user-images.githubusercontent.com/31476608/111933506-878f0700-8b0f-11eb-8414-87580ee372f2.png)

The node.js rewrite is more effecient in grabbing the weather by using the `weather-js` npm module, and can also fetch the time around the globe via `luxon` and `moment-timezone`, which the original bot can't do.

## Minecraft skins
CAutomator Legacy could fetch Minecraft skins. Self-explanatory.

![Minecraft skin example](https://user-images.githubusercontent.com/31476608/111933687-dfc60900-8b0f-11eb-9dc3-4a4a33a5e4cb.png)

##
