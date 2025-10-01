// Тест API webhook
const testData = {
  message: {
    text: '/converter',
    chat: {
      id: 123456789
    }
  }
};

fetch('https://currantly-converter.vercel.app/api/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});