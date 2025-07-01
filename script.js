function onScanSuccess(decodedText) {
    const resultBox = document.getElementById("result");
    resultBox.innerText = "Checking...";

    fetch(`https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec`)
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
