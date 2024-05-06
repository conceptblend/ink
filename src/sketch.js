import * as utils from "./lib/fx-utils";
import { Drop } from "./drop";

// PARAMETER SETS
const PARAM_SETS = [
  {
    name: "set one",
    seed: "hello world",
    width: 1080,
    height: 1080,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: false,
    renderAsVector: AS_SVG,
  },
];

// PARAMETERS IN USE
const PARAMS = PARAM_SETS[PARAM_SETS.length - 1];

// VIDEO
const EXPORTVIDEO = AS_SVG ? false : PARAMS.exportVideo ?? false; // set to `false` to not export
const FPS = PARAMS.fps;
const DURATION = PARAMS.duration;

const drops = [];

export const sketch = (p) => {
  let isRecording = false;

  p.keyReleased = (e) => {
    const KEY_S = 83;
    const KEY_SPACE = 32;
    if (e.which === KEY_S) {
      // saveImage("png");
      downloadOutput();
    } else if (e.which === KEY_SPACE) {
      if (p.isLooping()) {
        p.noLoop();
      } else {
        p.loop();
      }
    }
  };

  p.setup = () => {
    // SVG output is MUCH SLOWER but necessary for the SVG exports
    p.createCanvas(PARAMS.width, PARAMS.height, PARAMS.renderAsVector ? p.SVG : p.P2D);

    p.angleMode(p.DEGREES);
    p.colorMode(p.RGB, 255);

    // p.noStroke();

    const radius = 40;
    for (let y = 0, ySteps = 8; y < ySteps; y++) {
      for (let x = 0, max = 8; x < max; x++) {
        const step = PARAMS.width / max;
        const drop = new Drop(p, y * step, PARAMS.height * 0.5 + x, radius, p.color(255, 100, 64));
        for (let other of drops) {
          other.marble(drop);
        }
        drops.push(drop);
      }
    }

    // Dependency: Statically added via HTML
    Math.seedrandom(PARAMS.seed);

    p.frameRate(FPS);

    if (!EXPORTVIDEO && !PARAMS.isAnimated) p.noLoop();
  };

  p.draw = () => {
    p.background(0);

    // DO YOUR DRAWING HERE!
    // p.noFill();
    // p.stroke(255, 0, 255);
    // p.rect(20 + (p.frameCount % 60), 20, 30, 30);

    for (const drop of drops) {
      drop.show();
    }

    if (EXPORTVIDEO) {
      if (PARAMS.renderAsVector) throw new Error("Cannot export video when rendering as Vector");
      if (!isRecording) {
        isRecording = true;
        console.log("Recording...[ Not implemented ]");
      }
      // Example to end automatically after 361 frames to get a full loop
      if (p.frameCount > DURATION) {
        p.noLoop();
        saveConfig();
        console.log("Done.");
      }
    }
  };

  function getName() {
    // Encode the parameters into the filename
    return `${PARAMS.name}-${encodeURIComponent(PARAMS.seed)}-${new Date().toISOString()}`;
  }

  function saveImage(ext = "jpg") {
    p.save(`${getName()}.${ext}`);
  }

  function saveConfig() {
    p.saveJSON(PARAMS, `${getName()}-config.json`);
  }

  function downloadOutput() {
    saveImage(PARAMS.renderAsVector ? "svg" : "jpg");
    saveConfig();
  }
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
