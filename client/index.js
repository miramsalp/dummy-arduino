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