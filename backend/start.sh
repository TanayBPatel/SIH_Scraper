#!/bin/bash

echo "🚀 SIH Data Scraper & Gemini API Backend"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version must be 16 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ .env file created from template"
        echo "📝 Please edit .env file with your MongoDB and Gemini API credentials"
        echo ""
    else
        echo "❌ env.example not found. Please create .env file manually"
        exit 1
    fi
else
    echo "✅ .env file found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if MongoDB is running (optional check)
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB:"
        echo "   mongod"
        echo ""
    fi
else
    echo "⚠️  MongoDB not found. Please ensure MongoDB is installed and running"
    echo ""
fi

echo ""
echo "🎯 Setup complete! Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Start MongoDB (if not already running)"
echo "3. Start the server: npm run dev"
echo "4. Test the API: node test/test-api.js"
echo "5. Start scraping: npm run scrape"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🚀 Happy scraping!"
