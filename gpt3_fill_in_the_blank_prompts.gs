// Replace YOUR_API_KEY with your actual API key
var apiKey = "";
// The URL of the GPT-3 API endpoint
var endpoint = "https://api.openai.com/v1/completions";
//Change this to the column number that maps to your response
var responseIndex = 4
function makeRequestToOpenAI(row_values, row) {
  var prompt = `I need a ${row_values[0]} that will address the pain points and needs of my ${row_values[1]}  and show them how my ${row_values[2]}  is the solution they've been searching for.`
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
  sheet.getRange(row, responseIndex).setValue(json.choices[0].text);
}

function editTrigger(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var editedRange = e.range;
  var row = editedRange.getRow();
  
  // Get the number of columns in the sheet
  var numColumns = sheet.getLastColumn();
  
  // Get the range for the entire row minus the response
  var rowRange = sheet.getRange(row, 1, 1, numColumns-1);
  
  // Get the values for all cells in the row
  var rowValues = rowRange.getValues();
  
  // Check if all cells in the row have a value
  var isRowFilledOut = rowValues[0].every(function(cell) {
    return cell !== "";
  });
  
  if (isRowFilledOut) {
    makeRequestToOpenAI(rowValues,row)
  }
}
