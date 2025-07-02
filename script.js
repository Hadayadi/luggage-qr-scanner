const resultElement = document.getElementById("result");
const reader = new Html5Qrcode("reader");
let currentCameraId = null;
let isArabic = false;

// Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec";

// Start QR scanning
function startScanner(cameraId) {
  reader.start(
    cameraId,
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    onScanSuccess,
    (error) => {
      console.warn("QR scan error:", error);
    }
  ).catch((err) => {
    console.error("Camera start error:", err);
    resultElement.textContent = isArabic ? "فشل تشغيل الكاميرا." : "Failed to start camera.";
  });
}

// When QR is scanned
function onScanSuccess(decodedText) {
  reader.stop().then(() => {
    fetch(`${API_URL}?code=${encodeURIComponent(decodedText)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          resultElement.textContent = isArabic ? "تعذر الوصول إلى الخادم." : "Could not reach server.";
        } else {
          resultElement.innerHTML = `
            <strong>${isArabic ? 'الوجهة' : 'Destination'}:</strong> ${data.destination}<br>
            <strong>${isArabic ? 'المالك' : 'Owner'}:</strong> ${data.owner}<br>
            <strong>${isArabic ? 'الوصول' : 'Arrival'}:</strong> ${data.arrival}<br>
            <strong>${isArabic ? 'من' : 'From'}:</strong> ${data.from}<br>
            <strong>${isArabic ? 'المغادرة' : 'Departure'}:</strong> ${data.departure}<br>
            <strong>${isArabic ? 'إلى' : 'To'}:</strong> ${data.to}<br>
            <strong>${isArabic ? 'التالي' : 'Next'}:</strong> ${data.next}<br>
            <strong>${isArabic ? 'الاحتياجات' : 'Needs'}:</strong> ${data.needs}
          `;
        }
      }).catch(err => {
        console.error("Fetch error:", err);
        resultElement.textContent = isArabic ? "خطأ في الاتصال بالخادم." : "Error reaching server.";
      });
  });
}

// Toggle language function (linked in HTML)
function toggleLanguage() {
  isArabic = !isArabic;

  document.getElementById('main-title').textContent = isArabic
    ? 'ماسح رمز الأمتعة'
    : 'Luggage Code Scanner';

  document.getElementById("result").textContent = isArabic
    ? 'في انتظار المسح...'
    : 'Waiting for scan...';

  document.querySelector('footer').textContent = isArabic
    ? '© 2025 الأكاديمية السعودية للخدمات الأرضية'
    : '© 2025 Saudi Ground Services Academy';
}

// Toggle dark/light mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// Upload image and decode QR
document.addEventListener("DOMContentLoaded", () => {
  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      const select = document.createElement("select");
      select.className = "btn";
      devices.forEach(device => {
        const option = document.createElement("option");
        option.value = device.id;
        option.text = device.label || `Camera ${device.id}`;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        if (currentCameraId) reader.stop();
        currentCameraId = select.value;
        startScanner(currentCameraId);
      });

      document.querySelector(".controls").prepend(select);
      currentCameraId = devices[0].id;
      startScanner(currentCameraId);
    }
  }).catch(err => {
    resultElement.textContent = "Camera access error: " + err;
    console.error(err);
  });

  // Upload image support
  const uploadBtn = document.createElement("button");
  uploadBtn.className = "btn";
  uploadBtn.textContent = isArabic ? "تحميل صورة" : "Upload Image";
  uploadBtn.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      Html5Qrcode.getCameras().then(() => {
        const html5Qr = new Html5Qrcode("reader");
        html5Qr.scanFile(file, true)
          .then(onScanSuccess)
          .catch(err => {
            console.error("Image decode error:", err);
            resultElement.textContent = isArabic
              ? "لم يتم العثور على رمز QR في الصورة."
              : "No QR code found in image.";
          });
      });
    };
    input.click();
  };
  document.querySelector(".controls").appendChild(uploadBtn);
});
