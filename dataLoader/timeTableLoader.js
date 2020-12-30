const dataLoader = require('./dataLoader.js');
const dailyLoader = require('./dailyLoader.js');
const util = require('./util.js');
const fs = require('fs');

let timeTableData;

exports.loadData = function(reqData) {
  fs.readFile('data/time-table.json', function(err, data) {
    timeTableData = parseData(JSON.parse(data));
    dailyLoader.requestData((name, data) => {
      if(data != undefined) {
        timeTableData['daily'] = filterInvalidDailyTimeTableData(JSON.parse(JSON.stringify(data)));
      }
      dataLoader.onDataLoaded(reqData, timeTableData);
    });
  });
}

function parseData(data) {
  let newData = [];

  for(let i = 0; i < 7; i++) {
    let innerData = [];
    let subjects = getSubjectSetting(data, i);
    let timing = getTimingSetting(data['timing'], i);
    //  //console.log(subjects);

    if(util.isDef(subjects) && util.isDef(timing)) {
      let classExtra, restExtra;

    //    //console.log(timing['extra']);
      if(util.isDef(timing['extra'])) {
        classExtra = timing['extra']['class'];
        restExtra = timing['extra']['rest'];
      }

      let curTime = timing['start-time'];
      for(let j = 0; j < subjects.length; j++) {
        let classData = {};
        classData['subject'] = subjects[j];
        classData['start-time'] = curTime;
        curTime = util.addTime(curTime, getExtraValue(classExtra, j, timing['class-time']));
        classData['end-time'] = curTime;
        innerData.push(classData);

        if(j < subjects.length-1) {
          curTime = util.addTime(curTime, getExtraValue(restExtra, j, timing['rest-time']));
																							//console.log(getExtraValue(restExtra, j, timing['rest-time']));
        }
      }
    }
    newData.push(innerData);
  }
  ////console.log(newData);
  return newData;
}

function filterInvalidDailyTimeTableData(data) {
  //console.log('Validating daily time table data...');

  if(removeIfTimeIsInvalid(data['start-time']))
    console.warn('start-time is discarded due to invalid time data.');
  if(removeIfTimeIsInvalid(data['class-time']))
    console.warn('class-time is discarded due to invalid time data.');
  if(removeIfTimeIsInvalid(data['rest-time']))
    console.warn('rest-time is discarded due to invalid time data.');

  if(data['extra'] != undefined) {
    let checkCode;
    checkCode = discardIfTimeListIsInvalid(data['extra']['class']);
    if(checkCode == 1) {
      console.warn('extra > class is discarded due to wrong data format.');
    } else if (checkCode == 2) {
      console.warn('extra > class is discarded due to invalid time data at ['+i+'].');
    }
    checkCode = discardIfTimeListIsInvalid(data['extra']['rest']);
    if(checkCode == 1) {
      console.warn('extra > rest is discarded due to wrong data format.');
    } else if (checkCode == 2) {
      console.warn('extra > rest is discarded due to invalid time data at ['+i+'].');
    }
  }

  if(data['subjects'] != undefined && !Array.isArray(data['subjects'])) {
    delete data['subjects'];
    console.warn('subjects are discarded due to wrong data format.');
  }
}
function discardIfTimeIsInvalid(data) {
  if(data != undefined && !util.isTimeValid(data)) {
    delete data;
    return true;
  }
  return false;
}
function discardIfTimeListIsInvalid(data) {
  if(data != undefined && !Array.isArray(data)) {
    delete data;
    return 1;
  } else {
    for(let i = 0; i < data.length; i++) {
      if(!util.isTimeValid(data)) {
        delete data;
        return 2;
      }
    }
  }
  return 0;
}

function getExtraValue(data, index, defaultValue) {
																							//console.log(data[index], util.isDef(data), util.isDef(data[index]), util.isTimeValid(data[index]));
  if(util.isDef(data) && util.isDef(data[index]) && util.isTimeValid(data[index])) {
    return data[index];
  }
  return defaultValue;
}

function getSubjectSetting(data, day) {
  if(util.isDef(data['subjects']) && util.isDef(data['subjects'][day]) && isSubjectValid(data['subjects'][day])) //check if subject data exist
    return data['subjects'][day];
  return undefined;
}
function isSubjectValid(data) {
  return util.isDef(data) && Array.isArray(data);
}

function getTimingSetting(data, day) {
  return (!util.isDef(data['extra']) || !isTimingValid(data['extra'][day])) ? data['default'] : data['extra'][day];
}
function isTimingValid(data) {
  return util.isDef(data)
            && util.isDef(data['start-time']) && util.isTimeValid(data['start-time'])
            && util.isDef(data['class-time']) && util.isTimeValid(data['class-time'])
            && util.isDef(data['rest-time']) && util.isTimeValid(data['rest-time']);
}
