const html5QrCode = new Html5Qrcode("reader");

// Detect and list available cameras
Html5Qrcode.getCameras().then(devices => {
  console.log("Detected cameras:", devices);

  if (devices && devices.length) {
    const cameraId = devices[0].id;

    html5QrCode.start(
      cameraId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      (decodedText, decodedResult) => {
        console.log("✅ Code scanned:", decodedText);

        const apiUrl = "https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec?code=" + encodeURIComponent(decodedText);

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const resultEl = document.getElementById("result");
            if (data.error) {
              resultEl.innerHTML = `<span style='color:red;'>❌ ${data.error}</span>`;
            } else {
              resultEl.innerHTML = `
                <b>📍 Destination:</b> ${data.destination}<br>
                <b>🎫 Owner:</b> ${data.owner}<br>
                <b>📅 Arrival:</b> ${data.arrival}<br>
                <b>🛫 From:</b> ${data.from} | <b>🛬 To:</b> ${data.to}<br>
                <b>📦 Departure:</b> ${data.departure} | <b>Next:</b> ${data.next}<br>
                <b>📌 Needs:</b> ${data.needs}
              `;
              playSuccessSound();
              html5QrCode.stop().then(() => console.log("Scanner stopped")).catch(err => console.error("Stop error", err));
            }
          })
          .catch(err => {
            console.error("Fetch error:", err);
            alert("⚠️ Error retrieving data. Check the URL and Google Script permissions.");
          });
      },
      (errorMsg) => {
        console.warn("Scan error:", errorMsg);
      }
    );
  } else {
    alert("❌ No camera found.");
  }
}).catch(err => {
  console.error("Camera access error:", err);
  alert("Unable to access camera.");
});

function playSuccessSound() {
  const audio = new Audio("success.mp3");
  audio.play();
}
