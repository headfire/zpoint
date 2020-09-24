var playerAbout = 'hide';
var playerAutohide = 'off';
var playerRenderMode = 'mono';


//**********************************************
//************** INIT FUNCTION  ****************
//**********************************************

function playerStartEmpty() {
  playerCloneToolbar();
  playerSetInfo();
  webgl = document.getElementById( 'webgl' )
  zpStartEmpty(webgl, 'assets/img/textures', playerOnSlideReady)
}

function playerStartSlide(paper, slide) {
  playerCloneToolbar();
  playerSetInfo();
  webgl = document.getElementById( 'webgl' );
  zpStartSlide(webgl, 'assets/img/textures', 'slides'+'/' + paper + '/' + slide, playerOnSlideReady);
}

function playerOnSlideReady() {
  playerSetHtmlByClass('slide-title', zpGetSlideName())
  window.addEventListener( 'resize', playerOnWindowResize , false );
  requestAnimationFrame( playerOnAnimationFrame );
}

//**********************************************
//**************    EVENT FUNCTION *************
//**********************************************

function playerOnCamera() {
   zpHome();
}

function playerOnDecor() {
	
}

function playerOnRender() {
  if (playerRenderMode == 'mono')	{
 	 playerRenderMode = 'cross-eye'; 
     playerSetStyle('btn-render', 'blue');
  } else if (playerRenderMode == 'cross-eye') {
     playerRenderMode = 'side-by-side';
     playerSetStyle('btn-render', 'red');
  } else if (playerRenderMode == 'side-by-side') {
	 playerRenderMode = 'mono'; 
     playerSetStyle('btn-render', 'gray');
  }	 
  zpSetRenderMode(playerRenderMode)   
  playerSetStyle('drawzone',playerRenderMode)
  playerSetInfo();
}

function playerOnFullscreen() { 
	
}

function playerOnAutohide() {
  if (playerAutohide == 'off')	{
    playerAutohide = 'on';
    playerSetStyle('btn-autohide', 'blue');
    playerSetStyle('controls-top', 'autohide-on');
    playerSetStyle('controls-bottom', 'autohide-on');
  } else if (playerAutohide == 'on') {
    playerAutohide = 'off';
    playerSetStyle('btn-autohide', 'gray');
    playerSetStyle('controls-top', 'autohide-off');
    playerSetStyle('controls-bottom', 'autohide-off');
  }	 
}

function playerOnAbout() {
  if (playerAbout == 'hide')	{
	 playerAbout = 'show'
     playerSetStyle('popup-about', 'show')
  } else  if (playerAbout == 'show') {
	 playerAbout = 'hide'
     playerSetStyle('popup-about', 'hide')
  }	 
}


function playerOnPlay() {
	
}

function playerOnStop() {
	
}

function playerOnStepForward() {
	
}

function playerOnStepBackward() {
	
}


//**********************************************
//****************  SYSTEM EVENTS FUNCTION *****
//**********************************************

function playerOnWindowResize() {
  zpSetRenderZoneSizes();
}

function playerOnAnimationFrame() {
  requestAnimationFrame( playerOnAnimationFrame );
  zpAnimate();
}


//**********************************************
//****************  UTIL FUNCTION **************
//**********************************************

function playerSetStyle(generalClassName, styleClasses) {
  var items = document.getElementsByClassName(generalClassName);
  for(item of items)
	  item.className = generalClassName + ' ' + styleClasses;
}


function playerSetHtmlByClass(className, innerHTML) {
var x = document.getElementsByClassName(className);
var i;
  for (i = 0; i < x.length; i++) {
    x[i].innerHTML = innerHTML;
  }
}

function playerSetInfo() {
   var info = '';
   if (playerRenderMode == 'mono') {
      info = '<font color="#666666">Режим 3D Моно: </font>';
   } else if(playerRenderMode == 'cross-eye') {
      info = '<font color="blue">Режим 3D Перекрестный взгляд: </font>';
   } else if (playerRenderMode == 'side-by-side') {
      info = '<font color="red">Режим 3D Side By Syde: </font>';
   }
   info += "Мышь: Левая: ОСМОТР, Средняя: ПРИБЛИЖЕНИЕ, Правая: СМЕЩЕНИЕ " 
   playerSetHtmlByClass('info', info);
}

function playerCloneToolbar() {
   var toolbarCode = document.getElementById('mono-toolbar').innerHTML;
   document.getElementById('left-toolbar').innerHTML = toolbarCode;
   document.getElementById('right-toolbar').innerHTML = toolbarCode;
}

//Запустить отображение в полноэкранном режиме
function playerFullScreenOn() {
  element =	document.getElementById( 'drawZone' );
  if (element.requestFullScreen) {
      element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
  }
}

// Выход из полноэкранного режима
function playerFullScreenOff() {
  if(document.cancelFullScreen) {
     document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
     document.mozCancelFullScreen();
  } else if(document.webkitCancelFullScreen) {
     document.webkitCancelFullScreen();
  }
}






























