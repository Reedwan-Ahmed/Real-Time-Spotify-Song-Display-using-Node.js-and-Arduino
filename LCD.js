//LDC.js
//JS code for LCD Displaying

const axios = require('axios');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Initialize Serial Port (Make sure to use the correct COM port)
const port = new SerialPort({
  path: 'COM3', // Replace with your Arduino COM port
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Spotify API credentials
const refreshToken = 'AQAJWzcIt_tF2M6Fdkob7Y3RtD0LgTF2ckJu2VKLmNH6Ie8o0r6s6SGiAmzCuHhiORkoz5dvg99_n7MS0qGfz5O-ofb5rYmCoKD7Q8yZOfPpJx4kD8IEOksHMVOeY5icyD4'; // Your refresh token
const clientId = 'fdf90cfcc0e04f7599bca3d8f2442ea5'; // Your client ID
const clientSecret = '656017e7084d421e8c0a0187165bf941'; // Your client secret

// Access token will be updated automatically
let accessToken = 'BQBtgXV-5dYg_gAB11z4W5Wv7SlyQ_KC8iLK0s4zB9rfIgaDgruBdfiT9CMqKvRqeuoOcqONzb2Sw0c4ML97db9IZQOZFTKw8UFb5JuYI-oCun4K-fagB_8IE_VytJUmg_O1CYDWX6uq9JtAsi9ptO3xK1l7LBR0K9BGEzoLZ82WgfUIj9Z4d1CWRQldylpjPOX9gb4iyQ_wnIrcB3skEFNA3z60daWNYymgA4yF6Q'; // Replace with your current valid token

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    accessToken = response.data.access_token; // Update the global access token
    console.log('Access token refreshed successfully:', accessToken);
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
};

// Function to get the currently playing track
const getCurrentlyPlaying = async () => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.data) {
      const songName = response.data.item.name;
      const artist = response.data.item.artists[0].name;
      const album = response.data.item.album.name;

      console.log(`Currently Playing: ${songName}`);
      console.log(`Artist: ${artist}`);
      console.log(`Album: ${album}`);

      // Combine the song details into a single string with clear separators
      const message = `Song: ${songName} | Artist: ${artist} | Album: ${album}\n`;

      // Send the combined data to Arduino
      port.write(message);
    } else {
      console.log('No track is currently playing.');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Access token expired. Refreshing...');
      await refreshAccessToken(); // Refresh the token
      getCurrentlyPlaying(); // Retry the request with the new token
    } else {
      console.error('Error fetching data:', error);
    }
  }
};

// Repeatedly check for the currently playing track every 5 seconds
setInterval(getCurrentlyPlaying, 5000);


//Arduino CODE


#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Initialize the LCD (address 0x27 is a common I2C address)
LiquidCrystal_I2C lcd(0x27, 16, 2); // Adjust the address if needed

void setup() {
  lcd.begin(16, 2);   // Set LCD size to 16x2
  lcd.backlight();    // Turn on the backlight
  Serial.begin(9600); // Start serial communication with Node.js
}

void loop() {
  if (Serial.available()) {
    // Read the complete string sent from Node.js
    String data = Serial.readStringUntil('\n');

    // Extract parts of the data using delimiters
    int songIndex = data.indexOf("Song: ");
    int artistIndex = data.indexOf("Artist: ");
    int albumIndex = data.indexOf("Album: ");

    // Extract each part (adjust indexing to skip the label text)
    String song = data.substring(songIndex + 6, artistIndex - 3);  // Skip "Song: "
    String artist = data.substring(artistIndex + 8, albumIndex - 3); // Skip "Artist: "
    String album = data.substring(albumIndex + 7);  // Skip "Album: "

    // Display the information on the LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(song); // Display the song name on the first line

    lcd.setCursor(0, 1);
    lcd.print(artist); // Display the artist name on the second line

    delay(2000); // Show the first two lines for 2 seconds

    // Display the album name on the LCD after a short delay
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Album:");
    lcd.setCursor(0, 1);
    lcd.print(album);

    delay(2000); // Show the album name for 2 seconds
  }
}
