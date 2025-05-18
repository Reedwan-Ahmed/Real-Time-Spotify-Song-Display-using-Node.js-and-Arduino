//newAceessToken.js

const axios = require('axios');

// Function to refresh access token
async function refreshAccessToken() {
    const refreshToken = 'AQAJWzcIt_tF2M6Fdkob7Y3RtD0LgTF2ckJu2VKLmNH6Ie8o0r6s6SGiAmzCuHhiORkoz5dvg99_n7MS0qGfz5O-ofb5rYmCoKD7Q8yZOfPpJx4kD8IEOksHMVOeY5icyD4'; // Your actual refresh token
    const clientId = 'fdf90cfcc0e04f7599bca3d8f2442ea5'; // Your actual client ID
    const clientSecret = '656017e7084d421e8c0a0187165bf941'; // Your actual client secret

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }), {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const newAccessToken = response.data.access_token;
        console.log('New access token:', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}

// Your existing function to make requests to the Spotify API
async function getCurrentlyPlaying() {
    let accessToken = 'your-current-access-token-here'; // Initial access token

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // Do something with the response
        console.log(response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // If token expired, refresh it and retry the request
            console.log('Token expired, refreshing...');
            accessToken = await refreshAccessToken();  // Refresh the token

            // Retry the request with the new token
            if (accessToken) {
                const retryResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(retryResponse.data); // Do something with the new response
            }
        } else {
            console.error('Error fetching data:', error);
        }
    }
}

// Call the function to get the currently playing track
getCurrentlyPlaying();
