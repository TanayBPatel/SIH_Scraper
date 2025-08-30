# SIH Data Hub Frontend

A modern, beautiful React frontend for the Smart India Hackathon (SIH) Data Analytics platform, built with Vite, Material-UI, and modern React practices.

## 🚀 Features

- **Modern UI/UX**: Beautiful Material-UI design with responsive layout
- **Dashboard**: Comprehensive overview with statistics and charts
- **Problem Statements**: Advanced data grid with filtering and search
- **Analytics**: Interactive charts and data visualization
- **Data Exports**: CSV export functionality for all data types
- **AI Integration**: Google Gemini AI-powered analysis
- **Data Scraping**: Web scraping controls and monitoring
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Professional UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Recharts** - Beautiful and responsive charts
- **Emotion** - CSS-in-JS styling solution

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main layout with sidebar navigation
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard with statistics
│   ├── Problems.jsx    # Problem statements data grid
│   ├── Analytics.jsx   # Charts and data visualization
│   ├── Exports.jsx     # Data export functionality
│   ├── Scraping.jsx    # Web scraping controls
│   └── AIAnalysis.jsx  # AI-powered analysis interface
├── services/           # API and external services
│   └── apiService.js   # Backend API communication
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running on port 3001

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🔧 Configuration

### API Configuration

The frontend connects to the backend API. Update the API base URL in `src/services/apiService.js`:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_TITLE=SIH Data Hub
```

## 📱 Pages Overview

### 1. Dashboard
- **Statistics Cards**: Total problems, categories, organizations, years
- **Progress Charts**: Top categories and yearly distribution
- **System Status**: Real-time backend connectivity status

### 2. Problem Statements
- **Advanced Data Grid**: Sortable, filterable problem data
- **Search & Filters**: By year, category, organization, text search
- **Export Options**: Download filtered data as CSV
- **Pagination**: Efficient data loading for large datasets

### 3. Analytics
- **Category Analysis**: Bar charts and pie charts for problem categories
- **Trends & Patterns**: Yearly trends and organization participation
- **Distribution Charts**: Difficulty levels and sector distribution
- **Interactive Charts**: Hover effects and responsive design

### 4. Exports
- **Category Exports**: Export problems by specific category
- **Year Exports**: Export problems by SIH edition year
- **Bulk Export**: Download complete dataset
- **File Management**: View and download generated CSV files

### 5. Data Scraping
- **Year Selection**: Scrape specific SIH editions
- **Bulk Operations**: Scrape all available years
- **Progress Monitoring**: Real-time scraping status
- **Best Practices**: Guidelines for optimal scraping

### 6. AI Analysis
- **Natural Language Queries**: Ask questions in plain English
- **Predefined Templates**: Quick analysis templates
- **Gemini Integration**: Google AI-powered insights
- **Chat History**: Track analysis queries and responses

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1976d2) - Main actions and highlights
- **Secondary**: Pink (#dc004e) - Secondary actions
- **Success**: Green - Positive states and confirmations
- **Warning**: Orange - Caution and warnings
- **Error**: Red - Errors and critical states

### Typography
- **Font Family**: Roboto (Google Fonts)
- **Headings**: Bold weights for hierarchy
- **Body Text**: Optimized for readability
- **Responsive**: Adaptive sizing for mobile devices

### Components
- **Cards**: Elevated with subtle shadows and hover effects
- **Buttons**: Rounded corners with hover animations
- **Forms**: Clean inputs with proper validation states
- **Tables**: Responsive data grids with sorting

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile First**: Optimized for small screens
- **Breakpoints**: xs, sm, md, lg, xl
- **Adaptive Layout**: Sidebar collapses on mobile
- **Touch Friendly**: Proper touch targets and gestures

## 🔌 API Integration

### Endpoints Used
- `GET /api/health` - System health check
- `GET /api/stats` - Dashboard statistics
- `GET /api/problems` - Problem statements with pagination
- `GET /api/analytics/*` - Analytics and frequency data
- `GET /api/export/*` - Data export functionality
- `POST /api/scrape/*` - Web scraping operations
- `POST /api/gemini/query` - AI analysis queries

### Error Handling
- **Network Errors**: Graceful fallbacks and user feedback
- **API Errors**: Proper error messages and recovery options
- **Loading States**: Progress indicators and skeleton screens
- **Retry Logic**: Automatic retry for failed requests

## 🚀 Performance Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components load on demand
- **Optimized Bundles**: Vite's fast build optimization
- **Caching**: API response caching and optimization
- **Image Optimization**: Responsive images and lazy loading

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production
```bash
npm run preview
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

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

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Advanced Filters**: More sophisticated search and filtering
- **Data Visualization**: Additional chart types and analytics
- **Mobile App**: React Native companion app
- **Offline Support**: Service worker for offline functionality
- **Multi-language**: Internationalization support
- **Dark Mode**: Theme switching capability
- **Advanced AI**: More sophisticated AI analysis features
