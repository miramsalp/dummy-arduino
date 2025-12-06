# Project Configuration

## 1. NodeMCU (ESP32S3) Configuration (`nodemcu/esp32s3.ino`)

Open `nodemcu/esp32s3.ino` in Arduino IDE and update the following:

*   **WiFi Credentials:**
    ```cpp
    #define WIFI_SSID "your_wifi_ssid" // Replace with your WiFi SSID
    #define WIFI_PASSWORD "your_wifi_password" // Replace with your WiFi Password
    ```

*   **Netpie Configuration:** Obtain these from your Netpie application dashboard.
    ```cpp
    #define NETPIE_CLIENT_ID "your_netpie_client_id" // Replace with your Netpie Client ID
    #define NETPIE_TOKEN "your_netpie_token" // Replace with your Netpie Token
    #define NETPIE_SECRET "your_netpie_secret" // Replace with your Netpie Secret
    ```
    Upload the sketch to your ESP32S3 board after making changes.

## 2. Client-side Token Configuration (`client/index.js`)

Open `client/index.js` and update the `deviceToken` variable:

*   **`deviceToken`:** This is a concatenation of your Netpie `CLIENT_ID` and `TOKEN`, separated by a colon (`:`). Use the same values from your `esp32s3.ino` configuration.

    ```javascript
    const deviceToken = "your_netpie_client_id:your_netpie_token"; // Example: "myClientId:myToken"
    ```