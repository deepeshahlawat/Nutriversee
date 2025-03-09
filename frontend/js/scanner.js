// Nutriversee/frontend/js/scanner.js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const resultDiv = document.getElementById('result');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Error accessing camera:', err);
    resultDiv.innerHTML = `<p style="color:red;">Camera access error: ${err}</p>`;
  });

// Capture photo and send to backend
captureBtn.addEventListener('click', () => {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base64Image = canvas.toDataURL('image/jpeg');

  // Send captured image to backend /api/scan endpoint
  fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Response from server:', data);
      if (data.error) {
        resultDiv.innerHTML = `<p style="color:red;">Error: ${JSON.stringify(data.error)}</p>`;
      } else {
        const { recognition, nutrition } = data;
        const dishName = recognition.recognition_results?.[0]?.name || 'Unknown Dish';
        const calories = nutrition.nutritional_info?.calories || 'N/A';

        resultDiv.innerHTML = `
          <h2>Recognition</h2>
          <p><strong>Dish:</strong> ${dishName}</p>
          <p><strong>Image ID:</strong> ${recognition.imageId}</p>
          <h2>Nutritional Information</h2>
          <p><strong>Calories:</strong> ${calories}</p>
        `;
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      resultDiv.innerHTML = `<p style="color:red;">Fetch error: ${err}</p>`;
    });
});
