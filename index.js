const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.use(express.json());

// Assignment 1
const fetchCatBreeds = async () => {
  const url = 'https://catfact.ninja/breeds';
  let breedsByCountry = {};

  const urlResponse = await axios.get(url);
  const totalPages = urlResponse.data.last_page;

  for (let i = 1; i <= totalPages; i++) {
    const response = await axios.get(`${url}?page=${i}`);
    const breedDataList = response.data.data;

    breedDataList.forEach(breedData => {
      const { breed, origin, coat, pattern } = breedData;

      if (!breedsByCountry[origin]) {
        breedsByCountry[origin] = [];
      }

      breedsByCountry[origin].push({
        breed,
        origin,
        coat,
        pattern
      });
    });
  }

  return breedsByCountry;
};

 fetchCatBreeds().then(breedsByCountry => console.log(breedsByCountry));

// Logging POST requests
app.post('/task2', (req, res) => {
  const { str } = req.body;
  const wordCount = str.trim().split(/\s+/).length;

  let responseMessage;

  if (wordCount >= 8) {
    responseMessage = 'Word count is greater than or equal to 8';
    res.status(200).send(responseMessage);
  } else {
    responseMessage = 'Word count is less than 8';
    res.status(406).send(responseMessage);
  }

  // Logging the POST request and response
  const logData = `POST request received at ${new Date()}:\nRequest Body: ${JSON.stringify(req.body)}\nResponse: ${responseMessage}\n\n`;
  fs.appendFile('postRequests.log', logData, err => {
    if (err) {
      console.error('Error writing log:', err);
    }
  });
});

app.get('/', (req, res) => res.send('Server is ready'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
