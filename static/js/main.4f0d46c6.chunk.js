(this["webpackJsonphexagons-no-2"]=this["webpackJsonphexagons-no-2"]||[]).push([[0],{16:function(e,i,t){},29:function(e,i,t){"use strict";t.r(i);var a=t(1),o=t.n(a),n=t(10),s=t.n(n),r=(t(16),t(5)),c=t(2);window.p5=c;t(18);var d=t(11),l=t(0);function h(){return Object(l.jsxs)("svg",{id:"play-icon",className:"fade-out",xmlns:"http://www.w3.org/2000/svg",height:"24",viewBox:"0 0 24 24",width:"24",children:[Object(l.jsx)("path",{d:"M0 0h24v24H0z",fill:"none"}),Object(l.jsx)("path",{d:"M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"})]})}var u=function(e){for(var i,t,a=e.length;0!==a;)t=Math.floor(Math.random()*a),i=e[a-=1],e[a]=e[t],e[t]=i;return e};var g=function(e){for(var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:100,a=[],o=0;o<4;){var n={h:e=(e+=90*o)<360?e:e-360,s:i,b:t};o++,a.push(n)}return a},b=t.p+"static/media/hexagons-no-2.a28c7879.ogg",v=t.p+"static/media/hexagons-no-2.6cb01f6d.mid",f=function(){var e=Object(a.useRef)(),i=function(e){e.canvas=null,e.canvasWidth=window.innerWidth,e.canvasHeight=window.innerHeight,e.audioLoaded=!1,e.player=null,e.PPQ=15360,e.baseSize=0,e.baseDivisors=[2,4,8,16],e.baseDivisor=16,e.colourPalette=[],e.baseRepititions=[12,18,24],e.baseRepitition=1,e.loadMidi=function(){d.Midi.fromUrl(v).then((function(i){console.log(i);var t=i.tracks[5].notes,a=i.tracks[3].notes,o=i.tracks[1].notes.filter((function(e){return 43!=e.midi})),n=Object.assign({},i.tracks[7].controlChanges);e.scheduleCueSet(t,"executeCueSet1"),e.scheduleCueSet(a,"executeCueSet2"),e.scheduleCueSet(o,"executeCueSet3"),e.scheduleCueSet(n[Object.keys(n)[0]],"executeCueSet4"),e.audioLoaded=!0,document.getElementById("loader").classList.add("loading--complete"),document.getElementById("play-icon").classList.remove("fade-out")}))},e.preload=function(){e.song=e.loadSound(b,e.loadMidi),e.song.onended(e.logCredits)},e.setup=function(){e.noLoop(),e.colorMode(e.HSB),e.canvas=e.createCanvas(e.canvasWidth,e.canvasHeight),e.reset()},e.draw=function(){e.audioLoaded&&e.song.isPlaying()},e.scheduleCueSet=function(i,t){for(var a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=-1,n=1,s=0;s<i.length;s++){var r=i[s],c=r.ticks,d=r.time;(c!==o||a)&&(r.currentCue=n,e.song.addCue(d,e[t],r),o=c,n++)}},e.executeCueSet1=function(i){if(e.changeBaseSize(),e.baseRepitition>1){var t=[];e.hexagonGrid=e.hexagonGrid.slice(0,Math.ceil(e.hexagonGrid.length/4)),e.background(0,0,0,.4*e.globalOpacity),e.fill(0,0,0,e.globalOpacity),e.noStroke(),console.log(e.globalOpacity),e.hexagon(e.width/2,e.height/2,e.bigHexSize,0),e.hexagonGrid.forEach((function(i){for(var a=i.colour,o=i.x,n=i.y,s=e.baseSize,r=0;r<e.baseRepitition;r++){for(var c=0;c<r;c++)s-=s/10;t.push({x:o,y:n,colour:a,size:s})}})),t=(t=u(t)).slice(0,Math.ceil(t.length/2));for(var a=i.duration,o=parseInt(1e3*a)/t.length,n=function(i){var a=t[i],n=(a.x,a.y,a.size),s=a.colour;setTimeout((function(){e.noFill(),e.strokeWeight(1),e.stroke(s.h,s.s,s.b,1.8*e.globalOpacity),e.hexagon(a.x,a.y,n)}),o*i)},s=0;s<t.length;s++)n(s)}else e.background(0,0,0,.9*e.globalOpacity),e.hexagonGrid.forEach((function(i){var t=i.colour;e.fill(t.h,t.s,t.b,e.globalOpacity),e.stroke(t.h,t.s,t.b,.5),e.hexagon(i.x,i.y,e.baseSize)}))},e.executeCueSet2=function(i){var t=e.baseRepititions.indexOf(e.baseRepitition),a=Object(r.a)(e.baseRepititions);a.splice(t,1),e.baseRepitition=e.random(a)},e.bigHexSize=0,e.bigHexStep=0,e.globalOpacity=0,e.executeCueSet3=function(i){var t=i.ticks,a=e.map(t%122880,0,122880,0,32),o=Math.floor(e.map(t%122880,0,122880,0,16)%8),n=e.colourPalette[o],s=e.bigHexSize+e.bigHexStep*a;e.noFill(),e.strokeWeight(6),e.stroke(n.h,n.s,n.b,e.globalOpacity),e.hexagon(e.width/2,e.height/2,s,0)},e.executeCueSet4=function(i){e.globalOpacity=i.value},e.hexagon=function(i,t,a){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:e.TWO_PI/12;a/=2,e.angleMode(e.RADIANS);var n=e.TWO_PI/6;e.beginShape();for(var s=o;s<e.TWO_PI+o;s+=n){var r=i+e.cos(s)*a,c=t+e.sin(s)*a;e.vertex(r,c)}e.endShape(e.CLOSE)},e.mousePressed=function(){e.audioLoaded&&(e.song.isPlaying()?e.song.pause():(parseInt(e.song.currentTime())>=parseInt(e.song.buffer.duration)&&e.reset(),document.getElementById("play-icon").classList.add("fade-out"),e.canvas.addClass("fade-in"),e.song.play()))},e.creditsLogged=!1,e.logCredits=function(){!e.creditsLogged&&parseInt(e.song.currentTime())>=parseInt(e.song.buffer.duration)&&(e.creditsLogged=!0,console.log("Music By: http://labcat.nz/","\n","Animation By: https://github.com/LABCAT/hexagons-no-2/"),e.song.stop())},e.reset=function(){e.background(0,0,100);var i=e.random(360);e.colourPalette=g(i,e.random(50,100),e.random(50,100)),e.colourPalette=e.colourPalette.concat(g(i+30,e.random(50,100),e.random(50,100))),e.baseDivisors=[2,4,8,16],e.baseDivisor=64,e.baseRepitition=1,e.bigHexSize=e.height>=e.width?e.width:e.height,e.bigHexSize=1.15*e.bigHexSize,e.bigHexStep=(e.width-e.bigHexSize)/32,e.changeBaseSize()},e.changeBaseSize=function(){e.baseRepitition>1&&(e.baseDivisors=[6,12,24,48]);var i=e.baseDivisors.indexOf(e.baseDivisor),t=Object(r.a)(e.baseDivisors);t.splice(i,1),e.baseDivisor=e.random(t),e.baseSize=e.height>=e.width?e.width:e.height,e.baseSize=e.baseSize/e.baseDivisor,e.populateHexagonGrid()},e.hexagonGrid=[],e.populateHexagonGrid=function(){e.hexagonGrid=[];var i=0;if(e.baseRepitition>1)for(var t=e.height>=e.width?Math.floor(e.width/e.baseSize):Math.floor(e.height/e.baseSize),a=t/2,o=e.width/2-e.baseSize*t/2+e.baseSize/2,n=0;n<a;n++){for(var s=0;s<t;s++){var r=e.colourPalette[i%e.colourPalette.length];e.hexagonGrid.push({x:s*e.baseSize+o,y:e.height/2+e.baseSize*n,colour:r}),e.hexagonGrid.push({x:s*e.baseSize+o,y:e.height/2-e.baseSize*n,colour:r}),i++}t--,o+=e.baseSize/2}else for(var c=0;c<Math.floor(e.width/e.baseSize)+2;c++)for(var d=0;d<Math.floor(e.height/e.baseSize)+2;d++){var l=e.colourPalette[i%e.colourPalette.length];e.hexagonGrid.push({x:d%2===0?c*e.baseSize:c*e.baseSize-e.baseSize/2,y:d*e.baseSize,colour:l}),i++}e.hexagonGrid=u(e.hexagonGrid)},e.updateCanvasDimensions=function(){e.canvasWidth=window.innerWidth,e.canvasHeight=window.innerHeight,e.canvas=e.resizeCanvas(e.canvasWidth,e.canvasHeight)},window.attachEvent?window.attachEvent("onresize",(function(){e.updateCanvasDimensions()})):window.addEventListener&&window.addEventListener("resize",(function(){e.updateCanvasDimensions()}),!0)};return Object(a.useEffect)((function(){new c(i,e.current)}),[]),Object(l.jsx)("div",{ref:e,children:Object(l.jsx)(h,{})})};var p=function(){return Object(l.jsx)(f,{})};s.a.render(Object(l.jsx)(o.a.StrictMode,{children:Object(l.jsx)(p,{})}),document.getElementById("root"))}},[[29,1,2]]]);
//# sourceMappingURL=main.4f0d46c6.chunk.js.map