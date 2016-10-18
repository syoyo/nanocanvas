// How to work with non-BMP characters
// https://github.com/svaarala/duktape-wiki/blob/add-nonbmp-howto/HowtoNonBmpCharacters.md
var ICON_SEARCH = Duktape.dec('jx', '"\\U0001f50d"');
var ICON_CIRCLED_CROSS = "\u2716"
var ICON_CHEVRON_RIGHT = "\uE75E"
var ICON_CHECK = "\u2713"
var ICON_LOGIN = "\uE740"
var ICON_TRASH = "\uE729"

this.addEventListener('click', function(evt) {
  print(evt.type + ', ' + evt.clientX + ', ' + evt.button + ', ctrl: ' + evt.ctrlKey + ', alt: ' + evt.altKey + ', shift: ' + evt.shiftKey);
});

function isBlack(r, g, b, a) {
  if (r === 0.0 && g === 0.0 && b === 0.0 && a === 0.0) {
    return true;
  }
  return false;
}

function hue(h, m1, m2)
{
  if (h < 0) h += 1;
  if (h > 1) h -= 1;
  if (h < 1.0/6.0)
    return m1 + (m2 - m1) * h * 6.0;
  else if (h < 3.0/6.0)
    return m2;
  else if (h < 4.0/6.0)
    return m1 + (m2 - m1) * (2.0/3.0 - h) * 6.0;
  return m1;
}

function hsl2rgb(h, s, l)
{
  var m1, m2;
  h = h % 1.0;
  if (h < 0.0) h += 1.0;
  s = Math.max(0.0, Math.min(s, 1.0));
  l = Math.max(0.0, Math.min(l, 1.0));
  m2 = l <= 0.5 ? (l * (1 + s)) : (l + s - l * s);
  m1 = 2 * l - m2;
  var r = Math.max(0.0, 256*Math.min(hue(h + 1.0/3.0, m1, m2), 255));
  var g = Math.max(0.0, 256*Math.min(hue(h, m1, m2), 255));
  var b = Math.max(0.0, 256*Math.min(hue(h - 1.0/3.0, m1, m2), 255));
  //col.a = a/255.0f;
  return {r: r, g:g, b:b}
}

function drawEyes(vg, x, y, w, h, mx, my, t)
{
  var ex = w *0.23;
  var ey = h * 0.5;
  var lx = x + ex;
  var ly = y + ey;
  var rx = x + w - ex;
  var ry = y + ey;
  var dx,dy,d;
  var br = (ex < ey ? ex : ey) * 0.5;
  var blink = 1 - Math.pow(Math.sin(t*0.5),200)*0.8;

  vg.beginPath();
  vg.ellipse(lx+3.0,ly+16.0, ex,ey);
  vg.ellipse(rx+3.0,ry+16.0, ex,ey);
  vg.linearGradient(x,y+h*0.5,x+w*0.1,y+h, 0,0,0,32, 0,0,0,16);
  vg.fill();

  vg.beginPath(vg);
  vg.ellipse(lx,ly, ex,ey);
  vg.ellipse(rx,ry, ex,ey);
  vg.linearGradient(x,y+h*0.25,x+w*0.1,y+h, 220,220,220,255, 128,128,128,255);
  vg.fill();

  dx = (mx - rx) / (ex * 10);
  dy = (my - ry) / (ey * 10);
  d = Math.sqrt(dx*dx+dy*dy);
  if (d > 1.0) {
    dx /= d; dy /= d;
  }
  dx *= ex*0.4;
  dy *= ey*0.5;
  vg.beginPath();
  vg.ellipse(lx+dx,ly+dy+ey*0.25*(1-blink), br,br*blink);
  vg.fillColor(32,32,32,255);
  vg.fill();

  dx = (mx - rx) / (ex * 10);
  dy = (my - ry) / (ey * 10);
  d = Math.sqrt(dx*dx+dy*dy);
  if (d > 1.0) {
    dx /= d; dy /= d;
  }

  dx *= ex*0.4;
  dy *= ey*0.5;
  vg.beginPath();
  vg.ellipse(rx+dx,ry+dy+ey*0.25*(1-blink), br,br*blink);
  vg.fillColor(32,32,32,255);
  vg.fill();

}


function drawGraph(vg, x, y, w, h, t)
{
  var samples = new Array(6);
  var sx = new Array(6);
  var sy = new Array(6);
  var dx = w/5.0;
  var i;

  samples[0] = (1+Math.sin(t*1.2345+Math.cos(t*0.33457)*0.44))*0.5;
  samples[1] = (1+Math.sin(t*0.68363+Math.cos(t*1.3)*1.55))*0.5;
  samples[2] = (1+Math.sin(t*1.1642+Math.cos(t*0.33457)*1.24))*0.5;
  samples[3] = (1+Math.sin(t*0.56345+Math.cos(t*1.63)*0.14))*0.5;
  samples[4] = (1+Math.sin(t*1.6245+Math.cos(t*0.254)*0.3))*0.5;
  samples[5] = (1+Math.sin(t*0.345+Math.cos(t*0.03)*0.6))*0.5;

  for (i = 0; i < 6; i++) {
    sx[i] = x+i*dx;
    sy[i] = y+h*samples[i]*0.8;
  }

  // Graph background
  vg.beginPath();
  vg.moveTo(sx[0], sy[0]);
  for (i = 1; i < 6; i++) {
    vg.bezierTo(sx[i-1]+dx*0.5,sy[i-1], sx[i]-dx*0.5,sy[i], sx[i],sy[i]);
  }
  vg.lineTo(x+w, y+h);
  vg.lineTo(x, y+h);
  vg.linearGradient(x,y,x,y+h, 0,160,192,0, 0,160,192,64);
  vg.fill();

  // Graph line
  vg.beginPath();
  vg.moveTo(sx[0], sy[0]+2);
  for (i = 1; i < 6; i++) {
    vg.bezierTo(sx[i-1]+dx*0.5,sy[i-1]+2, sx[i]-dx*0.5,sy[i]+2, sx[i],sy[i]+2);
  }
  vg.strokeColor(0,0,0,32);
  vg.strokeWidth(3.0);
  vg.stroke();

  vg.beginPath();
  vg.moveTo(sx[0], sy[0]);
  for (i = 1; i < 6; i++) {
    vg.bezierTo(sx[i-1]+dx*0.5,sy[i-1], sx[i]-dx*0.5,sy[i], sx[i],sy[i]);
  }
  vg.strokeColor(0,160,192,255);
  vg.strokeWidth(3.0);
  vg.stroke();

  // Graph sample pos
  for (i = 0; i < 6; i++) {
    vg.beginPath();
    vg.rect(sx[i]-10, sy[i]-10+2, 20,20);
    vg.radialGradient(sx[i],sy[i]+2, 3.0,8.0, 0,0,0,32, 0,0,0,0);
    vg.fill();
  }

  vg.beginPath();
  for (i = 0; i < 6; i++) {
    vg.circle(sx[i], sy[i], 4.0);
  }
  vg.fillColor(0,160,192,255);
  vg.fill();
  vg.beginPath();
  for (i = 0; i < 6; i++) {
    vg.circle(sx[i], sy[i], 2.0);
  }
  vg.fillColor(220,220,220,255);
  vg.fill();

  vg.strokeWidth(1.0);
}

function drawButton(vg, icon, text, x, y, w, h, r, g, b, a) {
  var cornerRadius = 4.0;

  var alpha = isBlack(r, g, b, a) ? 16 : 32;
  
  vg.beginPath();
  vg.roundedRect(x+1,y+1, w-2,h-2, cornerRadius-1);
  if (!isBlack(r,g,b,a)) {
    vg.fillColor(r,g,b,a);
    vg.fill();
  }
  vg.linearGradient(x,y,x,y+h, 255,255,255,alpha, 0,0,0,alpha);
  vg.fill();

  vg.beginPath();
  vg.roundedRect(x+0.5,y+0.5, w-1,h-1, cornerRadius-0.5);
  vg.strokeColor(0,0,0,48);
  vg.stroke();


  vg.fontSize(20.0);
  vg.fontFace("sans-bold");
  var tw = vg.textBounds(0,0,text);
  var iw = 0;
  if (icon != 0) {
    vg.fontSize(h*1.3);
    vg.fontFace("icons");
    iw = vg.textBounds(0,0, icon);
    iw += h*0.15;
  }

  if (icon != 0) {
    vg.fontSize(h*1.3);
    vg.fontFace("icons");
    vg.fillColor(255,255,255,96);
    vg.textAlign(vg.ALIGN_LEFT | vg.ALIGN_MIDDLE);
    vg.text(x+w*0.5-tw*0.5-iw*0.75, y+h*0.5, icon);
  }

  vg.fontSize(20.0);
  vg.fontFace("sans-bold");
  vg.textAlign(vg.ALIGN_LEFT | vg.ALIGN_MIDDLE);
  vg.fillColor(0,0,0,160);
  vg.text(x+w*0.5-tw*0.5+iw*0.25,y+h*0.5-1,text);
  vg.fillColor(255,255,255,160);
  vg.text(x+w*0.5-tw*0.5+iw*0.25,y+h*0.5,text);

}

function drawSearchBox(vg, text, x, y, w, h)
{
	var cornerRadius = h/2-1;

	// Edit
	vg.beginPath();
	vg.roundedRect(x,y, w,h, cornerRadius);
	vg.boxGradient(x,y+1.5, w,h, h/2,5, 0,0,0,16, 0,0,0,92);
	vg.fill();

	vg.fontSize(h*1.3);
	vg.fontFace("icons");
	vg.fillColor(255,255,255,64);
	vg.textAlign(vg.ALIGN_CENTER|vg.ALIGN_MIDDLE);
	vg.text(x+h*0.55, y+h*0.55, ICON_SEARCH);

	vg.fontSize(20.0);
	vg.fontFace("sans");
	vg.fillColor(255,255,255,32);

	vg.textAlign(vg.ALIGN_LEFT|vg.ALIGN_MIDDLE);
	vg.text(x+h*1.05,y+h*0.5,text);

	vg.fontSize(h*1.3);
	vg.fontFace("icons");
	vg.fillColor(255,255,255,32);
	vg.textAlign(vg.ALIGN_CENTER|vg.ALIGN_MIDDLE);
	vg.text(x+w-h*0.55, y+h*0.55, ICON_CIRCLED_CROSS);
}

function drawWindow(vg, title, x, y, w, h) {
  var cornerRadius = 3.0;
  vg.save();

  // window
  vg.beginPath();
  vg.roundedRect(x,y,w,h,cornerRadius);
  vg.fillColor(28,30,34,192);
  vg.fill();

  // drop shadow
  vg.beginPath();
  vg.rect(x-10,y-10,w+20,h+30);
  vg.roundedRect(x,y,w,h,cornerRadius);
  vg.pathWinding(vg.HOLE);
  vg.boxGradient(x,y+2,w,h,cornerRadius*2, 10,0,0,0,128, 0,0,0,0);
  vg.fill();

  // header
  vg.beginPath()
  vg.roundedRect(x+1,y+1,w-2,30,cornerRadius-1);
  vg.linearGradient(x,y,x,y+15,255,255,255,8,0,0,0,16);
  vg.fill();

  vg.beginPath();
  vg.moveTo(x+0.5,y+0.5+30);
  vg.lineTo(x+0.5+w-1,y+0.5+30);
  vg.strokeColor(0,0,0,32);
  vg.stroke();

  vg.fontSize(18.0);
  vg.fontFace('sans-bold');
  vg.textAlign(vg.ALIGN_CENTER);
  vg.fontBlur(2);
  vg.fillColor(0,0,0,128);
  vg.text(x+w/2, y+16+1, title);

  vg.fontBlur(0);
  vg.fillColor(220,220,220,160);
  vg.text(x+w/2, y+16, title);

  vg.restore();
}

function drawDropDown(vg, text, x, y, w, h)
{
	var cornerRadius = 4.0;

	vg.beginPath();
	vg.roundedRect(x+1,y+1, w-2,h-2, cornerRadius-1);
	vg.linearGradient(x,y,x,y+h, 255,255,255,16, 0,0,0,16);
	vg.fill();

	vg.beginPath();
	vg.roundedRect(x+0.5,y+0.5, w-1,h-1, cornerRadius-0.5);
	vg.strokeColor(0,0,0,48);
	vg.stroke();

	vg.fontSize(20.0);
  vg.fontFace("sans");
	vg.fillColor(255,255,255,160);
	vg.textAlign(vg.ALIGN_LEFT|vg.ALIGN_MIDDLE);
	vg.text(x+h*0.3,y+h*0.5,text);

	vg.fontSize(h*1.3);
	vg.fontFace("icons");
	vg.fillColor(255,255,255,64);
	vg.textAlign(vg.ALIGN_CENTER|vg.ALIGN_MIDDLE);
	vg.text(x+w-h*0.5, y+h*0.5, ICON_CHEVRON_RIGHT);
}

function drawColorwheel(vg, x, y, w, h, t)
{
  var hueVal = Math.sin(t * 0.12);

  vg.save();

  var cx = x + w*0.5;
  var cy = y + h*0.5;
  var r1 = (w < h ? w : h) * 0.5 - 5.0;
  var r0 = r1 - 20.0;
  var aeps = 0.5 / r1; // half a pixel arc length in radians (2pi cancels out).

  for (var i = 0; i < 6; i++) {
    var a0 = i / 6.0 * Math.PI * 2.0 - aeps;
    var a1 = (i+1.0) / 6.0 * Math.PI * 2.0 + aeps;
    vg.beginPath();
    vg.arc(cx,cy, r0, a0, a1, vg.CW);
    vg.arc(cx,cy, r1, a1, a0, vg.CCW);
    vg.closePath();
    var ax = cx + Math.cos(a0) * (r0+r1)*0.5;
    var ay = cy + Math.sin(a0) * (r0+r1)*0.5;
    var bx = cx + Math.cos(a1) * (r0+r1)*0.5;
    var by = cy + Math.sin(a1) * (r0+r1)*0.5;
    c0 = hsl2rgb(a0/(Math.PI*2),1.0,0.55);
    c1 = hsl2rgb(a1/(Math.PI*2),1.0,0.55);
    vg.linearGradient(ax,ay, bx,by, c0.r, c0.g, c0.b, 255, c1.r, c1.g, c1.b, 255);
    vg.fill();
  }

  vg.beginPath();
  vg.circle(cx,cy, r0-0.5);
  vg.circle(cx,cy, r1+0.5);
  vg.strokeColor(0,0,0,64);
  vg.stroke();

  // Selector
  vg.save();
  vg.translate(cx,cy);
  vg.rotate(hueVal*Math.PI*2);

  // Marker on
  vg.strokeWidth(2.0);
  vg.beginPath();
  vg.rect(r0-1,-3,r1-r0+2,6);
  vg.strokeColor(255,255,255,192);
  vg.stroke();

	vg.beginPath();
	vg.rect(r0-2-10,-4-10,r1-r0+4+20,8+20);
	vg.rect(r0-2,-4,r1-r0+4,8);
	vg.pathWinding(vg.HOLE);
	vg.boxGradient(r0-3,-5,r1-r0+6,10, 2,4, 0,0,0,128, 0,0,0,0);
	vg.fill();

	// Center triangle
	var r = r0 - 6;
	ax = Math.cos(120.0/180.0*Math.PI) * r;
	ay = Math.sin(120.0/180.0*Math.PI) * r;
	bx = Math.cos(-120.0/180.0*Math.PI) * r;
	by = Math.sin(-120.0/180.0*Math.PI) * r;
	vg.beginPath();
	vg.moveTo(r,0);
	vg.lineTo(ax,ay);
	vg.lineTo(bx,by);
	vg.closePath();
  col = hsl2rgb(hueVal, 1.0, 0.5);
	vg.linearGradient(r,0, ax,ay, col.r, col.g, col.b, 255, 255,255,255,255);
	vg.fill();
  vg.linearGradient((r+ax)*0.5,(0+ay)*0.5, bx,by, 0,0,0,0, 0,0,0,255);
	vg.fill();
	vg.strokeColor(0,0,0,64);
	vg.stroke();

	// Select circle on triangle
	var ax = Math.cos(120.0/180.0*Math.PI) * r*0.3;
	var ay = Math.sin(120.0/180.0*Math.PI) * r*0.4;
	vg.strokeWidth(2.0);
	vg.beginPath();
	vg.circle(ax,ay,5);
	vg.strokeColor(255,255,255,192);
	vg.stroke();

	vg.beginPath();
	vg.rect(ax-20,ay-20,40,40);
	vg.circle(ax,ay,7);
	vg.pathWinding(vg.HOLE);
	vg.radialGradient(ax,ay, 7,9, 0,0,0,64, 0,0,0,0);
	vg.fill();

  vg.restore();
  vg.restore();
}

function drawLabel(vg, text, x, y, w, h)
{
  vg.fontSize(18.0);
  vg.fontFace("sans");
  vg.fillColor(255,255,255,128);

  vg.textAlign(vg.ALIGN_LEFT|vg.ALIGN_MIDDLE);
  vg.text(x,y+h*0.5,text);
}

function drawEditBoxBase(vg, x, y, w, h)
{
  // Edit
  vg.beginPath();
  vg.roundedRect(x+1,y+1, w-2,h-2, 4-1);
  vg.boxGradient(x+1,y+1+1.5, w-2,h-2, 3,4, 255,255,255,32, 32,32,32,32);
  vg.fill();

  vg.beginPath();
  vg.roundedRect(x+0.5,y+0.5, w-1,h-1, 4-0.5);
  vg.strokeColor(0,0,0,48);
  vg.stroke();
}

function drawEditBox(vg, text, x, y, w, h)
{
  drawEditBoxBase(vg, x,y, w,h);

  vg.fontSize(20.0);
  vg.fontFace("sans");
  vg.fillColor(255,255,255,64);
  vg.textAlign(vg.ALIGN_LEFT|vg.ALIGN_MIDDLE);
  vg.text(x+h*0.3,y+h*0.5,text);
}

function drawEditBoxNum(vg, text, units, x, y, w, h)
{
  drawEditBoxBase(vg, x,y, w,h);

  var uw = vg.textBounds(0,0, units);

  vg.fontSize(18.0);
  vg.fontFace("sans");
  vg.fillColor(255,255,255,64);
  vg.textAlign(vg.ALIGN_RIGHT|vg.ALIGN_MIDDLE);
  vg.text(x+w-h*0.3,y+h*0.5,units);

  vg.fontSize(20.0);
  vg.fontFace("sans");
  vg.fillColor(255,255,255,128);
  vg.textAlign(vg.ALIGN_RIGHT|vg.ALIGN_MIDDLE);
  vg.text(x+w-uw-h*0.5,y+h*0.5,text);
}

function drawCheckBox(vg, text, x, y, w, h)
{
  vg.fontSize(18.0);
  vg.fontFace("sans");
  vg.fillColor(255,255,255,160);

  vg.textAlign(vg.ALIGN_LEFT|vg.ALIGN_MIDDLE);
  vg.text(x+28,y+h*0.5,text);

  vg.beginPath();
  vg.roundedRect(x+1,y+(h*0.5)-9, 18,18, 3);
  vg.boxGradient(x+1,y+(h*0.5)-9+1, 18,18, 3,3, 0,0,0,32, 0,0,0,92);
  vg.fill(vg);

  vg.fontSize(40);
  vg.fontFace("icons");
  vg.fillColor(255,255,255,128);
  vg.textAlign(vg.ALIGN_CENTER|vg.ALIGN_MIDDLE);
  vg.text(x+9+2, y+h*0.5, ICON_CHECK);
}

function drawSlider(vg, pos, x, y, w, h)
{
	var cy = y+(h*0.5);
	var kr = (h*0.25);

	vg.save();

	// Slot
	vg.beginPath();
	vg.roundedRect(x,cy-2, w,4, 2);
	vg.boxGradient(x,cy-2+1, w,4, 2,2, 0,0,0,32, 0,0,0,128);
	vg.fill();

	// Knob Shadow
	vg.beginPath();
	vg.rect(x+(pos*w)-kr-5,cy-kr-5,kr*2+5+5,kr*2+5+5+3);
	vg.circle(x+(pos*w),cy, kr);
	vg.pathWinding(vg.HOLE);
	vg.radialGradient(x+(pos*w),cy+1, kr-3,kr+3, 0,0,0,64, 0,0,0,0);
	vg.fill();

	// Knob
	vg.beginPath();
	vg.circle(x+(pos*w),cy, kr-1);
	vg.fillColor(40,43,48,255);
	vg.fill();
	vg.linearGradient(x,cy-kr,x,cy+kr, 255,255,255,16, 0,0,0,16);
	vg.fill();

	vg.beginPath();
	vg.circle(x+(pos*w),cy, kr-0.5);
	vg.strokeColor(0,0,0,92);
	vg.stroke();

	vg.restore();
}

function drawSpinner(vg, cx, cy, r, t)
{
  var a0 = 0.0 + t*6;
  var a1 = Math.PI + t*6;
  var r0 = r;
  var r1 = r * 0.75;
  var ax,ay, bx,by;

  vg.save();

  vg.beginPath();
  vg.arc(cx,cy, r0, a0, a1, vg.CW);
  vg.arc(cx,cy, r1, a1, a0, vg.CCW);
  vg.closePath();
  ax = cx + Math.cos(a0) * (r0+r1)*0.5;
  ay = cy + Math.sin(a0) * (r0+r1)*0.5;
  bx = cx + Math.cos(a1) * (r0+r1)*0.5;
  by = cy + Math.sin(a1) * (r0+r1)*0.5;
  vg.linearGradient(ax,ay, bx,by, 0,0,0,0, 0,0,0,128);
  vg.fill();

  vg.restore();
}

function drawThumbnails(vg, x, y, w, h, images, nimages, t)
{
  var cornerRadius = 3.0;
  var ix,iy,iw,ih;
  var thumb = 60.0;
  var arry = 30.5;
  var imgw, imgh;
  var stackh = (nimages/2) * (thumb+10) + 10;
  var i;
  var u = (1+Math.cos(t*0.5))*0.5;
  var u2 = (1-Math.cos(t*0.2))*0.5;
  var scrollh, dv;

  vg.save();

  vg.beginPath();
  vg.rect(x-10,y-10, w+20,h+30);
  vg.roundedRect(x,y, w,h, cornerRadius);
  vg.pathWinding(vg.HOLE);
  vg.boxGradient(x,y+4, w,h, cornerRadius*2, 20, 0,0,0,128, 0,0,0,0);
  vg.fill();

  // Window
  vg.beginPath();
  vg.roundedRect(x,y, w,h, cornerRadius);
  vg.moveTo(x-10,y+arry);
  vg.lineTo(x+1,y+arry-11);
  vg.lineTo(x+1,y+arry+11);
  vg.fillColor(200,200,200,255);
  vg.fill();

  vg.save();
  vg.scissor(x,y,w,h);
  vg.translate(0, -(stackh - h)*u);

  dv = 1.0 / (nimages-1);

  for (i = 0; i < nimages; i++) {
    var tx, ty, v, a;
    tx = x+10;
    ty = y+10;
    tx += (i%2) * (thumb+10);
    ty += (i/2) * (thumb+10);
    imgSize = vg.imageSize(images[i]);
    imgw = imgSize.width;
    imgh = imgSize.height
    if (imgw < imgh) {
      iw = thumb;
      ih = iw * imgh/imgw;
      ix = 0;
      iy = -(ih-thumb)*0.5;
    } else {
      ih = thumb;
      iw = ih * imgw/imgh;
      ix = -(iw-thumb)*0.5;
      iy = 0;
    }

    v = i * dv;
    a = Math.min(Math.max((u2-v)/dv, 0.0), 1.0);

    if (a < 1.0) {
      drawSpinner(vg, tx+thumb/2,ty+thumb/2, thumb*0.25, t);
    }

    vg.beginPath();
    vg.roundedRect(tx,ty, thumb,thumb, 5);
    vg.imagePattern(tx+ix, ty+iy, iw,ih, 0.0/180.0*Math.PI, images[i], a);
    vg.fill();

    vg.beginPath();
    vg.rect(tx-5,ty-5, thumb+10,thumb+10);
    vg.roundedRect(tx,ty, thumb,thumb, 6);
    vg.pathWinding(vg.HOLE);
    vg.boxGradient(tx-1,ty, thumb+2,thumb+2, 5, 3, 0,0,0,128, 0,0,0,0);
    vg.fill();

    vg.beginPath();
    vg.roundedRect(tx+0.5,ty+0.5, thumb-1,thumb-1, 4-0.5);
    vg.strokeWidth(1.0);
    vg.strokeColor(255,255,255,192);
    vg.stroke();
    
  }

  vg.restore();

  // Hide fades
  vg.beginPath();
  vg.rect(x+4,y,w-8,6);
  vg.linearGradient(x,y,x,y+6, 200,200,200,255, 200,200,200,0);
  vg.fill();

  vg.beginPath();
  vg.rect(x+4,y+h-6,w-8,6);
  vg.linearGradient(x,y+h,x,y+h-6, 200,200,200,255, 200,200,200,0);
  vg.fill();

  // Scroll bar
  vg.beginPath();
  vg.roundedRect(x+w-12,y+4, 8,h-8, 3);
  vg.boxGradient(x+w-12+1,y+4+1, 8,h-8, 3,4, 0,0,0,32, 0,0,0,92);
  vg.fill();

  scrollh = (h/stackh) * (h-8);
  vg.beginPath();
  vg.roundedRect(x+w-12+1,y+4+1 + (h-8-scrollh)*u, 8-2,scrollh-2, 2);
  vg.boxGradient(x+w-12-1,y+4+(h-8-scrollh)*u-1, 8,scrollh, 3,4, 220,220,220,255, 128,128,128,255);
  vg.fill();

  vg.restore();
}

function drawLines(vg, x, y, w, h, t)
{
	var i, j;
	var pad = 5.0, s = w/9.0 - pad*2;
	var pts = [0,0,0,0,0,0,0,0];
  var fx, fy;
	var joins = [vg.MITER, vg.ROUND, vg.BEVEL];
	var caps = [vg.BUTT, vg.ROUND, vg.SQUARE];

	vg.save(vg);
	pts[0] = -s*0.25 + Math.cos(t*0.3) * s*0.5;
	pts[1] = Math.sin(t*0.3) * s*0.5;
	pts[2] = -s*0.25;
	pts[3] = 0;
	pts[4] = s*0.25;
	pts[5] = 0;
	pts[6] = s*0.25 + Math.cos(-t*0.3) * s*0.5;
	pts[7] = Math.sin(-t*0.3) * s*0.5;

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			fx = x + s*0.5 + (i*3+j)/9.0*w + pad;
			fy = y - s*0.5 + pad;

		  vg.lineCap(caps[i]);
			vg.lineJoin(joins[j]);

			vg.strokeWidth(s*0.3);
			vg.strokeColor(0,0,0,160);
			vg.beginPath();
			vg.moveTo(fx+pts[0], fy+pts[1]);
			vg.lineTo(fx+pts[2], fy+pts[3]);
			vg.lineTo(fx+pts[4], fy+pts[5]);
			vg.lineTo(fx+pts[6], fy+pts[7]);
			vg.stroke();

			vg.lineCap(vg.BUTT);
			vg.lineJoin(vg.BEVEL);

			vg.strokeWidth(1.0);
			vg.strokeColor(0,192,255,255);
			vg.beginPath();
			vg.moveTo(fx+pts[0], fy+pts[1]);
			vg.lineTo(fx+pts[2], fy+pts[3]);
			vg.lineTo(fx+pts[4], fy+pts[5]);
			vg.lineTo(fx+pts[6], fy+pts[7]);
			vg.stroke();
		}
	}

	vg.restore(vg);
}

/* TODO
function drawParagraph(vg, x, y, width, height, mx, my)
{
	//NVGtextRow rows[3];
	//NVGglyphPosition glyphs[100];
	var text = "This is longer chunk of text.\n  \n  Would have used lorem ipsum but she    was busy jumping over the lazy dog with the fox and all the men who came to the aid of the party.";
	//const char* start;
	//const char* end;
	//int nrows, i, nglyphs, j, lnum = 0;
	//float lineh;
	//float caretx, px;
	//float bounds[4];
	//float a;
	//float gx,gy;
	//int gutter = 0;

	vg.save(vg);

	vg.fontSize(18.0);
	vg.fontFace("sans");
	vg.textAlign(vg.ALIGN_LEFT|vg.ALIGN_TOP);
	vg.textMetrics(NULL, NULL, &lineh);

	// The text break API can be used to fill a large buffer of rows,
	// or to iterate over the text just few lines (or just one) at a time.
	// The "next" variable of the last returned item tells where to continue.
	start = text;
	end = text + strlen(text);
	while ((nrows = nvgTextBreakLines(vg, start, end, width, rows, 3))) {
		for (i = 0; i < nrows; i++) {
			NVGtextRow* row = &rows[i];
			int hit = mx > x && mx < (x+width) && my >= y && my < (y+lineh);

			nvgBeginPath(vg);
			nvgFillColor(vg, nvgRGBA(255,255,255,hit?64:16));
			nvgRect(vg, x, y, row->width, lineh);
			nvgFill(vg);

			nvgFillColor(vg, nvgRGBA(255,255,255,255));
			nvgText(vg, x, y, row->start, row->end);

			if (hit) {
				caretx = (mx < x+row->width/2) ? x : x+row->width;
				px = x;
				nglyphs = nvgTextGlyphPositions(vg, x, y, row->start, row->end, glyphs, 100);
				for (j = 0; j < nglyphs; j++) {
					float x0 = glyphs[j].x;
					float x1 = (j+1 < nglyphs) ? glyphs[j+1].x : x+row->width;
					float gx = x0 * 0.3f + x1 * 0.7f;
					if (mx >= px && mx < gx)
						caretx = glyphs[j].x;
					px = gx;
				}
				nvgBeginPath(vg);
				nvgFillColor(vg, nvgRGBA(255,192,0,255));
				nvgRect(vg, caretx, y, 1, lineh);
				nvgFill(vg);

				gutter = lnum+1;
				gx = x - 10;
				gy = y + lineh/2;
			}
			lnum++;
			y += lineh;
		}
		// Keep going...
		start = rows[nrows-1].next;
	}

	if (gutter) {
		char txt[16];
		snprintf(txt, sizeof(txt), "%d", gutter);
		nvgFontSize(vg, 13.0f);
		nvgTextAlign(vg, NVG_ALIGN_RIGHT|NVG_ALIGN_MIDDLE);

		nvgTextBounds(vg, gx,gy, txt, NULL, bounds);

		nvgBeginPath(vg);
		nvgFillColor(vg, nvgRGBA(255,192,0,255));
		nvgRoundedRect(vg, (int)bounds[0]-4,(int)bounds[1]-2, (int)(bounds[2]-bounds[0])+8, (int)(bounds[3]-bounds[1])+4, ((int)(bounds[3]-bounds[1])+4)/2-1);
		nvgFill(vg);

		nvgFillColor(vg, nvgRGBA(32,32,32,255));
		nvgText(vg, gx,gy, txt, NULL);
	}

	y += 20.0f;

	nvgFontSize(vg, 13.0f);
	nvgTextAlign(vg, NVG_ALIGN_LEFT|NVG_ALIGN_TOP);
	nvgTextLineHeight(vg, 1.2f);

	nvgTextBoxBounds(vg, x,y, 150, "Hover your mouse over the text to see calculated caret position.", NULL, bounds);

	// Fade the tooltip out when close to it.
	gx = fabsf((mx - (bounds[0]+bounds[2])*0.5f) / (bounds[0] - bounds[2]));
	gy = fabsf((my - (bounds[1]+bounds[3])*0.5f) / (bounds[1] - bounds[3]));
	a = maxf(gx, gy) - 0.5f;
	a = clampf(a, 0, 1);
	nvgGlobalAlpha(vg, a);

	nvgBeginPath(vg);
	nvgFillColor(vg, nvgRGBA(220,220,220,255));
	nvgRoundedRect(vg, bounds[0]-2,bounds[1]-2, (int)(bounds[2]-bounds[0])+4, (int)(bounds[3]-bounds[1])+4, 3);
	px = (int)((bounds[2]+bounds[0])/2);
	nvgMoveTo(vg, px,bounds[1] - 10);
	nvgLineTo(vg, px+7,bounds[1]+1);
	nvgLineTo(vg, px-7,bounds[1]+1);
	nvgFill(vg);

	nvgFillColor(vg, nvgRGBA(0,0,0,220));
	nvgTextBox(vg, x,y, 150, "Hover your mouse over the text to see calculated caret position.", NULL);

	nvgRestore(vg);
}
*/

function drawWidths(vg, x, y, width)
{
	vg.save();

	vg.strokeColor(0,0,0,255);

	for (var i = 0; i < 20; i++) {
		var w = (i+0.5)*0.1;
		vg.strokeWidth(w);
		vg.beginPath();
		vg.moveTo(x,y);
		vg.lineTo(x+width,y+width*0.3);
		vg.stroke();
		y += 10;
	}

	vg.restore();
}

function drawCaps(vg, x, y, width)
{
	var caps = [vg.BUTT, vg.ROUND, vg.SQUARE];
	var lineWidth = 8.0;

	vg.save();

	vg.beginPath();
	vg.rect(x-lineWidth/2, y, width+lineWidth, 40);
	vg.fillColor(255,255,255,32);
	vg.fill();

	vg.beginPath();
	vg.rect(x, y, width, 40);
	vg.fillColor(255,255,255,32);
	vg.fill();

	vg.strokeWidth(lineWidth);
	for (var i = 0; i < 3; i++) {
		vg.lineCap(caps[i]);
		vg.strokeColor(0,0,0,255);
		vg.beginPath();
		vg.moveTo(x, y + i*10 + 5);
		vg.lineTo(x+width, y + i*10 + 5);
		vg.stroke();
	}

	vg.restore();
}

function drawScissor(vg, x, y, t)
{
	vg.save(vg);

	// Draw first rect and set scissor to it's area.
	vg.translate(x, y);
	vg.rotate(5*Math.PI/180.0);
	vg.beginPath();
	vg.rect(-20,-20,60,40);
	vg.fillColor(255,0,0,255);
	vg.fill();
	vg.scissor(-20,-20,60,40);

	// Draw second rectangle with offset and rotation.
	vg.translate( 40,0);
	vg.rotate(t);

	// Draw the intended second rectangle without any scissoring.
	vg.save();
	vg.resetScissor();
	vg.beginPath();
	vg.rect(-20,-10,60,30);
	vg.fillColor(255,128,0,64);
	vg.fill();
	vg.restore();

	// Draw second rectangle with combined scissoring.
	vg.intersectScissor(-20,-10,60,30);
	vg.beginPath();
	vg.rect(-20,-10,60,30);
	vg.fillColor(255,128,0,255);
	vg.fill();

	vg.restore();
}

var VG = undefined;
var gImages = [];
var t = 0.0;

function onInit() {
  try {
    vg = new NanoVG();

    for (var i = 0; i < 12; i++) {
      var imageId = vg.createImage("../example/images/image" + (i+1) + ".jpg", 0);
      gImages.push(imageId);
    }

    t =  0.0;

  } catch(e) {
    print(e.stack);
  }

}

function onQuit() {
  for (var i = 0; i < 12; i++) {
    vg.deleteImage(gImages[i]);
  }
}

function onDraw() {

  try {
    if (VG == undefined) {
      VG = new NanoVG();
    }
    var vg = VG;
    //var tw = vg.textBounds(0,0,'text');
    var width = 1000;
    var height = 600;
    t = t + 0.02;
    var x, y, popy;

    drawEyes(vg, width - 250, 50, 150, 100, 0, 0, t);
    drawGraph(vg, 0, height/2, width, height/2, t);
    drawColorwheel(vg, width - 300, height - 300, 250, 250, t);

    // Line joints
    drawLines(vg, 120, height-50, 600, 50, t);

    // Line caps
    drawWidths(vg, 10, 50, 30);

    // Line caps
    drawCaps(vg, 10, 300, 30);

    drawScissor(vg, 50, height-80, t);

    vg.save();

    // Widgets
    drawWindow(vg, "Widgets `n Stuff", 50, 50, 300, 400);
    x = 60; y = 95;
    drawSearchBox(vg, "Search", x,y,280,25);
    y += 40;
    drawDropDown(vg, "Effects", x,y,280,28);
    popy = y + 14;
    y += 45;

    // Form
    drawLabel(vg, "Login", x,y, 280,20);
    y += 25;
    drawEditBox(vg, "Email",  x,y, 280,28);
    y += 35;
    drawEditBox(vg, "Password", x,y, 280,28);
    y += 38;
    drawCheckBox(vg, "Remember me", x,y, 140,28);
    drawButton(vg, ICON_LOGIN, "Sign in", x+138, y, 140, 28, 0,96,128,255);
    y += 45;


    // Slider
    drawLabel(vg, "Diameter", x,y, 280,20);
    y += 25;
    drawEditBoxNum(vg, "123.00", "px", x+180,y, 100,28);
    drawSlider(vg, 0.4, x,y, 170,28);
    y += 55;

    drawButton(vg, ICON_TRASH, "Delete", x, y, 160, 28, 128,16,8,255);
    drawButton(vg, 0, "Cancel", x+170, y, 110, 28, 0,0,0,0);

    // Thumbnails box
    drawThumbnails(vg, 365, popy-30, 160, 300, gImages, 12, t);

    vg.restore();
  } catch(e) {
    print(e.stack);
  }

}
