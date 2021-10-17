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

        p.baseDivisors = [8, 16, 32, 64];

        p.baseDivisor = 64;

        p.colourPalette = [];

        p.baseRepititions = [4, 8, 16];

        p.baseRepitition = 1;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[5].notes; // Sampler 3 - QS Pure
                    const noteSet2 = result.tracks[3].notes; // Sampler 2 - QS Para
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
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
               
                // p.hexagon(p.width /2, p.height / 2, p.baseSize);
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
            p.background(0);
            p.hexagonGrid.forEach(hexagon => {
                for (let i = 0; i < p.baseRepitition; i++) {
                    setTimeout(
                        function () {
                            const { colour } = hexagon; 
                            p.stroke(colour.h, colour.s, colour.b);
                            if(p.baseRepitition > 1) {
                                p.noFill();
                                p.strokeWeight(4);
                            }
                            else {
                                p.fill(colour.h, colour.s, colour.b);
                            }
                            p.hexagon(p.baseSize * hexagon.x, p.baseSize * hexagon.y, p.baseSize / (i + 1));
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

        /*
        * function to draw a hexagon shape
        * adapted from: https://p5js.org/examples/form-regular-polygon.html
        * @param {Number} x        - x-coordinate of the hexagon
        * @param {Number} y      - y-coordinate of the hexagon
        * @param {Number} radius   - radius of the hexagon
        */
        p.hexagon = (x, y, radius) => {
            radius = radius / 2;
            p.angleMode(p.RADIANS);
            const angle = p.TWO_PI / 6;
            p.beginShape();
            for (var a = p.TWO_PI / 12; a < p.TWO_PI + p.TWO_PI / 12; a += angle) {
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
                TetradicColourCalulator(randomHue + 45,p.random(50, 100),p.random(50, 100))
            );
            p.changeBaseSize();
        }

        p.changeBaseSize = () => {
            const index = p.baseDivisors.indexOf(p.baseDivisor)
            let divisors = [...p.baseDivisors];
            divisors.splice(index, 1);
            p.baseDivisor = p.random(divisors);
            p.baseSize = p.height >= p.width ? p.height : p.width;
            p.baseSize = p.baseSize / p.baseDivisor;
            p.populateHexagonGrid();
        }

        p.hexagonGrid = [];

        p.populateHexagonGrid = () => {
            p.hexagonGrid = [];
            let count = 0;
            for (let i = 0; i < p.baseDivisor + 2; i++) {
                for (let j = 0; j < p.baseDivisor + 2; j++) {
                    const colour = p.colourPalette[count % p.colourPalette.length];
                    p.hexagonGrid.push(
                        {
                            x: j % 2 === 0 ? i : i - 0.5,
                            y: j,
                            colour: colour,
                        }
                    )
                    count++;
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
