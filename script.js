const apiUrl = "https://api.sheetbest.com/sheets/141d75ff-f837-4250-9528-ecb937f461ac";

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

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

const html5QrCode = new Html5Qrcode("reader");

function switchCamera(facingMode) {
  Html5Qrcode.getCameras().then(devices => {
    let deviceIdToUse = devices.find(cam =>
      facingMode === "user"
        ? cam.label.toLowerCase().includes("front")
        : cam.label.toLowerCase().includes("back")
    )?.id || devices[0].id;

    html5QrCode.stop().then(() => {
      html5QrCode.start(
        deviceIdToUse,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {}
      );
    }).catch(() => {
      html5QrCode.start(
        deviceIdToUse,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {}
      );
    });
  });
}

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    html5QrCode.scanFile(file, true)
      .then(onScanSuccess)
      .catch(() => {
        document.getElementById("result").textContent = isArabic
          ? "فشل في قراءة الصورة"
          : "Failed to decode image.";
      });
  };
  input.click();
}

function onScanSuccess(decodedText) {
  html5QrCode.pause();
  document.getElementById("result").textContent = isArabic ? "جارٍ التحقق..." : "Validating...";

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const match = data.find(row => row.code === decodedText);

      if (match) {
        document.getElementById("result").textContent = `
${isArabic ? "الوجهة" : "Destination"}: ${match.destination}
${isArabic ? " | المالك" : " | Owner"}: ${match.owner}
${isArabic ? " | الوصول" : " | Arrival"}: ${match.arrival}
        `;
      } else {
        document.getElementById("result").textContent = isArabic
          ? "الرمز غير موجود"
          : "Code not found.";
      }

      html5QrCode.resume();
    })
    .catch(() => {
      document.getElementById("result").textContent = isArabic
        ? "خطأ في الاتصال بالخادم"
        : "Error contacting server.";
      html5QrCode.resume();
    });
}
