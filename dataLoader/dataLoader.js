const mainIpc = require('../mainIpc.js');

const timeTableLoader = require('./timeTableLoader.js');
const mealLoader = require('./mealLoader.js');


exports.loadData = function(name) {
  switch (name) {
    case 'time-table':
      timeTableLoader.loadData();
      break;
    case 'meal':
      mealLoader.loadData();
      break;
  }
}

exports.onDataLoaded = function(name, data) {
  mainIpc.sendData(name, data);
}
