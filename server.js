//server.js
//to get new token run this server first then go to https://accounts.spotify.com/authorize?client_id=fdf90cfcc0e04f7599bca3d8f2442ea5&response_type=code&redirect_uri=http://localhost:8888/callback&scope=user-read-private user-read-email

const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = 8888;

// Replace with your Spotify app credentials
const client_id = 'fdf90cfcc0e04f7599bca3d8f2442ea5';
const client_secret = '656017e7084d421e8c0a0187165bf941';
const redirect_uri = 'http://localhost:8888/callback';

app.get('/callback', (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const authOptions = {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
    }),
    method: 'POST',
    url: tokenUrl,
  };

  axios(authOptions)
    .then(response => {
      const access_token = response.data.access_token;
      res.send('Access token received: ' + access_token);
    })
    .catch(error => {
      console.error('Error fetching token:', error);
      res.status(500).send('Error fetching token');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
