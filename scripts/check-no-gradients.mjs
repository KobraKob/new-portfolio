#!/usr/bin/env node
// Check for forbidden gradients in the codebase
// Run: node scripts/check-no-gradients.mjs

import { globSync } from 'glob';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd(), 'src');
const patterns = [
  'linear-gradient',
  'radial-gradient',
  'conic-gradient',
  'repeating-linear-gradient',
  'repeating-radial-gradient',
  'repeating-conic-gradient',
  '<linearGradient',
  '<radialGradient',
  '<conicGradient'
];

const extensions = ['.tsx', '.ts', '.css', '.scss', '.sass', '.less'];

let violations = 0;

for (const ext of extensions) {
  const files = globSync(`**/*${ext}`, { cwd: root, absolute: true });
  
  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      for (const pattern of patterns) {
        if (line.includes(pattern)) {
          // Allow in comments only
          const commentIndex = line.indexOf('//');
          const patternIndex = line.indexOf(pattern);
          
          if (commentIndex === -1 || patternIndex < commentIndex) {
            console.error(`❌ Gradient found in ${file}:${index + 1}`);
            console.error(`   ${line.trim()}`);
            violations++;
          }
        }
      }
    });
  }
}

if (violations > 0) {
  console.error(`\n❌ Found ${violations} gradient violation(s). Gradients are banned per design spec.`);
  process.exit(1);
} else {
  console.log('✅ No gradients found.');
  process.exit(0);
}