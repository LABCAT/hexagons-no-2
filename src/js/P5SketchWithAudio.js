import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import TetradicColourCalulator from './functions/TetradicColourCalulator.js';

import audio from "../audio/circles-no-3.ogg";
import midi from "../audio/circles-no-3.mid";

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

        p.baseDivisors = [4, 8, 16, 32, 64];

        p.baseDivisor = 64;

        p.colourPallette = [];

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    const noteSet1 = result.tracks[5].notes; // Synth 1
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            // p.song = p.loadSound(audio, p.loadMidi);
            // p.song.onended(p.logCredits);
            document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
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

        p.setup = () => {
            p.colorMode(p.HSB);
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.populateHexagonGrid();
            p.reset();
        }

        p.draw = () => {
            let count = 0;
            p.hexagonGrid.forEach(hexagon => {
                const colour = p.colourPallette[count % p.colourPallette.length];
                p.fill(colour.h, colour.s, colour.b);
                p.hexagon(p.baseSize * hexagon.x, p.baseSize * hexagon.y, p.baseSize);
                count++;
            });
            if(p.audioLoaded && p.song.isPlaying()){

            }
        }

        p.executeCueSet1 = (note) => {
            p.background(p.random(255), p.random(255), p.random(255));
            p.fill(p.random(255), p.random(255), p.random(255));
            p.noStroke();
            p.ellipse(p.width / 2, p.height / 2, p.width / 4, p.width / 4);
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
            p.reset();
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
            p.changeBaseSize();
            const randomHue = p.random(360);
            p.colourPallette = TetradicColourCalulator(randomHue,p.random(50, 100),p.random(50, 100));
            p.colourPallette = p.colourPallette.concat(TetradicColourCalulator(randomHue + 45,p.random(50, 100),p.random(50, 100)));
            console.log(p.colourPallette);
        }

        p.changeBaseSize = () => {
            const index = p.baseDivisors.indexOf(p.baseDivisor)
            let divisors = [...p.baseDivisors];
            divisors.splice(index, 1);
            p.baseDivisor = p.random(divisors);
            p.baseSize = p.height >= p.width ? p.height : p.width;
            p.baseSize = p.baseSize / p.baseDivisor;
        }

        p.hexagonGrid = [];

        p.populateHexagonGrid = () => {
            for (let i = 0; i < 66; i++) {
                for (let j = 0; j < 66; j++) {
                    p.hexagonGrid.push(
                        {
                            x: j % 2 === 0 ? i : i - 0.5,
                            y: j,
                        }
                    )
                }   
            }
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
