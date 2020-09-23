
var mainModeFlag = 'mono-mode';
var mainInfoFlag = 'info-on';
var mainErrorMessage = '';

var playerAbout = 'hide';
var playerAutohide = 'off';

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

function playerOnStereo() {
	
}

function playerOnFullscreen() { 
	
}

function playerOnAutohide() {
  if (playerAutohide == 'off')	{
    playerSetStyle('btn-autohide', 'blue')
    playerSetStyle('controls-top', 'autohide-on')
    playerSetStyle('controls-bottom', 'autohide-on')
    playerAutohide = 'on'
  } else {
    playerSetStyle('btn-autohide', 'gray')
    playerSetStyle('controls-top', 'autohide-off')
    playerSetStyle('controls-bottom', 'autohide-off')
    playerAutohide = 'off'
  }	 
}

function playerOnAbout() {
  if (playerAbout == 'hide')	{
     playerSetStyle('popup-about', 'show')
	 playerAbout = 'show'
  } else {
     playerSetStyle('popup-about', 'hide')
	 playerAbout = 'hide'
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

function mainSetInfo() {
   var mode = '';
   if (mainModeFlag == 'cross-eye-mode') {
      mode = '3D Перекрестный взгляд';
      }
   if (mainModeFlag == 'stereo-tv-mode') {
      mode = '3D TV SideBySyde';
      }
   var info = '';
   if (mainErrorMessage !== '') {
     info += "<font color='red'>" + mainErrorMessage +"</font>";
	 } 
	else { 
      info += "<font color='blue'>"+mode+"</font> ";
	  info += "Мышь: Левая: ОСМОТР, Средняя: ПРИБЛИЖЕНИЕ, Правая: СМЕЩЕНИЕ " 
	  info += zdeskGetMessages(); 
   }
   mainSetHtmlByClass('info',info);
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

// FLAGS
function mainNextFlag(flag) {

if (flag == 'mono-mode') 
    return  'cross-eye-mode';
if (flag == 'cross-eye-mode') 
    return  'stereo-tv-mode';
if (flag == 'stereo-tv-mode') 
    return  'mono-mode';
	
if (flag == 'info-on') 
   return 'info-off'
if (flag == 'info-off') 
   return 'info-on'
}

function mainSetFlags() {
  document.getElementById('drawZone').className = mainModeFlag + ' ' + mainInfoFlag;  
}

function mainSlideGetParamDefault() {
   var param = Object();
   param.isDesk = true; 	 
   param.isAxis = true; 	 
   param.scaleA = 1; 	 
   param.scaleB = 1; 	 
   param.deskDX = 0; 	 
   param.deskDY = 0; 	 
   param.deskDZ = -50;
 return param;
 }  

function mainSlideMakeDefault() {
}
 
 
function playerLoadSlide(paper, slide) {
  webgl = document.getElementById( 'webgl' )
  zdeskLoadSlide(webgl, 'assets/img/textures/', 'slides'+'/' + paper + '/' + slide +'/')
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

function mainOnInfo() {
  mainInfoFlag = mainNextFlag(mainInfoFlag);
  mainSetFlags();
 }


function mainOnFullScreen() {
  launchFullScreen(document.getElementById( 'drawZone' ));
}

function mainOnMode() {
   mainModeFlag = mainNextFlag(mainModeFlag);
   mainSetFlags();
   mainSetInfo();
   zdeskSetRenderMode(mainModeFlag);
 }

function mainOnWindowResize() {
  zdeskHandleResize();
}

function mainOnAnimationFrame() {
  requestAnimationFrame( mainOnAnimationFrame );
  zdeskHandleControl();
}































