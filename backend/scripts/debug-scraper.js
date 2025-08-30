const axios = require('axios');
const cheerio = require('cheerio');

async function debugSIHWebsite() {
  try {
    console.log('🔍 Debugging SIH website structure...');
    
    const url = 'https://sih.gov.in/sih2024PS';
    console.log(`📡 Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 30000
    });
    
    console.log(`✅ Response status: ${response.status}`);
    console.log(`📏 Content length: ${response.data.length} characters`);
    
    const $ = cheerio.load(response.data);
    
    // Check for common elements
    console.log('\n🔍 Checking for common elements:');
    console.log(`- <title>: ${$('title').text()}`);
    console.log(`- <h1>: ${$('h1').length} found`);
    console.log(`- <h2>: ${$('h2').length} found`);
    console.log(`- <h3>: ${$('h3').length} found`);
    console.log(`- <p>: ${$('p').length} found`);
    console.log(`- <div>: ${$('div').length} found`);
    console.log(`- <table>: ${$('table').length} found`);
    console.log(`- <ul>: ${$('ul').length} found`);
    console.log(`- <li>: ${$('li').length} found`);
    
    // Look for problem statement related content
    console.log('\n🔍 Looking for problem statement content:');
    const problemElements = $('*').filter((i, el) => {
      const text = $(el).text();
      return text.includes('Problem') || text.includes('Statement') || text.includes('SIH');
    });
    
    console.log(`Found ${problemElements.length} elements containing problem/statement/SIH text`);
    
    if (problemElements.length > 0) {
      console.log('\n📋 First few problem-related elements:');
      problemElements.slice(0, 5).each((i, el) => {
        const text = $(el).text().trim().substring(0, 200);
        console.log(`${i + 1}. ${text}...`);
      });
    }
    
    // Check for specific classes or IDs
    console.log('\n🔍 Checking for specific classes/IDs:');
    const classes = $('[class]').map((i, el) => $(el).attr('class')).get();
    const uniqueClasses = [...new Set(classes)];
    console.log(`Unique classes found: ${uniqueClasses.slice(0, 20).join(', ')}`);
    
    // Look for table structure
    if ($('table').length > 0) {
      console.log('\n📊 Table structure found:');
      $('table').each((i, table) => {
        const rows = $(table).find('tr');
        const cols = $(table).find('th, td');
        console.log(`Table ${i + 1}: ${rows.length} rows, ${cols.length} cells`);
        
        // Show first few rows
        $(table).find('tr').slice(0, 3).each((j, row) => {
          const cells = $(row).find('td, th');
          const cellText = cells.map((k, cell) => $(cell).text().trim()).get();
          console.log(`  Row ${j + 1}: ${cellText.join(' | ')}`);
        });
      });
    }
    
    // Save HTML for manual inspection
    const fs = require('fs');
    fs.writeFileSync('debug-sih-page.html', response.data);
    console.log('\n💾 Saved HTML to debug-sih-page.html for manual inspection');
    
  } catch (error) {
    console.error('❌ Error debugging SIH website:', error.message);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response headers:`, error.response.headers);
    }
  }
}

debugSIHWebsite();
