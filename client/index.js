const API_ENDPOINT = "https://api.netpie.io/v2/device/shadow/data";
const DEVICE_TOKEN = "6b884eea-8693-4705-ab8d-8f075c0fe471:YuzykSHEUk2MGQDws6g2CmQ6qdqJeX7Q";

let monitorInterval = null;

async function terminalDisplay(data) {
  if (data.data.distance !== 1) {
    document.body.classList.remove("alert-bg");
    return;
  }
  
  let trigger = true; 
  const terminal = document.getElementById("terminal");
  const body = document.querySelector(".main-container");
  const log = document.createElement("div");
  const time = document.createElement("div");
  log.classList.add("log");

  const now = new Date();
  time.classList.add("time-log");
  time.textContent = now.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  log.appendChild(time);

  const messageDiv = document.createElement("div");
  
  if (data.data.on === 1) {
    messageDiv.textContent = "มีผู้บุกรุก "; 
    messageDiv.classList.add("intruder-alert");
    body.classList.add("alert-bg");
  } else {
    messageDiv.textContent = "มีคนอยู่ใกล้เคียง"; 
    messageDiv.classList.add("distance-1");
    body.classList.remove("alert-bg");
  }

  log.appendChild(messageDiv);

  if (trigger) terminal.prepend(log);
}

function getShadowData() {
  const alias = "";

  fetch(`${API_ENDPOINT}?alias=${alias}`, {
    method: "GET",
    headers: {
      "Authorization": `Device ${DEVICE_TOKEN}`
    }
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("shadow-data-output").textContent = JSON.stringify(data, null, 2);

      if (data && data.data) {
        terminalDisplay(data);

        const distValue = data.data.distance;
        const distElem = document.getElementById("dist-status");
        document.getElementById("dist-val").innerText = `(Value: ${distValue})`;

        if (distValue == 1) {
          distElem.innerText = "อยู่ในระยะ";
          distElem.className = "status-text active";
        } else {
          distElem.innerText = "ไม่อยู่ในระยะ";
          distElem.className = "status-text inactive";
        }

      } else {
        alert("ไม่พบข้อมูล data ใน Shadow");
      }
    })
    .catch(error => {
      document.getElementById("shadow-data-output").textContent = `Error: ${error}`;
    });
}

document.getElementById("get-shadow-data").addEventListener("click", getShadowData);


function startMonitoring() {
  if (monitorInterval === null) {
    getShadowData(); 
    // call limitations
    // 800000/31 = 25806 -> 25806/24 = 1075 -> 3600/1080 -> 3.33
    monitorInterval = setInterval(getShadowData, 3300); 
    console.log("Monitoring started (every 3.3s).");
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.getElementById('monitor-toggle');
  const statusText = document.getElementById('monitor-status-text');

  function updateDisplay(isOn) {
    toggleSwitch.checked = isOn;
    if (isOn) {
      statusText.textContent = 'ON';
      statusText.classList.add('status-on');
    } else {
      statusText.textContent = 'OFF';
      statusText.classList.remove('status-on');
    }
  }

  function updateShadow(isOn) {
    const valueToSend = isOn ? 1 : 0;
    fetch(API_ENDPOINT, {
      method: "PUT",
      headers: { "Authorization": `Device ${DEVICE_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: { on: valueToSend } })
    })
      .then(res => res.json())
      .then(data => console.log("Shadow Updated:", data))
      .catch(err => console.error("Update Error:", err));
  }

  toggleSwitch.addEventListener('change', function () {
    const isOn = toggleSwitch.checked;
    updateDisplay(isOn);
    updateShadow(isOn);
  });

  fetch(API_ENDPOINT, {
    method: "GET", headers: { "Authorization": `Device ${DEVICE_TOKEN}` }
  })
    .then(response => response.json())
    .then(data => {
      console.log("Initial Data:", data);
      if (data && data.data && data.data.on !== undefined) {
        const isCurrentlyOn = (data.data.on === 1);
        updateDisplay(isCurrentlyOn); 
      }
    })
    .catch(error => {
      console.error("Get Initial Data Error:", error);
    });
  startMonitoring();
});