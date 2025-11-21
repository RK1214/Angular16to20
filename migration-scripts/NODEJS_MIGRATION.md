# Node.js-Based Flex Layout Migration

**The simplest and most reliable way to migrate Angular Flex Layout to CSS!**

## Why Node.js Version?

✅ **Already installed** - Node.js is required for Angular, so no additional setup!
✅ **No PATH issues** - Works perfectly on Windows (unlike Python)
✅ **Same power** - All features of the Python version
✅ **Fast** - Uses native Node.js for HTML parsing
✅ **Cross-platform** - Works on Windows, macOS, and Linux

## Quick Start

### 1. Verify Node.js (Should already be installed)

```bash
node --version
# Should show v18.x.x or higher
```

### 2. Run the Migration

```bash
# Make script executable
chmod +x migration-scripts/*.sh

# Run Node.js-based migration
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh
```

### 3. Choose Mode

When prompted:
- **Option 1**: Dry-run (preview changes first - recommended!)
- **Option 2**: Full migration (actually modify files)

## What It Does

The Node.js migration script automatically:

1. ✅ **Generates CSS utilities** (`src/styles/_layout.scss`)
   - 200+ flex utility classes
   - All responsive breakpoints
   - Gap, alignment, order utilities

2. ✅ **Migrates HTML files**
   - Converts static directives to CSS classes
   - Converts dynamic bindings to custom directives
   - Properly merges class attributes (no duplicates!)
   - Preserves HTML structure
   - **No backup files created** - Use git for rollback if needed

3. ✅ **Creates TypeScript directives**
   - `[appFlex]` - For dynamic flex values
   - `[appGap]` - For dynamic gaps
   - `[appLayout]` - For dynamic layouts
   - `[appLayoutAlign]` - For dynamic alignment
   - `[appFlexOrder]` - For dynamic ordering

4. ✅ **Removes Flex Layout**
   - Removes FlexLayoutModule from all modules
   - Uninstalls @angular/flex-layout package

5. ✅ **Tests build** - Ensures everything compiles

6. ✅ **Lets you review** - No automatic commits, you control when to commit

## Example Migration

### Before:
```html
<div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="16px">
  <div [fxFlex]="itemWidth" fxFlex.xs="100">Content</div>
  <div fxFlex="300px" fxHide.xs>Sidebar</div>
</div>
```

### After:
```html
<div class="flex-row align-space-between-center gap-16">
  <div [appFlex]="itemWidth" class="flex-100-xs">Content</div>
  <div class="flex-300px hide-xs">Sidebar</div>
</div>
```

## All Scenarios Handled

✅ Static directives → CSS classes
✅ Dynamic bindings → Custom directives
✅ Template expressions (`{{ ... }}`)
✅ Calc() expressions
✅ Responsive breakpoints (.xs, .sm, .gt-xs, etc.)
✅ Complex nested layouts
✅ Multiple directives on same element
✅ Existing class attribute preservation

## Features

### 🎯 No Syntax Breaking
Uses proper HTML parsing (not regex), so your HTML structure is always preserved.

### 🎯 Perfect Class Merging
```html
<!-- BEFORE (WRONG) -->
<div class="existing" class="flex-row" class="gap-16">

<!-- AFTER (CORRECT) -->
<div class="existing flex-row gap-16">
```

### 🎯 Dry-Run Mode
Preview all changes before applying them!

```bash
# Run in dry-run mode first
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh
# Select option 1

# Review the output

# Then run again for real migration
# Select option 2
```

### 🎯 Detailed Warnings
Get notified about:
- Dynamic layouts that need custom directives
- Complex responsive patterns
- Edge cases that may need manual review

## Technical Details

### Dependencies
- **Node.js 18+** - Already installed for Angular!
- **glob package** - Auto-installed if needed

### Files Generated

**CSS:**
- `src/styles/_layout.scss` - Complete CSS utility library

**TypeScript:**
- `src/app/shared/utils/flex.utils.ts` - Utility functions
- `src/app/shared/directives/flex.directive.ts` - 5 custom directives
- `src/app/shared/shared.module.ts` - Module exporting directives

### Files Modified
- All `*.html` files with flex directives
- `src/styles.scss` - Adds layout import
- All `*.module.ts` files - Removes FlexLayoutModule

## Usage

### Command Line

```bash
# Basic usage
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh

# Or run the Node.js script directly:
node migration-scripts/migrate-flex-to-css.js --dry-run --verbose
node migration-scripts/migrate-flex-to-css.js --src-dir src
node migration-scripts/migrate-flex-to-css.js --generate-only
```

### Options

```bash
node migration-scripts/migrate-flex-to-css.js [options]

Options:
  --src-dir <dir>    Source directory (default: src)
  --dry-run          Preview changes without modifying
  --verbose, -v      Show detailed migration steps
  --generate-only    Only generate SCSS/TS files
  --help, -h         Show help
```

## After Migration

### 1. Review Changes

```bash
# See what was changed
git diff

# Check specific files
git diff src/styles/_layout.scss
git diff src/app/shared/
```

### 2. Import SharedModule (if using dynamic directives)

```typescript
// feature.module.ts
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,  // Add this
    // ... other imports
  ]
})
export class FeatureModule { }
```

### 3. Test Thoroughly

```bash
npm run build
npm start
```

Check:
- ✅ All layouts render correctly
- ✅ Responsive breakpoints work
- ✅ Dynamic bindings function properly
- ✅ No console errors

### 4. Commit When Ready

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Phase 2: Migrate Angular Flex Layout to CSS

- Converted flex directives to CSS classes
- Created custom directives for dynamic bindings
- Removed @angular/flex-layout dependency
- Generated comprehensive layout utilities"
```

**Note:** The script doesn't create backup files or auto-commit. This gives you full control to review changes before committing.

## Troubleshooting

### Issue: "Cannot find module 'glob'"

**Solution:**
```bash
npm install glob
# Then run the migration again
```

### Issue: Node.js not found

**Solution:**
```bash
# Install Node.js from: https://nodejs.org/
# Then restart terminal and try again
```

### Issue: Build fails after migration

**Solution:**
1. Check that SharedModule is imported in modules using dynamic directives
2. Verify _layout.scss is imported in styles.scss
3. Check browser console for runtime errors

### Issue: Need to rollback changes

**Solution:**

Since no backup files are created, use git to rollback:

```bash
# See what changed
git status
git diff

# Discard all changes (if not committed)
git checkout .

# Or discard specific file
git checkout src/path/to/file.html

# If already committed, revert the commit
git revert HEAD

# Or reset to previous commit (careful!)
git reset --hard HEAD~1
```

**Best practice:** Always commit your work before running the migration, so you can easily revert if needed.

## Comparison: Node.js vs Python vs Bash

| Feature | Node.js ⭐ | Python | Bash |
|---------|-----------|--------|------|
| Setup required | ✅ None | Python install | ✅ None |
| Windows PATH issues | ✅ Never | ⚠️ Common | ✅ Never |
| HTML parsing | ✅ Proper | ✅ Proper | ❌ Regex |
| Class merging | ✅ Perfect | ✅ Perfect | ❌ Duplicates |
| Dynamic bindings | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Complex scenarios | ✅ All | ✅ All | ⚠️ Some |
| Speed | ✅ Fast | ✅ Fast | ✅ Fast |

**Winner: Node.js** - No setup, works everywhere, same power as Python!

## Next Steps

After completing Phase 2:

1. ✅ Test your application thoroughly
2. ✅ Review any warnings from the migration
3. ✅ Commit the changes
4. ✅ Run Phase 3: `./migration-scripts/phase3-material-legacy-to-mdc.sh`

## Support

- **Full guide**: [HOW_TO_RUN.md](HOW_TO_RUN.md)
- **Flex migration details**: [FLEX_MIGRATION_GUIDE.md](FLEX_MIGRATION_GUIDE.md)
- **Windows setup**: [WINDOWS_SETUP.md](WINDOWS_SETUP.md)

## Summary

**Node.js version is the best choice for Angular Flex Layout migration:**

✅ Uses Node.js (already installed)
✅ No additional dependencies
✅ Works perfectly on all platforms
✅ No PATH configuration needed
✅ Same robust features as Python version
✅ Proper HTML parsing (no syntax breaking)
✅ Perfect class merging (no duplicates)
✅ Handles all complex scenarios
✅ Dry-run mode for safety
✅ Comprehensive warnings

**Just run it and it works!** 🎉

---

*Last Updated: 2025-11-21*
