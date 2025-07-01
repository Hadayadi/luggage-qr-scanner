// Global language flag from index.html
var isArabic = false;

function onScanSuccess(decodedText, decodedResult) {
    const resultBox = document.getElementById("result");

    // Reset styles before fetch
    resultBox.style.backgroundColor = "";
    resultBox.style.borderColor = "";
    resultBox.innerText = isArabic ? "جاري التحقق..." : "Checking...";

    // 🔁 Fetch destination from Google Sheets backend
    fetch(`https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec`)
        .then(res => res.json())
        .then(data => {
            let destination = data?.destination;

            if (destination) {
                // ✅ Success sound
                const audio = new Audio("success.wav"); // Use success.mp3 if you have it
                audio.play();

                // ✅ Success visual
                resultBox.style.backgroundColor = "#c8e6c9";
                resultBox.style.borderColor = "#4caf50";

                // ✅ Dual-language result
                resultBox.innerText = isArabic
                    ? `الوجهة: ${destination} \nDestination: ${destination}`
                    : `Destination: ${destination} \nالوجهة: ${destination}`;
            } else {
                // ❌ Not found
                resultBox.innerText = isArabic ? "لم يتم العثور على الوجهة." : "Destination not found.";
                resultBox.style.backgroundColor = "#ffebee";
                resultBox.style.borderColor = "#e57373";
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            resultBox.innerText = isArabic ? "حدث خطأ أثناء التحقق." : "Error occurred while checking.";
            resultBox.style.backgroundColor = "#ffebee";
            resultBox.style.borderColor = "#e57373";
        });
}

// QR Scanner initialization
const html5QrcodeScanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250
});
html5QrcodeScanner.render(onScanSuccess);
