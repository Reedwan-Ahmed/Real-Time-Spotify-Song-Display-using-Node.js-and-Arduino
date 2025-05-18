#include <Wire.h>
#include <LiquidCrystal_I2C.h>


LiquidCrystal_I2C lcd(0x27, 16, 2); 

void setup() {
  lcd.begin(16, 2);   
  lcd.backlight();    
  Serial.begin(9600); 
}

void loop() {
  if (Serial.available()) {
    String data = Serial.readStringUntil('\n');

    int songIndex = data.indexOf("Song: ");
    int artistIndex = data.indexOf("Artist: ");
    int albumIndex = data.indexOf("Album: ");

    String song = data.substring(songIndex + 6, artistIndex - 3);  
    String artist = data.substring(artistIndex + 8, albumIndex - 3); 
    String album = data.substring(albumIndex + 7); 

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(song);

    lcd.setCursor(0, 1);
    lcd.print(artist); 
    delay(2000); 

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Album:");
    lcd.setCursor(0, 1);
    lcd.print(album);

    delay(2000); 
  }
}
