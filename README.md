A single shared multiplayer word game (填充題 / fill-in-the-blank poem), built in [Vue 2](https://v2.vuejs.org/) and bundled with [Vite](https://vitejs.dev/). The backend (Socket.IO game state) is a small Express app in `server/`.

Everyone who loads the app joins the same game.

## Hosting locally
You'll need `node` and `npm` installed.

Clone this repo, and within the downloaded directory, run:

``` sh
npm install
npm run dev
```

This runs the Vite dev server (frontend) and the Express/Socket.IO backend together. The frontend listens on port `8008` and proxies `/api` and `/socket.io` requests to the backend on port `8009`, so the whole app behaves as a single origin at `http://localhost:8008`.

For production, `npm run build` produces a static `dist/` bundle, and `npm start` runs the backend in production mode, which also serves `dist/` directly (single port, defaulting to `8008`, configurable via `PORT`).

## Usage
By applying the query parameter `?role=mod`, you gain access to the mod panel — lock/unlock the poem so blanks can't be edited, and reset it back to blank. Knowledge of this flag is currently the only layer of security, so try not to broadcast this information.

Every page load shows a small QR code (top right) pointing back at the app, meant to make it easy to invite people by displaying it on a shared screen.

### QR Codes and `localhost`
Note that if you access the app via `localhost`, the QR code directs devices to `localhost`, which will mean something different for each device. To get around this, access the site via its host's [local IP address](https://www.google.com/search?client=firefox-b-1-d&q=how+to+find+local+ip).
