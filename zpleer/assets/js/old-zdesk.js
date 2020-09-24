function zpGetMaterial(materialColor, isDoubleSide) {
 
  material = new THREE.MeshLambertMaterial( { color: materialColor} );
  
/*	
  if (isDoubleSide)
    material.side = THREE.DoubleSide 
  if (zpTransparent < 1) {
    material.opacity = zpTransparent;	
    material.transparent = true;
   }	
*/  
  return material;	
}

function zpGetPointMaterial() {
  return zpGetMaterial(zpPointColor, false);  
}

function zpGetLineMaterial() {
  return zpGetMaterial(zpLineColor, false);  
}

function zpGetObjectMaterial() {
  return zpGetMaterial(zpObjectColor, false);  
}

function zpGetTriangleMaterial() {
  return zpGetMaterial( zpTriangleColor, true);  
}

function zpGetMarkMaterial() {
  return zpGetMaterial( zpMarkColor, false);  
}

// *******************************
// zp CORE INTERFACE FUNCTION
// *******************************

// util 

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

function zpCreateCapPoint(place) {
  var geometry = new THREE.IcosahedronGeometry( 5, 2 );
  var object = new THREE.Mesh( geometry, zpGetLineMaterial() );
    object.position.copy(place);
  return object;
}

function zpArrow(place, lenght, lookAt) {
  var geometry = new THREE.CylinderGeometry( 0, lenght/3, lenght, 8 );
  var object = new THREE.Mesh( geometry, zpGetLineMaterial()  );
    object.position.copy(place);
    if (!(lookAt === undefined))
	   object.lookAt( lookAt );
    object.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
  zpAdd( object );
}

// position function

function zpDecart( x, y, z) {
   z = z || 0;
   return new THREE.Vector3(x, y, z);
}
		    
function zpPolar( radius, angle, z) {
   z = z || 0;
   return new THREE.Vector3(radius*Math.cos(angle), radius*Math.sin(angle), z);
}

// lines and vectors

function zpPoint(place) {
	var sphereGeometry = new THREE.IcosahedronGeometry( 10, 2 );
    var material = zpGetPointMaterial();
	var object = new THREE.Mesh( sphereGeometry, material );
      object.position.copy(place);
    zpAdd( object );
}

function zpLine(startPlace, endPlace) {
    var geometry = new THREE.CylinderGeometry( 1, 1, 1 );
    var object = new THREE.Mesh( geometry, zpGetLineMaterial() );
	object.position.copy(startPlace);
	object.position.lerp( endPlace, 0.5 );
	object.scale.set( 5, startPlace.distanceTo( endPlace ), 5 );
	object.lookAt( endPlace );
	object.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
	zpAdd( object );
}

function zpVect(start, end) {
  var arrowLen = 30; 
  var endLine = zpPointOnLine(start, end, 1 - ((arrowLen/2)  / zpDistance(start, end)));
  var conePlace = zpPointOnLine(endLine, end, 1/2);
  zpLine(start, endLine);
  zpArrow(endLine, arrowLen, end);
}

function zpArc(place, radius, startAngle, angle, lookAt) {

  var geometry = new THREE.TorusGeometry( radius, 5, 8, 40, angle);
  var object = new THREE.Mesh( geometry, zpGetLineMaterial()  );
  object.position.copy(place);
	if (!(lookAt === undefined))
	   object.lookAt( lookAt );
	
	// наконечники дуги
   if (angle < 360)	{
       var cap1 = zpCreateCapPoint(zpPolar(radius, 0));
       var cap2 = zpCreateCapPoint(zpPolar(radius, angle));
       object.add(cap1);               
       object.add(cap2);               
   }
   
    object.rotateOnAxis(new THREE.Vector3(0,0,1),startAngle);
	zpAdd( object );
}

// flat figures

function zpTriangle(placeA, placeB, placeC) {
   var geometry = new THREE.Geometry();
     geometry.vertices.push( placeA, placeB, placeC )
     geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
   var object = new THREE.Mesh( geometry, zpGetTriangleMaterial());
   zpAdd( object );
}

// solid

function zpBox(place, sizeX, sizeY, sizeZ, lookAt, zAngle) {

    var geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ );
    var object = new THREE.Mesh( geometry, zpGetObjectMaterial() );
	object.position.copy(place);
	if (!(lookAt === undefined))
	   object.lookAt( lookAt );
	if (!(zAngle === undefined))
	   object.rotateOnAxis(new THREE.Vector3(0,0,1), zAngle);
	zpAdd( object );
}

function zpSphere(place, radius) {

    var geometry = new THREE.SphereGeometry(radius, 40, 40 );
    var object = new THREE.Mesh( geometry, zpGetObjectMaterial() );
	object.position.copy(place);
	zpAdd( object );
}

function zpCylinder(place, topRadius, bottomRadius, height, lookAt) {

    var geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 40, 1 );
    var object = new THREE.Mesh( geometry, zpGetObjectMaterial() );
	object.position.copy(place);
	if (!(lookAt === undefined))
	   object.lookAt( lookAt );
	object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
	zpAdd( object );
}

function zpTorus(place, mainRadius, tubeRadius, lookAt) {

    var geometry = new THREE.TorusGeometry(mainRadius, tubeRadius,  50, 30 );
    var object = new THREE.Mesh( geometry, zpGetObjectMaterial() );
	object.position.copy(place);
	if (!(lookAt === undefined))
	   object.lookAt( lookAt );
	zpAdd( object );
}

// marks and comments

function zpMarkLine(placeA, placeB, markCount) {

  var markLen = 4; 
  var markR = 8; 
  var markSpace = 10; 
  var place = zpPointOnLine(placeA, placeB, 1/2);
  var shift = markSpace*(markCount-1)/2;
  
  var group = new THREE.Group;
    group.position.copy(place);
    group.lookAt( placeB );
	
  for (var i=0 ; i<markCount;i++) {
  place = zpDecart(0,0,i*markSpace - shift);	
  var geometry = new THREE.CylinderGeometry( markR, markR, markLen, 12 );
  var object = new THREE.Mesh( geometry, zpGetMarkMaterial()  );
    object.position.copy(place);
    object.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
  group.add(object);	
  }
 
  zpAdd( group );
}

function zpMarkAngle(aPlace, basePlace, bPlace, markCount) {
  
  // точность при сравнении с нулем
  const delta = 0.001 
  
  // находим вектора при вершине угла
  var a = zpDecart(aPlace.x - basePlace.x, aPlace.y - basePlace.y, aPlace.z - basePlace.z);
  var b = zpDecart(bPlace.x - basePlace.x, bPlace.y - basePlace.y, bPlace.z - basePlace.z);
  
  //назодим векторное произведение (оно - же перпендикуляр к обоим векторам)
  var cross = zpDecart(0,0,0);
  cross.crossVectors(a,b);
 
  // проверяем векторное произведение на близость к нулю
  // это значит, что угол либо нулевой, либо 180 - метки не чертим
  if ( cross.length() < delta ) 
    return;
    
  var markR = 3; 
  var centerR = 40; 
  var spaceR = 10; 
  var shift = spaceR*(markCount-1)/2; 
  
  var group = new THREE.Group;
  
  // вращаем группу в направлении перпендикуляра с сторонам угла
  group.lookAt( cross );

  // вычисляем координаты единичного вектора с учетом поворота 
  group.updateMatrix();
  var ex = zpDecart(100,0,0);
  ex.applyMatrix4(group.matrix);
  
  // вычисляем углы
  var angle = b.angleTo(a);
  var aAngle = ex.angleTo(a);
  var bAngle = ex.angleTo(b);
  
  // определяем стартовый угол и корректруем в зависимости от схемы векторов
  var startAngle = aAngle;
  if (Math.abs((bAngle - aAngle) - angle) > delta)
     var startAngle = Math.PI*2-aAngle;
 
  // сдвигаем группу в вершину угла	  
  group.position.copy(basePlace);
	
  for (var i=0 ;i<markCount; i++) {
    var geometry = new THREE.TorusGeometry( centerR - shift + i*spaceR, markR, 8, 40, angle);
    var object = new THREE.Mesh( geometry, zpGetMarkMaterial()  );
    object.rotateOnAxis(new THREE.Vector3(0,0,1), startAngle);
    group.add(object);	
  }
 
   zpAdd( group );
}

function zpLabel(place, text) {

    var r = Math.floor( zpLabelColor / (256*256) ) % 256;
    var g = Math.floor( zpLabelColor / 256 ) % 256;
    var b = zpLabelColor % 256;

	var div = document.createElement( 'div' );
	div.className = 'label';
	div.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
	div.style.opacity = zpTransparent;
	div.textContent = text;
	var label = new THREE.CSS2DObject( div , 'left');
	label.position.copy(place);
	zpAdd( label );

	var div = document.createElement( 'div' );
	div.className = 'label';
	div.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
	div.style.opacity = ''+zpTransparent;
	div.textContent = text;
	var label = new THREE.CSS2DObject( div , 'right');
	label.position.copy(place);
	zpAdd( label );
}
			
function zpMessage(text) {
  zpMessages.push( {start:zpVisibleStartFrame, end:zpVisibleEndFrame, text:text});
}

// coord system

function zpSetCoord(place, lookAt, zAngle) {
	zpCurrentCoord = new THREE.Group();
	zpCurrentCoord.position.copy(place);
	if (!(lookAt === undefined))
	   zpCurrentCoord.lookAt(lookAt);
	if (!(zAngle === undefined))
	   zpCurrentCoord.rotateOnAxis(new THREE.Vector3(0,0,1), zAngle);
	zpDrawing.add( zpCurrentCoord );
}

function zpCoord() {
  var o = zpDecart(0,0,0);
  var len = 300;
  var plen = 100;
  var x = zpDecart(len,0,0);
  var y = zpDecart(0,len,0);
  var z = zpDecart(0,0,len);
  zpPoint(o); zpLabel(o,'O');
  zpVect(o,x); zpLabel(x,'x');
  zpVect(o,y); zpLabel(y,'y');
  zpVect(o,z); zpLabel(z,'z');
  
  zpPoint(zpDecart(plen,0,0));
  zpPoint(zpDecart(0,plen,0));
  zpPoint(zpDecart(0,0,plen));

  zpPoint(zpDecart(plen*2,0,0));
  zpPoint(zpDecart(0,plen*2,0));
  zpPoint(zpDecart(0,0,plen*2));
}

// color and transparent

function zpSetPointColor(color) { zpPointColor = color; } 
function zpSetLineColor(color) { zpLineColor = color; } 
function zpSetObjectColor(color) { zpObjectColor = color; } 
function zpSetMarkColor(color) { zpMarkColor = color; } 
function zpSetTriangleColor(color) { zpTriangleColor = color; } 
function zpSetLabelColor(color) { zpLabelColor = color; } 
function zpSetTransparent(transparent) { zpTransparent = transparent; } 

// frames control

function zpSetVisible(startFrame, endFrame) {
  zpVisibleStartFrame = startFrame;
  zpVisibleEndFrame = endFrame;
  if (zpFrameCount<endFrame) {
      zpFrameCount = endFrame;
  }  
}

