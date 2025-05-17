# Real-Time-Spotify-Song-Display-using-Node.js-and-Arduino
A project that fetches your currently playing Spotify track using the Web API and shows it on a 16x2 I2C LCD connected to an Arduino. This is one of my original projects that I started from scratch to see my potential, just after completing my EEE 3209 MCU course. This is more like my expertise in AI prompt engineering and Arduino, with little basic knowledge of JS.

Hardware Requirements:
---------------------
1 x Arduino Uno
1 x 16x2 I2C LCD Display
1 x I2C Module for LCD (usually pre-attached)
Wires
USB cable for Arduino
Computer (Windows 10/11)

Software Requirements:
---------------------
1. Arduino IDE
Download and install the Arduino IDE from Arduino's official website.
2. Node.js
Download and install Node.js from Node.js official website. Ensure that NPM (Node Package Manager) is included.
3. Spotify Developer Account
Create a developer account at Spotify Developer Dashboard.
4. Dependencies
Install the following libraries:
For Arduino: LiquidCrystal_I2C library.
For Node.js: axios, serialport

Step 1: Hardware Setup
-----------------------
Connect the LCD to Arduino Uno
Connect the GND pin of the I2C module to Arduino GND.
Connect the VCC pin of the I2C module to Arduino 5V.
Connect the SDA pin of the I2C module to Arduino A4.
Connect the SCL pin of the I2C module to Arduino A5.
Check LCD Address
Different I2C modules may have different addresses (e.g., 0x27, 0x3F). To confirm the address:
Upload an I2C scanner code to the Arduino (available online).
Open the Serial Monitor in the Arduino IDE to see the address.

Step 2: Setting Up Spotify Developer App
----------------------------------------
1. Create an App:
Go to the Spotify Developer Dashboard and create a new app.
Note down the Client ID and Client Secret.

2. Set the Redirect URI:
In your app settings, add http://localhost:8888/callback as a redirect URI.

Get a Refresh Token:
--------------------
Step 1: Get the Authorization Code (using browser)
1.Construct the following URL in your browser:
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-playback-state%20user-read-currently-playing
2.Log in and allow permissions.
3.You’ll be redirected to something like: http://localhost:8888/callback?code=AQCyN8VQ...<your_auth_code>
Copy the code= part — this is your Authorization Code.

Step 2: Exchange Authorization Code for Refresh Token (in Postman)
1.Open Postman.
2.Create a POST request to: https://accounts.spotify.com/api/token

3. In the Headers tab:
Key: Authorization
Value: Basic <base64(client_id:client_secret)>

To get the base64 string:
If your client ID is abc and secret is 123,
then base64("abc:123") = YWJjOjEyMw==

Key: Content-Type
Value: application/x-www-form-urlencoded

4. In the Body tab (form-data or x-www-form-urlencoded), enter:
grant_type: authorization_code
code: <your_authorization_code>
redirect_uri: http://localhost:8888/callback

5. Send the request.

Step 3: Copy Your Tokens:
You’ll receive a response like this:
{
  "access_token": "BQD...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "AQA...",
  "scope": "user-read-playback-state user-read-currently-playing"
}
Save your Access token and Refresh token — you’ll use this to get new access tokens without re-authorizing.
