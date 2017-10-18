const $ = require('jquery');
const Chart = require('chart.js');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { ipcRenderer } = require('electron');
const Wordpos = require('wordpos');

let wordpos = new Wordpos();
let resultObject = {
    noOfChar: 0,
    noOfCharSpace: 0,
    noOfWords: 0,
    noOfUnique: 0,
    repetationOfwORD: [],
    noun: [],
    verb: [],
    adverb: [],
    adjective: []
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
        partOfSpech(dotData)
            .then(result => {
                setProgress(Math.round((3 / 7) * 100));
                resultObject.noun = result.noun;
                result.verb = result.verb;
                resultObject.adverb = result.adverb;
                resultObject.adjective = result.adjective; // find noun, verb, adverb, adjective

                let clearData = dotData.split(' ');// total string divided by space
                clearData = clearData.filter(ele => ele.trim() != ''); //[remove spaces present into array]
                let originalData = clearData;
                resultObject.noOfCharSpace = clearData.join('').length; // number of character without[space, dot, comma]
                setProgress(Math.round((4 / 7) * 100));
                resultObject.noOfWords = originalData.length;
                setProgress(Math.round((5 / 7) * 100));

                let uniqueWord = [];
                originalData.map((d, i) => {
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
                setProgress(Math.round((7 / 7) * 100));
                setTimeout(() => {
                    showMainDiv(true, false, false);
                }, 500);
                resultMode = 'file';
            })
            .catch(err => {
                alert('Error occure: ' + err);
            });
    }
    else
        alert('No text');
}
ipcRenderer.on('file', (event, data) => {
    resultMode = 'file';
    showMainDiv(false, true, false);
    processFile(data);
})

function partOfSpech(data) {
    return new Promise((resolve, reject) => {
        wordpos.getPOS(data, (val) => resolve({ noun: val.nouns, verb: val.verbs, adverb: val.adverbs, adjective: val.adjectives }))
    });
}

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
        loadData(resultObject);
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

function generateValue(result) {
    let values = [];
    values.push(result.noun.length > 0 ? Math.round((result.noun.length / result.noOfWords) * 100) : 0);
    values.push(result.verb.length > 0 ? Math.round((result.verb.length / result.noOfWords) * 100) : 0);
    values.push(result.adverb.length > 0 ? Math.round((result.adverb.length / result.noOfWords) * 100) : 0);
    values.push(result.adjective.length > 0 ? Math.round((result.adjective.length / result.noOfWords) * 100) : 0);
    return values;
}

function loadPartOfSpechDiv(result) {
    if (result.noun.length > 0) {
        $('.noun').show();
        $('.noun div').empty();
        $('.noun h2').text(result.noun.length + ' Noun Present');
        let str = result.noun.join(', ');
        $('.noun div').append('<p>' + str + '</p>');
    }
    else
        $('.noun').hide();

    if (result.verb.length > 0) {
        $('.verb').show();
        $('.verb div').empty();
        $('.verb h2').text(result.verb.length + ' Verb Present');
        let str = result.verb.join(', ');
        $('.verb div').append('<p>' + str + '</p>');
    }
    else
        $('.verb').hide();

    if (result.adverb.length > 0) {
        $('.adverb').show();
        $('.adverb div').empty();
        $('.adverb h2').text(result.adverb.length + ' Adverb Present');
        let str = result.adverb.join(', ');
        $('.adverb div').append('<p>' + str + '</p>');
    }
    else
        $('.adverb').hide();

    if (result.adjective.length > 0) {
        $('.adjective').show();
        $('.adjective div').empty();
        $('.adjective h2').text(result.adjective.length + ' Adjective Present');
        let str = result.adjective.join(', ');
        $('.adjective div').append('<p>' + str + '</p>');
    }
    else
        $('.adjective').hide();
}

function generateColor() {
    let colorArray = [];
    let i = 0;
    while (i < 4) {
        colorArray.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
        i++;
    }
    return colorArray;
}
function loadData(result) {
    defaultTab();
    $('#totalChar').text(result.noOfChar);
    $('#totalCharSpace').text(result.noOfCharSpace);
    $('#totalWord').text(result.noOfWords);
    $('#totalUniqueWord').text(result.noOfUnique);
    let colorArray = [];
    let values = [];
    colorArray = generateColor();
    values = generateValue(result);
    loadPartOfSpechDiv(result);
    repetationWordSet(result);
    initChart(colorArray, values);
}

function repetationWordSet(result) {
    $('#repetation tbody').empty();
    for (let word of result.repetationOfwORD)
        $('#repetation tbody').append('<tr><td style="width: 80%;">' + word.word + '</td><td>' + word.repeat + '</td></tr>');
}
function initChart(colorArray, values) {
    let chartDiv = $('#chartData');
    let chart = new Chart(chartDiv, {
        type: 'bar',
        data: {
            labels: ['Noun', 'Verb', 'Adverb', 'Adjective'],
            datasets: [{
                label: 'Part-Of-Spech Percentage Graph',
                data: values,
                backgroundColor: colorArray,
                lineTension: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Part-Of-Spech Analyze',
                    },
                    ticks: {
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        stepSize: 10,
                        max: 100
                    }
                }]
            },
            title: {
                display: true,
                text: 'Part-Of-Spech Analyze Graph'
            }
        }
    });
}