#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

#define WIFI_SSID "bas"
#define WIFI_PASSWORD "22222222"

// Netpie Config
#define NETPIE_HOST "broker.netpie.io"
#define NETPIE_PORT 8883
#define NETPIE_CLIENT_ID "bcb2bdc1-c5a5-467a-a991-91bcd6b51157"
#define NETPIE_TOKEN "HtWewDzHfVakjX97a36eaJuNboASE88y"
#define NETPIE_SECRET "kyv8oY1UzBLzFyJwVgB83NtMf8gowHkH"

WiFiClientSecure wifiClient;
PubSubClient client(wifiClient);

static unsigned long lastMsg = 0;

int sensor;
int mode = 5;
int readPin = 3;

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, message);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  if (doc["data"].containsKey("on")) {
    bool onStatus = doc["data"]["on"];

    if (onStatus == true) {
      Serial.println("Command: TURN ON");
      digitalWrite(mode, HIGH);  // สั่งเปิดไฟ
    } else {
      Serial.println("Command: TURN OFF");
      digitalWrite(mode, LOW);  // สั่งปิดไฟ
    }
  }
}
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting NETPIE connection...");
    if (client.connect(NETPIE_CLIENT_ID, NETPIE_TOKEN, NETPIE_SECRET)) {
      Serial.println("connected");

      client.subscribe("@shadow/data/updated");  //


    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(readPin, INPUT);
  pinMode(mode, OUTPUT);

  digitalWrite(mode, LOW);  //

  wifiClient.setInsecure();
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  client.setServer(NETPIE_HOST, NETPIE_PORT);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  sensor = digitalRead(readPin);
  Serial.print("value: ");
  Serial.print(sensor);

  if (sensor == 1) Serial.println(" Detect");
  else Serial.println(" No Detect");

  unsigned long now = millis();
  if (now - lastMsg > 1000) {
    lastMsg = now;
    String jsonPayload = "{\"data\": { \"distance\": " + String(sensor) + " }}";
    client.publish("@shadow/data/update", jsonPayload.c_str());
  }

  delay(500);
}