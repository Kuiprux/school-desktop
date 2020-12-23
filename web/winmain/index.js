const ipcHandler = require('../rendererIpc.js');

window.onload = init;
function init() {
  let timeTableDiv = document.getElementById('subject-container');

  let timeDiv = document.getElementById('time');
  let dateDiv = document.getElementById('date');

  const DOT = 'ㆍ';

  let noteDiv = document.getElementById('note');

  let lunchDiv = document.getElementById('lunch');
  let dinnerDiv = document.getElementById('dinner');

  //let isInited = false;

  let preDay;

  let timeTableData;
  let curTimeTable;
  let dailyNoteData;

  let subIndex = 0;
  let isSubStarted = false;

  updateDateAndTime();
  initLoad();
  //isInited = true;

  function updateDateAndTime() { //TODO note color update
    let d = new Date();
    timeDiv.innerHTML = dateToString(d, true);
    dateDiv.innerHTML = dateToString(d, false);
    if(preDay != undefined && preDay != d.getDay()) { //if it is initializing or have become next day
      updateNewData();
      subInddex = 0;
      if(timeTableData != undefined) { // if timeTableData exists
        curTimeTable = timeTableData[d.getDay()];
        updateTimeTable();
      }
    } else if(timeTableData != undefined && curTimeTable == undefined) {
      curTimeTable = timeTableData[d.getDay()];
      updateTimeTable();
    }
    if(curTimeTable != undefined) updateSubject(d);
    if(dailyNoteData != undefined) updateDailyNote(d);
    preDay = d.getDay();
    setTimeout(updateDateAndTime, 100);
  }
  function initLoad() {
    loadTimeTable();
    updateNewData();
  }
  function updateNewData() {
    loadMeal();
    loadDailyNote();
  }

  function updateSubject(curDate) {
    if(subIndex >= curTimeTable.length) return;
    let checkDate = timeDataToDate(isSubStarted ? curTimeTable[subIndex]['end-time'] : curTimeTable[subIndex]['start-time']);

    if(curDate >= checkDate) {
      if(isSubStarted) {
        timeTableDiv.children[subIndex].classList.remove('selected');
        if(subIndex < curTimeTable.length) timeTableDiv.children[subIndex].classList.add('done');
        subIndex++;
      } else {
        timeTableDiv.children[subIndex].classList.add('selected');
      }
      isSubStarted = !isSubStarted;
    }
  }
  function updateDailyNote(curDate) {
    console.log(curDate);
    for(let i = 0; i < noteDiv.children.length; i++) {
      let aNoteDiv = noteDiv.children[i];
      if(!aNoteDiv.classList.contains('always-selected')) {
        let startTime = timeDataToDate(aNoteDiv.getAttribute('start-time'));
        let endTime = timeDataToDate(aNoteDiv.getAttribute('end-time'));
        console.log(i, startTime == undefined, startTime <= curDate,endTime == undefined, endTime > curDate);
        if(startTime == undefined && endTime == undefined) {
          aNoteDiv.classList.add('always-selected');
        } else if((startTime == undefined || startTime <= curDate) && (endTime == undefined || endTime > curDate)) { // TODO flickering bug
          console.log(i, 'a')
          if(!aNoteDiv.classList.contains('selected')) {
            aNoteDiv.classList.add('selected');
          }
        } else {
          console.log(i, 'b')
          if(aNoteDiv.classList.contains('selected')) {
            aNoteDiv.classList.remove('selected');
          }
        }
      }
    }
  }

  function loadTimeTable() {
    ipcHandler.requestData('time-table', saveTimeTable);
  }
  function saveTimeTable(res) {
    timeTableData = res['data'];
  }
  function updateTimeTable() {
    let children = timeTableDiv.children;
    //console.log(curTimeTable)
    for(let i = 0; i < curTimeTable.length; i++) {
      if(i < children.length) {
        //console.log(curTimeTable[i]['subject']);
        children[i].innerText = curTimeTable[i]['subject'];
      } else {
        let newDiv = document.createElement('div');
        newDiv.innerText = curTimeTable[i]['subject'];
        newDiv.classList.add('subject');
        timeTableDiv.appendChild(newDiv);
      }
    }
    while(children.length > curTimeTable.length) {
      timeTableDiv.removeChild(children[children.length-1]);
    }
  }


  function loadMeal() {
    ipcHandler.requestData('meal', updateMeal);
  }
  function updateMeal(res) {
    updateData(lunchDiv, res['data'][0], DOT, '급식이 없습니다');
    updateData(dinnerDiv, res['data'][1], DOT, '급식이 없습니다');
  }

  function loadDailyNote() {
    ipcHandler.requestData('daily-note', saveDailyNote);
  }
  function saveDailyNote(res) {
    dailyNoteData = res['data'];

    if(dailyNoteData != undefined) {
      noteDiv.innerHTML = '';
      for(let i = 0; i < dailyNoteData.length; i++) {
        let line = dailyNoteData[i];
        let lineDiv = document.createElement('div');
        lineDiv.classList.add('note-line');
        lineDiv.classList.add(line['type']);
        if(line['start-time'] != undefined) lineDiv.setAttribute('start-time', line['start-time'])
        if(line['end-time'] != undefined) lineDiv.setAttribute('end-time', line['end-time'])
        lineDiv.innerText = DOT + line['content'];
        noteDiv.appendChild(lineDiv);
      }
    }
  }


  function updateData(div, data, prefix, emptyText) {
    div.innerHTML = "";
    if(data.length == 0) {
      if(emptyText != undefined) {
        div.innerHTML = emptyText;
      }
    } else {
      for(let i = 0; i < data.length; i++) {
        div.innerHTML += prefix + data[i];
        if(i < data.length-1) {
          div.innerHTML += '<br />';
        }
      }
    }
  }


  function dateToString(date, isTime){
    if(isTime) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return hours + ':' + minutes;
    } else {
      let week = ['일', '월', '화', '수', '목', '금', '토'];
      return date.getFullYear() + '년 ' + (date.getMonth()+1) + '월 ' + date.getDate() + '일 (' + week[date.getDay()] + ')';
    }
  }
  function timeDataToDate(data, date) {
    if(data == undefined) return undefined;
    let newDate = (date == undefined ? new Date() : date);
    let subTime = data.split(':');
    newDate.setSeconds(subTime[subTime.length-1]);
    newDate.setMinutes(subTime[subTime.length-2]);
    if(subTime.length > 2) newDate.setHours(subTime[subTime.length-3]);

    return newDate;
  }
}
