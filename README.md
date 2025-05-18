# Real-Time-Spotify-Song-Display-using-Node.js-and-Arduino
A project that fetches your currently playing Spotify track using the Web API and shows it on a 16x2 I2C LCD connected to an Arduino. This is one of my original projects that I started from scratch to see my potential, just after completing my EEE 3209 MCU course. This is more like my expertise in AI prompt engineering and Arduino, with little basic knowledge of JS. Watch this in "RAW" mode for clear instructions.

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

#Note that I have uploaded 3 JS codes and 1 Arduino IDE code in the main branch that you will need next: 1.server.js 2.newAceessToken.js 3.LDC.js 4.Arduino IDE code
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

Step 1: Hardware Setup
-----------------------
Connect the LCD to Arduino Uno

Check LCD Address
Different I2C modules may have different addresses (e.g., 0x27, 0x3F). To confirm the address:
Upload an I2C scanner code to the Arduino (available online).

Step 2: Setting Up Spotify Developer App
----------------------------------------
1. Go to the Spotify Developer Dashboard:
https://developer.spotify.com/dashboard
2. Log in with your Spotify account (or sign up if you don’t have one).
3. Click on “Create an App” (You might see it as “Create a Client” or “New App”).
4. In the popup:
App name: Choose anything (e.g., “Spotify LCD Project”)
App description: Optional (e.g., “Arduino LCD display showing currently playing Spotify song”)
Check both checkboxes to agree to the terms
Click “Create”
5. Once the app is created, click on your app to open its settings.
6. Copy down the following (you’ll need these later):
Client ID
Client Secret
7. Set a redirect URI:
In your app dashboard, click “Edit Settings”
Under “Redirect URIs” section, click “Add”
Enter: http://localhost:8888/callback
Click “Add” and then “Save”

Summary: You now have a registered Spotify app and the three key pieces of data:
client_id
client_secret
redirect_uri

Step 3: Get a Refresh Token: ( There are 2 ways to get this. Either use the Postman method or use the server.js method )
--------------------
Postman method:
---------------
Step 1: Get the Authorization Code using your browser
1. Open your web browser.
2. Copy and paste this URL into the address bar, but replace the parts in ALL CAPS with your own info:
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-playback-state%20user-read-currently-playing
-Replace YOUR_CLIENT_ID with your Spotify app’s Client ID.
-Replace YOUR_REDIRECT_URI with the Redirect URI you set in your Spotify app (usually http://localhost:8888/callback).
3. Press Enter to open the link.
4. You will be asked to log in to your Spotify account and approve permissions. Do that.
5. After you approve, the browser will redirect to a URL like this: http://localhost:8888/callback?code=AUTHORIZATION_CODE_HERE
6. Copy the part after code= — this is your Authorization Code. Save it somewhere, you’ll need it in the next step.
   
Step 2: Exchange Authorization Code for Refresh Token using Postman
1. Open Postman (if you don’t have it, download and install it from https://www.postman.com/).
2. Create a new POST request.
3. Set the request URL to: https://accounts.spotify.com/api/token
4. Go to the Headers tab and add these two headers:

### Headers (for Postman)

| Key           | Value                                  |
|----------------|----------------------------------------|
| Authorization | Basic YOUR_BASE64_ENCODED_CREDENTIALS  |
| Content-Type  | application/x-www-form-urlencoded      |

To get YOUR_BASE64_ENCODED_CREDENTIALS, you must base64 encode your client_id and client_secret joined with a colon :.
For example, if your client ID is abc and secret is 123, encode abc:123 to base64, which results in YWJjOjEyMw==.
You can use an online base64 encoder or run this command in a terminal: echo -n 'abc:123' | base64
5. Go to the Body tab, select x-www-form-urlencoded as the type, and add these key-value pairs:
### Body (x-www-form-urlencoded)

| Key          | Value                            |
|--------------|----------------------------------|
| grant_type   | authorization_code               |
| code         | YOUR_AUTHORIZATION_CODE          |
| redirect_uri | http://localhost:8888/callback   |

Replace YOUR_AUTHORIZATION_CODE with the code you copied from Step 1.
6. Click Send.

Step 3: Save Your Tokens
1. After sending the request, you will get a response like this:
{
  "access_token": "BQD...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "AQA...",
  "scope": "user-read-playback-state user-read-currently-playing"
}
2. Copy and save both access_token and refresh_token somewhere safe. You will use the refresh token later to get new access tokens without needing to log in again.

Server.js method to get access token:
------------------------------------
1. You will run a Node.js server that listens for Spotify’s redirect and grabs the authorization code. This code is the key to getting your long-term access + refresh token.

2. Tools Needed:
Node.js installed on your machine (https://nodejs.org/)
A terminal (Command Prompt, Terminal, or PowerShell)
Code editor (like VS Code)

3. Instructions:
1. Create a new folder for your project (if you haven’t yet), e.g.:
mkdir spotify-lcd-project
cd spotify-lcd-project
2. Initialize a Node.js project:
npm init -y
3. Install required packages:
npm install express axios querystring
4. Create a file called server.js in your project folder, and paste the following code:
"Server.js" (code given in main branch)
5. Replace:
YOUR_CLIENT_ID → with your Spotify client ID
YOUR_CLIENT_SECRET → with your Spotify client secret
6. Run the server:
In your terminal:
node server.js
7. Open the following link in your browser:
Replace the CLIENT_ID with yours.
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:8888/callback&scope=user-read-playback-state user-read-currently-playing
You will be asked to log into Spotify and authorize your app. Once done, Spotify will redirect you to http://localhost:8888/callback?code=...
8. You will now see an HTML page showing:
Access Token
Refresh Token
9. Copy and save both tokens safely — especially the refresh token, which you’ll need to regenerate access tokens later.

Step 3: Automatically Refresh Your Access Token Using "newAccessToken.js"
-----------------------------------------------------------------------
Once you've obtained your refresh token (from Postman or via running server.js and visiting the /callback URL), you don’t need to manually request an access token again. You can programmatically refresh it using the newAccessToken.js file since each token lasts for only 1 hour.
1. Open your code editor and locate the file named: newAccessToken.js
2. Open a terminal in the same directory.
3. Install required dependency (if not done already): npm install axios
4. Verify this line is correct inside your file:
const refreshToken = 'YOUR_REFRESH_TOKEN_HERE';
Replace 'YOUR_REFRESH_TOKEN_HERE' with your actual refresh token (from Step 2 or server.js output).
5.Run the script: node newAccessToken.js
You now have a program that can generate a fresh token and access Spotify's "currently playing" data automatically.

Step 4: Display Spotify Track Info on Your LCD Using LDC.js and Arduino
-----------------------------------------------------------------------
1. Prepare your Arduino hardware:
Connect your LCD display to your Arduino via I2C (check your wiring matches LCD address 0x27).
Connect your Arduino to your computer via USB.
2. Upload the Arduino code:
Open Arduino IDE.
Copy the Arduino IDE code I shared in the main branch.
Select the correct COM port and board.
Upload the code to your Arduino.
3. Set the correct COM port in LDC.js:
Open your LDC.js.
Find this line:
path: 'COM3', // Replace with your Arduino COM port
4. Install required Node.js dependencies:
npm install axios serialport @serialport/parser-readline
5. Add your Spotify credentials in LDC.js:
Make sure these are set correctly:
const refreshToken = 'YOUR_REFRESH_TOKEN';
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
let accessToken = 'YOUR_INITIAL_ACCESS_TOKEN';
The initial access token should be a valid one you got from newAccessToken.js or server.js.
6.Run LDC.js:
node LDC.js

What you should see:
The LCD screen connected to your Arduino will display the current song name on the first line and the artist name on the second line.
After 2 seconds, it will switch to show "Album:" on the first line and the album name on the second.
This display will update automatically every 5 seconds with the latest playing info.

#It took me a lot of effort to execute my project. I needed to troubleshoot and fix errors many times until it became perfect. There were many difficulties, yet I tried to cover up the core things that I mainly learned.
Here is a Video of my final project that worked perfectly in my youtube channel: https://youtu.be/FjlkE5RW_3I
