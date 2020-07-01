const mainIpc = require('../mainIpc.js');

const timeTableLoader = require('./timeTableLoader.js');
const mealLoader = require('./mealLoader.js');
const dailyLoader = require('./dailyLoader.js');


exports.loadData = function(reqData) {
  switch (reqData['name']) {
    case 'time-table':
      timeTableLoader.loadData(reqData);
      break;
    case 'meal':
      mealLoader.loadData(reqData);
      break;
    case 'daily-note':
      dailyLoader.loadData(reqData);
  }
}

exports.onDataLoaded = function(reqData, data) {
  mainIpc.sendData(reqData, data);
}
