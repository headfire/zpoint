// *******************************
// ***** zp CORE FUNCTION *****
// *******************************
var zpSlideFunc = function() {};
 
var zpSlideName = 'Система создания 3D стерео презентаций'
var zpSlideDir = 'slides';
var zpTexturesDir = ''

var zpScaleA = 1; 	 
var zpScaleB = 1; 	 
var zpDeskDX = 0; 	 
var zpDeskDY = 0; 	 
var zpDeskDZ = -50;

var zpScale = 1;

var zpCamera, zpControls, zpScene, zpDrawing, zpDrawArea;
var zpGeometryRenderer, zpLeftLabelRenderer, zpRightLabelRenderer ,zpStereoEffect;

var zpRenderMode = 'mono';

var zpAxisParent, zpDeskParent, zpSceneParent


function zpStartEmpty(drawAreaElement, texturesDir, onReadyFunc) {
   zpDrawArea = drawAreaElement;	
   zpTexturesDir = 	texturesDir;
   zpInit();
   zpDesk();
   zpSetRenderMode('mono');  
   onReadyFunc();
}

function zpStartSlide(drawAreaElement, texturesDir, slideDir, onReadyFunc) {
   zpDrawArea = drawAreaElement;	
   zpTexturesDir = 	texturesDir;
   zpSlideDir = slideDir;
   var filename = zpSlideDir + '/slide.js?time=' + new Date().getTime();
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.open('GET', filename, true);
   xmlhttp.onreadystatechange = function() {
     if (xmlhttp.readyState == 4) {
       if (xmlhttp.status == 200) {
		 try {
           eval(' function zpLoadedSlideFunc() { '+ xmlhttp.responseText + ' } ');
           zpSlideFunc = zpLoadedSlideFunc;
 		 } catch(e) { console.log(e); }
        }
     zpInit();
	 zpDesk();
     zpSetRenderMode('mono');  
     onReadyFunc();
	  }
  };
 xmlhttp.send(null); 
}

function zpInit() {
	
    zpScene = new THREE.Scene();
	zpLoader = new THREE.BufferGeometryLoader();
	
    zpSceneParent =  new THREE.Object3D();
    zpSlideFunc();
	
	zpScale = zpScaleA/zpScaleB;
	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	zpCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 3000*zpScale );
	zpCamera.up.set(0,0,1); // задает правильную систему координат ВАЖНО!!!
	zpCamera.position.set(300*zpScale,-600*zpScale,200*zpScale);
	//zpCamera.lookAt(new THREE.Vector3( 0*zpScale,0*zpScale, -100));
	
	zpControls = new THREE.OrbitControls( zpCamera, zpDrawArea );
	zpControls.target = new THREE.Vector3( 0*zpScale,0*zpScale, zpDeskDZ/2);
	zpControls.rotateSpeed = 1.0;
	zpControls.zoomSpeed = 1.2;
	zpControls.panSpeed = 0.8;
	zpControls.noZoom = false;
	zpControls.noPan = false;
	zpControls.staticMoving = true;
	zpControls.dynamicDampingFactor = 0.3;
	zpControls.keys = [ 65, 83, 68 ];
	zpControls.addEventListener( 'change', zpRender );

	THREE.ImageUtils.crossOrigin = '';
	
	// lights

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( -300*zpScale, -200*zpScale, 1000*zpScale );
	zpScene.add( light );

	light = new THREE.AmbientLight( 0x999999 );
	zpScene.add( light );

	// renderer
	
	zpGeometryRenderer = new THREE.WebGLRenderer( { antialias: true } );
	zpGeometryRenderer.setClearColor(  0x999999 );
	zpGeometryRenderer.setPixelRatio( window.devicePixelRatio );
	zpGeometryRenderer.setSize( zpDrawArea.clientWidth, zpDrawArea.clientHeight );
	zpGeometryRenderer.domElement.style.position = 'absolute';
	zpGeometryRenderer.domElement.style.top = '0px';
	zpDrawArea.appendChild( zpGeometryRenderer.domElement );

	zpLeftLabelRenderer = new THREE.CSS2DRenderer('left');
	zpLeftLabelRenderer.setSize( zpDrawArea.clientWidth/2, zpDrawArea.clientHeight );
	zpLeftLabelRenderer.domElement.style.position = 'absolute';
	zpLeftLabelRenderer.domElement.style.top = '0px';
	zpLeftLabelRenderer.domElement.style.left = '0px';
	zpLeftLabelRenderer.domElement.style.pointerEvents = 'none';
	
	zpRightLabelRenderer = new THREE.CSS2DRenderer('right');
	zpRightLabelRenderer.setSize( zpDrawArea.clientWidth/2, zpDrawArea.clientHeight );
	zpRightLabelRenderer.domElement.style.position = 'absolute';
	zpRightLabelRenderer.domElement.style.top = '0px';
	zpRightLabelRenderer.domElement.style.left = ''+zpDrawArea.clientWidth/2+'px';
	zpRightLabelRenderer.domElement.style.pointerEvents = 'none';
	
	zpDrawArea.appendChild( zpLeftLabelRenderer.domElement );
	zpDrawArea.appendChild( zpRightLabelRenderer.domElement );
	
	zpStereoEffect = new THREE.headfireStereoEffect( zpGeometryRenderer, zpLeftLabelRenderer, zpRightLabelRenderer, 1200*zpScale );
	
}

function zpDesk() {
	zpDeskParent = new THREE.Object3D();
	zpScene.add(zpDeskParent)
	var deskGeometry = new THREE.BoxGeometry( 1500*zpScale, 1000*zpScale, 40*zpScale );
	var deskTexture = THREE.ImageUtils.loadTexture( zpTexturesDir + '/wood.jpg', undefined, zpRender);
	deskTexture.minFilter = THREE.LinearFilter;
	var deskMaterial = new THREE.MeshBasicMaterial( {  map: deskTexture } );
	deskMesh = new THREE.Mesh( deskGeometry, deskMaterial );
	deskMesh.position.set(zpDeskDX, zpDeskDY, zpDeskDZ-22*zpScale); 
	zpDeskParent.add( deskMesh );

	zpLabel(zpDeskParent , zpDecart((-1500/2 + 20)*zpScale + zpDeskDX, (1000/2 + 20)*zpScale + zpDeskDY, zpDeskDZ), 'A0 M'+zpScaleB+':'+zpScaleA, 0xbbbbbb);

	
	var paperGeometry = new THREE.BoxGeometry( 1189*zpScale, 841*zpScale, 2*zpScale);
	paperTexture = THREE.ImageUtils.loadTexture(zpTexturesDir + '/paper.jpg', undefined, zpRender);
	paperTexture.minFilter = THREE.LinearFilter;
	paperTexture.wrapS = THREE.RepeatWrapping;
	paperTexture.wrapT = THREE.RepeatWrapping;
	paperTexture.repeat.set( 4, 4 );
	var paperMaterial = new THREE.MeshBasicMaterial( {  map: paperTexture } );
	paperMesh = new THREE.Mesh( paperGeometry, paperMaterial );
	paperMesh.position.set(zpDeskDX, zpDeskDY, zpDeskDZ-1.9*zpScale); // not 2 for flat surfaces visible
	zpDeskParent.add( paperMesh );

	var cnopGeometry = new THREE.CylinderGeometry( 10*zpScale, 10*zpScale, 6*zpScale, 12, 1 );
	var cnopMaterial =  new THREE.MeshLambertMaterial( { color:0x707070 } ); // shading: THREE.FlatShading

	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX+564*zpScale,zpDeskDY+390*zpScale,zpDeskDZ+0);
	cnopMesh.rotation.x = Math.PI/2;
	zpDeskParent.add( cnopMesh );
	
	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX-564*zpScale,zpDeskDX+390*zpScale,zpDeskDZ);
	cnopMesh.rotation.x = Math.PI/2;
	zpDeskParent.add( cnopMesh );

	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX+564*zpScale,zpDeskDY-390*zpScale,zpDeskDZ);
	cnopMesh.rotation.x = Math.PI/2;
	zpDeskParent.add( cnopMesh );

	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX-564*zpScale,zpDeskDY-390*zpScale,zpDeskDZ);
	cnopMesh.rotation.x = Math.PI/2;
	zpDeskParent.add( cnopMesh );
	
	zpDrawing = new THREE.Group();
	zpDeskParent.add( zpDrawing );
}		


// ********************************************
// ********************************************
// ********************************************
function zpDecart( x, y, z) {
   z = z || 0;
   return new THREE.Vector3(x, y, z);
}
		    
function zpPolar( radius, angle, z) {
   z = z || 0;
   return new THREE.Vector3(radius*Math.cos(angle), radius*Math.sin(angle), z);
}

function zpPointOnLine(start, end, k) {
  var dx = end.x - start.x; 
  var dy = end.y - start.y; 
  var dz = end.z - start.z;
  return zpDecart(start.x + dx*k, start.y + dy*k, start.z + dz*k);
}

function zpDistance(start, end) {
  var dx = end.x - start.x; 
  var dy = end.y - start.y; 
  var dz = end.z - start.z;
  return Math.sqrt(dx*dx+dy*dy+dz*dz);   
}


function zpVect(par, start, end, lineWidth, pColor) {
  var arrowLen = 10*lineWidth; 
  var endLine = zpPointOnLine(start, end, 1 - ((arrowLen/2)  / zpDistance(start, end)));
  var conePlace = zpPointOnLine(endLine, end, 1/2);
  zpLine(start, endLine, pColor, lineWidth);
  zpArrow(endLine, arrowLen, end, lineWidth, pColor);
}

function zpCoord(par, pColor, lineWidth, len) {
	
  var center = zpDecart(0,0,0);
  var plen = len/3;
  var pSize = lineWidth*2;
  var pLineWidth = 3*zpScale;
  var x = zpDecart(len,0,0);
  var y = zpDecart(0,len,0);
  var z = zpDecart(0,0,len);
  zpPoint(par, center, pColor, pSize); zpLabel(par, center,'O');
  zpVect(par, center,x, pColor, pLineWidth); zpLabel(par, x,'x');
  zpVect(par, center,y, pColor, pLineWidth); zpLabel(par, y,'y');
  zpVect(par, center,z, pColor, pLineWidth); zpLabel(par, z,'z');
  
  zpPoint(par, zpDecart(plen,0,0), pColor, pSize);
  zpPoint(par, zpDecart(0,plen,0), pColor, pSize);
  zpPoint(par, zpDecart(0,0,plen), pColor, pSize);

  zpPoint(par, zpDecart(plen*2,0,0), pColor, pSize);
  zpPoint(par, zpDecart(0,plen*2,0), pColor, pSize);
  zpPoint(par, zpDecart(0,0,plen*2), pColor, pSize);
}

function zpLabel(par,  place, txt, pColor) {
	/*
    var r = Math.floor( pColor / (256*256) ) % 256;
    var g = Math.floor( pColor / 256 ) % 256;
    var b = pColor % 256;
	clr = 'rgb(' + r + ',' + g + ',' + b + ')';
	*/
	clr = pColor;
	dLabel = 15 * zpScaleA/zpScaleB;

    place = new THREE.Vector3 (place.x+dLabel, place.y+dLabel, place.z+dLabel);
  
	var div = document.createElement( 'div' );
	div.className = 'label';
	div.style.color = clr;
	//div.style.opacity = zpTransparent;
	div.textContent = txt;
	var label = new THREE.CSS2DObject( div , 'left');
	label.position.copy(place);
	//zpAdd( label );
	par.add(label);

	var div = document.createElement( 'div' );
	div.className = 'label';
	div.style.color = clr
	//div.style.opacity = ''+zpTransparent;
	div.textContent = txt;
	var label = new THREE.CSS2DObject( div , 'right');
	label.position.copy(place);
	//zpAdd( label );
	par.add(label);
}

function zpLine(par,startPlace, endPlace, pColor, pWidth) {
    var geometry = new THREE.CylinderGeometry( 1, 1, 1 );
	var material = new THREE.MeshLambertMaterial( { color: pColor} );
    var object = new THREE.Mesh( geometry, material );
	object.position.copy(startPlace);
	object.position.lerp( endPlace, 0.5 );
	object.scale.set( pWidth, startPlace.distanceTo( endPlace ), pWidth);
	object.lookAt( endPlace );
	object.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
	par.add( object );
}

function zpPoint(par, place, pColor, pWidth) {
	var sphereGeometry = new THREE.IcosahedronGeometry( pWidth * 1.5, 2);
    var material = new THREE.MeshLambertMaterial( { color: pColor} );
	var mesh = new THREE.Mesh( sphereGeometry, material );
    mesh.position.copy(place);
	par.add(mesh);
}

function zpArrow(par, place, lenght, lookAt, pColor, pWidth) {
    var geometry = new THREE.CylinderGeometry( 0, pWidth*3, lenght, 8 );
    var material = new THREE.MeshLambertMaterial( { color: pColor} );
	var object = new THREE.Mesh( geometry, material );
    object.position.copy(place);
    if (!(lookAt === undefined))
	   object.lookAt( lookAt );
    object.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
    par.add( object );
}


// ********************************************
// ********************************************
// ********************************************

function zpGetSlideName() {
	return zpSlideName;
}

function zpAnimate() {
  if (zpControls)	
     zpControls.update();
}

function zpRender() {
    if (zpRenderMode == 'mono') {
	   zpGeometryRenderer.render( zpScene, zpCamera );
	   zpLeftLabelRenderer.render( zpScene, zpCamera );
	  }
	else if (zpRenderMode == 'cross-eye') {
	   zpStereoEffect.render( zpScene, zpCamera, true);
	  } 
	else if (zpRenderMode == 'side-by-side') {
	   zpStereoEffect.render( zpScene, zpCamera, false);
	  } 
}

function zpHome() {
  if (zpControls)	
     zpControls.reset();
}

function zpSetRenderMode(mode) {
  zpRenderMode = mode;
   if (zpRenderMode ==  'mono') {
      zpGeometryRenderer.autoClear = true;
	  zpRightLabelRenderer.domElement.style.display = 'none';
	  }   else {	  
      zpGeometryRenderer.autoClear = false;
      zpRightLabelRenderer.domElement.style.display = 'block';
   }
   zpSetRenderZoneSizes();
}

function zpSetDecorMode(mode) {
  zpDecorMode = mode;
   if (zpDecorMode ==  'empty') {
	  zpDeskParent.visible = false; 
 //     zpAxisParent.visible = false; 
   }   else if (zpDecorMode ==  'desk')  {	  
	  zpDeskParent.visible = true; 
 //     zpAxisParent.visible = false; 
   }   else if (zpDecorMode ==  'axis')  {	  
	  zpDeskParent.visible = false; 
  //    zpAxisParent.visible = true; 
   }
   zpRender();
}

function zpSetRenderZoneSizes() {
    if (zpRenderMode == 'mono') {
	   zpCamera.aspect = (zpDrawArea.clientWidth/ zpDrawArea.clientHeight);
       zpCamera.updateProjectionMatrix();
       zpRightLabelRenderer.domElement.style.left = ''+zpDrawArea.clientWidth/2+'px';
       zpRightLabelRenderer.setSize( zpDrawArea.clientWidth/2, zpDrawArea.clientHeight );
	   zpGeometryRenderer.setSize( zpDrawArea.clientWidth, zpDrawArea.clientHeight );
	   zpLeftLabelRenderer.domElement.style.left = '0px';
	   zpLeftLabelRenderer.setSize( zpDrawArea.clientWidth, zpDrawArea.clientHeight );
	  }	
	else if (zpRenderMode == 'cross-eye') {
	   zpCamera.aspect = (zpDrawArea.clientWidth/ zpDrawArea.clientHeight);
       zpCamera.updateProjectionMatrix();
       zpRightLabelRenderer.domElement.style.left = ''+zpDrawArea.clientWidth/2+'px';
       zpRightLabelRenderer.setSize( zpDrawArea.clientWidth/2, zpDrawArea.clientHeight );
	   zpLeftLabelRenderer.domElement.style.left = '0px';
	   zpLeftLabelRenderer.setSize( zpDrawArea.clientWidth/2, zpDrawArea.clientHeight );
	   zpStereoEffect.setSize( zpDrawArea.clientWidth, zpDrawArea.clientHeight );
	  }	
	else if (zpRenderMode == 'side-by-side') {
	   zpCamera.aspect = (zpDrawArea.clientWidth/ zpDrawArea.clientHeight) *2;
       zpCamera.updateProjectionMatrix();
       zpRightLabelRenderer.domElement.style.left = ''+zpDrawArea.clientWidth/2+'px';
       zpRightLabelRenderer.setSize( zpDrawArea.clientWidth/2, zpDrawArea.clientHeight );
	   zpLeftLabelRenderer.domElement.style.left = '0px';
	   zpLeftLabelRenderer.setSize( zpDrawArea.clientWidth/2, zpDrawArea.clientHeight );
	   zpStereoEffect.setSize( zpDrawArea.clientWidth, zpDrawArea.clientHeight );
  } 
  zpRender();
}

// ********************************************
// zpoint object interface
// ********************************************

var zp = new Object();

zp.slideName = function(slideName) {
  zpSlideName = slideName;
}

zp.setParam = function(scaleA, scaleB, deskDX, deskDY, deskDZ) {
   zpScaleA = scaleA; 	 
   zpScaleB = scaleB; 	 
   zpDeskDX = deskDX; 	 
   zpDeskDY = deskDY; 	 
   zpDeskDZ = deskDZ;
}

zp.label = function (place, txt, color) {
   zpLabel(zpSceneParent, place, txt, color)
}

zp.point =  function(place, pColor, size) {
   zpPoint(zpSceneParent, place, pColor, size)	
}

zp.line = function (startPlace, endPlace, pColor, pLineWidth) {
  zpLine(zpSceneParent, startPlace, endPlace, pColor, pLineWidth)
}

zp.curve = function (shapeName, pColor, pLineWidth) {
	jsonFilename = zpSlideDir + '/'+ shapeName +'.json';
	zpLoader.load(jsonFilename, function(geometry) {
	arr = 	geometry.attributes.position.array
	cnt = arr.length;
    var x0 = arr[0]; var y0 = arr[1]; var z0 = arr[2];
	var x1 = x0;  var y1 = y0; var z1 = z0;
	for (var i = 1; i<cnt/3 ;i++) {
		x1 = x0;  y1 = y0; z1 = z0;
	    x0 = arr[i*3];  y0 = arr[i*3+1]; z0 = arr[i*3+2];
		zp.line(new THREE.Vector3 (x0, y0, z0), new THREE.Vector3 (x1, y1, z1), pColor, pLineWidth)
	}	
	zpRender();
	});
}
	
zp.curveLine = function (shapeName, pColor, pLineWidth) {
	jsonFilename = zpSlideDir + '/'+ shapeName +'.json';
	zpLoader.load(jsonFilename, function(geometry) {
	line_material = new THREE.LineBasicMaterial({color: pColor, linewidth: pLineWidth});
	line = new THREE.Line(geometry, line_material);
	zpSceneParent.add(line);
	zpRender();
	});
}	

zp.shape = function (shapeName, pColor, pSpecular, pShininess, pOpacity) {
	jsonFilename = zpSlideDir + '/'+ shapeName +'.json';
    var shape_phong_material;
    if (pOpacity == 1) {
			shape_phong_material = new THREE.MeshPhongMaterial( {
			   color:pColor,
			   specular:pSpecular,
			   shininess:pShininess,
			   side: THREE.DoubleSide,
			   });
		} else {		   
			shape_phong_material = new THREE.MeshPhongMaterial( {
			   color:pColor,
			   //specular:pSpecular,
			   //shininess:pShininess,
			   side: THREE.DoubleSide,
			   transparent: true, 
			   premultipliedAlpha: true, 
			   opacity:pOpacity
		   });
		 }  
    	zpLoader.load(jsonFilename, function(geometry) {
				mesh = new THREE.Mesh(geometry, shape_phong_material);
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				zpSceneParent.add(mesh);
				zpRender();
			});
}			



























