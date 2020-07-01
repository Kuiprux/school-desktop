const dataLoader = require('./dataLoader.js');
const util = require('./util.js');
const fs = require('fs');

let didTimeTableRequested = false;
let didRendererRequested = false;

let loadedData;

exports.requestData = function(callback) { //From timeTableLoader
  if(didTimeTableRequested || loadedData == undefined)
    loadFile((data) => {
      callback(data == undefined || data['time-table'] == undefined ? undefined : data['time-table']);
    });
  else
    return loadedData['time-table'];
}

exports.loadData = function(reqData) { //From mainIpc
  if(didRendererRequested || loadedData == undefined)
    loadFile((data) => {
      dataLoader.onDataLoaded(reqData, (data == undefined ? undefined : data['note']));
    });
  else
    return loadedData['note'];
}

function loadFile(callback) {
  let date = new Date();
  console.log(getDateString(date));
  fs.readFile('data/daily/'+getDateString(date)+'.json', function(err, data) {
    if(err == null) {
      console.log(err);
      console.log(data);
      //console.log(Buffer.from(data).toString('utf8'));
      let newData = JSON.parse(data);
      loadedData = getDailyData(newData, date.getDay());
      //console.log(newData);
      callback(loadedData);
    } else {
      callback(undefined);
    }
  });
}

function getDailyData(data, day) {
  if(data == undefined) return undefined;
  if(data[day] == undefined) return undefined;
  if(Object.keys(data[day]).length === 0 && data[day].constructor === Object) return undefined;
  return data[day];
}

function getDateString(date) {
  let year = date.getFullYear().toString().substr(-2)
  let month = (date.getMonth()+1).toString();
  if (month.length === 1)
    month = "0" + month;
  let week = getWeek(date.getDate(), date.getDay());
  return year+month+week;
}

function getWeek(date, day) {
  let fixer = day-Math.floor(date%7);
  if(fixer < 0) fixer += 7;
  return Math.floor((date+fixer)/7);
}

function filterInvalidDailyNote(data) {
  console.log('Validating daily note data...');

  if(!Array.isArray(data)) {
    console.warn('note data is discarded due to wrong data format.');
    return false;
  }

  for(let i = 0; i < data.length; i++) {
    let aNote = data[i]
    console.log('checking note[' + i + ']...');
    if(!util.isTimeValid(aNote['start-time'])) {
      aNote['start-time'] = undefined;
      console.warn('start-time is discarded due to invalid time data.');
    }
    if(!util.isTimeValid(aNote['end-time'])) {
      sNote['end-time'] = undefined;
      console.warn('end-time is discarded due to invalid time data.');
    }
  }
}

/*
function b(offset) {
  for(let i = 1; i <= 31; i++) {
    console.log(i, offset, a(i+offset, (i+offset-1)%7));
  }
}
*/
