const dataLoader = require('./dataLoader.js');
const dailyLoader = require('./dailyLoader.js');
const fs = require('fs');

//const timeValidator = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])(:[0-5]?[0-9])?$/;
//const timeValidator = /^([0-1]?[0-9]|2[0-3]:)?([0-5][0-9]):([0-5][0-9])$/;
const timeValidator = /^(([0-1]?[0-9]|2[0-3]):)?([0-5]?[0-9]):([0-5]?[0-9])$/;

let timeTableData;

exports.loadData = function() {
  fs.readFile('data/time-table.json', function(err, data) {
    timeTableData = parseData(JSON.parse(data));
    dailyLoader.requestData((name, data) => {
      if(data != undefined) {
        timeTableData['daily'] = filterValidDailyData(JSON.parse(JSON.stringify(data)));
      }
      dataLoader.onDataLoaded('time-table', timeTableData);
    });
  });
}

function parseData(data) {
  let newData = [];

  for(let i = 0; i < 7; i++) {
    let innerData = [];
    let subjects = getSubjectSetting(data, i);
    let timing = getTimingSetting(data['timing'], i);
    //  console.log(subjects);

    if(isDef(subjects) && isDef(timing)) {
      let classExtra, restExtra;

    //    console.log(timing['extra']);
      if(isDef(timing['extra'])) {
        classExtra = timing['extra']['class'];
        restExtra = timing['extra']['rest'];
      }

      let curTime = timing['start-time'];
      for(let j = 0; j < subjects.length; j++) {
        let classData = {};
        classData['subject'] = subjects[j];
        classData['start-time'] = curTime;
        curTime = addTime(curTime, getExtraValue(classExtra, j, timing['class-time']));
        classData['end-time'] = curTime;
        innerData.push(classData);

        if(j < subjects.length-1) {
          curTime = addTime(curTime, getExtraValue(restExtra, j, timing['rest-time']));
        }
      }
    }
    newData.push(innerData);
  }
  //console.log(newData);
  return newData;
}

function filterValidDailyData(data) {
  console.log('loading daily data...');

  if(removeIfTimeIsInvalid(data['start-time']))
    console.warn('start-time is discarded dur to invalid time data.');
  if(removeIfTimeIsInvalid(data['class-time']))
    console.warn('class-time is discarded dur to invalid time data.');
  if(removeIfTimeIsInvalid(data['rest-time']))
    console.warn('rest-time is discarded dur to invalid time data.');

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
  if(data != undefined && !isTimeValid(data)) {
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
      if(!isTimeValid(data)) {
        delete data;
        return 2;
      }
    }
  }
  return 0;
}

function addTime(time1, time2) {
  if(!isTimeValid(time1) || !isTimeValid(time2)) return undefined;
  let arr1 = time1.split(':');
  let arr2 = time2.split(':');
  let resArr = [];
  if(arr1.length == 2) arr1.unshift(0)
  if(arr2.length == 2) arr2.unshift(0)
  for(let i = 0; i < 3; i++) {
    resArr[i] = +arr1[i] + +arr2[i];
    if(i != 0 && resArr[i] >= 60) {
      resArr[i] -= 60;
      resArr[i-1] += 1;
    }
  }
  if(resArr[0] == 0)
    resArr.shift();
  let answer = resArr.join(':');
  return answer;
}

function isTimeValid(time) {
  return timeValidator.test(time);
}

function getExtraValue(data, index, defaultValue) {
  if(isDef(data) && isDef(data[index]) && isTimeValid(data[index])) {
    return data[index];
  }
  return defaultValue;
}

function getSubjectSetting(data, day) {
  if(isDef(data['subjects']) && isDef(data['subjects'][day]) && isSubjectValid(data['subjects'][day])) //check if subject data exist
    return data['subjects'][day];
  return undefined;
}
function isSubjectValid(data) {
  return isDef(data) && Array.isArray(data);
}

function getTimingSetting(data, day) {
  return (!isDef(data['extra']) || !isTimingValid(data['extra'][day])) ? data['default'] : data['extra'][day];
}
function isTimingValid(data) {
  return isDef(data)
            && isDef(data['start-time']) && isTimeValid(data['start-time'])
            && isDef(data['class-time']) && isTimeValid(data['class-time'])
            && isDef(data['rest-time']) && isTimeValid(data['rest-time']);
}

function isDef(v) {
    return v !== undefined && v !== null;
}
