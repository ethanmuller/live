A codebase to host jackbox-style multiplayer games,
where a moderator can create rooms and players can join

The idea is to make multiplayer games where large numbers of players can join. I
don't know what the upper limit of concurrent players is, so please tell me if
you find out.

The UI is built in [Vue 2](https://v2.vuejs.org/), bundled with [Vite](https://vitejs.dev/). The backend (party API + Socket.IO) is a small Express app in `server/`.

## Hosting locally
You'll need `node` and `npm` installed.

Clone this repo, and within the downloaded directory, run:

``` sh
npm install
npm run dev
```

This runs the Vite dev server (frontend) and the Express/Socket.IO backend together. The frontend listens on port `8008` and proxies `/api`, `/socket.io`, and `/uploads` requests to the backend on port `8009`, so the whole app behaves as a single origin at `http://localhost:8008`, same as before.

For production, `npm run build` produces a static `dist/` bundle, and `npm start` runs the backend in production mode, which also serves `dist/` directly (single port, defaulting to `8008`, configurable via `PORT`).

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

## Known issues
The "Poem" game (the default one you get from the mod panel) is the only one that's actually wired up and working. "Quest", "Masks", and the standalone `/beast` page are earlier, unfinished games — they reference a `Dpad`/`Btn` component pair and the `p5`/`vue-use-sound` packages that were never finished/were removed from this project, so they won't render correctly. This was already true before the Vite migration; nothing here was newly broken by it.
