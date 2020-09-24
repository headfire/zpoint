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

	zpSlideFunc();

	zpScale = zpScaleA/zpScaleB

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
	
	var deskGeometry = new THREE.BoxGeometry( 1500*zpScale, 1000*zpScale, 40*zpScale );
	var deskTexture = THREE.ImageUtils.loadTexture( zpTexturesDir + '/wood.jpg', undefined, zpRender);
	deskTexture.minFilter = THREE.LinearFilter;
	var deskMaterial = new THREE.MeshBasicMaterial( {  map: deskTexture } );
	deskMesh = new THREE.Mesh( deskGeometry, deskMaterial );
	deskMesh.position.set(zpDeskDX, zpDeskDY, zpDeskDZ-22*zpScale); 
	zpScene.add( deskMesh );

	zpLabel((-1500/2 + 20)*zpScale + zpDeskDX, (1000/2 + 20)*zpScale + zpDeskDY, zpDeskDZ, 'A0 M'+zpScaleB+':'+zpScaleA, 0xbbbbbb);

	
	var paperGeometry = new THREE.BoxGeometry( 1189*zpScale, 841*zpScale, 2*zpScale);
	paperTexture = THREE.ImageUtils.loadTexture(zpTexturesDir + '/paper.jpg', undefined, zpRender);
	paperTexture.minFilter = THREE.LinearFilter;
	paperTexture.wrapS = THREE.RepeatWrapping;
	paperTexture.wrapT = THREE.RepeatWrapping;
	paperTexture.repeat.set( 4, 4 );
	var paperMaterial = new THREE.MeshBasicMaterial( {  map: paperTexture } );
	paperMesh = new THREE.Mesh( paperGeometry, paperMaterial );
	paperMesh.position.set(zpDeskDX, zpDeskDY, zpDeskDZ-1.9*zpScale); // not 2 for flat surfaces visible
	zpScene.add( paperMesh );

	var cnopGeometry = new THREE.CylinderGeometry( 10*zpScale, 10*zpScale, 6*zpScale, 12, 1 );
	var cnopMaterial =  new THREE.MeshLambertMaterial( { color:0x707070 } ); // shading: THREE.FlatShading

	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX+564*zpScale,zpDeskDY+390*zpScale,zpDeskDZ+0);
	cnopMesh.rotation.x = Math.PI/2;
	zpScene.add( cnopMesh );
	
	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX-564*zpScale,zpDeskDX+390*zpScale,zpDeskDZ);
	cnopMesh.rotation.x = Math.PI/2;
	zpScene.add( cnopMesh );

	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX+564*zpScale,zpDeskDY-390*zpScale,zpDeskDZ);
	cnopMesh.rotation.x = Math.PI/2;
	zpScene.add( cnopMesh );

	cnopMesh = new THREE.Mesh( cnopGeometry, cnopMaterial );
	cnopMesh.position.set(zpDeskDX-564*zpScale,zpDeskDY-390*zpScale,zpDeskDZ);
	cnopMesh.rotation.x = Math.PI/2;
	zpScene.add( cnopMesh );
	
	zpDrawing = new THREE.Group();
	zpScene.add( zpDrawing );
}		


// ********************************************
// ********************************************
// ********************************************
function zpLabel(x,y,z, txt, color) {
	
    var r = Math.floor( color / (256*256) ) % 256;
    var g = Math.floor( color / 256 ) % 256;
    var b = color % 256;
	clr = 'rgb(' + r + ',' + g + ',' + b + ')';
	
	dLabel = 15 * zpScaleA/zpScaleB;

    place = new THREE.Vector3 (x+dLabel, y+dLabel, z+dLabel);
  
	var div = document.createElement( 'div' );
	div.className = 'label';
	div.style.color = clr;
	//div.style.opacity = zpTransparent;
	div.textContent = txt;
	var label = new THREE.CSS2DObject( div , 'left');
	label.position.copy(place);
	//zpAdd( label );
	zpScene.add(label);

	var div = document.createElement( 'div' );
	div.className = 'label';
	div.style.color = clr
	//div.style.opacity = ''+zpTransparent;
	div.textContent = txt;
	var label = new THREE.CSS2DObject( div , 'right');
	label.position.copy(place);
	//zpAdd( label );
	zpScene.add(label);
}



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
  zpSlideName = 	slideName;
}

zp.setParam = function(scaleA, scaleB, deskDX, deskDY, deskDZ) {
   zpScaleA = scaleA; 	 
   zpScaleB = scaleB; 	 
   zpDeskDX = deskDX; 	 
   zpDeskDY = deskDY; 	 
   zpDeskDZ = deskDZ;
}

zp.label = function (x,y,z, txt, color) {
   zpLabel(x,y,z, txt, color)
}


zp.point =  function(x,y,z, pColor, size) {
	var sphereGeometry = new THREE.IcosahedronGeometry( size * zpScaleA/zpScaleB*2, 2 );
    var material = new THREE.MeshLambertMaterial( { color: pColor} );
	var mesh = new THREE.Mesh( sphereGeometry, material );
      mesh.position.copy(new THREE.Vector3 (x, y, z));
	zpScene.add(mesh);
}

zp.line = function (startPlace, endPlace, pColor, pLineWidth) {
    var geometry = new THREE.CylinderGeometry( 1, 1, 1 );
	var material = new THREE.MeshLambertMaterial( { color: pColor} );
    var object = new THREE.Mesh( geometry, material );
	object.position.copy(startPlace);
	object.position.lerp( endPlace, 0.5 );
	object.scale.set( pLineWidth*zpScaleA/zpScaleB/1.5, startPlace.distanceTo( endPlace ), pLineWidth*zpScaleA/zpScaleB/1.5 );
	object.lookAt( endPlace );
	object.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
	zpScene.add( object );
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
	zpScene.add(line);
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
				zpScene.add(mesh);
				zpRender();
			});
}			



























