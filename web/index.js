const ipcHandler = require('./rendererIpc.js');

window.onload = function() {
  let timeTableDiv = document.getElementById('subject-container');

  let timeDiv = document.getElementById('time');
  let dateDiv = document.getElementById('date');

  let lunchDiv = document.getElementById('lunch');
  let dinnerDiv = document.getElementById('dinner');

  let preDay;

  let timeTableData;
  let curTimeTable;

  let subIndex = 0;
  let isSubStarted = false;

  updateDateAndTime();
  initLoad();

  function updateDateAndTime() {
    let d = new Date();
    timeDiv.innerHTML = dateToString(d, true);
    dateDiv.innerHTML = dateToString(d, false);
    if(preDay != undefined && preDay != d.getDay()) {
      updateNewData();
      subInddex = 0;
      if(timeTableData != undefined) {
        curTimeTable = timeTableData[d.getDay()];
        updateTimeTable();
      }
    } else if(timeTableData != undefined && curTimeTable == undefined) {
      curTimeTable = timeTableData[d.getDay()];
      updateTimeTable();
    }
    if(curTimeTable != undefined) updateSubject(d);
    preDay = d.getDay();
    setTimeout(updateDateAndTime, 100);
  }
  function initLoad() {
    loadTimeTable();
    updateNewData();
  }
  function updateNewData() {
    loadMeal();
  }

  function updateSubject(curDate) {
    if(subIndex >= curTimeTable.length) return;
    let checkDate = new Date();
    let subTime = (isSubStarted ? curTimeTable[subIndex]['end-time'] : curTimeTable[subIndex]['start-time']).split(':');
    checkDate.setSeconds(subTime[subTime.length-1]);
    checkDate.setMinutes(subTime[subTime.length-2]);
    if(subTime.length > 2) checkDate.setHours(subTime[subTime.length-3]);

    if(curDate >= checkDate) {
      if(isSubStarted) {
        timeTableDiv.children[subIndex].classList.remove('selected');
        subIndex++;
      } else {
        timeTableDiv.children[subIndex].classList.add('selected');
      }
      isSubStarted = !isSubStarted;
    }
  }
  function loadTimeTable() {
    ipcHandler.requestData('time-table', saveTimeTable);
  }
  function saveTimeTable(data) {
    console.log(data);
    timeTableData = data;
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
  function updateMeal(data) {
    updateData(lunchDiv, data[0], 'ㆍ', '급식이 없습니다');
    updateData(dinnerDiv, data[1], 'ㆍ', '급식이 없습니다');
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
      return date.getFullYear() + '년 ' + date.getMonth() + '월 ' + date.getDate() + '일 (' + week[date.getDay()] + ')';
    }
  }
}
