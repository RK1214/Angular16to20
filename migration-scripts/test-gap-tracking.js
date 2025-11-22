const fs = require('fs');
const path = require('path');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator.js');
const migrator = new FlexMigrator({ dryRun: false });
fs.unlinkSync(tempPath);

console.log('='.repeat(80));
console.log('Testing Gap Tracking');
console.log('='.repeat(80));
console.log('');

// Test all gap scenarios
const testCases = [
  { input: '<div fxLayoutGap="10px"></div>', desc: 'Gap 10px (custom)' },
  { input: '<div fxLayoutGap="24px"></div>', desc: 'Gap 24px (standard)' },
  { input: '<div fxLayoutGap="16"></div>', desc: 'Gap 16 (no px, standard)' },
  { input: '<div fxLayoutGap="10"></div>', desc: 'Gap 10 (no px, custom)' },
  { input: '<div fxLayoutGap="30"></div>', desc: 'Gap 30 (no px, custom)' },
  { input: '<div fxLayoutGap.gt-xs="24px"></div>', desc: 'Gap 24px on gt-xs (breakpoint)' },
  { input: '<div fxLayoutGap.sm="15px"></div>', desc: 'Gap 15px on sm (custom + breakpoint)' },
];

console.log('Migrating gap test cases:');
console.log('-'.repeat(80));
testCases.forEach(({ input, desc }) => {
  const result = migrator.migrateTag(input);
  console.log(`${desc}`);
  console.log(`  Input:  ${input}`);
  console.log(`  Output: ${result}`);
  console.log('');
});

console.log('='.repeat(80));
console.log('Custom Classes Tracked:');
console.log('='.repeat(80));
console.log(`Total custom classes: ${migrator.customClasses.size}`);
console.log('');

Array.from(migrator.customClasses)
  .filter(({ type }) => type === 'gap' || type === 'gap-breakpoint')
  .sort((a, b) => a.name.localeCompare(b.name))
  .forEach(({ name, type, value, breakpoint }) => {
    console.log(`  ${name}:`);
    console.log(`    Type: ${type}`);
    console.log(`    Value: ${value}`);
    console.log(`    Breakpoint: ${breakpoint || 'none'}`);
    console.log('');
  });

// Generate SCSS
const outputPath = path.join(__dirname, 'test-gap-tracking-output.scss');
migrator.generateLayoutScss(outputPath);

const scssContent = fs.readFileSync(outputPath, 'utf-8');
const customSection = scssContent.split('// Custom Classes (Dynamically Generated)')[1];

console.log('='.repeat(80));
console.log('Generated Custom Classes:');
console.log('='.repeat(80));

if (customSection) {
  console.log('// Custom Classes (Dynamically Generated)' + customSection);
} else {
  console.log('⚠️  No custom section found');
}

// Clean up
fs.unlinkSync(outputPath);
