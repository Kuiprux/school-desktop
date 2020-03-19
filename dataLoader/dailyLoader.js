const dataLoader = require('./dataLoader.js');
const fs = require('fs');

let didTimeTableRequested = false;
let didRendererRequested = false;

let loadedData;

exports.requestData = function(callback) { //From timeTableLoader
  if(didTimeTableRequested || loadedData == undefined)
    loadFile((data) => {
      callback(data == undefined ? undefined : data['time-table']);
    });
  else
    return data;
}

exports.loadData = function() { //From mainIpc
  if(didRendererRequested || loadedData == undefined)
    loadFile((data) => {
      dataLoader.onDataLoaded('daily', data);
    });
  else
    return data;
}

function loadFile(callback) {
  let date = new Date();
  fs.readFile('data/daily/'+getDateString(date)+'.json', function(err, data) {
    console.log(err);
    console.log(data);
    //console.log(Buffer.from(data).toString('utf8'));
    let newData = JSON.parse(data);
    loadedData = getDailyData(newData, date.getDay());
    //console.log(newData);
    callback(loadedData);
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
/*
function b(offset) {
  for(let i = 1; i <= 31; i++) {
    console.log(i, offset, a(i+offset, (i+offset-1)%7));
  }
}
*/
