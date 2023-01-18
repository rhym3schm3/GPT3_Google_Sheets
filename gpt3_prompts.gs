
// Replace YOUR_API_KEY with your actual API key
var apiKey = "";
// The URL of the GPT-3 API endpoint
var endpoint = "https://api.openai.com/v1/completions";
function updateResponse(prompt, row) {
  // The parameters for the API request
  var params = {
    "model": "text-davinci-003",
    "prompt": prompt,
    "max_tokens": 4000,
  };
  
  // The options for the API request
  var options = {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    "payload": JSON.stringify(params)
  };
  
  // Make the API request
  var response = UrlFetchApp.fetch(endpoint, options);
  
  // Parse the response
  var json = JSON.parse(response.getContentText());
  
  // Update the response column in the sheet
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(row, 2).setValue(json.choices[0].text);
}

function editTrigger(e) {
  var sheet = e.source.getActiveSheet();
  var columnA = e.range.getColumn();
  var row = e.range.getRow();
  
  // Check if the change was made in column A
  if (columnA == 1) {
    // Check if the cell in column A is not empty
    if (sheet.getRange(row, 1).getValue() != "") {
      updateResponse(sheet.getRange(row, 1).getValue(),row)
    }
  }
}
