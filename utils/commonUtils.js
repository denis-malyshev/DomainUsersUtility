function changeInnerHTML(btnId, value) {
    document.getElementById(btnId).innerHTML = value;
}

function changeElementValue(elementId, value) {
    document.getElementById(elementId).value = value;
}

function appendRow(tableId, rowData) {
    let row = document.getElementById(tableId).getElementsByTagName('tbody')[0].insertRow();

    for (let data of rowData) {
        row.insertCell(row.length).innerHTML = data;
    }
}

function clearTable(tableId) {
    $('#' + tableId).find('tbody').empty();
}