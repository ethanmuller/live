A codebase to host jackbox-style multiplayer games,
where a moderator can create rooms and players can join

The idea is to make multiplayer games where large numbers of players can join. I
don't know what the upper limit of concurrent players is, so please tell me if
you find out.

The UI is built in [Vue](https://vuejs.org/), using the [NuxtJS](https://nuxtjs.org/) framework

## Hosting locally
You'll need `node` and `npm` installed.

Clone this repo, and within the downloaded directory, run:

``` sh
npm install # this will take a while to run
npm run dev
```

This will start a development server on port `8008`.

## Usage
By applying the query parameter `?role=mod`, you gain the ability to create new parties. Mods can also end parties with the big red "End Party" button. Knowledge of this flag is currently the only layer of security, so try not to broadcast this information.

**If there are no open parties,** the home page displays a message saying something like "There is nothing happening here at the moment. Try refreshing your browser?"
**If there is one open party,** guests arriving on the home page will be automatically redirected into the party.
**If there is more than one open party,** users will see a list of all the parties.
This behavior is meant to nudge users where they're supposed to be.
This behavior does not apply to mods.

By applying the query parameter `?role=screen`, you will display a QR code which contains a URL to join the party the client is in. This is meant to be displayed on a large screen, inviting people to join

### QR Codes and `localhost`
Note that if you access the app via `localhost`, QR codes direct devices to `localhost`, which will mean something different for each device. To get around this, access the site via its host's [local IP address](https://www.google.com/search?client=firefox-b-1-d&q=how+to+find+local+ip).
