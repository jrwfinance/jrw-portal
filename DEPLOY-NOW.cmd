@echo off
title JRW Finance — Deploy to Netlify
SET PATH=C:\Program Files\nodejs;%PATH%
echo.
echo  =======================================
echo   JRW Finance — Deploying Both Portals
echo  =======================================
echo.
echo  Make sure you are logged into Netlify:
echo    netlify login
echo.
echo  Deploying broker admin to admin.jrwfinance.com.au ...
cd /d "%~dp0deploy\broker-admin"
npx -y netlify-cli@latest deploy --prod --dir . --site 07baf1be-f624-4dcb-ab41-f0092ed1da02
if %errorlevel% neq 0 (
  echo.
  echo  [!] Broker admin deploy failed. Try: netlify login
  pause
  exit /b 1
)

echo.
echo  Deploying client portal to portal.jrwfinance.com.au ...
cd /d "%~dp0deploy\client-portal"
npx -y netlify-cli@latest deploy --prod --dir . --site 12ea9a97-6846-41c7-98b0-cb5f87d2a93c
if %errorlevel% neq 0 (
  echo.
  echo  [!] Client portal deploy failed.
  pause
  exit /b 1
)

echo.
echo  =======================================
echo   Both sites deployed successfully!
echo   - admin.jrwfinance.com.au
echo   - portal.jrwfinance.com.au
echo  =======================================
echo.
pause
