const dataLoader = require('./dataLoader.js');
const fs = require('fs');

const monthValidator = /^(([0-9][0-9])):([0-9][0-9])$/;

let loadedData;

exports.loadData = function(reqData) {
  loadFile((data) => {
    callback(loadFile());
  });
}

function loadFile(callback) {
  console.log(getDateString(date));
  fs.readFile('data/daily/events.dat', function(err, data) {
    if(err == null) {
      console.log(err);
      console.log(data);
      loadedData = parseEventData(data);
      callback(getTrimmedEventData(data, new Date());
    } else {
      callback(undefined);
    }
  });
}

function parseEventData(data):
  let lines = data.substring(" ");
  for(let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if(monthVelidator.test(line) {
    
    }
  }
//TODO
/*

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
*/