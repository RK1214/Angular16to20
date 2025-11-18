# Angular 16 to Angular 20 Migration Plan

## Table of Contents
1. [Overview](#overview)
2. [Pre-Migration Assessment](#pre-migration-assessment)
3. [Migration Phases](#migration-phases)
4. [Detailed Steps](#detailed-steps)
5. [Testing Strategy](#testing-strategy)
6. [Rollback Plan](#rollback-plan)

---

## Overview

### Current State
- **Angular Version**: 16.2.0
- **Material Version**: 16.2.0 (Legacy Components)
- **Layout Solution**: Angular Flex Layout 15.0.0-beta.42 (Deprecated)
- **TypeScript Version**: 5.1.6

### Target State
- **Angular Version**: 20.x (Latest)
- **Material Version**: 20.x (MDC Components only)
- **Layout Solution**: CSS Grid + Flexbox or Angular CDK Layout
- **TypeScript Version**: 5.7+ (as required by Angular 20)

### Key Challenges
1. **Angular Flex Layout is deprecated** - No direct replacement
2. **Material Legacy components removed** in Angular 17+
3. **Breaking changes** across multiple major versions (16 → 17 → 18 → 19 → 20)
4. **Template syntax changes** for Material MDC components
5. **Styling changes** for Material Design 3

---

## Pre-Migration Assessment

### 1. Current Component Inventory

#### Material Legacy Components Used
- ✓ MatLegacyButtonModule (buttons, raised buttons, icon buttons)
- ✓ MatLegacyCardModule (cards with title, content)
- ✓ MatLegacyFormFieldModule (form fields with labels)
- ✓ MatLegacyInputModule (text inputs)
- ✓ MatLegacyTableModule (data tables)
- ✓ MatLegacyListModule (navigation lists)
- ✓ MatLegacySelectModule (dropdowns)
- ✓ MatLegacySnackBarModule (notifications)
- ✓ MatLegacyTooltipModule (tooltips)

#### Flex Layout Directives Used
- `fxLayout` (row, column)
- `fxLayoutAlign` (alignment)
- `fxLayoutGap` (spacing)
- `fxFlex` (flex sizing)
- `fxShow.gt-xs`, `fxShow.xs` (responsive visibility)
- `fxLayout.xs` (responsive layouts)

#### Files to Modify
```
src/
├── app/
│   ├── app.component.html (Flex Layout + Material)
│   ├── app.module.ts (Module imports)
│   ├── features/
│   │   ├── home/
│   │   │   └── home.component.html (Flex Layout + Material)
│   │   └── users/
│   │       ├── user-form.component.html (Flex Layout + Material + Forms)
│   │       ├── user-form.component.ts (Material imports)
│   │       └── users-list.component.html (Flex Layout + Material + Table)
│   └── styles.scss (Material theming)
├── index.html (Material fonts)
└── angular.json (Build configuration)
```

---

## Migration Phases

### Phase 1: Preparation & Setup (2-3 hours)
- Create git branch for migration
- Document current functionality
- Set up testing environment
- Create backup of package-lock.json

### Phase 2: Migrate Angular Flex Layout (3-4 hours)
- Replace Flex Layout with CSS Grid/Flexbox
- Update all templates with Flex Layout directives
- Test responsive behavior

### Phase 3: Migrate Material Legacy to MDC (4-5 hours)
- Update Material component imports
- Update component templates
- Update component styles
- Test all Material components

### Phase 4: Incremental Angular Version Updates (6-8 hours)
- Migrate Angular 16 → 17
- Migrate Angular 17 → 18
- Migrate Angular 18 → 19
- Migrate Angular 19 → 20

### Phase 5: Testing & Validation (3-4 hours)
- Unit testing
- Integration testing
- Visual regression testing
- Performance testing

### Phase 6: Cleanup & Documentation (1-2 hours)
- Remove deprecated code
- Update documentation
- Code review

**Total Estimated Time**: 19-26 hours

---

## Detailed Steps

## PHASE 1: Preparation & Setup

### Step 1.1: Create Migration Branch
```bash
git checkout -b feature/angular-20-migration
git add .
git commit -m "Pre-migration snapshot: Angular 16 with Flex Layout and Legacy Material"
```

### Step 1.2: Document Current Functionality
- Take screenshots of all pages
- Document all user flows
- List all features and components

### Step 1.3: Install Angular CLI Globally (if needed)
```bash
npm install -g @angular/cli@20
```

---

## PHASE 2: Migrate Angular Flex Layout to CSS

### Strategy: Replace with Modern CSS

Angular Flex Layout has been deprecated. We'll use:
- **CSS Flexbox** for 1-dimensional layouts
- **CSS Grid** for 2-dimensional layouts
- **CSS Container Queries** for responsive behavior
- **Angular CDK Layout Module** for breakpoint detection (if needed)

### Step 2.1: Create Layout Utility Classes

Create `src/styles/_layout.scss`:

```scss
// Flexbox Layout Utilities
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

// Alignment
.align-start-center {
  align-items: center;
  justify-content: flex-start;
}

.align-space-between-center {
  align-items: center;
  justify-content: space-between;
}

.align-center-center {
  align-items: center;
  justify-content: center;
}

// Gap utilities
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }

// Flex sizing
.flex-auto { flex: 1 1 auto; }
.flex-none { flex: 0 0 auto; }
.flex-1 { flex: 1; }

// Responsive utilities using container queries
@media (max-width: 599px) {
  .hide-xs { display: none !important; }
  .show-xs { display: flex !important; }
  .flex-column-xs { flex-direction: column; }
}

@media (min-width: 600px) {
  .hide-gt-xs { display: none !important; }
  .show-gt-xs { display: flex !important; }
}

@media (min-width: 960px) {
  .show-gt-sm { display: flex !important; }
  .hide-gt-sm { display: none !important; }
}
```

### Step 2.2: Migration Mapping Guide

| Flex Layout Directive | CSS Replacement |
|----------------------|-----------------|
| `fxLayout="row"` | `class="flex-row"` |
| `fxLayout="column"` | `class="flex-column"` |
| `fxLayout.xs="column"` | `class="flex-row flex-column-xs"` |
| `fxLayoutAlign="start center"` | `class="align-start-center"` |
| `fxLayoutAlign="space-between center"` | `class="align-space-between-center"` |
| `fxLayoutGap="12px"` | `class="gap-12"` |
| `fxLayoutGap="16px"` | `class="gap-16"` |
| `fxFlex` | `class="flex-1"` |
| `fxFlex="auto"` | `class="flex-auto"` |
| `fxFlex="none"` | `class="flex-none"` |
| `fxFlex="300px"` | `style="flex: 0 0 300px"` or create utility class |
| `fxShow.xs` | `class="show-xs hide-gt-xs"` |
| `fxShow.gt-xs` | `class="hide-xs show-gt-xs"` |
| `fxShow.gt-sm` | `class="show-gt-sm"` |

### Step 2.3: Update Templates

**Example: app.component.html**

BEFORE:
```html
<mat-toolbar class="mat-toolbar" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="12px">
  <div fxLayout="row" fxLayoutAlign="start center" fxFlex="auto">
    <span>NG16 Material Legacy Sample</span>
  </div>
  <div fxFlex="none" fxShow.gt-xs>
    <button mat-button routerLink="/">Home</button>
  </div>
  <div fxFlex="none" fxShow.xs>
    <button mat-button routerLink="/">
      <mat-icon>home</mat-icon>
    </button>
  </div>
</mat-toolbar>
```

AFTER:
```html
<mat-toolbar class="mat-toolbar flex-row align-start-center gap-12">
  <div class="flex-row align-start-center flex-auto">
    <span>NG16 Material Legacy Sample</span>
  </div>
  <div class="flex-none hide-xs show-gt-xs">
    <button mat-button routerLink="/">Home</button>
  </div>
  <div class="flex-none show-xs hide-gt-xs">
    <button mat-button routerLink="/">
      <mat-icon>home</mat-icon>
    </button>
  </div>
</mat-toolbar>
```

### Step 2.4: Update All Templates

Apply the migration mapping to:
- ✓ `src/app/app.component.html`
- ✓ `src/app/features/home/home.component.html`
- ✓ `src/app/features/users/user-form.component.html`
- ✓ `src/app/features/users/users-list.component.html`

### Step 2.5: Remove Flex Layout Module

Update `package.json`:
```json
{
  "dependencies": {
    // Remove this line:
    // "@angular/flex-layout": "15.0.0-beta.42"
  }
}
```

Update `src/app/app.module.ts`:
```typescript
// Remove this import:
// import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    // Remove FlexLayoutModule from imports array
  ]
})
```

### Step 2.6: Test Responsive Behavior

Test at breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

---

## PHASE 3: Migrate Material Legacy Components to MDC

### Important: Material Component Changes in v17+

Material Angular v17+ uses MDC (Material Design Components) exclusively. Legacy components were removed.

### Step 3.1: Component Import Changes

**Module Import Mapping:**

| Legacy Module | MDC Module | Notes |
|--------------|------------|-------|
| `MatLegacyButtonModule` | `MatButtonModule` | Direct replacement |
| `MatLegacyCardModule` | `MatCardModule` | Direct replacement |
| `MatLegacyFormFieldModule` | `MatFormFieldModule` | Template changes required |
| `MatLegacyInputModule` | `MatInputModule` | Direct replacement |
| `MatLegacyTableModule` | `MatTableModule` | Direct replacement |
| `MatLegacyListModule` | `MatListModule` | Template changes required |
| `MatLegacySelectModule` | `MatSelectModule` | Template changes required |
| `MatLegacySnackBarModule` | `MatSnackBarModule` | API compatible |
| `MatLegacyTooltipModule` | `MatTooltipModule` | Direct replacement |

### Step 3.2: Update app.module.ts

BEFORE:
```typescript
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
// ... other legacy imports
```

AFTER:
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
```

### Step 3.3: Template Changes for MDC Components

#### Buttons - No Changes Required
```html
<!-- These work the same in MDC -->
<button mat-button>Button</button>
<button mat-raised-button>Raised</button>
<button mat-icon-button><mat-icon>add</mat-icon></button>
```

#### Cards - No Changes Required
```html
<!-- These work the same in MDC -->
<mat-card>
  <mat-card-title>Title</mat-card-title>
  <mat-card-content>Content</mat-card-content>
</mat-card>
```

#### Form Fields - CHANGES REQUIRED

BEFORE (Legacy):
```html
<mat-form-field>
  <mat-label>Name</mat-label>
  <input matInput formControlName="name" />
  <mat-error *ngIf="form.get('name')?.invalid">Name required</mat-error>
</mat-form-field>
```

AFTER (MDC) - Same structure, but MDC has different styling:
```html
<!-- Appearance attribute recommended for MDC -->
<mat-form-field appearance="outline">
  <mat-label>Name</mat-label>
  <input matInput formControlName="name" />
  <mat-error *ngIf="form.get('name')?.invalid">Name required</mat-error>
</mat-form-field>
```

MDC Form Field Appearances:
- `fill` (default) - Filled background
- `outline` - Outlined border

#### Lists - Minor Changes

BEFORE (Legacy):
```html
<mat-list>
  <mat-list-item routerLink="/users">Users</mat-list-item>
</mat-list>
```

AFTER (MDC):
```html
<mat-nav-list>
  <a mat-list-item routerLink="/users">Users</a>
</mat-nav-list>
```

Or for non-navigation lists:
```html
<mat-list>
  <mat-list-item>
    <span matListItemTitle>Title</span>
    <span matListItemLine>Description</span>
  </mat-list-item>
</mat-list>
```

#### Tables - No Changes Required
```html
<!-- Tables work the same in MDC -->
<table mat-table [dataSource]="users">
  <!-- column definitions -->
</table>
```

#### Select - No Template Changes
```html
<!-- Selects work the same in MDC -->
<mat-form-field>
  <mat-label>Role</mat-label>
  <mat-select formControlName="role">
    <mat-option value="admin">Admin</mat-option>
  </mat-select>
</mat-form-field>
```

### Step 3.4: Update Component TypeScript Files

Update `users-list.component.ts`:

BEFORE:
```typescript
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
```

AFTER:
```typescript
import { MatSnackBar } from '@angular/material/snack-bar';
```

### Step 3.5: Update Styles for MDC

Update `src/styles.scss`:

BEFORE:
```scss
@include mat.all-component-themes($theme);
@include mat.all-legacy-component-themes($theme);
```

AFTER:
```scss
// MDC only - no legacy themes
@include mat.all-component-themes($theme);
```

Remove legacy-specific styles:
```scss
// Remove these:
// .mat-legacy-toolbar { ... }
// .mat-legacy-button { ... }
// .mat-legacy-table { ... }
```

Update to use MDC classes:
```scss
.mat-toolbar {
  background: linear-gradient(90deg, rgba(33,150,243,1), rgba(63,81,181,1));
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  padding: 8px 16px;
}

.mat-mdc-button, .mat-mdc-raised-button, .mat-mdc-icon-button {
  text-transform: uppercase;
}

.mat-mdc-table .mat-mdc-row:hover {
  background-color: rgba(0,0,0,0.03);
}
```

### Step 3.6: Test Material Components

Test each component type:
- ✓ Buttons (flat, raised, icon)
- ✓ Cards (with title, content)
- ✓ Form fields (input, error states)
- ✓ Tables (display, sorting)
- ✓ Lists (navigation, display)
- ✓ Select dropdowns
- ✓ Snackbar notifications
- ✓ Tooltips

---

## PHASE 4: Incremental Angular Version Updates

### IMPORTANT: Update One Major Version at a Time

Do NOT skip versions. Update: 16 → 17 → 18 → 19 → 20

### Step 4.1: Update Angular 16 → 17

```bash
# Update Angular CLI and Core
ng update @angular/cli@17 @angular/core@17

# Update Angular Material
ng update @angular/material@17

# Update other Angular packages
npm install @angular/animations@17 \
  @angular/common@17 \
  @angular/compiler@17 \
  @angular/forms@17 \
  @angular/platform-browser@17 \
  @angular/platform-browser-dynamic@17 \
  @angular/router@17 \
  @angular/cdk@17

# Update dev dependencies
npm install --save-dev @angular/compiler-cli@17 \
  @angular-devkit/build-angular@17 \
  typescript@~5.2.0
```

**Key Changes in Angular 17:**
- Standalone components by default (optional for existing apps)
- New control flow syntax (`@if`, `@for`, `@switch`)
- Vite and esbuild builders available
- Material legacy components removed

**After Update:**
```bash
npm install
npm run build
npm start
# Test the application
```

### Step 4.2: Update Angular 17 → 18

```bash
ng update @angular/cli@18 @angular/core@18
ng update @angular/material@18

npm install
npm run build
npm start
```

**Key Changes in Angular 18:**
- Zoneless change detection (experimental)
- Material 3 theming improvements
- Route redirects as functions
- TypeScript 5.4 support

### Step 4.3: Update Angular 18 → 19

```bash
ng update @angular/cli@19 @angular/core@19
ng update @angular/material@19

npm install
npm run build
npm start
```

**Key Changes in Angular 19:**
- Incremental hydration
- Linked signals
- Resource API
- TypeScript 5.5 support

### Step 4.4: Update Angular 19 → 20

```bash
ng update @angular/cli@20 @angular/core@20
ng update @angular/material@20

npm install
npm run build
npm start
```

**Key Changes in Angular 20:**
- (Check official release notes when available)
- Likely TypeScript 5.7+ support
- Performance improvements
- Material Design 3 enhancements

### Step 4.5: Update Other Dependencies

Update remaining dependencies:
```bash
# Update TypeScript (if not auto-updated)
npm install --save-dev typescript@latest

# Update RxJS (if needed)
npm install rxjs@latest

# Update zone.js (if needed)
npm install zone.js@latest

# Remove deprecated packages
npm uninstall angular-in-memory-web-api  # Consider replacing with real API
```

### Step 4.6: Handle Breaking Changes

Review and fix breaking changes for each version:

**Angular 17 Breaking Changes:**
- Remove all legacy Material imports (done in Phase 3)
- Update deprecated APIs
- Check for removed lifecycle hooks

**Angular 18 Breaking Changes:**
- Update route configuration if using redirects
- Check for deprecated router APIs

**Angular 19 Breaking Changes:**
- Review hydration changes
- Update signal usage if applicable

**Angular 20 Breaking Changes:**
- (Review official migration guide)

---

## PHASE 5: Testing & Validation

### Step 5.1: Unit Tests

If tests exist, update them:
```bash
npm test
```

Fix test imports and mock Material components.

### Step 5.2: Build for Production

```bash
npm run build
```

Verify:
- No build errors
- Bundle size is reasonable
- Source maps generated

### Step 5.3: Manual Testing Checklist

**Home Page:**
- ✓ Layout renders correctly
- ✓ Responsive behavior works
- ✓ Navigation links work
- ✓ Cards display properly

**Users List Page:**
- ✓ Table displays data
- ✓ Columns render correctly
- ✓ "Create user" button works
- ✓ Edit/Delete buttons work
- ✓ Responsive card view (mobile)
- ✓ Snackbar shows on delete

**User Form Page:**
- ✓ Form fields render
- ✓ Form validation works
- ✓ Save button functional
- ✓ Cancel button works
- ✓ Success message appears

**Cross-Browser Testing:**
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)

**Responsive Testing:**
- ✓ Mobile (375px - 599px)
- ✓ Tablet (600px - 959px)
- ✓ Desktop (960px+)

### Step 5.4: Performance Testing

Compare before and after:
- Bundle size
- Initial load time
- Time to interactive
- Lighthouse scores

```bash
# Generate production build
npm run build

# Analyze bundle
npx webpack-bundle-analyzer dist/*/stats.json
```

---

## PHASE 6: Cleanup & Documentation

### Step 6.1: Remove Deprecated Code

Remove:
- ✓ All legacy Material imports
- ✓ Flex Layout dependencies
- ✓ Unused polyfills
- ✓ Old build configurations

### Step 6.2: Update Documentation

Update:
- ✓ README.md with new versions
- ✓ Development setup instructions
- ✓ Deployment procedures
- ✓ This migration plan (mark as completed)

### Step 6.3: Code Review

Review:
- Component structure
- Consistent styling
- TypeScript strict mode
- Accessibility (a11y)

### Step 6.4: Git Commit & Merge

```bash
# Final commit
git add .
git commit -m "Complete Angular 20 migration with MDC Material and CSS layout"

# Merge to main (or create PR)
git checkout main
git merge feature/angular-20-migration
git push origin main
```

---

## Testing Strategy

### Automated Testing

1. **Unit Tests** (if applicable)
   - Update test imports
   - Mock Material components
   - Run: `npm test`

2. **E2E Tests** (if applicable)
   - Update selectors for MDC components
   - Test user flows
   - Run: `npm run e2e`

### Manual Testing

1. **Functional Testing**
   - Test all CRUD operations
   - Verify form validation
   - Check navigation

2. **Visual Testing**
   - Compare screenshots before/after
   - Check responsive layouts
   - Verify Material theming

3. **Cross-Browser Testing**
   - Test on Chrome, Firefox, Safari, Edge
   - Test on iOS Safari and Android Chrome

### Performance Testing

1. **Lighthouse Audit**
   - Run before and after
   - Compare scores
   - Target: 90+ performance

2. **Bundle Analysis**
   - Check bundle size
   - Identify large dependencies
   - Optimize if needed

---

## Rollback Plan

### If Migration Fails

1. **Revert Git Changes**
```bash
git checkout main
git branch -D feature/angular-20-migration
```

2. **Restore Dependencies**
```bash
npm ci  # Restore from package-lock.json
```

3. **Rebuild Application**
```bash
npm install
npm run build
npm start
```

### Checkpoint Strategy

Create git commits after each phase:
- ✓ After Phase 2 (Flex Layout migration)
- ✓ After Phase 3 (Material migration)
- ✓ After each Angular version update in Phase 4

This allows rolling back to any checkpoint if issues arise.

---

## Risk Assessment

### High Risk Items

1. **Flex Layout Migration**
   - Risk: Layout breaking on responsive views
   - Mitigation: Thorough testing at all breakpoints
   - Rollback: Revert to Phase 1 checkpoint

2. **Material Component Changes**
   - Risk: Component behavior differences
   - Mitigation: Test each component thoroughly
   - Rollback: Revert to Phase 2 checkpoint

3. **Multiple Version Jumps**
   - Risk: Cascading breaking changes
   - Mitigation: Update one version at a time
   - Rollback: Revert to last working version

### Medium Risk Items

1. **TypeScript Version Changes**
   - Risk: Type errors in existing code
   - Mitigation: Fix types incrementally

2. **Build Configuration Changes**
   - Risk: Build failures
   - Mitigation: Keep angular.json simple

### Low Risk Items

1. **Dependency Updates**
   - Risk: Minor version incompatibilities
   - Mitigation: Lock versions in package.json

---

## Post-Migration Optimizations

### Optional Enhancements After Migration

1. **Adopt Standalone Components**
   - Convert NgModule to standalone
   - Remove unnecessary imports

2. **Use New Control Flow Syntax**
   - Replace `*ngIf` with `@if`
   - Replace `*ngFor` with `@for`

3. **Implement Signals**
   - Replace some RxJS with signals
   - Use computed signals

4. **Optimize Bundle**
   - Enable build-time optimization
   - Implement lazy loading

5. **Enhance Accessibility**
   - Add ARIA labels
   - Test with screen readers

---

## Success Criteria

Migration is complete when:

✓ Application builds without errors
✓ All pages render correctly
✓ All functionality works as before
✓ Responsive layouts work on all breakpoints
✓ No console errors in browser
✓ Bundle size is similar or smaller
✓ Performance is same or better
✓ All tests pass (if applicable)
✓ Code is deployed to production

---

## Resources & References

### Official Documentation
- [Angular Update Guide](https://update.angular.io/)
- [Angular Material Migration Guide](https://material.angular.io/guide/mdc-migration)
- [Angular Flex Layout Replacement Guide](https://github.com/angular/flex-layout/wiki/Frequently-Asked-Questions#q-is-flexlayout-deprecated)

### Version Release Notes
- [Angular 17 Release](https://blog.angular.io/introducing-angular-v17-4d7033312e4b)
- [Angular 18 Release](https://blog.angular.io/angular-v18-is-now-available-e79d5ac0affe)
- [Angular 19 Release](https://blog.angular.io/meet-angular-v19-7b29dfd05b84)
- [Angular 20 Release](https://angular.dev) (Check when available)

### Community Resources
- [Angular Discord](https://discord.gg/angular)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/angular)
- [Angular Material Issues](https://github.com/angular/components/issues)

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Preparation | 2-3 hours | None |
| Phase 2: Flex Layout | 3-4 hours | Phase 1 |
| Phase 3: Material MDC | 4-5 hours | Phase 2 |
| Phase 4: Angular Updates | 6-8 hours | Phase 3 |
| Phase 5: Testing | 3-4 hours | Phase 4 |
| Phase 6: Cleanup | 1-2 hours | Phase 5 |
| **Total** | **19-26 hours** | |

**Recommended Schedule:**
- Day 1: Phases 1-2
- Day 2: Phase 3
- Day 3: Phase 4 (Angular 16→17, 17→18)
- Day 4: Phase 4 (Angular 18→19, 19→20)
- Day 5: Phases 5-6

---

## Approval & Sign-off

Before starting migration:
- [ ] Review and approve this plan
- [ ] Allocate time for migration
- [ ] Set up development environment
- [ ] Create backup of current code
- [ ] Notify team of migration schedule

---

*Last Updated: 2025-11-18*
*Version: 1.0*
*Status: Ready for Review*
