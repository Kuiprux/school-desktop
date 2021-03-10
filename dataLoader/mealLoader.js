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
		  mealData[1] = getMealList(meals[1]);
		case 1:
		  mealData[0] = getMealList(meals[0]);
		  break;
	  }
      /*let children = meal.childNodes;
	  console.log(children);
	  let shouldSkip = false;
      for (let i = 0; i < children.length; i++) {
        let tableChild = children[i];
		//console.log(tableChild);
        if(tableChild.nodeType != 3) {
		  if(tableChild.rawText == '중식' || tableChild.rawText == '[중식]')
			continue;
		  else if(tableChild.rawText == '석식' || tableChild.rawText == '[석식]') {
			mealIndex = 1;
			continue;
		  } else {
            //logs.push(tableChild.rawText.split(/[ \(]+/)[0]);
            mealData[mealIndex].push(tableChild.rawText.split(/[ \(]+/)[0]);
          }
        }
      }*/
    }
    //console.log(mealData.length);
    //log();
    dataLoader.onDataLoaded(reqData, mealData);
  });
}

function getMealList(rootDDTag) {
	let children = rootDDTag.childNodes[1].childNodes;
	//console.log(rootUlTag);
			//console.log(rootUlTag.childNodes.length);
	/*for(let i = 0; i < children.length; i++) {
		let child = children[i];
		console.log(i);
        //if(child.nodeType == 1)
			//console.log(child);
	}*/
	console.log(rootDDTag.childNodes[1].rawText.split(/\n/))

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
