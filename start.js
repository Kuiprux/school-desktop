const electron = require('electron');
const { app, BrowserWindow, Tray, Menu } = require('electron');
const ipcHandler = require('./mainIpc.js');
const os = require("os");
const { exec } = require('child_process');
const path = require('path')

let debugMode = false;
//debugMode = true;

let win = null;
let tray = null;

let isMainMode = true;

let mainTrayMenu;
let calTrayMenu;

function createWindow () {
  if(debugMode) {
    win = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        nodeIntegration: true
      }
    });
  } else {

    let displays = electron.screen.getAllDisplays();
    let display = displays.find((dis) => {
      //return (dis.bounds.x !== 0 || dis.bounds.y !== 0);
        return (dis.bounds.x == 0 || dis.bounds.y == 0);
    })

    // 브라우저 창을 생성합니다.
    win = new BrowserWindow({
    //  width: 1024,
    //  height: 768,
      x: display.bounds.x,
      y: display.bounds.y,
      fullscreen: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
  }

  tray = new Tray('icon.png');
  /*const contextMenu = Menu.buildFromTemplate([
    { label: 'Calendar Mode', click: swapMode },
    { label: 'Quit', click: win.close() }
  ]);*/
  tray.setToolTip('School Desktop');
  //tray.setContextMenu(contextMenu);

  mainTrayMenu = Menu.buildFromTemplate([
    { label: '30724 정종현' },
    { label: 'Quit', click: ()=>{win.close();} }
  ]);
  calTrayMenu = Menu.buildFromTemplate([
    { label: 'Main Mode', click: swapMode },
    { label: 'Quit', click: ()=>{win.close();} }
  ]);

  // and load the index.html of the app.
  //win.loadFile('./web/winmain/index.html')
  loadMode(true);

  // 개발자 도구를 엽니다.
  if(debugMode) win.webContents.openDevTools();

  if(!debugMode) makeWallpaper(getHwnd(win));
}

function loadMode(isMain) {
  isMainMode = isMain;
  if(isMainMode) {
    tray.setContextMenu(mainTrayMenu);
    //win.loadFile('./web/winmain/index.html');
    win.loadURL(`file://${path.join(__dirname, './web/winmain/index.html')}`);
  } else {
    tray.setContextMenu(calTrayMenu);
    //win.loadFile('./web/wincal/index.html');
    win.loadURL(`file://${path.join(__dirname, './web/wincal/index.html')}`);
  }
}
function swapMode() {
  loadMode(!isMainMode);
}

function getHwnd(win) {
  let hbuf = win.getNativeWindowHandle();

  if (os.endianness() == "LE") {
    return hbuf.readInt32LE();
  } else {
    return hbuf.readInt32BE();
  }
}
function makeWallpaper(hwnd) {
  exec(`cd cpp & wallpaper_setter.exe ${hwnd}`, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err);
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  });
}
function resetWallpaper() {
  console.log('aa');
  exec('cd cpp & wallpaper_resetter.exe', (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err);
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
    app.quit();
  });
}

// 이 메소드는 Electron의 초기화가 완료되고
// 브라우저 윈도우가 생성될 준비가 되었을때 호출된다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.whenReady().then(createWindow)

// 모든 윈도우가 닫히면 종료된다.
app.on('window-all-closed', () => {
  // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
  // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
  if (process.platform !== 'darwin') {
    if(debugMode) {
      app.quit();
    } else {
      resetWallpaper();
    }
  }
})

app.on('activate', () => {
  // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
  // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
