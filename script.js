function onScanSuccess(decodedText) {
    const resultBox = document.getElementById("result");
    resultBox.innerText = "Checking...";

    fetch(`https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec?code=${decodedText}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                resultBox.innerHTML = `<span style="color:red;">Code not found.</span>`;
                return;
            }

            const { owner, from, to, next, needs } = data;

            resultBox.innerHTML = `
                <strong>Owner:</strong> ${owner}<br>
                <strong>From:</strong> ${from}<br>
                <strong>To:</strong> ${to}<br>
                <strong>Next Stop:</strong> ${next || '—'}<br>
                <strong>Special Needs:</strong> ${needs || 'None'}
            `;

            new Audio("success.mp3").play();
        })
        .catch(err => {
            resultBox.innerHTML = `<span style="color:red;">Error occurred.</span>`;
        });
}

const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
    { facingMode: "environment" }, 
    { fps: 10, qrbox: 250 },
    onScanSuccess
).catch(err => {
    document.getElementById("result").innerHTML = `<span style="color:red;">Camera error: ${err}</span>`;
});
