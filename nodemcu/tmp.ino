#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

#define WIFI_SSID     "bas"
#define WIFI_PASSWORD "22222222"

// Netpie MQTT
#define NETPIE_HOST   "broker.netpie.io"
#define NETPIE_PORT   8883

#define NETPIE_CLIENT_ID "6b884eea-8693-4705-ab8d-8f075c0fe471"
#define NETPIE_TOKEN     "YuzykSHEUk2MGQDws6g2CmQ6qdqJeX7Q"
#define NETPIE_SECRET    "dLdkJpUauGeDruRiD41vrFKK6DaM9czW"

WiFiClientSecure wifiClient;
PubSubClient client(wifiClient);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message from NETPIE: ");
  for (int i = 0; i < length; i++) Serial.print((char)payload[i]);
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting NETPIE connection...");
    if (client.connect(NETPIE_CLIENT_ID, NETPIE_TOKEN, NETPIE_SECRET)) {
      Serial.println("connected");
      client.subscribe("@msg/esp");
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
  pinMode(4, INPUT);
  
  wifiClient.setInsecure();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWiFi Connected!");

  client.setServer(NETPIE_HOST, NETPIE_PORT);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  static unsigned long lastMsg = 0;
  unsigned long now = millis();

  if (now - lastMsg > 5000) {
    lastMsg = now;

    int dummyDist = random(0, 2); 
    int dummyVib = random(0, 2);  

    String jsonPayload = "{\"data\": { \"distance\": " + String(dummyDist) + ", \"vibration\": " + String(dummyVib) + " }}";

    Serial.print("Sending Dummy Data: ");
    Serial.println(jsonPayload);

    client.publish("@shadow/data/update", jsonPayload.c_str());
  }
}