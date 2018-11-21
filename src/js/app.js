import $ from 'jquery';
import {parseCode, deleteTable} from './code-analyzer';
//insert delete and get

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        initTable();
        let codeToParse = $('#codePlaceholder').val();
        //let parsedCode = parseCode(codeToParse);
        //let tableRows = createTable(parsedCode);
        let tableRows = parseCode(codeToParse);
        createTableFromRows(tableRows);
    });
});

//clean table in html and init it.
function initTable(){
    let HTMLtable = document.getElementById('parsedTable');
    for(var i = HTMLtable.rows.length - 1; i > 0; i--)
    {
        HTMLtable.deleteRow(i);
    }
    deleteTable();
}
function createTableFromRows(tableRows) {
    for(let i=0; i<tableRows.length; i++){
        insertRow(i+1, tableRows[i]);
    }
}
function insertRow(i, rowToInsert) {
    let HTMLtable = document.getElementById('parsedTable');
    let row = HTMLtable.insertRow(i);
    let lineCell = row.insertCell(0);
    let typeCell = row.insertCell(1);
    let nameCell = row.insertCell(2);
    let conditionCell = row.insertCell(3);
    let valueCell = row.insertCell(4);
    lineCell.innerHTML = rowToInsert['line'];
    typeCell.innerHTML = rowToInsert['type'];
    nameCell.innerHTML = rowToInsert['name'];
    conditionCell.innerHTML = rowToInsert['condition'];
    valueCell.innerHTML = rowToInsert['value'];
}


