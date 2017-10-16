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
let resultMode = 'file';

function processFile(data) {
    for (let key in resultObject) {
        if (resultObject.hasOwnProperty(key))
            resultObject[key] = '';
    }
    let fileData = fs.readFileSync(new URL('file:///' + data), 'utf8').toString();
    if (fileData.trim()) {
        setProgress(Math.round((1 / 7) * 100));
        let nelineData = fileData.replace(/(?:\r\n|\r|\n)/g, ' ');
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
        setProgress(Math.round((5 / 7) * 100));

        uniqueWord.map((d, i) => {
            let wordRepeat = originalData.filter(g => g.toLowerCase().trim() == d.word);
            if (wordRepeat)
                uniqueWord[i].repeat = wordRepeat.length - 1; // repetation of each word
        });
        resultObject.repetationOfwORD = uniqueWord;
        setProgress(Math.round((6 / 7) * 100));
        setTimeout(() => {
            showMainDiv(true, false, false);
        }, 500);
        //alert('Result: ' + JSON.stringify(resultObject));
        resultMode = file;
    }
    else
        alert('No text');
}
ipcRenderer.on('file', (event, data) => {
    resultMode = 'file';
    showMainDiv(false, true, false);
    processFile(data);
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
        initMainDiv();
    }
    else if (progressDiv) {
        $('.defaultDiv').hide();
        $('.mainDiv').hide();
        $('.progressReport').show();
        $('#myBar').width('0%');
        $('#myBar').text('0%');
    }
    else if (defaultDiv) {
        $('.mainDiv').hide();
        $('.progressReport').hide();
        $('.defaultDiv').hide();
    }

}

function initMainDiv() {
    if (resultMode == 'file') {
        $('.mainDiv .fileList ul').empty();
        $('.mainDiv .fileList ul').hide();
        $('.mainDiv .fileList .emptyText').show();
        loadData();
    }
    else if (resultMode == 'folder') {
        $('.mainDiv .fileList ul').show();
        $('.mainDiv .fileList ul').empty();
        $('.mainDiv .fileList .emptyText').hide();
    }
}

function loadData(){
    $('#totalChar').text(resultObject.noOfChar);
    $('#totalCharSpace').text(resultObject.noOfCharSpace);
    $('#totalWord').text(resultObject.noOfWords);
    $('#totalUniqueWord').text(resultObject.noOfUnique);
}