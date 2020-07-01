//const timeValidator = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])(:[0-5]?[0-9])?$/;
//const timeValidator = /^([0-1]?[0-9]|2[0-3]:)?([0-5][0-9]):([0-5][0-9])$/;
const timeValidator = /^(([0-1]?[0-9]|2[0-3]):)?([0-5]?[0-9]):([0-5]?[0-9])$/;

function isDef(v) {
    return v !== undefined && v !== null;
}

function isTimeValid(time) {
  return timeValidator.test(time);
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

exports.isDef = isDef;
exports.isTimeValid = isTimeValid;
exports.addTime = addTime;
