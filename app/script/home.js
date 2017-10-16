const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { ipcRenderer } = require('electron');
let resultObject = {
    noOfChar: '',
    nochardot: '',
    noOfCharSpace: '',
    noOfWords: '',
    noOfUnique: '',
    repetationOfwORD: ''
};
let resultMode = '';
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
        alert(fileData + typeof fileData);
        setProgress(Math.round((1 / 7) * 100));
        let nelineData = fileData.replace(/(?:\r\n|\r|\n)/g, ' ');
        alert('New line data::  ' + nelineData);
        resultObject.noOfChar = nelineData.length;// number of char with [space, coma, dot]
        setProgress(Math.round((2 / 7) * 100));
        let dotData = nelineData.replace(/[\.,]+/g, ' ');// remove [, and .];
        let clearData = dotData.split(' ');// total string divided by space
        clearData = clearData.filter(ele => ele.trim() != ''); //[remove spaces present into array]
        let originalData = clearData;
        resultObject.noOfCharSpace = clearData.join('').length; // number of character without[space, dot, comma]
        setProgress(Math.round((3 / 7) * 100));

        resultObject.noOfWords = originalData.length;
        setProgress(Math.round((4 / 7) * 100));

        let uniqueWord = [];
        originalData.map((d, i) => {
            //alert('word: ' + d + ' index ' + i);
            if (uniqueWord.findIndex(f => f.word == d.trim().toLowerCase()) == -1) // Find Unique words.
                uniqueWord.push({ word: d.trim().toLowerCase(), repeat: 0 });
        });
        resultObject.noOfUnique = uniqueWord.length;
        setProgress(Math.round((6 / 7) * 100));

        uniqueWord.map((d, i) => {
            let wordRepeat = originalData.filter(g => g.toLowerCase().trim() == d.word);
            if (wordRepeat)
                uniqueWord[i].repeat = wordRepeat.length - 1; // repetation of each word
        });
        resultObject.repetationOfwORD = uniqueWord;
        setProgress(Math.round((7 / 6) * 100));
        setTimeout(() => {
            showMainDiv(true, false, false);
        }, 500);
        //alert('Result: ' + JSON.stringify(resultObject));
        resultMode = file;
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