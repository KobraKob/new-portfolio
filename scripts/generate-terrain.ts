#!/usr/bin/env node
// Generate terrain contours using d3-contour + simplex-noise
// Run: npx tsx scripts/generate-terrain.ts

import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { createNoise2D } from 'simplex-noise';
import { contours } from 'd3-contour';

const width = 800;
const height = 400;
const cellSize = 4;
const thresholdCount = 12;

const noise2D = createNoise2D(() => Math.random());

const values = new Float32Array(width * height);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const nx = x / width * 6;
    const ny = y / height * 3;
    let v = noise2D(nx, ny) * 0.5;
    v += noise2D(nx * 2, ny * 2) * 0.25;
    v += noise2D(nx * 4, ny * 4) * 0.125;
    v += noise2D(nx * 8, ny * 8) * 0.0625;
    values[y * width + x] = (v + 1) / 2;
  }
}

const contourThresholds = Array.from({ length: thresholdCount }, (_, i) => (i + 1) / (thresholdCount + 1));
const contourData = contours()
  .size([width, height])
  .thresholds(contourThresholds)
  .smooth(true)(values);

const layers = {
  ground: contourData
    .filter((_, i) => i % 3 === 0)
    .map(c => ({
      coordinates: c.coordinates,
      value: c.value,
      depth: 0
    })),
  mid: contourData
    .filter((_, i) => i % 3 === 1)
    .map(c => ({
      coordinates: c.coordinates,
      value: c.value,
      depth: 1
    })),
  far: contourData
    .filter((_, i) => i % 3 === 2)
    .map(c => ({
      coordinates: c.coordinates,
      value: c.value,
      depth: 2
    }))
};

const output = {
  width,
  height,
  layers,
  generatedAt: new Date().toISOString()
};

const outDir = resolve(process.cwd(), 'src/art');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'terrain.generated.json'), JSON.stringify(output, null, 2));

console.log(`✅ Generated terrain contours:`);
console.log(`   Ground layer: ${layers.ground.length} paths`);
console.log(`   Mid layer: ${layers.mid.length} paths`);
console.log(`   Far layer: ${layers.far.length} paths`);
console.log(`   Output: src/art/terrain.generated.json`);