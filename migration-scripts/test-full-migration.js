const fs = require('fs');
const path = require('path');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator_full.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator_full.js');

console.log('='.repeat(80));
console.log('Full Migration Test - HTML + CSS Generation');
console.log('='.repeat(80));
console.log('');

// Create test HTML file
const testHtmlPath = path.join(__dirname, 'test-input.html');
const testHtml = `
<div fxFlex="92">Custom percentage 92</div>
<div fxFlex="35">Custom percentage 35</div>
<div fxFlex="50">Standard percentage 50</div>
<div fxFlex="650px">Custom pixel 650px</div>
<div fxFlex="125px">Custom pixel 125px</div>
<div fxFlex="100px">Standard pixel 100px</div>
<div fxFlex.sm="85">Breakpoint flex sm</div>
<div fxFlex.gt-xs="50">Breakpoint flex gt-xs</div>
<div fxFlex.sm="calc(100% - 40px)">Calc on sm</div>
<div fxLayoutGap="10px">Custom gap 10px</div>
<div fxLayoutGap="15px">Custom gap 15px</div>
<div fxLayoutGap="24px">Standard gap 24px</div>
<div fxLayoutGap.sm="18px">Gap on sm</div>
<div fxLayoutGap.gt-xs="30px">Gap on gt-xs</div>
`;

fs.writeFileSync(testHtmlPath, testHtml);

// Run migration with dryRun: false to actually write files
const migrator = new FlexMigrator({ dryRun: false });

console.log('Step 1: Processing HTML file...');
console.log('-'.repeat(80));

console.log('Original HTML:');
console.log(testHtml);

// migrateFile reads the file itself, so we just pass the path
migrator.migrateFile(testHtmlPath);

// Read the migrated content
const migratedHtml = fs.readFileSync(testHtmlPath, 'utf-8');
console.log('');
console.log('Migrated HTML:');
console.log(migratedHtml);
console.log('');

console.log('Step 2: Custom classes tracked during migration...');
console.log('-'.repeat(80));
console.log(`Total custom classes: ${migrator.customClasses.size}`);
console.log('');

// List all custom classes
Array.from(migrator.customClasses.values())
  .sort((a, b) => a.name.localeCompare(b.name))
  .forEach(({ name, type, value, breakpoint }) => {
    console.log(`  ${name}:`);
    console.log(`    Type: ${type}`);
    console.log(`    Value: ${value}`);
    console.log(`    Breakpoint: ${breakpoint || 'none'}`);
  });
console.log('');

console.log('Step 3: Generating _layout.scss file...');
console.log('-'.repeat(80));

const scssOutputPath = path.join(__dirname, 'test-output-layout.scss');
migrator.generateLayoutScss(scssOutputPath);

console.log(`✅ SCSS file generated at: ${scssOutputPath}`);
console.log('');

console.log('Step 4: Verifying custom classes in generated SCSS...');
console.log('-'.repeat(80));

const scssContent = fs.readFileSync(scssOutputPath, 'utf-8');

// Check if custom section exists
if (scssContent.includes('// Custom Classes (Dynamically Generated)')) {
  console.log('✅ Custom classes section found in SCSS');

  const customSection = scssContent.split('// Custom Classes (Dynamically Generated)')[1];

  console.log('');
  console.log('Custom Classes Section:');
  console.log('// Custom Classes (Dynamically Generated)' + customSection);

  // Check specific classes
  const classesToCheck = [
    'flex-92',
    'flex-35',
    'flex-650px',
    'flex-125px',
    'flex-85-sm',
    'gap-10',
    'gap-15',
    'gap-18-sm',
    'gap-30-gt-xs',
    'flex-calc-sm-calc10040px'
  ];

  console.log('');
  console.log('Verification:');
  console.log('-'.repeat(80));

  classesToCheck.forEach(className => {
    if (scssContent.includes(`.${className}`)) {
      console.log(`✅ ${className} - FOUND in CSS`);
    } else {
      console.log(`❌ ${className} - MISSING from CSS`);
    }
  });

} else {
  console.log('❌ Custom classes section NOT found in SCSS');
  console.log('');
  console.log('SCSS Content (last 500 chars):');
  console.log(scssContent.slice(-500));
}

console.log('');
console.log('='.repeat(80));
console.log('Cleanup...');
console.log('='.repeat(80));

// Clean up
fs.unlinkSync(testHtmlPath);
fs.unlinkSync(scssOutputPath);
fs.unlinkSync(tempPath);
delete require.cache[require.resolve('./_temp_migrator_full.js')];

console.log('✅ Test files cleaned up');
console.log('');
console.log('='.repeat(80));
console.log('Test Complete!');
console.log('='.repeat(80));
