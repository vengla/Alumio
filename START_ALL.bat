@echo off
echo ========================================
echo   Alumni Platform - Complete Launcher
echo ========================================
echo.

echo Starting all services...
echo.

REM Start Backend Server
echo [1/2] Starting Backend API Server...
start "Backend API Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

REM Start Web Frontend
echo [2/2] Starting Web Application...
start "Web Frontend" cmd /k "cd web && npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Opening Central Hub in your browser...
echo.
timeout /t 2 /nobreak > nul

REM Open the central hub
start http://localhost:8080

REM Start a simple server for the hub page
echo Starting Central Hub Server...
cd "%~dp0"
start "Central Hub" cmd /k "node hub_server.js"

echo.
echo ========================================
echo   Access Your Applications:
echo ========================================
echo.
echo   Central Hub:  http://localhost:8080
echo   Web App:      http://localhost:3000
echo   Mobile App:   http://localhost:8080/mobile
echo   Backend API:  http://localhost:5000
echo.
echo ========================================
echo Press any key to stop all servers...
pause > nul

REM Close all windows
taskkill /FI "WindowTitle eq Backend API Server*" /T /F
taskkill /FI "WindowTitle eq Web Frontend*" /T /F
taskkill /FI "WindowTitle eq Central Hub*" /T /F
