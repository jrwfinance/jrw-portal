@echo off
setlocal
echo === JRW Finance - Deploy both portals to Netlify ===
echo.
echo Broker admin: jrw-broker-admin (07baf1be-f624-4dcb-ab41-f0092ed1da02)
echo Client portal: jrw-portal      (12ea9a97-6846-41c7-98b0-cb5f87d2a93c)
echo.
echo This will install netlify-cli if missing, then deploy both sites.
pause

cd /d "%~dp0broker-admin"
echo --- Deploying broker admin ---
npx -y netlify-cli@latest deploy --prod --dir . --site 07baf1be-f624-4dcb-ab41-f0092ed1da02
if errorlevel 1 goto :err

cd /d "%~dp0client-portal"
echo --- Deploying client portal ---
npx -y netlify-cli@latest deploy --prod --dir . --site 12ea9a97-6846-41c7-98b0-cb5f87d2a93c
if errorlevel 1 goto :err

echo.
echo === Both sites deployed ===
pause
exit /b 0

:err
echo.
echo Deploy failed. Run "npx netlify-cli@latest login" first if not logged in, then re-run this.
pause
exit /b 1
