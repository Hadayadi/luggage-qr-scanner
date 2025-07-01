function onScanSuccess(decodedText) {
    const resultBox = document.getElementById("result");
    resultBox.innerHTML = "<em>Checking...</em>";

    fetch(`https://script.google.com/macros/s/AKfycbyUyfpiO2tGtJ80__hehw-wGIRLMFj8cuEusmim-9NXDC-T6HCpLVCaZPeZrv8sAkUk/exec?code=${encodeURIComponent(decodedText)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
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

            try {
                const audio = new Audio("success.mp3");
                audio.play();
            } catch (e) {
                console.warn("Audio playback failed:", e);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            resultBox.innerHTML = `<span style="color:red;">Error occurred while checking. Please try again.</span>`;
        });
}
