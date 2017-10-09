const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');
let resultObject = {
    noOfChar: '',
    noOfCharSpace: '',
    noOfWords: '',
    noOfUnique: '',
    repetationOfwORD: ''
};
//const eventEmiter = require('events').EventEmitter;
alert('rrr');
//const events = new eventEmiter();
alert('Runn');
ipcRenderer.on('file', (event, data) => {
    alert(data);
    showMainDiv(false, true);
    $('#myBar').width('0%');
    processFile(data);
});

function processFile(data) {
    for (let key in resultObject) {
        if (resultObject.hasOwnProperty(key))
            object[key] = '';
    }
    let fileData = fs.readFileSync(data, 'utf8').toString();
    if (fileData.trim()) {
        setProgress(Math.round((1 / 6) * 100));
        let fileData = fileData.replace(/ \n| \t|\n |\t |\n|\t/g, ' ');
        let fileData = fileData.replace(/. | .|./g, ' ');
        resultObject.noOfChar = fileData.length;
        setProgress(Math.round((2 / 6) * 100));
        fileData = fileData.split(' ');
        resultObject.noOfCharSpace = fileData.join('').length;
        setProgress(Math.round((3 / 6) * 100));
        fileData = fileData.join(' ');
        setProgress(Math.round((4 / 6) * 100));
    }
    else
        alert('No text');
}
function showMainDiv(mainDiv = false, progressDiv = false, defaultDiv = false) {
    if (mainDiv) {
        $('.defaultDiv').hide();
        $('.progressReport').hide();
        $('.mainDiv').show();
        initMainDiv();
    }
    else if (progressDiv) {
        $('.defaultDiv').hide();
        $('.mainDiv').hide();
        $('.progressReport').show();
    }
    else if (defaultDiv) {
        $('.mainDiv').hide();
        $('.progressReport').hide();
        $('.defaultDiv').hide();
    }

}

function initMainDiv() {
    $('.mainDiv .fileList ul').empty();
    $('.mainDiv .resultDiv').empty();
}