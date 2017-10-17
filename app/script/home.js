const $ = require('jquery');
const Chart = require('chart.js');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { ipcRenderer } = require('electron');

let resultObject = {
    noOfChar: 0,
    nochardot: 0,
    noOfCharSpace: 0,
    noOfWords: 0,
    noOfUnique: 0,
    repetationOfwORD: 0
};
let resultMode = 'file';

$('#tableFormat').on('click', () => {
    if (!($('#tableData').is(':visible'))) {
        $('#graphFormat').removeClass('setDiv');
        $('#graphFormat').addClass('notActive');
        $('#tableFormat').removeClass('notActive');
        $('#tableFormat').addClass('setDiv');
        $('#graphData').hide();
        $('#tableData').show();
    }
});

$('#graphFormat').on('click', () => {
    alert('click');
    if (!($('#graphData').is(':visible'))) {
        $('#tableFormat').removeClass('setDiv');
        $('#tableFormat').addClass('notActive');
        $('#graphFormat').removeClass('notActive');
        $('#graphFormat').addClass('setDiv');
        $('#tableData').hide();
        $('#graphData').show();
    }
});


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

function defaultTab() {
    $('#graphFormat').removeClass('setDiv');
    $('#graphFormat').addClass('notActive');
    $('#tableFormat').removeClass('notActive');
    $('#tableFormat').addClass('setDiv');
    $('#graphData').hide();
    $('#tableData').show();
}
function loadData() {
    defaultTab();
    $('#totalChar').text(resultObject.noOfChar);
    $('#totalCharSpace').text(resultObject.noOfCharSpace);
    $('#totalWord').text(resultObject.noOfWords);
    $('#totalUniqueWord').text(resultObject.noOfUnique);
    let chartDiv = $('#chartData');
    let labell = resultObject.repetationOfwORD.map(d => d.word);
    let colorArray = [];
    let values = resultObject.repetationOfwORD.map(d => {
        colorArray.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
        return d.repeat != 0 ? Math.round((d.repeat / resultObject.noOfWords) * 100) : 0;
    });
    let chart = new Chart(chartDiv, {
        type: 'bar',
        data: {
            labels: labell,
            datasets: [{
                label: 'Word Repetation Percentage',
                data: values,
                backgroundColor: colorArray,
                lineTension: 0
            }]
        },
        options:{
            responsive: true,
            scales:{
                xAxes:[{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Repeat %',
                    },
                    ticks:{
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        stepSize : 10,                        
                        max: 100
                    }
                }]
            },
            title:{
                display: true,
                text: 'Percentage of each word repetation'
            }
        }
    });
}