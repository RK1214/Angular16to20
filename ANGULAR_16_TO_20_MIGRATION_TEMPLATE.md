# Angular 16 to Angular 20 Migration Guide (Generic Template)

**A comprehensive, step-by-step guide for migrating any Angular 16 project to Angular 20**

This guide covers:
- ✅ Angular Flex Layout → CSS migration (ALL directives)
- ✅ Material Legacy → MDC Components (ALL components)
- ✅ Angular 16 → 17 → 18 → 19 → 20 (Sequential updates)
- ✅ Real-world issues and solutions
- ✅ Compatible with any Angular 16 project

---

## Table of Contents

1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Phase 1: Preparation & Setup](#phase-1-preparation--setup)
3. [Phase 2: Angular Flex Layout → CSS](#phase-2-angular-flex-layout--css)
4. [Phase 3: Material Legacy → MDC](#phase-3-material-legacy--mdc)
5. [Phase 4: Angular Version Updates](#phase-4-angular-version-updates)
6. [Phase 5: Testing & Validation](#phase-5-testing--validation)
7. [Phase 6: Cleanup & Documentation](#phase-6-cleanup--documentation)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Reference Tables](#reference-tables)

---

## Pre-Migration Checklist

Before starting the migration, ensure you have:

- [ ] **Git repository** - All code committed and pushed
- [ ] **Node.js 18+** installed
- [ ] **npm 9+** installed
- [ ] **Backup** of current working application
- [ ] **Time allocation** - 20-30 hours for complete migration
- [ ] **Team notification** - Inform team of migration schedule
- [ ] **Testing plan** - Define what needs to be tested
- [ ] **Rollback plan** - Know how to revert if needed

### Check Current Versions

```bash
# Check current Angular version
ng version

# Check current dependencies
npm list @angular/core @angular/material @angular/flex-layout
```

### Expected Starting State

- Angular: 16.x
- Angular Material: 16.x (with Legacy components)
- Angular Flex Layout: 15.x (deprecated)
- TypeScript: 5.1.x

---

## Phase 1: Preparation & Setup

**Time Estimate:** 2-3 hours

### Step 1.1: Create Git Branch

```bash
# Ensure main branch is clean
git status
git add .
git commit -m "Pre-migration commit"

# Create backup branch
git branch pre-migration-backup

# Create migration branch
git checkout -b feature/angular-20-migration
```

### Step 1.2: Update .gitignore

Add backup file patterns to prevent git conflicts during updates:

```bash
# Add to .gitignore
echo "*.v*-backup" >> .gitignore
echo "*.backup" >> .gitignore
git add .gitignore
git commit -m "Update gitignore for migration backups"
```

### Step 1.3: Document Current State

Create an inventory of what you're using:

```bash
# Create inventory file
touch MIGRATION_INVENTORY.md
```

**MIGRATION_INVENTORY.md:**
```markdown
# Migration Inventory

## Flex Layout Directives Used
- [ ] fxLayout
- [ ] fxLayoutAlign
- [ ] fxLayoutGap
- [ ] fxFlex
- [ ] fxShow / fxHide
- [ ] fxShow.gt-xs / fxHide.xs (responsive)
- [ ] fxLayout.xs / fxLayout.sm / fxLayout.md (responsive)
- [ ] Other: _______________

## Material Legacy Components Used
- [ ] MatLegacyAutocompleteModule
- [ ] MatLegacyButtonModule
- [ ] MatLegacyCardModule
- [ ] MatLegacyCheckboxModule
- [ ] MatLegacyChipsModule
- [ ] MatLegacyDialogModule
- [ ] MatLegacyFormFieldModule
- [ ] MatLegacyInputModule
- [ ] MatLegacyListModule
- [ ] MatLegacyMenuModule
- [ ] MatLegacyPaginatorModule
- [ ] MatLegacyProgressBarModule
- [ ] MatLegacyProgressSpinnerModule
- [ ] MatLegacyRadioModule
- [ ] MatLegacySelectModule
- [ ] MatLegacySlideToggleModule
- [ ] MatLegacySliderModule
- [ ] MatLegacySnackBarModule
- [ ] MatLegacyTableModule
- [ ] MatLegacyTabsModule
- [ ] MatLegacyTooltipModule
- [ ] Other: _______________

## Files to Modify
List all files that use Flex Layout or Material Legacy:
- [ ] src/app/...
```

### Step 1.4: Verify Application Works

```bash
# Install dependencies
npm install

# Run build
npm run build

# Start dev server
npm start

# Test all features manually
```

✅ **Phase 1 Complete** when:
- Git branch created
- Current state documented
- Application builds and runs successfully

---

## Phase 2: Angular Flex Layout → CSS

**Time Estimate:** 3-5 hours

Angular Flex Layout is deprecated and must be replaced with CSS Flexbox/Grid.

### Step 2.1: Create CSS Utility File

Create `src/styles/_layout.scss`:

```scss
// ===================================
// Flexbox Layout Utilities
// ===================================

// Basic flex containers
.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row-reverse {
  display: flex;
  flex-direction: row-reverse;
}

.flex-column-reverse {
  display: flex;
  flex-direction: column-reverse;
}

// Flex wrap
.flex-wrap {
  flex-wrap: wrap;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

// ===================================
// Alignment Utilities (justify-content + align-items)
// ===================================

.align-start-start {
  justify-content: flex-start;
  align-items: flex-start;
}

.align-start-center {
  justify-content: flex-start;
  align-items: center;
}

.align-start-end {
  justify-content: flex-start;
  align-items: flex-end;
}

.align-center-start {
  justify-content: center;
  align-items: flex-start;
}

.align-center-center {
  justify-content: center;
  align-items: center;
}

.align-center-end {
  justify-content: center;
  align-items: flex-end;
}

.align-end-start {
  justify-content: flex-end;
  align-items: flex-start;
}

.align-end-center {
  justify-content: flex-end;
  align-items: center;
}

.align-end-end {
  justify-content: flex-end;
  align-items: flex-end;
}

.align-space-between-start {
  justify-content: space-between;
  align-items: flex-start;
}

.align-space-between-center {
  justify-content: space-between;
  align-items: center;
}

.align-space-between-end {
  justify-content: space-between;
  align-items: flex-end;
}

.align-space-around-center {
  justify-content: space-around;
  align-items: center;
}

.align-space-evenly-center {
  justify-content: space-evenly;
  align-items: center;
}

// ===================================
// Gap Utilities (spacing)
// ===================================

.gap-4 { gap: 4px; }
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }
.gap-20 { gap: 20px; }
.gap-24 { gap: 24px; }
.gap-32 { gap: 32px; }
.gap-48 { gap: 48px; }

// Row and column specific gaps
.row-gap-8 { row-gap: 8px; }
.row-gap-12 { row-gap: 12px; }
.row-gap-16 { row-gap: 16px; }

.col-gap-8 { column-gap: 8px; }
.col-gap-12 { column-gap: 12px; }
.col-gap-16 { column-gap: 16px; }

// ===================================
// Flex Item Sizing (fxFlex equivalents)
// ===================================

.flex-auto {
  flex: 1 1 auto;
}

.flex-none {
  flex: 0 0 auto;
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.flex-3 {
  flex: 3;
}

// Percentage based flex
.flex-10 { flex: 0 0 10%; max-width: 10%; }
.flex-20 { flex: 0 0 20%; max-width: 20%; }
.flex-25 { flex: 0 0 25%; max-width: 25%; }
.flex-30 { flex: 0 0 30%; max-width: 30%; }
.flex-33 { flex: 0 0 33.333%; max-width: 33.333%; }
.flex-40 { flex: 0 0 40%; max-width: 40%; }
.flex-50 { flex: 0 0 50%; max-width: 50%; }
.flex-60 { flex: 0 0 60%; max-width: 60%; }
.flex-66 { flex: 0 0 66.666%; max-width: 66.666%; }
.flex-70 { flex: 0 0 70%; max-width: 70%; }
.flex-75 { flex: 0 0 75%; max-width: 75%; }
.flex-80 { flex: 0 0 80%; max-width: 80%; }
.flex-90 { flex: 0 0 90%; max-width: 90%; }
.flex-100 { flex: 0 0 100%; max-width: 100%; }

// Fixed width flex
.flex-100px { flex: 0 0 100px; }
.flex-150px { flex: 0 0 150px; }
.flex-200px { flex: 0 0 200px; }
.flex-220px { flex: 0 0 220px; }
.flex-250px { flex: 0 0 250px; }
.flex-300px { flex: 0 0 300px; }
.flex-400px { flex: 0 0 400px; }
.flex-500px { flex: 0 0 500px; }

// ===================================
// Width Utilities
// ===================================

.w-full { width: 100%; }
.w-auto { width: auto; }
.h-full { height: 100%; }
.h-auto { height: auto; }

// ===================================
// Responsive Breakpoints
// ===================================

// Extra small devices (phones, less than 600px)
@media (max-width: 599px) {
  .flex-column-xs {
    flex-direction: column !important;
  }

  .flex-row-xs {
    flex-direction: row !important;
  }

  .show-xs {
    display: flex !important;
  }

  .hide-xs {
    display: none !important;
  }

  .flex-100-xs {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}

// Small devices (tablets, 600px and up)
@media (min-width: 600px) and (max-width: 959px) {
  .flex-column-sm {
    flex-direction: column !important;
  }

  .flex-row-sm {
    flex-direction: row !important;
  }

  .show-sm {
    display: flex !important;
  }

  .hide-sm {
    display: none !important;
  }
}

// Medium devices (desktops, 960px and up)
@media (min-width: 960px) and (max-width: 1279px) {
  .flex-column-md {
    flex-direction: column !important;
  }

  .flex-row-md {
    flex-direction: row !important;
  }

  .show-md {
    display: flex !important;
  }

  .hide-md {
    display: none !important;
  }
}

// Large devices (large desktops, 1280px and up)
@media (min-width: 1280px) {
  .flex-column-lg {
    flex-direction: column !important;
  }

  .flex-row-lg {
    flex-direction: row !important;
  }

  .show-lg {
    display: flex !important;
  }

  .hide-lg {
    display: none !important;
  }
}

// Greater than XS (600px and up)
@media (min-width: 600px) {
  .show-gt-xs {
    display: flex !important;
  }

  .hide-gt-xs {
    display: none !important;
  }
}

// Greater than SM (960px and up)
@media (min-width: 960px) {
  .show-gt-sm {
    display: flex !important;
  }

  .hide-gt-sm {
    display: none !important;
  }
}

// Greater than MD (1280px and up)
@media (min-width: 1280px) {
  .show-gt-md {
    display: flex !important;
  }

  .hide-gt-md {
    display: none !important;
  }
}

// Less than SM (less than 600px)
@media (max-width: 599px) {
  .show-lt-sm {
    display: flex !important;
  }

  .hide-lt-sm {
    display: none !important;
  }
}

// Less than MD (less than 960px)
@media (max-width: 959px) {
  .show-lt-md {
    display: flex !important;
  }

  .hide-lt-md {
    display: none !important;
  }
}

// Less than LG (less than 1280px)
@media (max-width: 1279px) {
  .show-lt-lg {
    display: flex !important;
  }

  .hide-lt-lg {
    display: none !important;
  }
}

// ===================================
// Grid Layout Utilities
// ===================================

.grid {
  display: grid;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }

.grid-gap-8 { grid-gap: 8px; }
.grid-gap-12 { grid-gap: 12px; }
.grid-gap-16 { grid-gap: 16px; }
.grid-gap-24 { grid-gap: 24px; }
```

### Step 2.2: Import Layout Utilities

Add to `src/styles.scss`:

```scss
@use '@angular/material' as mat;

// Import layout utilities (replacement for Flex Layout)
@import './styles/layout';

// ... rest of your styles
```

### Step 2.3: Find All Flex Layout Usage

```bash
# Search for all Flex Layout directives in templates
grep -r "fxLayout" src/
grep -r "fxFlex" src/
grep -r "fxShow" src/
grep -r "fxHide" src/
grep -r "fxLayoutAlign" src/
grep -r "fxLayoutGap" src/
```

### Step 2.4: Replace Flex Layout Directives

Use this conversion table:

| Flex Layout Directive | CSS Replacement |
|----------------------|-----------------|
| `fxLayout="row"` | `class="flex-row"` |
| `fxLayout="column"` | `class="flex-column"` |
| `fxLayout="row wrap"` | `class="flex-row flex-wrap"` |
| `fxLayout.xs="column"` | `class="flex-row flex-column-xs"` |
| `fxLayoutAlign="start center"` | `class="align-start-center"` |
| `fxLayoutAlign="center center"` | `class="align-center-center"` |
| `fxLayoutAlign="space-between center"` | `class="align-space-between-center"` |
| `fxLayoutGap="16px"` | `class="gap-16"` |
| `fxFlex` | `class="flex-1"` |
| `fxFlex="50"` | `class="flex-50"` |
| `fxFlex="auto"` | `class="flex-auto"` |
| `fxFlex="none"` | `class="flex-none"` |
| `fxFlex="300px"` | `class="flex-300px"` |
| `fxShow.gt-xs` | `class="show-gt-xs"` |
| `fxShow.xs` | `class="show-xs"` |
| `fxHide.xs` | `class="hide-xs"` |
| `fxHide.gt-xs` | `class="hide-gt-xs"` |

**Example Conversion:**

Before:
```html
<div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="16px">
  <div fxFlex="60">Main content</div>
  <div fxFlex="300px" fxShow.gt-xs>Sidebar</div>
</div>
```

After:
```html
<div class="flex-row align-space-between-center gap-16">
  <div class="flex-60">Main content</div>
  <div class="flex-300px show-gt-xs">Sidebar</div>
</div>
```

### Step 2.5: Remove Flex Layout from Module

**app.module.ts:**

```typescript
// REMOVE this import
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    // ... other imports
    // FlexLayoutModule, // REMOVE THIS LINE
  ]
})
```

### Step 2.6: Remove Flex Layout from package.json

```bash
npm uninstall @angular/flex-layout
```

### Step 2.7: Test and Commit

```bash
# Reinstall dependencies
npm install

# Build
npm run build

# Test application
npm start

# Commit changes
git add -A
git commit -m "Phase 2: Migrated Flex Layout to CSS utilities"
```

✅ **Phase 2 Complete** when:
- All Flex Layout directives replaced with CSS classes
- @angular/flex-layout removed from package.json
- Application builds successfully
- Responsive layouts work correctly
- All breakpoints tested (mobile, tablet, desktop)

---

## Phase 3: Material Legacy → MDC

**Time Estimate:** 4-6 hours

### Step 3.1: Identify All Material Legacy Components

Search your codebase:

```bash
grep -r "MatLegacy" src/
grep -r "mat-legacy" src/
```

### Step 3.2: Update Module Imports

Replace all legacy imports with MDC equivalents:

**Complete Conversion Table:**

| Legacy Import | MDC Import |
|--------------|------------|
| `import { MatLegacyAutocompleteModule } from '@angular/material/legacy-autocomplete';` | `import { MatAutocompleteModule } from '@angular/material/autocomplete';` |
| `import { MatLegacyButtonModule } from '@angular/material/legacy-button';` | `import { MatButtonModule } from '@angular/material/button';` |
| `import { MatLegacyCardModule } from '@angular/material/legacy-card';` | `import { MatCardModule } from '@angular/material/card';` |
| `import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';` | `import { MatCheckboxModule } from '@angular/material/checkbox';` |
| `import { MatLegacyChipsModule } from '@angular/material/legacy-chips';` | `import { MatChipsModule } from '@angular/material/chips';` |
| `import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';` | `import { MatDialogModule } from '@angular/material/dialog';` |
| `import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';` | `import { MatFormFieldModule } from '@angular/material/form-field';` |
| `import { MatLegacyInputModule } from '@angular/material/legacy-input';` | `import { MatInputModule } from '@angular/material/input';` |
| `import { MatLegacyListModule } from '@angular/material/legacy-list';` | `import { MatListModule } from '@angular/material/list';` |
| `import { MatLegacyMenuModule } from '@angular/material/legacy-menu';` | `import { MatMenuModule } from '@angular/material/menu';` |
| `import { MatLegacyPaginatorModule } from '@angular/material/legacy-paginator';` | `import { MatPaginatorModule } from '@angular/material/paginator';` |
| `import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';` | `import { MatProgressBarModule } from '@angular/material/progress-bar';` |
| `import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';` | `import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';` |
| `import { MatLegacyRadioModule } from '@angular/material/legacy-radio';` | `import { MatRadioModule } from '@angular/material/radio';` |
| `import { MatLegacySelectModule } from '@angular/material/legacy-select';` | `import { MatSelectModule } from '@angular/material/select';` |
| `import { MatLegacySlideToggleModule } from '@angular/material/legacy-slide-toggle';` | `import { MatSlideToggleModule } from '@angular/material/slide-toggle';` |
| `import { MatLegacySliderModule } from '@angular/material/legacy-slider';` | `import { MatSliderModule } from '@angular/material/slider';` |
| `import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';` | `import { MatSnackBar } from '@angular/material/snack-bar';` |
| `import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';` | `import { MatSnackBarModule } from '@angular/material/snack-bar';` |
| `import { MatLegacyTableModule } from '@angular/material/legacy-table';` | `import { MatTableModule } from '@angular/material/table';` |
| `import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';` | `import { MatTabsModule } from '@angular/material/tabs';` |
| `import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';` | `import { MatTooltipModule } from '@angular/material/tooltip';` |

### Step 3.3: Update Component TypeScript Files

Search for legacy component usage in `.ts` files:

```bash
# Find MatLegacy usage in TypeScript
grep -r "MatLegacy" --include="*.ts" src/
```

Replace with MDC equivalents:

```typescript
// Before
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

// After
import { MatSnackBar } from '@angular/material/snack-bar';
```

### Step 3.4: Update Templates (if needed)

Most MDC components use the same template syntax, but some require changes:

**Form Fields - Add `appearance="outline"`:**

```html
<!-- Before -->
<mat-form-field>
  <mat-label>Name</mat-label>
  <input matInput />
</mat-form-field>

<!-- After (MDC recommended) -->
<mat-form-field appearance="outline">
  <mat-label>Name</mat-label>
  <input matInput />
</mat-form-field>
```

**Tables - Selectors remain the same:**
```html
<!-- These work in both Legacy and MDC -->
<table mat-table [dataSource]="data">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Name</th>
    <td mat-cell *matCellDef="let row">{{row.name}}</td>
  </ng-container>
</table>
```

### Step 3.5: Update Styles

Update `src/styles.scss`:

```scss
// Remove legacy theme mixin
@include mat.all-component-themes($theme);
// REMOVE: @include mat.all-legacy-component-themes($theme);

// Update CSS selectors from .mat-legacy-* to .mat-mdc-*
// Before:
.mat-legacy-button { }
.mat-legacy-table .mat-row:hover { }

// After:
.mat-mdc-button { }
.mat-mdc-table .mat-mdc-row:hover { }
```

### Step 3.6: Test and Commit

```bash
# Build
npm run build

# Test all Material components visually
npm start

# Commit
git add -A
git commit -m "Phase 3: Migrated Material Legacy to MDC components"
```

✅ **Phase 3 Complete** when:
- All Material Legacy imports replaced with MDC
- All `.ts` files updated
- Templates updated (appearance attributes added)
- Styles updated (MDC selectors)
- Application builds successfully
- All Material components work correctly

---

## Phase 4: Angular Version Updates

**Time Estimate:** 6-10 hours

This phase updates Angular through each major version sequentially.

### Step 4.1: Angular 16 → 17

```bash
# Backup package.json
cp package.json package.json.v16-backup

# Update to Angular 17
ng update @angular/core@17 @angular/cli@17 --force

# Update Material
ng update @angular/material@17 --force

# If using angular-in-memory-web-api
npm install angular-in-memory-web-api@0.17.0 --save --legacy-peer-deps

# Test build
npm run build

# Commit
git add -A
git commit -m "Phase 4.1: Updated to Angular 17"
```

**What to expect:**
- TypeScript updated to 5.4.x
- zone.js updated to 0.14.x
- Optional: Block control flow migration (defer to Phase 6)

### Step 4.2: Angular 17 → 18

```bash
# Update to Angular 18
ng update @angular/core@18 @angular/cli@18 --force

# Update Material
ng update @angular/material@18 --force

# If using angular-in-memory-web-api
npm install angular-in-memory-web-api@0.18.0 --save --legacy-peer-deps

# Test build
npm run build

# Commit
git add -A
git commit -m "Phase 4.2: Updated to Angular 18"
```

**What to expect:**
- **IMPORTANT**: `HttpClientModule` migrated to `provideHttpClient()`
  - If using `angular-in-memory-web-api`, REVERT this change (see Issue 9 in Common Issues)
- Material theme API changes: `mat.m2-define-palette()`, `mat.m2-define-light-theme()`
- These migrations are automatic

### Step 4.3: Angular 18 → 19

```bash
# Update to Angular 19
ng update @angular/core@19 @angular/cli@19 --force

# Update Material
ng update @angular/material@19 --force

# If using angular-in-memory-web-api
npm install angular-in-memory-web-api@0.19.0 --save --legacy-peer-deps

# Test build
npm run build

# Commit
git add -A
git commit -m "Phase 4.3: Updated to Angular 19"
```

**What to expect:**
- All components get `standalone: false` property (for NgModule apps)
- TypeScript updated to 5.8.x
- zone.js updated to 0.15.x
- Material elevation and background mixins added to styles.scss

### Step 4.4: Angular 19 → 20

```bash
# Update to Angular 20
ng update @angular/core@20 @angular/cli@20 --force

# Update Material
ng update @angular/material@20 --force

# If using angular-in-memory-web-api
npm install angular-in-memory-web-api@0.20.0 --save --legacy-peer-deps

# Test build
npm run build

# Commit
git add -A
git commit -m "Phase 4.4: Updated to Angular 20"
```

**What to expect:**
- tsconfig.json `moduleResolution` updated to `"bundler"`
- Angular workspace generation defaults updated
- Final version!

✅ **Phase 4 Complete** when:
- All four version updates completed successfully
- Application builds without errors
- All migrations applied correctly
- Final versions: Angular 20.x, Material 20.x

---

## Phase 5: Testing & Validation

**Time Estimate:** 3-5 hours

### Step 5.1: Build Verification

```bash
# Production build
npm run build

# Check bundle size
# Should be similar or smaller than Angular 16
```

### Step 5.2: Development Server

```bash
# Start dev server
npm start

# Application should run on http://localhost:4200
```

### Step 5.3: Functional Testing

Test all features:

- [ ] All pages load correctly
- [ ] All forms work (submit, validation)
- [ ] All tables display data
- [ ] All dialogs/modals open and close
- [ ] All dropdowns/selects work
- [ ] All buttons click and perform actions
- [ ] All navigation works
- [ ] All API calls work (if using mock APIs, test endpoints)
- [ ] All Material components render correctly

### Step 5.4: Responsive Testing

Test on different screen sizes:

- [ ] Mobile (< 600px)
- [ ] Tablet (600px - 959px)
- [ ] Desktop (960px+)
- [ ] All show/hide breakpoints work
- [ ] Layouts adjust correctly

### Step 5.5: Browser Testing

Test on:

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Step 5.6: Console Error Check

- [ ] No errors in browser console
- [ ] No 404s for missing resources
- [ ] No failed HTTP requests

✅ **Phase 5 Complete** when:
- All functional tests pass
- All responsive breakpoints work
- All browsers tested
- No console errors

---

## Phase 6: Cleanup & Documentation

**Time Estimate:** 1-2 hours

### Step 6.1: Remove Backup Files

```bash
# Remove backup files
rm -f *.v*-backup
rm -f *.backup
```

### Step 6.2: Update README

Update your project README with new versions:

```markdown
## Current Stack

- **Angular**: 20.x
- **Angular Material**: 20.x (MDC)
- **TypeScript**: 5.8.x
- **Layout**: CSS Flexbox/Grid utilities
```

### Step 6.3: Update package.json Description

```json
{
  "name": "your-project",
  "version": "2.0.0",
  "description": "Updated to Angular 20 with Material MDC"
}
```

### Step 6.4: Final Commit

```bash
git add -A
git commit -m "Phase 6: Cleanup and documentation complete - Angular 20 migration finished"
```

### Step 6.5: Tag Release

```bash
git tag -a v20.0.0 -m "Angular 20 migration complete"
```

### Step 6.6: Merge to Main (Optional)

```bash
# Switch to main
git checkout main

# Merge migration branch
git merge feature/angular-20-migration --no-ff

# Push to remote
git push origin main --tags
```

✅ **Phase 6 Complete** - Migration finished!

---

## Common Issues & Solutions

### Issue 1: Repository Not Clean Error

**Error:**
```
Error: Repository is not clean. Please commit or stash any changes before updating.
```

**Solution:**
```bash
# Add all backup patterns to .gitignore FIRST
echo "*.v*-backup" >> .gitignore
git add .gitignore
git commit -m "Add backup patterns to gitignore"

# Then run ng update
ng update @angular/core@17 --force
```

### Issue 2: Peer Dependency Conflicts

**Error:**
```
npm error ERESOLVE unable to resolve dependency tree
```

**Solution:**
Use `--legacy-peer-deps` flag:
```bash
npm install angular-in-memory-web-api@0.18.0 --save --legacy-peer-deps
```

### Issue 3: HttpClientModule Auto-Migration Breaking InMemoryWebApi

**Symptoms:**
- Build succeeds
- No console errors
- API endpoints return no data

**Solution:**
If using `angular-in-memory-web-api`, revert to `HttpClientModule`:

```typescript
// DON'T use provideHttpClient() with InMemoryWebApi
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,  // Must be BEFORE InMemoryWebApiModule
    InMemoryWebApiModule.forRoot(YourBackendService),
  ]
  // Remove provideHttpClient from providers
})
```

### Issue 4: Material Theme Not Working

**Solution:**
Check `styles.scss` has correct theme setup:

```scss
@use '@angular/material' as mat;

@include mat.core();

$primary: mat.m2-define-palette(mat.$m2-indigo-palette);
$accent: mat.m2-define-palette(mat.$m2-pink-palette);

$theme: mat.m2-define-light-theme((
  color: (primary: $primary, accent: $accent)
));

@include mat.all-component-themes($theme);
```

### Issue 5: Sass @import Deprecation Warning

**Warning:**
```
Deprecation Warning: Sass @import rules are deprecated
```

**Solution:**
This is non-blocking. To fix (optional):

```scss
// Instead of:
@import './styles/layout';

// Use:
@use './styles/layout';
```

### Issue 6: Missing `standalone` Property in Angular 19

**Automatic fix** - Migration adds `standalone: false` to all components.

If you see errors, manually add:

```typescript
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
  standalone: false  // Add this for NgModule components
})
```

### Issue 7: Build Size Increased

**Expected:** Bundle size may increase by 50-100 kB due to:
- MDC components are larger (better accessibility)
- More TypeScript features

**Optimization:**
```typescript
// Enable build optimization in angular.json
"optimization": true,
"buildOptimizer": true
```

### Issue 8: Form Fields Look Different

**Solution:**
Add `appearance` attribute:

```html
<mat-form-field appearance="outline">
  <mat-label>Label</mat-label>
  <input matInput />
</mat-form-field>
```

Available appearances: `fill`, `outline`

---

## Reference Tables

### Complete Flex Layout → CSS Conversion

| Flex Layout | CSS Utility | Description |
|------------|-------------|-------------|
| `fxLayout="row"` | `class="flex-row"` | Horizontal layout |
| `fxLayout="column"` | `class="flex-column"` | Vertical layout |
| `fxLayout="row-reverse"` | `class="flex-row-reverse"` | Reverse horizontal |
| `fxLayout="column-reverse"` | `class="flex-column-reverse"` | Reverse vertical |
| `fxLayout="row wrap"` | `class="flex-row flex-wrap"` | Wrapping rows |
| `fxLayout.xs="column"` | `class="flex-row flex-column-xs"` | Responsive column on mobile |
| `fxLayoutAlign="start start"` | `class="align-start-start"` | Top-left alignment |
| `fxLayoutAlign="start center"` | `class="align-start-center"` | Left, vertically centered |
| `fxLayoutAlign="center center"` | `class="align-center-center"` | Centered both ways |
| `fxLayoutAlign="space-between center"` | `class="align-space-between-center"` | Space between items |
| `fxLayoutAlign="space-around center"` | `class="align-space-around-center"` | Space around items |
| `fxLayoutGap="8px"` | `class="gap-8"` | 8px gap |
| `fxLayoutGap="16px"` | `class="gap-16"` | 16px gap |
| `fxFlex` | `class="flex-1"` | Grow to fill |
| `fxFlex="auto"` | `class="flex-auto"` | Auto sizing |
| `fxFlex="none"` | `class="flex-none"` | No grow/shrink |
| `fxFlex="25"` | `class="flex-25"` | 25% width |
| `fxFlex="50"` | `class="flex-50"` | 50% width |
| `fxFlex="300px"` | `class="flex-300px"` | 300px fixed width |
| `fxShow` | `class="show-xs"` | Always show |
| `fxHide` | `class="hide-xs"` | Always hide |
| `fxShow.xs` | `class="show-xs"` | Show on mobile |
| `fxHide.xs` | `class="hide-xs"` | Hide on mobile |
| `fxShow.gt-xs` | `class="show-gt-xs"` | Show on tablet+ |
| `fxHide.gt-xs` | `class="hide-gt-xs"` | Hide on tablet+ |
| `fxShow.sm` | `class="show-sm"` | Show on tablet |
| `fxHide.sm` | `class="hide-sm"` | Hide on tablet |
| `fxShow.gt-sm` | `class="show-gt-sm"` | Show on desktop+ |
| `fxShow.md` | `class="show-md"` | Show on desktop |
| `fxShow.lg` | `class="show-lg"` | Show on large desktop |

### Material Legacy → MDC Component Map

| Component Type | Legacy Package | MDC Package |
|---------------|---------------|-------------|
| Autocomplete | `@angular/material/legacy-autocomplete` | `@angular/material/autocomplete` |
| Button | `@angular/material/legacy-button` | `@angular/material/button` |
| Card | `@angular/material/legacy-card` | `@angular/material/card` |
| Checkbox | `@angular/material/legacy-checkbox` | `@angular/material/checkbox` |
| Chips | `@angular/material/legacy-chips` | `@angular/material/chips` |
| Dialog | `@angular/material/legacy-dialog` | `@angular/material/dialog` |
| Form Field | `@angular/material/legacy-form-field` | `@angular/material/form-field` |
| Input | `@angular/material/legacy-input` | `@angular/material/input` |
| List | `@angular/material/legacy-list` | `@angular/material/list` |
| Menu | `@angular/material/legacy-menu` | `@angular/material/menu` |
| Paginator | `@angular/material/legacy-paginator` | `@angular/material/paginator` |
| Progress Bar | `@angular/material/legacy-progress-bar` | `@angular/material/progress-bar` |
| Progress Spinner | `@angular/material/legacy-progress-spinner` | `@angular/material/progress-spinner` |
| Radio | `@angular/material/legacy-radio` | `@angular/material/radio` |
| Select | `@angular/material/legacy-select` | `@angular/material/select` |
| Slide Toggle | `@angular/material/legacy-slide-toggle` | `@angular/material/slide-toggle` |
| Slider | `@angular/material/legacy-slider` | `@angular/material/slider` |
| Snack Bar | `@angular/material/legacy-snack-bar` | `@angular/material/snack-bar` |
| Table | `@angular/material/legacy-table` | `@angular/material/table` |
| Tabs | `@angular/material/legacy-tabs` | `@angular/material/tabs` |
| Tooltip | `@angular/material/legacy-tooltip` | `@angular/material/tooltip` |

### Version Compatibility Matrix

| Angular | Material | TypeScript | zone.js | angular-in-memory-web-api |
|---------|----------|------------|---------|---------------------------|
| 16.2.x | 16.2.x | 5.1.x | 0.13.x | 0.16.0 |
| 17.3.x | 17.3.x | 5.4.x | 0.14.x | 0.17.0 |
| 18.2.x | 18.2.x | 5.4.x | 0.14.x | 0.18.0 |
| 19.2.x | 19.2.x | 5.8.x | 0.15.x | 0.19.0 |
| 20.3.x | 20.2.x | 5.8.x | 0.15.x | 0.20.0 |

---

## Best Practices

1. **Always commit before ng update** - Enables clean rollback
2. **One major version at a time** - Don't skip versions
3. **Use --force flag** - Required for peer dependency conflicts
4. **Install packages separately** - Update auxiliary packages after Angular
5. **Test build after each version** - Catch issues early
6. **Monitor bundle size** - Track changes through migration
7. **Ignore non-blocking warnings** - Focus on errors first
8. **Test runtime functionality** - Not just builds
9. **Keep HttpClientModule for InMemoryWebApi** - Compatibility issue

---

## Success Criteria

Migration is complete when:

✓ Application builds without errors
✓ All pages render correctly
✓ All functionality works as before
✓ Responsive layouts work on all breakpoints
✓ No console errors in browser
✓ Bundle size is acceptable
✓ Performance is same or better
✓ All tests pass
✓ Code merged to main branch

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: Preparation | 2-3 hours | 2-3 hours |
| Phase 2: Flex Layout | 3-5 hours | 5-8 hours |
| Phase 3: Material MDC | 4-6 hours | 9-14 hours |
| Phase 4: Angular Updates | 6-10 hours | 15-24 hours |
| Phase 5: Testing | 3-5 hours | 18-29 hours |
| Phase 6: Cleanup | 1-2 hours | 19-31 hours |
| **Total** | **19-31 hours** | |

---

## Additional Resources

- [Official Angular Update Guide](https://update.angular.io/)
- [Angular Material MDC Migration](https://material.angular.io/guide/mdc-migration)
- [Flex Layout Deprecation FAQ](https://github.com/angular/flex-layout/wiki/Frequently-Asked-Questions)
- [Angular 17 Release Notes](https://blog.angular.io/introducing-angular-v17-4d7033312e4b)
- [Angular 18 Release Notes](https://blog.angular.io/angular-v18-is-now-available-e79d5ac0affe)
- [Angular 19 Release Notes](https://blog.angular.io/meet-angular-v19-7b29dfd05b84)

---

**This template was created based on a real-world migration from Angular 16.2.0 to 20.3.12**

*Last Updated: 2025-11-18*
*Version: 1.0*
*License: MIT - Free to use and modify*
