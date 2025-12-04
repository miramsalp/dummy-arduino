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
    if(data.data.distance === 1) {
      trigger = true;
      const distanceDiv = document.createElement("div");
      distanceDiv.textContent = "มีคนอยู่ใกล้เคียง";
      distanceDiv.classList.add("distance-1");  
      log.appendChild(distanceDiv);
    } 
    if(data.data.vibration === 1) {
      trigger = true;
      const distanceDiv = document.createElement("div");
      distanceDiv.textContent = "มีการสั่นสะเทือน";
      distanceDiv.classList.add("vibration-1");  
      log.appendChild(distanceDiv);
    } 

    // log.textContent = content;
    if(trigger) terminal.prepend(log);  
}

document.getElementById("get-shadow-data").addEventListener("click", function() {
  const endpoint = "https://api.netpie.io/v2/device/shadow/data";
  const alias = ""; 
  
  const deviceToken = "6b884eea-8693-4705-ab8d-8f075c0fe471:YuzykSHEUk2MGQDws6g2CmQ6qdqJeX7Q"; 

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