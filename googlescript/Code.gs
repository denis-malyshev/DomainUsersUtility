var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
var MAX_RESULT = 500;
var COLUMN_COUNT = 5;

/**
 * Add menu item after the spreadsheet opens.
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Domain Users')
  .addItem('Find All Users', 'updateSheet')
  .addToUi();
}

function setDateFormat() {
  sheet.getRange(2, 4, MAX_RESULT, 1).setNumberFormat("MMM dd, yyyy");
}

function updateSheet() {
  clearTableData();
  setTableHeader();
  fillTable();

  for (i = 1; i <= COLUMN_COUNT; i++) {
    sheet.autoResizeColumn(i);
  }
  setDateFormat();
}

/**
* Cleans table data.
*/
function clearTableData() {
  sheet.getRange(1, 1, MAX_RESULT, COLUMN_COUNT).clear();
}

/**
* Fills table with data about users.
*/
function fillTable() {
  var users = listUsers();

  if (users && users.length > 0) {

    users.sort(function (u1, u2) {
      var date1 = new Date(u1.lastLoginTime).getTime();
      var date2 = new Date(u2.lastLoginTime).getTime();

      return date1 > date2 ? 1 : (date1 == date2 ? 0 : -1);
    });

    for (i = 0; i < users.length; i++) {
      var user = users[i];
      var rowData = [user.name.givenName, user.name.familyName, user.primaryEmail, new Date(user.lastLoginTime), user.suspended ? 'no' : 'yes'];
      sheet.getRange(i + 2, 1, 1, 5).setValues([rowData]);
    }
  }
}

/**
 * Sets table column names and decorates them.
 */
function setTableHeader() {
  var tableHeader = sheet.getRange(1, 1, 1, COLUMN_COUNT);

  tableHeader
  .setValues([["First Name", "Last Name", "Email", "Last Login", "Active"]])
  .setHorizontalAlignment("center")
  .setVerticalAlignment("middle");

  sheet.setFrozenRows(1);
}

/**
 * Returns array of users in domain.
 * @returns {Array}.
 */
function listUsers() {
  var optionalArgs = {
    customer: 'my_customer',
    maxResults: MAX_RESULT,
    orderBy: 'givenName'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return response.users;
}