var playerAbout = 'hide';
var playerAutohide = 'off';
var playerRender = 'mono';

function playerInit(paper, slide) {
  mainCloneToolbar();
  playerSetInfo();
  webgl = document.getElementById( 'webgl' )
  if ((paper == 'nopaper') && (slide == 'noslide')) {
	 zdeskStartEmpty(webgl, 'assets/img/textures/')
  } else {
     zdeskStartSlide(webgl, 'assets/img/textures/', 'slides'+'/' + paper + '/' + slide +'/')
     mainLoadSlideInfo(paper, slide);
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


function playerOnCamera() {
   zdeskHome();
}

function playerOnDecor() {
	
}

function playerOnRender() {
  if (playerRender == 'mono')	{
 	 playerRender = 'cross-eye'; 
     playerSetStyle('btn-render', 'blue');
  } else if (playerRender == 'cross-eye') {
     playerRender = 'side-by-side';
     playerSetStyle('btn-render', 'red');
  } else if (playerRender == 'side-by-side') {
	 playerRender = 'mono'; 
     playerSetStyle('btn-render', 'gray');
  }	 
  zdeskSetRenderMode(playerRender)   
  playerSetStyle('drawzone',playerRender)
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

function playerSetStyle(mainClassName, styleClasses) {
  var items = document.getElementsByClassName(mainClassName);
  for(item of items)
	  item.className = mainClassName + ' ' + styleClasses;
}


//UTIL
function mainSetHtmlByClass(className, innerHTML) {
var x = document.getElementsByClassName(className);
var i;
  for (i = 0; i < x.length; i++) {
    x[i].innerHTML = innerHTML;
  }
}

function playerSetInfo() {
   var info = '';
   if (playerRender == 'mono') {
      info = '<font color="#666666">Режим 3D Моно: </font>';
   } else if(playerRender == 'cross-eye') {
      info = '<font color="blue">Режим 3D Перекрестный взгляд: </font>';
   } else if (playerRender == 'side-by-side') {
      info = '<font color="red">Режим 3D Side By Syde: </font>';
   }
   info += "Мышь: Левая: ОСМОТР, Средняя: ПРИБЛИЖЕНИЕ, Правая: СМЕЩЕНИЕ " 
   mainSetHtmlByClass('info', info);
}

function mainCloneToolbar() {
   var toolbarCode = document.getElementById('mono-toolbar').innerHTML;
   document.getElementById('left-toolbar').innerHTML = toolbarCode;
   document.getElementById('right-toolbar').innerHTML = toolbarCode;
}

//Запустить отображение в полноэкранном режиме
function launchFullScreen(element) {
if(element.requestFullScreen) {
element.requestFullScreen();
} else if(element.mozRequestFullScreen) {
element.mozRequestFullScreen();
} else if(element.webkitRequestFullScreen) {
element.webkitRequestFullScreen();
}
}

// Выход из полноэкранного режима
function cancelFullscreen() {
if(document.cancelFullScreen) {
document.cancelFullScreen();
} else if(document.mozCancelFullScreen) {
document.mozCancelFullScreen();
} else if(document.webkitCancelFullScreen) {
document.webkitCancelFullScreen();
}
}


function mainLoadSlideInfo(paper, slide) {
   var filename = 'slides' + '/' + paper + '/' + slide + '/' + 'slide_info.json?time='+ new Date().getTime();
   var slideName = '';
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.open('GET', filename, true);
   xmlhttp.onreadystatechange = function() {
     if (xmlhttp.readyState == 4) {
       if (xmlhttp.status == 200) {
	       var slideInfo = JSON.parse(xmlhttp.responseText);
		   mainSetHtmlByClass('slide-title', slideInfo.slideName)
		   mainSetHtmlByClass('html-title', 'Точка сборки 3D | ' + slideInfo.slideName)
	    }
	 }
  };
 xmlhttp.send(null); 
}


function mainOnFullScreen() {
  launchFullScreen(document.getElementById( 'drawZone' ));
}

function mainOnWindowResize() {
  zdeskHandleResize();
}

function mainOnAnimationFrame() {
  requestAnimationFrame( mainOnAnimationFrame );
  zdeskHandleControl();
}































