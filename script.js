function doGet(e) {
  try {
    const code = e.parameter.code;
    if (!code) throw new Error("Missing code");

    const sheet = SpreadsheetApp.openById("...").getSheetByName("Luggage QR's");
    if (!sheet) throw new Error("Sheet not found");

    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(code).trim()) {
        return ContentService.createTextOutput(JSON.stringify({
          destination: data[i][1],
          owner: data[i][2],
          arrival: data[i][3],
          from: data[i][4],
          departure: data[i][5],
          to: data[i][6],
          next: data[i][7],
          needs: data[i][8]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ error: "Destination not found." }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log(err);
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
