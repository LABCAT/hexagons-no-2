import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import ShuffleArray from './functions/ShuffleArray.js';
import TetradicColourCalulator from './functions/TetradicColourCalulator.js';

import audio from "../audio/hexagons-no-2.ogg";
import midi from "../audio/hexagons-no-2.mid";

const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.baseSize = 0;

        p.baseDivisors = [2, 4, 8, 16, 32];

        p.baseDivisor = 64;

        p.colourPalette = [];

        p.baseRepititions = [12, 18, 24];

        p.baseRepitition = 1;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[5].notes; // Sampler 3 - QS Pure
                    const noteSet2 = result.tracks[3].notes; // Sampler 2 - QS Para
                    const noteSet3 = result.tracks[6].notes; // Sampler 4 - Dance Saw
                    let controlChanges = Object.assign({},result.tracks[7].controlChanges); // Filter 1 - Dance Saw
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.scheduleCueSet(noteSet3, 'executeCueSet3');
                    p.scheduleCueSet(controlChanges[Object.keys(controlChanges)[0]], 'executeCueSet4');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.setup = () => {
            p.noLoop();
            p.colorMode(p.HSB);
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.reset();
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
               
            }
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.executeCueSet1 = (note) => {
            const { duration } = note,
                delay = parseInt(duration * 1000) / p.baseRepitition;
            p.changeBaseSize();
            if(p.baseRepitition > 1) {
                p.background(0, 0, 0, p.globalOpacity);
                p.hexagonGrid = p.hexagonGrid.slice(0, Math.ceil(p.hexagonGrid.length / 4));
            }
            p.hexagonGrid.forEach(hexagon => {
                let size = p.baseSize;
                for (let i = 0; i < p.baseRepitition; i++) {
                    setTimeout(
                        function () {
                            const { colour } = hexagon;
                            for (let j = 0; j < i; j++) {
                                size = size - size / 10;
                            }
                            if(p.baseRepitition > 1) {
                                p.noFill();
                                p.strokeWeight(1);
                                p.stroke(colour.h, colour.s, colour.b, p.globalOpacity);
                            }
                            else {
                                p.fill(colour.h, colour.s, colour.b);
                            }
                            p.hexagon(hexagon.x, hexagon.y, size);
                        },
                        (delay * i)
                    );
                }
            });
        }

        p.executeCueSet2 = (note) => {
            const index = p.baseRepititions.indexOf(p.baseRepitition)
            let repititions = [...p.baseRepititions];
            repititions.splice(index, 1);
            p.baseRepitition = p.random(repititions);
        }

        p.bigHexes = [];

        p.bigHexSize = 0;

        p.bigHexStep = 0;

        p.bigHexColours = [];

        p.globalOpacity = 0;

        p.executeCueSet3 = (note) => {
            const { currentCue } = note,
                colourIndex = currentCue % 6 == 0 ? 5 : currentCue % 6 - 1;
            if(currentCue % 12 === 1){
                p.bigHexes = [];
                p.bigHexColours = [...p.colourPalette];
                p.bigHexColours = ShuffleArray(p.bigHexColours);
                p.bigHexColours.splice(0, 2);
                p.bigHexSize = p.height >= p.width ? p.width : p.height;
                p.bigHexSize = p.bigHexSize * 1.15;
                p.bigHexStep = (p.width - p.bigHexSize) / 12; 
            }
            p.bigHexes.push(
                {
                    size: p.bigHexSize,
                    colour: p.bigHexColours[colourIndex],
                }
            );
            p.bigHexes.forEach(bigHex => {
                const { size, colour } = bigHex;
                p.noFill();
                p.strokeWeight(12);
                p.stroke(colour.h, colour.s, colour.b, p.globalOpacity);
                p.hexagon(p.width / 2, p.height / 2, size, 0);
            });
            p.bigHexSize = p.bigHexSize + p.bigHexStep;
        }

        p.executeCueSet4 = (controlChange) => {
            p.globalOpacity = controlChange.value;
        }

        /*
        * function to draw a hexagon shape
        * adapted from: https://p5js.org/examples/form-regular-polygon.html
        * @param {Number} x        - x-coordinate of the hexagon
        * @param {Number} y      - y-coordinate of the hexagon
        * @param {Number} radius   - radius of the hexagon
        */
        p.hexagon = (x, y, radius, start = p.TWO_PI / 12) => {
            radius = radius / 2;
            p.angleMode(p.RADIANS);
            const angle = p.TWO_PI / 6;
            p.beginShape();
            for (var a = start; a < p.TWO_PI + start; a += angle) {
                let sx = x + p.cos(a) * radius;
                let sy = y + p.sin(a) * radius;
                p.vertex(sx, sy);
            }
            p.endShape(p.CLOSE);
        }

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {
            p.background(0);
            const randomHue = p.random(360);
            p.colourPalette = TetradicColourCalulator(randomHue,p.random(50, 100),p.random(50, 100));
            p.colourPalette = p.colourPalette.concat(
                TetradicColourCalulator(randomHue + 30,p.random(50, 100),p.random(50, 100))
            );
            p.changeBaseSize();
        }

        p.baseRepititionChanged = false;

        p.changeBaseSize = () => {
            if(p.baseRepitition > 1 && !p.baseRepititionChanged){
                p.background(255);
                p.baseDivisors = [ 6, 12, 24, 48 ];
                p.baseRepititionChanged = true;
            }
            const index = p.baseDivisors.indexOf(p.baseDivisor)
            let divisors = [...p.baseDivisors];
            divisors.splice(index, 1);
            p.baseDivisor = p.random(divisors);
            p.baseSize = p.height >= p.width ? p.width : p.height;
            p.baseSize = p.baseSize / p.baseDivisor;
            p.populateHexagonGrid();
        }

        p.hexagonGrid = [];

        p.populateHexagonGrid = () => {
            p.hexagonGrid = [];
            let count = 0;
            if(p.baseRepitition > 1){
                let columns = p.height >= p.width 
                    ? Math.floor(p.width / p.baseSize)
                    : Math.floor(p.height / p.baseSize),
                    rows = columns / 2,
                    xAdjuster = p.width / 2  - (p.baseSize * columns) / 2 + p.baseSize / 2;
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        const colour = p.colourPalette[count % p.colourPalette.length];
                        p.hexagonGrid.push(
                            {
                                x: j * p.baseSize + xAdjuster,
                                y: p.height / 2 + p.baseSize * i,
                                colour: colour,
                            }
                        );
                        if(1 > 0){
                            p.hexagonGrid.push(
                                {
                                    x: j * p.baseSize + xAdjuster,
                                    y: p.height / 2 - p.baseSize * i,
                                    colour: colour,
                                }
                            );
                        }
                        count++;
                    }
                    columns--;
                    xAdjuster = xAdjuster + p.baseSize / 2
                }
            }
            else {
                for (let i = 0; i < Math.floor(p.width / p.baseSize)  + 2; i++) {
                    for (let j = 0; j < Math.floor(p.height / p.baseSize) + 2; j++) {
                        const colour = p.colourPalette[count % p.colourPalette.length];
                        p.hexagonGrid.push(
                            {
                                x: j % 2 === 0 ? i * p.baseSize : i * p.baseSize - p.baseSize / 2,
                                y: j * p.baseSize,
                                colour: colour,
                            }
                        )
                        count++;
                    }   
                }
            }
            p.hexagonGrid = ShuffleArray(p.hexagonGrid);
        }


        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
