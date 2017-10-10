const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const {URL} = require('url');
const { ipcRenderer } = require('electron');
let resultObject = {
    noOfChar: '',
    noOfCharSpace: '',
    noOfWords: '',
    noOfUnique: '',
    repetationOfwORD: ''
};
//const eventEmiter = require('events').EventEmitter;
//alert('rrr');
//const events = new eventEmiter();
//alert('Runn');
function processFile(data) {
    for (let key in resultObject) {
        if (resultObject.hasOwnProperty(key))
            resultObject[key] = '';
    }
    alert(new URL('file:///' + data));
    let fileData = fs.readFileSync(new URL('file:///' + data), 'utf8').toString();
    alert('exe');
    if (fileData.trim()) {
        alert(fileData);
        setProgress(Math.round((1 / 6) * 100));
        // let fileData = fileData.replace(/ \n| \t|\n |\t |\n|\t/g, ' ');
        // let fileData = fileData.replace(/. | .|./g, ' ');
        // resultObject.noOfChar = fileData.length;
        // setProgress(Math.round((2 / 6) * 100));
        // fileData = fileData.split(' ');
        // resultObject.noOfCharSpace = fileData.join('').length;
        // setProgress(Math.round((3 / 6) * 100));
        // fileData = fileData.join(' ');
        // resultObject.noOfWords = fileData.length;
        // setProgress(Math.round((4 / 6) * 100));
        // let uniqueWord = [];
        // fileData.map(d => {
        //     if (uniqueWord.findIndex(f => f == d) == -1)
        //         uniqueWord.push({ word: d, repeat: 0 });
        // });
        // resultObject.noOfUnique = uniqueWord.length;
        // setProgress(Math.round((5 / 6) * 100));
        // uniqueWord.map((d, i) => {
        //     let wordRepeat = fileData.filter(g => g == d.word);
        //     if (wordRepeat)
        //         uniqueWord[i].repeat = wordRepeat.length;
        // });
        // resultObject.repetationOfwORD = uniqueWord;
        // setProgress(Math.round((6 / 6) * 100));
        // setTimeout(() => {
        //     showMainDiv(true, false, false);
        // }, 500);
    }
    else
        alert('No text');
    alert('process file');
}
function hel() {
    alert('hel');
}
ipcRenderer.on('file', (event, data) => {
    alert(data);
    hel();
    showMainDiv(false, true, false);
    alert('ok1');
    alert('ffff');
    processFile(data);
    alert('oooooo');
})



function setProgress(width) {
    $('#myBar').width(width + '%');
    $('#myBar').text(width + '%');
}
function showMainDiv(mainDiv, progressDiv, defaultDiv) {
    if (mainDiv) {
        $('.defaultDiv').hide();
        $('.progressReport').hide();
        $('.mainDiv').show();
        alert('div show');
        initMainDiv();
    }
    else if (progressDiv) {
        $('.defaultDiv').hide();
        $('.mainDiv').hide();
        $('.progressReport').show();
        $('#myBar').width('0%');
        $('#myBar').text('0%');
        alert('Finish');
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
    alert('done');
}