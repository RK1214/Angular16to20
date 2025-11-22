const fs = require('fs');
const path = require('path');

// Create test directory
const testDir = path.join(__dirname, '_test_src');
const testAppDir = path.join(testDir, 'app');
const testStylesDir = path.join(testDir, 'styles');

// Clean up if exists
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true });
}

// Create directories
fs.mkdirSync(testAppDir, { recursive: true });
fs.mkdirSync(testStylesDir, { recursive: true });

// Create test HTML files with different custom classes
const testFiles = [
  {
    path: path.join(testAppDir, 'dashboard.component.html'),
    content: `
<div fxLayout="row" fxLayoutGap="15px">
  <div fxFlex="92">Dashboard Item 1</div>
  <div fxFlex="35">Dashboard Item 2</div>
</div>`
  },
  {
    path: path.join(testAppDir, 'users.component.html'),
    content: `
<div fxLayout="column" fxLayoutGap="10px">
  <div fxFlex="650px">User Panel</div>
  <div fxFlex="125px">User Actions</div>
</div>`
  },
  {
    path: path.join(testAppDir, 'profile.component.html'),
    content: `
<div fxLayout="row">
  <div fxFlex.sm="85">Profile Info</div>
  <div fxFlex.gt-xs="50">Profile Stats</div>
</div>`
  },
  {
    path: path.join(testAppDir, 'settings.component.html'),
    content: `
<div fxLayout="row" fxLayoutGap.sm="18px">
  <div fxFlex.sm="calc(100% - 40px)">Settings Panel</div>
</div>`
  },
  {
    path: path.join(testAppDir, 'home.component.html'),
    content: `
<div fxLayout="row" fxLayoutGap="24px">
  <div fxFlex="50">Standard flex (no custom class)</div>
  <div fxFlex="100px">Standard flex (no custom class)</div>
</div>`
  }
];

// Write test files
testFiles.forEach(({ path: filePath, content }) => {
  fs.writeFileSync(filePath, content);
});

console.log('='.repeat(80));
console.log('Multi-File Migration Debug Test');
console.log('='.repeat(80));
console.log('');
console.log(`Created test directory: ${testDir}`);
console.log(`Created ${testFiles.length} test HTML files`);
console.log('');

// Load migrator
const scriptPath = path.join(__dirname, 'migrate-flex-to-css.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
scriptContent = scriptContent.replace(
  /\/\/ Check if glob is available[\s\S]*$/,
  'module.exports = FlexMigrator;'
);
const tempPath = path.join(__dirname, '_temp_migrator_multi.js');
fs.writeFileSync(tempPath, scriptContent);
const FlexMigrator = require('./_temp_migrator_multi.js');

// Run migration
const migrator = new FlexMigrator({
  dryRun: false,
  verbose: false,
  srcDir: testDir
});

console.log('='.repeat(80));
console.log('STEP 1: Processing HTML Files (Collecting Custom Classes)');
console.log('='.repeat(80));
console.log('');

// Manually simulate the directory migration to show debug output
const glob = require('glob');
const htmlFiles = glob.sync(`${testDir}/**/*.html`);

console.log(`Found ${htmlFiles.length} HTML files\n`);

htmlFiles.forEach((file, index) => {
  const beforeCount = migrator.customClasses.size;
  migrator.migrateFile(file);
  const afterCount = migrator.customClasses.size;
  const newClasses = afterCount - beforeCount;

  const relativePath = file.replace(testDir + '/', '');
  if (newClasses > 0) {
    console.log(`  [${index + 1}/${htmlFiles.length}] ${relativePath} → +${newClasses} custom class(es)`);
  } else {
    console.log(`  [${index + 1}/${htmlFiles.length}] ${relativePath}`);
  }
});

console.log('');
console.log('='.repeat(80));
console.log('STEP 2: Custom Classes Summary');
console.log('='.repeat(80));
console.log(`Total custom classes collected: ${migrator.customClasses.size}`);
console.log('');

if (migrator.customClasses.size > 0) {
  console.log('Custom classes to be generated:');
  console.log('-'.repeat(80));

  // Group by type
  const byType = {
    'flex': [],
    'flex-breakpoint': [],
    'flex-calc': [],
    'gap': [],
    'gap-breakpoint': []
  };

  Array.from(migrator.customClasses.values()).forEach(cls => {
    byType[cls.type] = byType[cls.type] || [];
    byType[cls.type].push(cls);
  });

  if (byType['flex'].length > 0) {
    console.log(`\n  Custom Flex Values (${byType['flex'].length}):`);
    byType['flex'].forEach(({ name, value }) => {
      console.log(`    - ${name} → flex: 1 1 ${value}`);
    });
  }

  if (byType['flex-breakpoint'].length > 0) {
    console.log(`\n  Breakpoint-Specific Flex (${byType['flex-breakpoint'].length}):`);
    byType['flex-breakpoint'].forEach(({ name, value, breakpoint }) => {
      console.log(`    - ${name} → flex: 1 1 ${value} [@${breakpoint}]`);
    });
  }

  if (byType['flex-calc'].length > 0) {
    console.log(`\n  Calc Expressions (${byType['flex-calc'].length}):`);
    byType['flex-calc'].forEach(({ name, value, breakpoint }) => {
      console.log(`    - ${name} → flex: 1 1 ${value} [@${breakpoint}]`);
    });
  }

  if (byType['gap'].length > 0) {
    console.log(`\n  Custom Gap Values (${byType['gap'].length}):`);
    byType['gap'].forEach(({ name, value }) => {
      console.log(`    - ${name} → gap: ${value}`);
    });
  }

  if (byType['gap-breakpoint'].length > 0) {
    console.log(`\n  Breakpoint-Specific Gaps (${byType['gap-breakpoint'].length}):`);
    byType['gap-breakpoint'].forEach(({ name, value, breakpoint }) => {
      console.log(`    - ${name} → gap: ${value} [@${breakpoint}]`);
    });
  }

  console.log('');
}

console.log('='.repeat(80));
console.log('STEP 3: Generating _layout.scss with custom classes...');
console.log('='.repeat(80));
const layoutPath = path.join(testStylesDir, '_layout.scss');
console.log(`Output: ${layoutPath}`);
console.log(`Custom classes to add: ${migrator.customClasses.size}`);
console.log('');
migrator.generateLayoutScss(layoutPath);
console.log('✅ _layout.scss generated successfully!');
console.log('');

console.log('='.repeat(80));
console.log('STEP 4: Verifying CSS Generation');
console.log('='.repeat(80));

const scssContent = fs.readFileSync(layoutPath, 'utf-8');
const customSection = scssContent.split('// Custom Classes (Dynamically Generated)')[1];

if (customSection) {
  console.log('✅ Custom classes section found in CSS\n');
  console.log('Generated custom classes:');
  console.log('// Custom Classes (Dynamically Generated)' + customSection);
} else {
  console.log('❌ No custom classes section found\n');
}

console.log('='.repeat(80));
console.log('Cleanup');
console.log('='.repeat(80));

// Clean up
fs.rmSync(testDir, { recursive: true });
fs.unlinkSync(tempPath);
delete require.cache[require.resolve('./_temp_migrator_multi.js')];

console.log('✅ Test files cleaned up');
console.log('');
console.log('='.repeat(80));
console.log('Test Complete!');
console.log('='.repeat(80));
console.log('');
console.log('Key Observations:');
console.log('  1. Each HTML file shows how many custom classes it added');
console.log('  2. Summary groups all classes by type');
console.log('  3. CSS is generated AFTER collecting all classes');
console.log('  4. All tracked classes appear in the CSS output');
console.log('');
