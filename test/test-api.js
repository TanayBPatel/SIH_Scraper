const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testing SIH Data API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health check: ${healthResponse.data.status}`);
    
    // Test problems endpoint
    console.log('\n2. Testing problems endpoint...');
    const problemsResponse = await axios.get(`${BASE_URL}/problems?limit=5`);
    console.log(`✅ Problems endpoint: ${problemsResponse.data.data.length} problems found`);
    
    // Test stats endpoint
    console.log('\n3. Testing stats endpoint...');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    console.log(`✅ Stats endpoint: ${statsResponse.data.data.totalProblems} total problems`);
    
    // Test export files endpoint
    console.log('\n4. Testing export files endpoint...');
    const exportResponse = await axios.get(`${BASE_URL}/export/files`);
    console.log(`✅ Export files: ${exportResponse.data.data.length} files available`);
    
    console.log('\n🎉 All API tests passed successfully!');
    console.log('🚀 Your SIH Data API is working correctly.');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Make sure the server is running on port 5000.');
      console.log('💡 Start the server with: npm start');
    } else if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Test failed:', error.message);
    }
  }
}

// Run tests
testAPI();
