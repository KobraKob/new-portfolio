#!/usr/bin/env node
// Check for remaining TODO: markers in source code
// Run: node scripts/check-todos.mjs

import { globSync } from 'glob';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd(), 'src');
const extensions = ['.tsx', '.ts', '.css', '.md'];

let todos = 0;
const todoDetails = [];

for (const ext of extensions) {
  const files = globSync(`**/*${ext}`, { cwd: root, absolute: true });
  
  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('TODO:')) {
        const commentIndex = line.indexOf('//');
        const todoIndex = line.indexOf('TODO:');
        
        if (commentIndex === -1 || todoIndex < commentIndex) {
          todos++;
          todoDetails.push({
            file: file.replace(root + '/', ''),
            line: index + 1,
            content: line.trim()
          });
        }
      }
    });
  }
}

if (todos > 0) {
  console.error(`\n❌ Found ${todos} TODO: marker(s) remaining:\n`);
  for (const todo of todoDetails) {
    console.error(`  ${todo.file}:${todo.line}`);
    console.error(`    ${todo.content}`);
  }
  console.error(`\n⚠️  Production build will fail. Resolve all TODOs before deploying.`);
  process.exit(1);
} else {
  console.log('✅ No TODO: markers found.');
  process.exit(0);
}