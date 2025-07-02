let html5QrcodeScanner;
let currentCamera = 'environment'; // Default to back camera

const qrCodeSuccessCallback = async (decodedText) => {
  document.getElementById("result").textContent = window.isArabic ? "جارٍ التحميل..." : "Loading...";

  try {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec?code=${decodedText}`);
    const data = await response.json();

    if (data.error) {
      document.getElementById("result").textContent = window.isArabic ? "لم يتم العثور على الوجهة" : "Destination not found";
    } else {
      const details = `
        ${window.isArabic ? 'الوجهة' : 'Destination'}: ${data.destination}
        ${window.isArabic ? 'المالك' : 'Owner'}: ${data.owner}
        ${window.isArabic ? 'الوصول' : 'Arrival'}: ${data.arrival}
        ${window.isArabic ? 'من' : 'From'}: ${data.from}
        ${window.isArabic ? 'المغادرة' : 'Departure'}: ${data.departure}
        ${window.isArabic ? 'إلى' : 'To'}: ${data.to}
        ${window.isArabic ? 'التالي' : 'Next'}: ${data.next}
        ${window.isArabic ? 'الاحتياجات' : 'Needs'}: ${data.needs}
      `;
      document.getElementById("result").textContent = details;
    }
  } catch (err) {
    document.getElementById("result").textContent = window.isArabic ? "فشل الاتصال بالخادم" : "Could not reach server.";
  }
};

const startScanner = async () => {
  const config = {
    fps: 10,
    qrbox: 250,
    aspectRatio: 1.333,
    facingMode: currentCamera
  };

  if (html5QrcodeScanner) {
    await html5QrcodeScanner.stop();
  }

  html5QrcodeScanner = new Html5Qrcode("reader");
  html5QrcodeScanner.start(
    { facingMode: currentCamera },
    config,
    qrCodeSuccessCallback
  ).catch(err => {
    console.error("Camera start error:", err);
    document.getElementById("result").textContent = window.isArabic ? "تعذر بدء الكاميرا" : "Unable to start camera.";
  });
};

const switchCamera = async (facingMode) => {
  currentCamera = facingMode;
  await startScanner();
};

window.isArabic = false;

function toggleLanguage() {
  window.isArabic = !window.isArabic;
  document.getElementById('main-title').textContent = isArabic ? 'ماسح رمز الأمتعة' : 'Luggage Code Scanner';
  document.getElementById("result").textContent = isArabic ? 'في انتظار المسح...' : 'Waiting for scan...';
  document.querySelector('footer').textContent = isArabic ? '© 2025 الأكاديمية السعودية للخدمات الأرضية' : '© 2025 Saudi Ground Services Academy';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function uploadImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const html5QrCode = new Html5Qrcode("reader");
      try {
        const decodedText = await html5QrCode.scanFile(file, true);
        qrCodeSuccessCallback(decodedText);
      } catch (err) {
        document.getElementById("result").textContent = isArabic ? "لم يتم العثور على رمز QR." : "QR code not found.";
      }
    };
    reader.readAsDataURL(file);
  };

  input.click();
}

window.onload = () => {
  startScanner();
};
