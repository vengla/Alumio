#!/bin/bash

echo "========================================"
echo "  Alumni Platform - Complete Launcher"
echo "========================================"
echo ""

echo "Starting all services..."
echo ""

# Start Backend Server
echo "[1/2] Starting Backend API Server..."
cd backend
gnome-terminal --title="Backend API Server" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -T "Backend API Server" -e "npm run dev; bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"' 2>/dev/null &
cd ..
sleep 3

# Start Web Frontend
echo "[2/2] Starting Web Application..."
cd web
gnome-terminal --title="Web Frontend" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -T "Web Frontend" -e "npm run dev; bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"' 2>/dev/null &
cd ..
sleep 5

echo ""
echo "========================================"
echo "  All Services Started!"
echo "========================================"
echo ""
echo "Opening Central Hub in your browser..."
echo ""
sleep 2

# Open the central hub
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:8080
elif command -v open > /dev/null; then
    open http://localhost:8080
else
    echo "Please open: http://localhost:8080"
fi

# Start a simple server for the hub page
echo "Starting Central Hub Server..."
python3 -m http.server 8080 &
HUB_PID=$!

echo ""
echo "========================================"
echo "  Access Your Applications:"
echo "========================================"
echo ""
echo "  Central Hub:  http://localhost:8080"
echo "  Web App:      http://localhost:3000"
echo "  Mobile App:   http://localhost:8080/mobile"
echo "  Backend API:  http://localhost:5000"
echo ""
echo "========================================"
echo "Press Ctrl+C to stop all servers..."

# Wait for user interrupt
trap "kill $HUB_PID 2>/dev/null; exit" INT
wait
