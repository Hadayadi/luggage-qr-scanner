# 🧳 SGS Luggage QR Scanner

A QR code scanner built for Saudi Ground Services (SGS) to track and validate luggage information by scanning QR codes using a web-based interface. The system supports both **camera scanning** and **manual input**, and is fully mobile-friendly.

## 🚀 Features

- ✅ **Live camera scanning** (front/back cameras supported)
- ✅ **Upload QR image files** for scanning
- ✅ **Manual QR code entry** (for fallback cases)
- ✅ **Auto-fetch luggage info** from connected Google Sheet via Sheet.best API
- ✅ **Displays only the matched row**
- ✅ **Language toggle** (Arabic 🇸🇦 / English)
- ✅ **Dark mode** support

## 📸 Live Demo

👉 [Click to open the app](https://hadayadi.github.io/luggage-qr-scanner/)

> Make sure to allow **camera access** when prompted.

## 📦 How It Works

1. Scans a QR code from the camera or image upload.
2. Sends the scanned code to the Sheet.best API connected to a Google Sheet.
3. If a match is found, displays the luggage destination, owner, and arrival date.
4. Manual entry option allows for fallback if QR scan fails.

## 🛠 Technologies Used

- HTML5 + CSS3
- Vanilla JavaScript
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- [Sheet.best API](https://sheet.best)
- Google Sheets as a lightweight database


## 📁 Project Structure

```bash
/
├── index.html         # Main app interface
├── sgs.png            # Logo used in the header
├── README.md          # Project readme file
