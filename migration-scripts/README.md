# Angular 16 to 20 Migration Scripts

Automated bash scripts to migrate any Angular 16 project to Angular 20.

## Overview

These scripts automate the complete migration process:
- ✅ **Phase 1**: Preparation & Setup
- ✅ **Phase 2**: Angular Flex Layout → CSS Migration
- ✅ **Phase 3**: Material Legacy → MDC Migration
- ✅ **Phase 4**: Angular 16→17→18→19→20 Updates
- ✅ **Phase 5**: Testing & Validation
- ✅ **Phase 6**: Cleanup & Documentation

## Prerequisites

- Node.js 18+
- npm 9+
- Git repository initialized
- Angular 16.x project
- Bash shell (macOS, Linux, WSL, Git Bash)

**Optional (for Phase 2):**
- Python 3.x (alternative migration option)

> **Note:** Phase 2 now has a **Node.js version** that requires no additional setup! See [NODEJS_MIGRATION.md](NODEJS_MIGRATION.md)

**Windows Users:** See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for setup help

## Quick Start

### 1. Copy Scripts to Your Project

```bash
# Copy the entire migration-scripts directory to your Angular project root
cp -r migration-scripts /path/to/your/angular-project/
cd /path/to/your/angular-project
```

### 2. Make Scripts Executable

```bash
chmod +x migration-scripts/*.sh
```

### 3. Run Scripts Sequentially

```bash
# Phase 1: Preparation
./migration-scripts/phase1-preparation.sh

# Phase 2: Flex Layout → CSS (Node.js version - RECOMMENDED)
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh
# Alternatives: phase2-flex-layout-to-css-robust.sh (Python) or phase2-flex-layout-to-css.sh (Bash)

# Phase 3: Material Legacy → MDC
./migration-scripts/phase3-material-legacy-to-mdc.sh

# Phase 4: Angular Version Updates
./migration-scripts/phase4-angular-updates.sh

# Phase 5: Testing
./migration-scripts/phase5-testing.sh

# Phase 6: Cleanup
./migration-scripts/phase6-cleanup.sh
```

## Script Details

### Phase 1: `phase1-preparation.sh`

**What it does:**
- Checks prerequisites (Node.js, npm, git)
- Creates git branches (`pre-migration-backup`, `feature/angular-20-migration`)
- Updates .gitignore for migration files
- Creates inventory of Flex Layout and Material Legacy usage
- Backs up critical files to `.migration-backup/`

**Output:**
- `MIGRATION_INVENTORY.md` - Complete list of what will be migrated
- Git branch: `feature/angular-20-migration`

**Time:** 2-3 minutes

---

### Phase 2A: `phase2-flex-layout-to-css-nodejs.sh` (⭐ RECOMMENDED)

> **NEW! Node.js-based migration - No Python required!**
>
> 📖 **See [NODEJS_MIGRATION.md](NODEJS_MIGRATION.md) for complete documentation**

**Why use the Node.js version?**
- ✅ **Zero setup** - Node.js already installed for Angular!
- ✅ **Works everywhere** - No PATH issues on Windows
- ✅ **Same features** - All capabilities of Python version
- ✅ **Fast** - Native Node.js performance
- ✅ **Reliable** - Proper HTML parsing, no syntax breaking

**What it does:**
Everything the other versions do, PLUS:
- Uses Node.js (already required for Angular)
- Auto-installs glob package if needed (no manual setup)
- Works perfectly on Windows (no Python PATH issues)
- Same robust migration as Python version
- Properly merges CSS classes (no `class="" class=""` issues)
- Handles dynamic bindings, calc(), template expressions
- Creates TypeScript directives for all dynamic cases

**Usage:**
```bash
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh

# Select option 1 for dry-run (preview)
# Select option 2 for full migration
```

**Requirements:**
- Node.js 18+ (already installed for Angular projects)

**Time:** 5-10 minutes

---

### Phase 2B: `phase2-flex-layout-to-css-robust.sh` (Python Alternative)

> **Python-based robust migration**

Use this if you prefer Python over Node.js.

**Requirements:**
- Python 3.x

---

### Phase 2C: `phase2-flex-layout-to-css.sh` (Original Bash)

**What it does:**
- Creates `src/styles/_layout.scss` with 200+ CSS utilities
- Imports layout utilities into `src/styles.scss`
- Replaces ALL Flex Layout directives in HTML files:
  - `fxLayout` → `class="flex-row"`
  - `fxLayoutAlign` → `class="align-center-center"`
  - `fxLayoutGap` → `class="gap-16"`
  - `fxFlex` → `class="flex-50"`
  - `fxShow.gt-xs` → `class="show-gt-xs"`
  - `fxHide.xs` → `class="hide-xs"`
  - And 30+ more directive conversions
- Removes `FlexLayoutModule` from all `.module.ts` files
- Uninstalls `@angular/flex-layout` package
- Runs build to verify changes

**Supported Directives:**
- All `fxLayout` variants (row, column, wrap, reverse, responsive)
- All `fxLayoutAlign` combinations
- All `fxLayoutGap` sizes (4px to 48px)
- All `fxFlex` types (percentage, fixed, auto, none)
- All `fxShow`/`fxHide` breakpoints (xs, sm, md, lg, gt-xs, lt-md, etc.)

**Output:**
- `src/styles/_layout.scss` - Complete CSS utility library
- Modified HTML files (all Flex Layout directives replaced)
- Updated module files (FlexLayoutModule removed)
- Build verification

**Time:** 5-10 minutes

---

### Phase 2: `phase2-flex-layout-to-css-robust.sh` (⭐ RECOMMENDED)

> **NEW! Python-based robust migration that fixes all known issues**
>
> 📖 **See [FLEX_MIGRATION_GUIDE.md](FLEX_MIGRATION_GUIDE.md) for complete documentation**

**Why use the robust version?**
- ✅ **No duplicate class attributes** - Properly merges all classes into single attribute
- ✅ **No HTML syntax breaking** - Uses proper HTML parsing
- ✅ **Handles complex scenarios** - Template expressions, calc(), dynamic bindings
- ✅ **Responsive breakpoints** - Correctly handles `.xs`, `.sm`, `.gt-xs`, etc.
- ✅ **Dynamic directives** - Creates TypeScript directives for `[fxFlex]`, `[fxLayoutGap]`, etc.
- ✅ **Comprehensive warnings** - Identifies edge cases for manual review

**What it does:**
Everything the original does, PLUS:
- Uses Python-based HTML parser (no regex!)
- Properly merges CSS classes (no `class="" class=""` issues)
- Handles dynamic bindings: `[fxFlex]="width"` → `[appFlex]="width"`
- Handles template expressions: `fxFlex="{{ expr }}"` → `[appFlex]="expr"`
- Handles calc() expressions: `fxFlex="calc(100% - 40px)"`
- Handles fxFlexOrder with breakpoints: `fxFlexOrder="2" fxFlexOrder.xs="1"`
- Creates TypeScript directives for all dynamic cases
- Creates SharedModule with all directives
- Provides detailed warnings for manual review
- Supports dry-run mode to preview changes

**Usage:**
```bash
# Run the robust version (RECOMMENDED)
./migration-scripts/phase2-flex-layout-to-css-robust.sh

# Select option 1 for dry-run (preview)
# Select option 2 for full migration
```

**Requirements:**
- Python 3.x (pre-installed on macOS/Linux)

**Generated Files:**
- `src/styles/_layout.scss` - Comprehensive CSS utilities
- `src/app/shared/directives/flex.directive.ts` - 5 custom directives
- `src/app/shared/utils/flex.utils.ts` - Utility functions
- `src/app/shared/shared.module.ts` - Module exporting directives

**Directives Created:**
- `[appFlex]` - Replaces dynamic `[fxFlex]`
- `[appGap]` - Replaces dynamic `[fxLayoutGap]`
- `[appLayout]` - Replaces dynamic `[fxLayout]`
- `[appLayoutAlign]` - Replaces dynamic `[fxLayoutAlign]`
- `[appFlexOrder]` - Replaces dynamic `[fxFlexOrder]`

**Output:**
- All features of original script
- Plus: TypeScript directives for dynamic bindings
- Plus: Proper class merging (no duplicates)
- Plus: Preserved HTML structure
- Plus: Comprehensive migration warnings

**Time:** 5-10 minutes

**Known Issues Fixed:**
1. ❌ `class="flex-1".xs` → ✅ `class="flex-1 flex-100-xs"`
2. ❌ Multiple `class=""` attributes → ✅ Single merged `class=""`
3. ❌ HTML syntax breaking → ✅ Always valid HTML
4. ❌ Unsupported scenarios → ✅ All scenarios covered

**When to use original vs robust:**
- ✅ **Use Robust** if your project has:
  - Dynamic flex bindings: `[fxFlex]="variable"`
  - Template expressions: `fxFlex="{{ expr }}"`
  - Calc() expressions: `fxFlex="calc(...)"`
  - Complex responsive patterns
  - Issues with the original script
- Use Original if:
  - You only use simple static directives
  - You don't have Python 3 available

---

### Phase 3: `phase3-material-legacy-to-mdc.sh`

**What it does:**
- Replaces ALL Material Legacy imports in TypeScript files (20+ components):
  - `MatLegacyButtonModule` → `MatButtonModule`
  - `MatLegacyCardModule` → `MatCardModule`
  - `MatLegacyFormFieldModule` → `MatFormFieldModule`
  - `MatLegacyTableModule` → `MatTableModule`
  - And 16+ more component conversions
- Updates CSS class selectors in SCSS files:
  - `.mat-legacy-button` → `.mat-mdc-button`
  - `.mat-legacy-table` → `.mat-mdc-table`
  - And all other legacy selectors
- Removes legacy theme from `src/styles.scss`
- Configures global `MAT_FORM_FIELD_DEFAULT_OPTIONS` in module files (sets `appearance: 'outline'`)
- Removes redundant `appearance` attributes from HTML templates
- Runs build to verify changes

**Components Supported:**
- Autocomplete, Button, Card, Checkbox, Chips
- Dialog, Form Field, Input, List, Menu
- Paginator, Progress Bar, Progress Spinner
- Radio, Select, Slide Toggle, Slider
- Snack Bar, Table, Tabs, Tooltip

**Output:**
- Updated TypeScript files (MDC imports)
- Updated SCSS files (MDC selectors)
- Updated module files (global form field configuration)
- Cleaned HTML templates (redundant attributes removed)
- Build verification

**Time:** 5-10 minutes

---

### Phase 4: `phase4-angular-updates.sh`

**What it does:**
- Updates Angular through ALL major versions sequentially:

**Step 1: Angular 16 → 17**
- Updates `@angular/core@17`, `@angular/cli@17`
- Updates `@angular/material@17`
- Updates `angular-in-memory-web-api@0.17.0` (if present)
- TypeScript → 5.4.x, zone.js → 0.14.x

**Step 2: Angular 17 → 18**
- Updates `@angular/core@18`, `@angular/cli@18`
- Updates `@angular/material@18`
- Updates `angular-in-memory-web-api@0.18.0` (if present)
- **Handles HttpClientModule conversion issue:**
  - Detects if using `angular-in-memory-web-api`
  - Automatically reverts `provideHttpClient()` → `HttpClientModule`
  - Ensures InMemoryWebApi compatibility
- Material theme API → M2 (`mat.m2-define-palette()`)

**Step 3: Angular 18 → 19**
- Updates `@angular/core@19`, `@angular/cli@19`
- Updates `@angular/material@19`
- Updates `angular-in-memory-web-api@0.19.0` (if present)
- TypeScript → 5.8.x, zone.js → 0.15.x
- Adds `standalone: false` to all components

**Step 4: Angular 19 → 20**
- Updates `@angular/core@20`, `@angular/cli@20`
- Updates `@angular/material@20`
- Updates `angular-in-memory-web-api@0.20.0` (if present)
- tsconfig `moduleResolution` → `"bundler"`

**Each step:**
- Runs `ng update` with `--force` flag
- Updates Material version
- Updates auxiliary packages
- Tests build
- Creates git commit

**Output:**
- 4 git commits (one per version)
- Final Angular 20.x.x installation
- Build verification after each step

**Time:** 15-30 minutes (requires internet connection)

---

### Phase 5: `phase5-testing.sh`

**What it does:**
- Runs production build
- Reports bundle size
- Starts development server
- Provides testing checklist

**Testing Checklist Provided:**
- All pages load
- All forms work
- All Material components render
- All responsive breakpoints work (mobile, tablet, desktop)
- No console errors
- All navigation works

**Output:**
- Build verification
- Running dev server for manual testing

**Time:** 10-20 minutes (manual testing)

---

### Phase 6: `phase6-cleanup.sh`

**What it does:**
- Removes all `.backup` files
- Removes `.migration-backup/` directory
- Updates `README.md` with migration results
- Creates git tag `v20.0.0`
- Optionally merges to `main` branch
- Optionally deletes migration branch

**Output:**
- Clean repository
- Updated README
- Tagged release
- Merged code (optional)

**Time:** 2-3 minutes

---

## What Gets Automated

### Flex Layout Replacements

The script handles ALL these conversions automatically:

```html
<!-- BEFORE -->
<div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="16px">
  <div fxFlex="60">Content</div>
  <div fxFlex="300px" fxShow.gt-xs>Sidebar</div>
</div>

<!-- AFTER -->
<div class="flex-row align-space-between-center gap-16">
  <div class="flex-60">Content</div>
  <div class="flex-300px show-gt-xs">Sidebar</div>
</div>
```

### Material Legacy Replacements

The script handles ALL these conversions automatically:

```typescript
// BEFORE
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

// AFTER
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
```

### CSS Class Replacements

```scss
// BEFORE
.mat-legacy-button { }
.mat-legacy-table .mat-row:hover { }

// AFTER
.mat-mdc-button { }
.mat-mdc-table .mat-mdc-row:hover { }
```

## Safety Features

### Backups Created
- `.backup` files for all modified files
- `.migration-backup/` directory with originals
- Git commits after each phase
- Git branches for rollback

### Error Handling
- Scripts exit on error (`set -e`)
- Build verification after each phase
- Confirmation prompts for destructive operations
- Color-coded output (green=success, red=error, yellow=warning)

### Rollback Options
```bash
# Restore from backup files
find src -name "*.backup" -exec sh -c 'mv "$1" "${1%.backup}"' _ {} \;

# Or rollback with git
git checkout pre-migration-backup

# Or revert last commit
git reset --hard HEAD~1
```

## Troubleshooting

### Issue: "Permission denied"
```bash
# Make scripts executable
chmod +x migration-scripts/*.sh
```

### Issue: "Command not found: ng"
```bash
# Install Angular CLI locally
npm install

# Use npx
npx ng update @angular/core@17 --force
```

### Issue: Build fails after Phase 2
- Check `MIGRATION_INVENTORY.md` for any missed directives
- Look for syntax errors in modified HTML files
- Restore from `.backup` files if needed

### Issue: Build fails after Phase 3
- Check for any custom Material styling that uses legacy selectors
- Verify `MAT_FORM_FIELD_DEFAULT_OPTIONS` is properly configured in module providers
- Check browser console for runtime errors
- Ensure all module imports are correct

### Issue: Phase 4 takes too long
- Ensure stable internet connection
- Scripts install many packages (this is normal)
- Each version update can take 3-8 minutes

## Manual Review Needed

Some things require manual review:

1. **Complex Flex Layout patterns** - Very complex nested layouts may need manual adjustment
2. **Custom Material styling** - Custom component styles may need updates
3. **Third-party libraries** - Check compatibility with Angular 20
4. **Unit tests** - May need updates for new APIs
5. **E2E tests** - May need updates for MDC selectors

## Success Criteria

Migration is successful when:

✅ All 6 phases complete without errors
✅ Production build succeeds
✅ No console errors in browser
✅ All pages load correctly
✅ All Material components render
✅ All responsive layouts work
✅ All functionality works as before

## What You Get

After running all scripts:

- ✅ Angular 20.3.x
- ✅ Material 20.2.x (MDC)
- ✅ TypeScript 5.8.x
- ✅ No Flex Layout dependency
- ✅ CSS utility system (200+ classes)
- ✅ All Material components using MDC
- ✅ Modern Angular 20 features
- ✅ Clean git history with 6+ commits
- ✅ Tagged release (v20.0.0)

## Estimated Time

| Phase | Time | Total |
|-------|------|-------|
| Phase 1 | 2-3 min | 2-3 min |
| Phase 2 | 5-10 min | 7-13 min |
| Phase 3 | 5-10 min | 12-23 min |
| Phase 4 | 15-30 min | 27-53 min |
| Phase 5 | 10-20 min | 37-73 min |
| Phase 6 | 2-3 min | 39-76 min |

**Total: ~40-76 minutes** (mostly automated)

## Support

For issues or questions:
- Check `MIGRATION_PLAN.md` for detailed migration guide
- Review `ANGULAR_16_TO_20_MIGRATION_TEMPLATE.md` for reference
- Check git history for what changed in each phase

## License

MIT - Free to use and modify

---

**Generated from real-world Angular 16 → 20 migration**
*Last Updated: 2025-11-18*
