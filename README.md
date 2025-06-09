# Real-Time-Spotify-Song-Display-using-Node.js-and-Arduino
A project that fetches your currently playing Spotify track using the Web API and shows it on a 16x2 I2C LCD connected to an Arduino. This is one of my original projects that I started completely from scratch, just after completing my EEE 3209 MCU course. 
This was a test of my skills in Arduino, basic JavaScript, and AI prompt engineering.
I solved many bugs and issues during development, and this final version works perfectly.
**Watch it in action:** [YouTube Demo Video](https://youtu.be/FjlkE5RW_3I)

 🧰 Hardware Requirements

- 1 × Arduino Uno  
- 1 × 16x2 I2C LCD Display  
- 1 × I2C Module (usually pre-attached to the LCD)  
- Jumper wires  
- USB cable for Arduino  
- Computer (Windows 10/11)

💻 Software Requirements

1. **Arduino IDE**  
   Download from [Arduino Official Site](https://www.arduino.cc/en/software)

2. **Node.js & NPM**  
   Download from [Node.js Official Site](https://nodejs.org/)

3. **Spotify Developer Account**  
   Register at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

4. **Required Libraries:**
   - **Arduino:** `LiquidCrystal_I2C` library  
   - **Node.js:** `axios`, `serialport`, `@serialport/parser-readline`


📁 Files Used in This Project

| File | Description |
|------|-------------|
| [`ArduinoIDEcodeSpotify.ino`](./ArduinoIDEcodeSpotify.ino) | Arduino code to drive the LCD display |
| [`LCD.js`](./LCD.js) | Displays current song info on the LCD via serial communication |
| [`server.js`](./server.js) | Local OAuth handler for Spotify (gets access & refresh tokens) |
| [`newAccessToken.js`](./newAccessToken.js) | Automatically refreshes your Spotify access token |
| [`README.md`](./README.md) | This guide you're reading |

## 🔌 Step 1: Hardware Setup

1. Connect the **I2C LCD** to the Arduino Uno (VCC, GND, SDA, SCL).  
2. Use an **I2C scanner sketch** to confirm your LCD address (`0x27`, `0x3F`, etc.).  
   You can find I2C scanner codes [online](https://playground.arduino.cc/Main/I2cScanner/).

---

## 🎧 Step 2: Create Your Spotify Developer App

1. Visit: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)  
2. Click **“Create an App”**
   - App name: e.g., `Spotify LCD Project`
   - Description: Optional  
3. Save your:
   - `Client ID`  
   - `Client Secret`  
4. Add a **Redirect URI**:  
   - `http://localhost:8888/callback`

---

Step 3: Get a Refresh Token: ( There are 2 ways to get this. Either use the Postman method or use the server.js method )
-----------------------------------------------------------------------------------------------------------------------
Postman method to Get a Refresh Token:
-------------------------------------
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

## Step 3: Save Your Tokens
1. After sending the request, you will get a response like this:
{
  "access_token": "BQD...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "AQA...",
  "scope": "user-read-playback-state user-read-currently-playing"
}
2. Copy and save both access_token and refresh_token somewhere safe. You will use the refresh token later to get new access tokens without needing to log in again.

Option B: Using [`server.js`](./server.js)

------------------------------------
1. You will run a Node.js server that listens for Spotify’s redirect and grabs the authorization code. This code is the key to getting your long-term access + refresh token.
Edit the file and replace:
const client_id = 'YOUR_CLIENT_ID';
const client_secret = 'YOUR_CLIENT_SECRET';

3. Tools Needed:
Node.js installed on your machine (https://nodejs.org/)
A terminal (Command Prompt, Terminal, or PowerShell)
Code editor (like VS Code)

4. Instructions:
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

**Step 3: Automatically Refresh Your Access Token Using [View newAccessToken.js](./newAccessToken.js)**

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

**Step 4: Display Spotify Track Info on Your LCD Using [LDC.js](./LDC.js)
and Arduino**

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

![thumb](https://github.com/user-attachments/assets/74b0a3ce-6b7e-41f8-8721-f00215da0039)
#It took me a lot of effort to execute my project. I needed to troubleshoot and fix errors many times until it became perfect. There were many difficulties, yet I tried to cover up the core things that I mainly learned.

Here is a Video of my final project that worked perfectly on my YouTube channel: 
-------------------------------------------------------------------------------
https://youtu.be/FjlkE5RW_3I
