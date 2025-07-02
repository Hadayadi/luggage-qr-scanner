const html5QrCode = new Html5Qrcode("reader");
let currentCameraId = null;

Html5Qrcode.getCameras().then(devices => {
  console.log("Available cameras:", devices);
  
  const selector = document.getElementById("cameraSelector");
  devices.forEach((device, index) => {
    const option = document.createElement("option");
    option.value = device.id;
    option.text = device.label || `Camera ${index + 1}`;
    selector.appendChild(option);
  });

  // Default to back camera if available
  const backCam = devices.find(d => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear"));
  const defaultCam = backCam ? backCam.id : devices[0].id;
  selector.value = defaultCam;
  startScanner(defaultCam);
});

function startScanner(cameraId) {
  currentCameraId = cameraId;
  html5QrCode.start(
    cameraId,
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText, decodedResult) => handleScan(decodedText),
    (errorMsg) => console.warn("Scan error:", errorMsg)
  ).catch(err => console.error("Start failed:", err));
}

function stopScanner() {
  html5QrCode.stop().catch(err => console.error("Stop error:", err));
}

document.getElementById("cameraSelector").addEventListener("change", (e) => {
  stopScanner();
  startScanner(e.target.value);
});

function handleScan(decodedText) {
  console.log("✅ Code scanned:", decodedText);
  const apiUrl = "https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec?code=" + encodeURIComponent(decodedText);

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById("result");
      if (data.error) {
        el.innerHTML = `<span style="color:red;">❌ ${data.error}</span>`;
      } else {
        el.innerHTML = `
          <b>📍 Destination:</b> ${data.destination}<br>
          <b>🎫 Owner:</b> ${data.owner}<br>
          <b>📅 Arrival:</b> ${data.arrival}<br>
          <b>🛫 From:</b> ${data.from} | <b>🛬 To:</b> ${data.to}<br>
          <b>📦 Departure:</b> ${data.departure} | <b>Next:</b> ${data.next}<br>
          <b>📌 Needs:</b> ${data.needs}
        `;
      }
      html5QrCode.stop().catch(err => console.error("Stop error:", err));
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("⚠️ Could not reach server.");
    });
}

// 🖼️ Upload image support
document.getElementById("uploadFile").addEventListener("change", (e) => {
  if (!e.target.files.length) return;
  const file = e.target.files[0];
  html5QrCode.scanFile(file, true)
    .then(qrCodeMessage => {
      console.log("QR code from image:", qrCodeMessage);
      handleScan(qrCodeMessage);
    })
    .catch(err => {
      console.error("Image scan error:", err);
      alert("❌ Could not read QR from image.");
    });
});

function playSuccessSound() {
  const audio = new Audio("success.mp3");
  audio.play();
}
