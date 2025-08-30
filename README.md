# SIH Data Hub - Complete Application

A comprehensive Smart India Hackathon (SIH) Data Analytics platform with a modern React frontend and Node.js backend, featuring web scraping, AI analysis, and advanced data visualization.

## 🏗️ Project Structure

```
research copy/
├── frontend/           # React + Vite frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main application
│   ├── package.json
│   └── README.md
├── backend/            # Node.js + Express backend
│   ├── config/         # Database and app configuration
│   ├── models/         # Sequelize database models
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic services
│   ├── scripts/        # Database and utility scripts
│   ├── exports/        # Generated CSV files
│   ├── server.js       # Main server file
│   └── package.json
└── README.md           # This file
```

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI/UX**: Beautiful Material-UI design with responsive layout
- **Dashboard**: Comprehensive overview with statistics and charts
- **Problem Statements**: Advanced data grid with filtering and search
- **Analytics**: Interactive charts and data visualization using Recharts
- **Data Exports**: CSV export functionality for all data types
- **AI Integration**: Google Gemini AI-powered analysis interface
- **Data Scraping**: Web scraping controls and monitoring
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Backend (Node.js + Express)
- **Web Scraping**: Advanced Cheerio-based SIH website scraper
- **Database**: PostgreSQL with Sequelize ORM
- **API Endpoints**: RESTful API for all frontend operations
- **AI Service**: Google Gemini AI integration for data analysis
- **CSV Export**: Comprehensive data export functionality
- **Rate Limiting**: Intelligent request throttling
- **Error Handling**: Robust error handling and recovery

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Professional UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Recharts** - Beautiful and responsive charts
- **Emotion** - CSS-in-JS styling solution

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - Object-Relational Mapping (ORM)
- **Cheerio** - HTML parsing and manipulation
- **Axios** - HTTP client for web scraping
- **Google Gemini AI** - AI-powered analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL database
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up database (create PostgreSQL database first)
# Update config/database.js with your database credentials

# Initialize database
npm run reset-db

# Start server
npm start
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📊 API Endpoints

### Core Endpoints
- `GET /api/health` - System health check
- `GET /api/stats` - Dashboard statistics
- `GET /api/problems` - Problem statements with pagination
- `GET /api/analytics/*` - Analytics and frequency data

### Export Endpoints
- `GET /api/export/all` - Export all data
- `GET /api/export/category/:category` - Export by category
- `GET /api/export/year/:year` - Export by year
- `GET /api/export/files` - List available export files

### Scraping Endpoints
- `POST /api/scrape/year/:year` - Scrape specific SIH year
- `GET /api/scrape/status` - Scraping operation status

### AI Analysis
- `POST /api/gemini/query` - AI-powered data analysis

## 🔧 Configuration

### Database Configuration
Update `backend/config/database.js`:

```javascript
module.exports = {
  development: {
    username: 'your_username',
    password: 'your_password',
    database: 'sih_database',
    host: 'localhost',
    dialect: 'postgres'
  }
};
```

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```env
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=sih_database
DB_HOST=localhost
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_TITLE=SIH Data Hub
```

## 📱 Frontend Pages

### 1. Dashboard
- Statistics cards with key metrics
- Progress charts for categories and years
- System status and connectivity information

### 2. Problem Statements
- Advanced data grid with sorting and filtering
- Search functionality across all fields
- Export options for filtered data

### 3. Analytics
- Interactive charts and visualizations
- Category analysis with bar and pie charts
- Trend analysis across years
- Organization participation insights

### 4. Exports
- Category-based data export
- Year-based data export
- Bulk export functionality
- File management and downloads

### 5. Data Scraping
- Year selection for targeted scraping
- Bulk operations for all years
- Progress monitoring and status tracking
- Best practices and guidelines

### 6. AI Analysis
- Natural language query interface
- Predefined analysis templates
- Google Gemini AI integration
- Query history and results

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1976d2) - Main actions and highlights
- **Secondary**: Pink (#dc004e) - Secondary actions
- **Success**: Green - Positive states
- **Warning**: Orange - Caution states
- **Error**: Red - Error states

### Components
- **Cards**: Elevated with shadows and hover effects
- **Buttons**: Rounded corners with animations
- **Forms**: Clean inputs with validation
- **Tables**: Responsive data grids

## 📊 Data Scraping

### How It Works
1. **Intelligent Parsing**: Uses Cheerio for HTML parsing
2. **Rate Limiting**: Respects server resources
3. **Error Handling**: Automatic retries and recovery
4. **Data Validation**: Ensures data quality and consistency

### Supported Years
- SIH 2015 through SIH 2025
- Comprehensive problem statement extraction
- Organization and category classification
- Technology stack identification

## 🤖 AI Integration

### Google Gemini AI
- **Natural Language Queries**: Ask questions in plain English
- **Contextual Analysis**: AI understands your dataset
- **Pattern Recognition**: Identifies hidden trends and correlations
- **Intelligent Insights**: Provides actionable recommendations

### Sample Queries
- "Analyze the most common problem categories"
- "What are the key technology trends?"
- "Identify patterns in organization participation"
- "How have problems evolved over the years?"

## 🚀 Performance Features

### Frontend
- **Code Splitting**: Route-based optimization
- **Lazy Loading**: Components load on demand
- **Optimized Bundles**: Vite's fast build system
- **Responsive Design**: Mobile-first approach

### Backend
- **Database Indexing**: Optimized queries
- **Caching**: Response caching strategies
- **Rate Limiting**: Request throttling
- **Connection Pooling**: Database optimization

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm run preview
```

### Docker Deployment
Both frontend and backend include Docker configurations for easy deployment.

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native companion
- **Offline Support**: Service worker implementation
- **Multi-language**: Internationalization
- **Dark Mode**: Theme switching
- **Advanced AI**: More sophisticated analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 📊 Current Status

- ✅ **Backend**: Fully functional with all endpoints working
- ✅ **Frontend**: Complete modern React application
- ✅ **Database**: 801 problem statements stored
- ✅ **Scraping**: Improved Cheerio-based scraper
- ✅ **AI Integration**: Google Gemini working
- ✅ **Exports**: CSV export functionality
- ✅ **Analytics**: Comprehensive data visualization

## 🎯 Getting Started Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure backend environment variables
- [ ] Install backend dependencies and start server
- [ ] Install frontend dependencies and start dev server
- [ ] Test API endpoints
- [ ] Explore frontend features
- [ ] Run data scraping operations
- [ ] Test AI analysis features
- [ ] Export data in various formats

The application is ready for production use with comprehensive features for SIH data analysis and management!
# SIH_Scraper
