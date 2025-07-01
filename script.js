function onScanSuccess(decodedText, decodedResult) {
    const resultBox = document.getElementById("result");
    resultBox.style.backgroundColor = "";
    resultBox.style.borderColor = "";
    resultBox.innerText = window.isArabic ? "جاري التحقق..." : "Checking...";

    fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?code=${decodedText}`)
        .then(res => res.json())
        .then(data => {
            let destination = data?.destination;
            if (destination) {
                const audio = new Audio("success.wav");
                audio.play();

                resultBox.style.backgroundColor = "#c8e6c9";
                resultBox.style.borderColor = "#4caf50";

                resultBox.innerText = window.isArabic
                    ? `الوجهة: ${destination} \nDestination: ${destination}`
                    : `Destination: ${destination} \nالوجهة: ${destination}`;
            } else {
                resultBox.innerText = window.isArabic ? "لم يتم العثور على الوجهة." : "Destination not found.";
                resultBox.style.backgroundColor = "#ffebee";
                resultBox.style.borderColor = "#e57373";
            }
        })
        .catch(err => {
            resultBox.innerText = window.isArabic ? "حدث خطأ أثناء التحقق." : "Error occurred while checking.";
            resultBox.style.backgroundColor = "#ffebee";
            resultBox.style.borderColor = "#e57373";
        });
}

const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);