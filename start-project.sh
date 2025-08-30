#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting SIH Data Scraper Project...${NC}\n"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "\n${RED}❌ $service_name failed to start within expected time${NC}"
    return 1
}

# Check if PostgreSQL is running
echo -e "${BLUE}🔍 Checking PostgreSQL...${NC}"
if ! check_port 5432; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running on port 5432${NC}"
    echo -e "${YELLOW}   Starting PostgreSQL...${NC}"
    brew services start postgresql@14 > /dev/null 2>&1
    sleep 3
fi

if check_port 5432; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
    echo -e "${YELLOW}   Please start PostgreSQL manually: brew services start postgresql@14${NC}"
    exit 1
fi

# Check if backend dependencies are installed
echo -e "${BLUE}🔍 Checking backend dependencies...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend
    npm install
    cd ..
else
    echo -e "${GREEN}✅ Backend dependencies are installed${NC}"
fi

# Check if frontend dependencies are installed
echo -e "${BLUE}🔍 Checking frontend dependencies...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
else
    echo -e "${GREEN}✅ Frontend dependencies are installed${NC}"
fi

# Start backend server
echo -e "${BLUE}🚀 Starting backend server...${NC}"
cd backend
if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use. Backend might already be running.${NC}"
else
    npm start &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
fi
cd ..

# Wait for backend to be ready
wait_for_service "http://localhost:3001/api/health" "Backend API"

# Start frontend server
echo -e "${BLUE}🚀 Starting frontend server...${NC}"
cd frontend
if check_port 5173; then
    echo -e "${YELLOW}⚠️  Port 5173 is already in use. Frontend might already be running.${NC}"
else
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
fi
cd ..

# Wait for frontend to be ready
wait_for_service "http://localhost:5173" "Frontend"

# Final status check
echo -e "\n${BLUE}📊 Final Status Check:${NC}"
if check_port 3001; then
    echo -e "${GREEN}✅ Backend API: http://localhost:3001${NC}"
else
    echo -e "${RED}❌ Backend API: Not running${NC}"
fi

if check_port 5173; then
    echo -e "${GREEN}✅ Frontend: http://localhost:5173${NC}"
else
    echo -e "${RED}❌ Frontend: Not running${NC}"
fi

echo -e "\n${GREEN}🎉 Project startup completed!${NC}"
echo -e "${BLUE}📖 Available URLs:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend API: ${GREEN}http://localhost:3001/api${NC}"
echo -e "   API Health: ${GREEN}http://localhost:3001/api/health${NC}"
echo -e "\n${YELLOW}💡 Tips:${NC}"
echo -e "   - Open http://localhost:5173 in your browser"
echo -e "   - Use Ctrl+C to stop all services"
echo -e "   - Check the logs for any errors"

# Keep the script running to maintain the background processes
echo -e "\n${BLUE}🔄 Services are running. Press Ctrl+C to stop all services.${NC}"
trap 'echo -e "\n${YELLOW}🛑 Stopping services...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait
