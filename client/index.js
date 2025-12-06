async function terminalDisplay(data) {
  // terminal
  let trigger = false;
  const terminal = document.getElementById("terminal");
  const log = document.createElement("div");
  const time = document.createElement("div");
  log.classList.add("log");

  // แสดงวันที่และเวลาแบบอ่านง่าย
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
  if (data.data.distance === 1) {
    trigger = true;
    const distanceDiv = document.createElement("div");
    distanceDiv.textContent = "มีคนอยู่ใกล้เคียง";
    distanceDiv.classList.add("distance-1");
    log.appendChild(distanceDiv);
  }
  if (data.data.vibration === 1) {
    trigger = true;
    const distanceDiv = document.createElement("div");
    distanceDiv.textContent = "มีการสั่นสะเทือน";
    distanceDiv.classList.add("vibration-1");
    log.appendChild(distanceDiv);
  }

  // log.textContent = content;
  if (trigger) terminal.prepend(log);
}

document.getElementById("get-shadow-data").addEventListener("click", function () {
  const endpoint = "https://api.netpie.io/v2/device/shadow/data";
  const alias = "";

  const deviceToken = "bcb2bdc1-c5a5-467a-a991-91bcd6b51157:HtWewDzHfVakjX97a36eaJuNboASE88y";

  fetch(`${endpoint}?alias=${alias}`, {
    method: "GET",
    headers: {
      "Authorization": `Device ${deviceToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("shadow-data-output").textContent = JSON.stringify(data, null, 2);

      if (data && data.data) {

        terminalDisplay(data);
        // dist
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

        const vibValue = data.data.vibration;
        const vibElem = document.getElementById("vib-status");

        document.getElementById("vib-val").innerText = `(Value: ${vibValue})`;

        if (vibValue == 1) {
          vibElem.innerText = "มีการสั่น";
          vibElem.className = "status-text inactive";
        } else {
          vibElem.innerText = "ไม่มีการสั่น";
          vibElem.className = "status-text active";
        }

      } else {
        alert("ไม่พบข้อมูล data ใน Shadow");
      }
    })
    .catch(error => {
      document.getElementById("shadow-data-output").textContent = `Error: ${error}`;
    });
});


document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.getElementById('monitor-toggle');
  const statusText = document.getElementById('monitor-status-text');

  const deviceToken = "bcb2bdc1-c5a5-467a-a991-91bcd6b51157:HtWewDzHfVakjX97a36eaJuNboASE88y";
  const endpoint = "https://api.netpie.io/v2/device/shadow/data";

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
    fetch(endpoint, {
      method: "PUT",
      headers: { "Authorization": `Device ${deviceToken}`, "Content-Type": "application/json" },
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

  fetch(endpoint, {
    method: "GET", headers: { "Authorization": `Device ${deviceToken}` }
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
});