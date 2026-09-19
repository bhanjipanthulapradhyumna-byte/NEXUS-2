@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Installing Wrangler...
  npm install
)
echo.
echo Logging in to Cloudflare if needed...
npx wrangler login
echo.
echo Deploying NEXUS...
npx wrangler deploy
pause
