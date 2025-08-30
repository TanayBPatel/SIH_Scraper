const axios = require('axios');

const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5173';

async function testBackend() {
  console.log('🧪 Testing Backend...');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ Backend health check:', healthResponse.data);
    
    // Test stats endpoint
    const statsResponse = await axios.get(`${BACKEND_URL}/api/stats`);
    console.log('✅ Backend stats:', `Total problems: ${statsResponse.data.data.totalProblems}`);
    
    // Test problems endpoint
    const problemsResponse = await axios.get(`${BACKEND_URL}/api/problems?limit=3`);
    console.log('✅ Backend problems:', `Retrieved ${problemsResponse.data.data.length} problems`);
    
    return true;
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    return false;
  }
}

async function testFrontend() {
  console.log('\n🧪 Testing Frontend...');
  
  try {
    // Test if frontend is accessible
    const frontendResponse = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend is accessible');
    
    return true;
  } catch (error) {
    console.error('❌ Frontend test failed:', error.message);
    return false;
  }
}

async function testIntegration() {
  console.log('🚀 Testing Full Integration...\n');
  
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  
  console.log('\n📊 Integration Test Results:');
  console.log(`Backend: ${backendOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`Frontend: ${frontendOk ? '✅ Working' : '❌ Failed'}`);
  
  if (backendOk && frontendOk) {
    console.log('\n🎉 Full integration test passed!');
    console.log(`🌐 Frontend: ${FRONTEND_URL}`);
    console.log(`🔧 Backend API: ${BACKEND_URL}/api`);
    console.log('\nYou can now:');
    console.log('1. Open the frontend in your browser');
    console.log('2. Navigate through the different pages');
    console.log('3. View problem statements, analytics, and exports');
    console.log('4. Use the AI analysis features (if Gemini API is configured)');
  } else {
    console.log('\n⚠️  Some components are not working properly.');
    console.log('Please check the error messages above and ensure all services are running.');
  }
}

// Run the test
testIntegration().catch(console.error);
