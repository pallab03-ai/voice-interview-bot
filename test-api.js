// Simple test script to verify API responses
// Usage: node test-api.js

const testLocal = async () => {
  console.log('\n=== Testing LOCAL API (http://localhost:3001) ===\n');
  
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: "What is your latest project?",
        language: "English"
      }),
    });

    if (!response.ok) {
      console.error(`❌ Local API Error: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log('✅ Local API Response:');
    console.log(data.answer);
    console.log('\n');
  } catch (error) {
    console.error('❌ Local API Failed:', error.message);
    console.log('\n💡 Make sure to run: node server-local.js\n');
  }
};

const testVercel = async () => {
  console.log('\n=== Testing VERCEL API (https://voice-interview-bot.vercel.app) ===\n');
  
  try {
    const response = await fetch('https://voice-interview-bot.vercel.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: "What is your latest project?",
        language: "English"
      }),
    });

    if (!response.ok) {
      console.error(`❌ Vercel API Error: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log('✅ Vercel API Response:');
    console.log(data.answer);
    console.log('\n');
  } catch (error) {
    console.error('❌ Vercel API Failed:', error.message);
  }
};

// Run tests
(async () => {
  await testLocal();
  await testVercel();
})();
