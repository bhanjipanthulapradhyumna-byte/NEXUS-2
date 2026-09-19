# NEXUS — Cloudflare Wrangler Deploy

This is a **Cloudflare Workers + Static Assets** project. It is ready to deploy directly with Wrangler; GitHub is not required.

## Windows — easiest deployment

Open Command Prompt or PowerShell in this folder and run:

```bash
npm install
npx wrangler login
npx wrangler deploy
```

Or double-click `deploy.bat`.

After deployment, Wrangler prints the live `workers.dev` URL.

## Local preview

```bash
npm install
npx wrangler dev
```

## Project structure

```text
package.json
wrangler.jsonc
src/
  index.js
public/
  index.html
  styles.css
  app.js
  assets/
    phoenix.png
```

## Cloudflare configuration

- Worker name: `nexus-ai`
- Entry point: `src/index.js`
- Static assets: `public/`
- API endpoint: `/api/chat`
- `workers.dev`: enabled
- SPA fallback: enabled

## Important

The UI is functional, but the `/api/chat` endpoint currently returns a placeholder response. Add your AI provider server-side and store its key as a Worker secret. Never put an AI API key, OAuth secret, or plaintext password in `public/`.

Example secret:

```bash
npx wrangler secret put AI_API_KEY
```

Real Google authentication and production account/session storage still need a proper authentication/backend integration.
