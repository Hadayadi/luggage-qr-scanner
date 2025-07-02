// ✅ New Web App URL from deployment
const apiUrl = "https://script.google.com/macros/s/AKfycbxNC4cp2rlmHhVLUQQlOrG42sxFPJ1thzV7vx9CVJ_HCvzGVJqqfXp8uhC6JtlNLrMK/exec";

// Language toggle
let isArabic = false;

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

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// Start QR scanner
const html5QrCode = new Html5Qrcode("reader");

function switchCamera(facingMode) {
  Html5Qrcode.getCameras().then(devices => {
    let deviceIdToUse = null;

    if (devices.length === 0) {
      alert("No cameras found.");
      return;
    }

    // Pick camera by facing mode
    for (let cam of devices) {
      if (
        (facingMode === "user" && cam.label.toLowerCase().includes("front")) ||
        (facingMode === "environment" && cam.label.toLowerCase().includes("back"))
      ) {
        deviceIdToUse = cam.id;
        break;
      }
    }

    // fallback if no labeled match
    if (!deviceIdToUse) {
      deviceIdToUse = devices[0].id;
    }

    html5QrCode.stop().then(() => {
      html5QrCode.start(
        deviceIdToUse,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanFailure
      );
    }).catch(() => {
      // Not running yet, just start
      html5QrCode.start(
        deviceIdToUse,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanFailure
      );
    });
  });
}

// Upload image to scan
function uploadImage() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    html5QrCode.scanFile(file, true)
      .then(onScanSuccess)
      .catch(err => {
        alert("Failed to scan image.");
      });
  };

  fileInput.click();
}

// Success handler
function onScanSuccess(decodedText, decodedResult) {
  html5QrCode.pause();
  document.getElementById("result").textContent = isArabic
    ? "جارٍ التحقق..."
    : "Validating...";

  fetch(`${apiUrl}?code=${encodeURIComponent(decodedText)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        document.getElementById("result").textContent = isArabic
          ? "الرمز غير موجود"
          : "Code not found.";
      } else {
        document.getElementById("result").textContent = `
          ${isArabic ? "الوجهة" : "Destination"}: ${data.destination}
          ${isArabic ? " | المالك" : " | Owner"}: ${data.owner}
          ${isArabic ? " | الوصول" : " | Arrival"}: ${data.arrival}
        `;
      }
      html5QrCode.resume();
    })
    .catch(error => {
      document.getElementById("result").textContent = isArabic
        ? "تعذر الوصول إلى الخادم"
        : "Could not reach server.";
      html5QrCode.resume();
    });
}

function onScanFailure(error) {
  // Silent fail (do nothing)
}
