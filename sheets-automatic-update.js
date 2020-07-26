function importData() {
  var fSource = DriveApp.getFolderById('1924fm3uNR4WKB5n3IqmRLkk3eL26uN7h'); // reports_folder_id = id of folder where csv reports are saved
  var ss = SpreadsheetApp.openById('13VgrmzIpy_Kwgf3BZ9lciPBGVw8t4oaD208UZhSoaDM'); // data_sheet_id = id of spreadsheet that holds the data to be updated with new report data
  var fileNames = [
    {csv: 'audience_city.csv', name: 'Audience City'},
    {csv: 'audience_country.csv',name: 'Audience Country'},
    {csv: 'audience_gender_age.csv', name: 'Audience Gender Age'},
    {csv: 'audience_locale.csv', name: 'Audience Locale'},
    {csv: 'email_contacts.csv', name: 'Email Contacts'},
    {csv: 'follower_count.csv', name: 'Follower Count'},
    {csv: 'get_directions_clicks.csv', name: 'Direction Clicks'},
    {csv: 'impressions.csv', name: 'Impressions'},
    {csv: 'online_followers.csv', name: 'Online Followers'},
    {csv: 'phone_call_clicks.csv', name: 'Phone Call Clicks'},
    {csv: 'profile_views.csv', name: 'Profile Views'},
    {csv: 'reach.csv', name: 'Reach'},
    {csv: 'text_message_clicks.csv', name: 'Text Message Clicks'},
    {csv: 'website_clicks.csv', name: 'Website Clicks'},
    {csv: 'total_follower_count.csv', name: 'Total Follower Count'}
  ];
 
   Logger.log(fileNames.length);
   for (var i = 0; i < fileNames.length; i++) {
    Logger.log(fileNames[i])
    var fi = fSource.getFilesByName(fileNames[i].csv); // latest report file
    if ( fi.hasNext() ) { // proceed if "report.csv" file exists in the reports folder
      var file = fi.next();
      var csv = file.getBlob().getDataAsString();
      var csvData = CSVToArray(csv); // see below for CSVToArray function
      //var sheet = ss.getActiveSheet();
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fileNames[i].name);
      Logger.log(sheet)
      // loop through csv data array and insert (append) as rows into 'NEWDATA' sheet
      for ( var j=0, lenCsv=csvData.length; j<lenCsv; j++ ) {
        sheet.getRange(j+1, 1, 1, csvData[j].length).setValues(new Array(csvData[j]));
      }
      /*
      ** report data is now in 'NEWDATA' sheet in the spreadsheet - process it as needed,
      ** then delete 'NEWDATA' sheet using ss.deleteSheet(newsheet)
      */
      // rename the report.csv file so it is not processed on next scheduled run
      //file.setName("audience_city-"+(new Date().toString())+".csv");
    }
  }
};


// http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.

function CSVToArray( strData, strDelimiter ) {
  // Check to see if the delimiter is defined. If not,
  // then default to COMMA.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[ 3 ];

    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
};