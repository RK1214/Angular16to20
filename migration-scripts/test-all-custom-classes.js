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
console.log('Testing ALL Custom Classes (Flex + Gap)');
console.log('='.repeat(80));
console.log('');

// Test all scenarios
const testCases = [
  // Custom flex percentages
  { input: '<div fxFlex="92"></div>', desc: 'Custom flex 92% (not in standard)' },
  { input: '<div fxFlex="35"></div>', desc: 'Custom flex 35% (not in standard)' },
  { input: '<div fxFlex="50"></div>', desc: 'Standard flex 50% (should NOT be custom)' },

  // Custom flex pixels
  { input: '<div fxFlex="650px"></div>', desc: 'Custom flex 650px (not in standard)' },
  { input: '<div fxFlex="125px"></div>', desc: 'Custom flex 125px (not in standard)' },
  { input: '<div fxFlex="100px"></div>', desc: 'Standard flex 100px (should NOT be custom)' },

  // Breakpoint-specific flex (always custom)
  { input: '<div fxFlex.sm="85"></div>', desc: 'Breakpoint flex 85% on sm' },
  { input: '<div fxFlex.xs="320px"></div>', desc: 'Breakpoint flex 320px on xs' },
  { input: '<div fxFlex.gt-xs="50"></div>', desc: 'Breakpoint flex 50% on gt-xs (even standard value)' },

  // Calc with breakpoint
  { input: '<div fxFlex.sm="calc(100% - 40px)"></div>', desc: 'Calc on sm breakpoint' },
  { input: '<div fxFlex.xs="calc(50% - 20px)"></div>', desc: 'Calc on xs breakpoint' },

  // Custom gaps
  { input: '<div fxLayoutGap="10px"></div>', desc: 'Custom gap 10px (not in standard)' },
  { input: '<div fxLayoutGap="15px"></div>', desc: 'Custom gap 15px (not in standard)' },
  { input: '<div fxLayoutGap="24px"></div>', desc: 'Standard gap 24px (should NOT be custom)' },

  // Breakpoint-specific gaps
  { input: '<div fxLayoutGap.sm="18px"></div>', desc: 'Gap 18px on sm breakpoint' },
  { input: '<div fxLayoutGap.gt-xs="30px"></div>', desc: 'Gap 30px on gt-xs breakpoint' },
];

console.log('Migrating test cases:');
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

Array.from(migrator.customClasses.values())
  .sort((a, b) => {
    // Sort by type first, then by name
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
  })
  .forEach(({ name, type, value, breakpoint }) => {
    console.log(`  ${name}:`);
    console.log(`    Type: ${type}`);
    console.log(`    Value: ${value}`);
    console.log(`    Breakpoint: ${breakpoint || 'none'}`);
    console.log('');
  });

// Generate SCSS
const outputPath = path.join(__dirname, 'test-all-custom-output.scss');
migrator.generateLayoutScss(outputPath);

const scssContent = fs.readFileSync(outputPath, 'utf-8');
const customSection = scssContent.split('// Custom Classes (Dynamically Generated)')[1];

console.log('='.repeat(80));
console.log('Generated Custom Classes SCSS:');
console.log('='.repeat(80));

if (customSection) {
  console.log('// Custom Classes (Dynamically Generated)' + customSection);
} else {
  console.log('⚠️  No custom section found');
}

// Clean up
fs.unlinkSync(outputPath);

console.log('='.repeat(80));
console.log('✅ Test Complete!');
console.log('='.repeat(80));
