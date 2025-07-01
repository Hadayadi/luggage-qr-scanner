const data = {
    "12345": "Jeddah",
    "54321": "Riyadh"
};

function onScanSuccess(decodedText) {
    const resultElement = document.getElementById("result");
    console.log("Scanned text:", decodedText);

    if (data[decodedText]) {
        resultElement.innerHTML = `<span style='color:green;'>Destination: ${data[decodedText]}</span>`;
        playSuccessSound();
    } else {
        resultElement.innerHTML = "<span style='color:red;'>Code not found. Please check the QR.</span>";
    }
}

function onScanError(errorMessage) {
    console.warn("Scan error:", errorMessage);
}

function playSuccessSound() {
    const audio = new Audio("success.mp3");
    audio.play();
}

const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess, onScanError);