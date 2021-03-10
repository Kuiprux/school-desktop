const request = require('request');
const iconv = require('iconv-lite');
const charset = require('charset');

const { parse } = require('node-html-parser');

const dataLoader = require('./dataLoader.js');

const mealUrl = 'https://school.jbedu.kr/jjys/M01050101/';
//const mealUrl = 'https://school.jbedu.kr/youngsaeng/M010501/';
//const mealUrl = 'http://youngsaeng.hs.kr/index.jsp?mnu=M001002003001&SCODE=S0000000777&frame=&year=2019&month=10';

const mealOptions = {
  url: mealUrl,
  headers: {
    'User-Agent': 'Mozilla/5.0'
  },
  encoding: null
};

exports.loadData = function(reqData) {
  request(mealOptions, (err, res, body) => {
    if (err) { return console.log(err); }
        //  const strContents = Buffer.from(body);
        //  const html = iconv.decode(strContents, 'EUC-KR').toString();
    const enc = charset(res.headers, body) // 해당 사이트의 charset값을 획득
    const i_result = iconv.decode(Buffer.from(body), enc); // 획득한 charset값으로 body를 디코딩
    //console.log(i_result);
    //console.log(i_result);
    let root = parse(i_result);
    let meals = root.querySelectorAll('.tch-lnc');
    let mealData = [[], []];
    if(meals != undefined) { //if meal data exist
	  switch(meals.length) {
		case 2:
		  mealData[1] = meals[1].childNodes[1].rawText.split(/\n/).map(str => str.trim().replace(/\(.+/, "")).filter(item => item);
		case 1:
		  mealData[0] = meals[0].childNodes[1].rawText.split(/\n/).map(str => str.trim().replace(/\(.+/, "")).filter(item => item);
		  break;
	  }
	  console.log(mealData);
    }
    dataLoader.onDataLoaded(reqData, mealData);
  });
}
/*
let logs = [];

function hey() {
  let str = '';
  for (let i = 0; i < logs.length; i++) {
    str += 'WOWSANSPAPYRUS';
    str += logs[i];
    str += 'WOW!YOUKNOWSANS!';
  }
  console.log(str);
  return str;
}

function log() {
  console.log(logs.length);
  var fs = require('fs');
  fs.writeFile('log.txt', hey(), function(err){
    if (err === null) {
      console.log('success');
    } else {
      console.log('fail');
    }
  });
}
*/
