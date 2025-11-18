# Angular 20 Migration - Quick Reference Guide

## Quick Links
- [Full Migration Plan](./MIGRATION_PLAN.md)
- [Angular Update Guide](https://update.angular.io/?v=16.0-20.0)
- [Material MDC Migration](https://material.angular.io/guide/mdc-migration)

---

## Flex Layout to CSS - Quick Reference

### Common Directives

```html
<!-- Row layout -->
fxLayout="row"                    → class="flex-row"
fxLayout="column"                 → class="flex-column"
fxLayout.xs="column"              → class="flex-row flex-column-xs"

<!-- Alignment -->
fxLayoutAlign="start center"     → class="align-start-center"
fxLayoutAlign="space-between center" → class="align-space-between-center"
fxLayoutAlign="center center"    → class="align-center-center"

<!-- Gap/Spacing -->
fxLayoutGap="8px"                 → class="gap-8"
fxLayoutGap="12px"                → class="gap-12"
fxLayoutGap="16px"                → class="gap-16"

<!-- Flex Sizing -->
fxFlex                            → class="flex-1"
fxFlex="auto"                     → class="flex-auto"
fxFlex="none"                     → class="flex-none"
fxFlex="300px"                    → style="flex: 0 0 300px"
fxFlex="1 1 60%"                  → style="flex: 1 1 60%"

<!-- Responsive Visibility -->
fxShow.xs                         → class="show-xs hide-gt-xs"
fxShow.gt-xs                      → class="hide-xs show-gt-xs"
fxShow.gt-sm                      → class="show-gt-sm"
fxHide.xs                         → class="hide-xs"
```

### Dynamic Bindings (Property Bindings)

For **dynamic values** from component properties, use custom directives:

```html
<!-- Dynamic Flex (variable values) -->
[fxFlex]="itemWidth"              → [appFlex]="itemWidth"
[fxFlex]="columnSize"             → [appFlex]="columnSize"

<!-- Dynamic Gap (variable values) -->
[fxLayoutGap]="spacing"           → [appGap]="spacing"
[fxLayoutGap]="gapSize"           → [appGap]="gapSize"
```

**Component Example:**
```typescript
export class MyComponent {
  itemWidth = '50';      // Becomes 50%
  columnSize = '300px';  // Becomes 300px fixed
  spacing = '16';        // Becomes 16px gap
}
```

**Directives automatically handle:**
- Numbers: `50` → `0 0 50%`
- Pixels: `200px` → `0 0 200px`
- Keywords: `auto` → `1 1 auto`

📖 See [DYNAMIC_FLEX_MIGRATION.md](./DYNAMIC_FLEX_MIGRATION.md) for detailed guide

### Breakpoints

| Name | Min Width | Flex Layout | CSS Class |
|------|-----------|-------------|-----------|
| xs | 0px | `.xs` | `.show-xs` |
| sm | 600px | `.gt-xs` | `.show-gt-xs` |
| md | 960px | `.gt-sm` | `.show-gt-sm` |
| lg | 1280px | `.gt-md` | `.show-gt-md` |
| xl | 1920px | `.gt-lg` | `.show-gt-lg` |

---

## Material Legacy to MDC - Quick Reference

### Module Imports

```typescript
// BEFORE (Angular 16 Legacy)
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { MatLegacyListModule } from '@angular/material/legacy-list';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';

// AFTER (Angular 20 MDC)
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
```

### Component Service Imports

```typescript
// BEFORE
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';

// AFTER
import { MatSnackBar } from '@angular/material/snack-bar';
```

### Template Changes

#### Buttons (No Changes)
```html
<!-- Same in Legacy and MDC -->
<button mat-button>Text</button>
<button mat-raised-button>Raised</button>
<button mat-icon-button><mat-icon>add</mat-icon></button>
<button mat-fab><mat-icon>add</mat-icon></button>
```

#### Cards (No Changes)
```html
<!-- Same in Legacy and MDC -->
<mat-card>
  <mat-card-title>Title</mat-card-title>
  <mat-card-content>Content</mat-card-content>
  <mat-card-actions>Actions</mat-card-actions>
</mat-card>
```

#### Form Fields (Configure global appearance)
```typescript
// RECOMMENDED: Configure globally in app.module.ts
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ]
})
export class AppModule {}
```

```html
<!-- Templates stay clean - no appearance attribute needed -->
<mat-form-field>
  <mat-label>Label</mat-label>
  <input matInput />
</mat-form-field>

<!-- Can still override per field if needed -->
<mat-form-field appearance="fill">
  <mat-label>Label</mat-label>
  <input matInput />
</mat-form-field>
```

**MDC Appearances:**
- `fill` - Filled style (default)
- `outline` - Outlined style (recommended)

#### Lists (Structure changes)
```html
<!-- BEFORE (Legacy) -->
<mat-list>
  <mat-list-item>Item 1</mat-list-item>
  <mat-list-item>Item 2</mat-list-item>
</mat-list>

<!-- AFTER (MDC - Navigation) -->
<mat-nav-list>
  <a mat-list-item href="#">Item 1</a>
  <a mat-list-item href="#">Item 2</a>
</mat-nav-list>

<!-- AFTER (MDC - Display with details) -->
<mat-list>
  <mat-list-item>
    <span matListItemTitle>Title</span>
    <span matListItemLine>Subtitle</span>
  </mat-list-item>
</mat-list>
```

#### Tables (No Changes)
```html
<!-- Same in Legacy and MDC -->
<table mat-table [dataSource]="dataSource">
  <ng-container matColumnDef="column">
    <th mat-header-cell *matHeaderCellDef>Header</th>
    <td mat-cell *matCellDef="let row">{{row.data}}</td>
  </ng-container>
  <tr mat-header-row *matHeaderRowDef="columns"></tr>
  <tr mat-row *matRowDef="let row; columns: columns;"></tr>
</table>
```

#### Select (No Changes)
```html
<!-- Same in Legacy and MDC -->
<mat-form-field>
  <mat-label>Select</mat-label>
  <mat-select formControlName="value">
    <mat-option value="1">Option 1</mat-option>
    <mat-option value="2">Option 2</mat-option>
  </mat-select>
</mat-form-field>
```

### CSS Class Changes

```scss
// Legacy classes (remove these)
.mat-legacy-button { }
.mat-legacy-raised-button { }
.mat-legacy-form-field { }
.mat-legacy-card { }
.mat-legacy-table { }

// MDC classes (use these)
.mat-mdc-button { }
.mat-mdc-raised-button { }
.mat-mdc-form-field { }
.mat-mdc-card { }
.mat-mdc-table { }
```

---

## Version Update Commands

### Update One Version at a Time

```bash
# Angular 16 → 17
ng update @angular/cli@17 @angular/core@17
ng update @angular/material@17
npm install && npm run build && npm start

# Angular 17 → 18
ng update @angular/cli@18 @angular/core@18
ng update @angular/material@18
npm install && npm run build && npm start

# Angular 18 → 19
ng update @angular/cli@19 @angular/core@19
ng update @angular/material@19
npm install && npm run build && npm start

# Angular 19 → 20
ng update @angular/cli@20 @angular/core@20
ng update @angular/material@20
npm install && npm run build && npm start
```

### If Update Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## Common Issues & Solutions

### Issue: "Cannot find module '@angular/material/legacy-*'"
**Solution:** You're on Angular 17+. Legacy modules were removed. Use MDC imports.

```typescript
// Change this:
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
// To this:
import { MatButtonModule } from '@angular/material/button';
```

### Issue: Flex Layout directives not working
**Solution:** Flex Layout is deprecated. Replace with CSS classes.

```html
<!-- Change this: -->
<div fxLayout="row" fxLayoutGap="16px">
<!-- To this: -->
<div class="flex-row gap-16">
```

### Issue: Form fields look different
**Solution:** Add appearance attribute to MDC form fields.

```html
<mat-form-field appearance="outline">
  <!-- form field content -->
</mat-form-field>
```

### Issue: List items not clickable
**Solution:** Use `mat-nav-list` with anchor tags for navigation.

```html
<mat-nav-list>
  <a mat-list-item routerLink="/path">Item</a>
</mat-nav-list>
```

### Issue: Build errors after version update
**Solution:** Clear cache and reinstall dependencies.

```bash
rm -rf node_modules package-lock.json .angular
npm install
ng build
```

### Issue: TypeScript errors after update
**Solution:** Update TypeScript to compatible version.

```bash
# For Angular 17-18
npm install --save-dev typescript@~5.2.0

# For Angular 19-20
npm install --save-dev typescript@~5.5.0
```

---

## Testing Checklist

### After Each Phase

- [ ] Application builds successfully (`npm run build`)
- [ ] Application runs without errors (`npm start`)
- [ ] No console errors in browser DevTools
- [ ] All pages render correctly
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Responsive layouts work on mobile
- [ ] Responsive layouts work on tablet
- [ ] Responsive layouts work on desktop

### Before Going to Production

- [ ] All automated tests pass
- [ ] Manual testing complete
- [ ] Cross-browser testing done (Chrome, Firefox, Safari, Edge)
- [ ] Performance is acceptable (Lighthouse score 90+)
- [ ] Bundle size is reasonable
- [ ] Accessibility tested
- [ ] Production build works (`npm run build`)
- [ ] Documentation updated

---

## Rollback Instructions

If something goes wrong:

```bash
# 1. Stop the server
# Press Ctrl+C

# 2. Revert git changes
git checkout main
git branch -D feature/angular-20-migration

# 3. Restore dependencies
npm ci

# 4. Rebuild and restart
npm run build
npm start
```

---

## File Modification Summary

### Files That Will Change

```
src/
├── app/
│   ├── app.component.html          ← Update Flex Layout directives
│   ├── app.module.ts                ← Update Material imports
│   ├── features/
│   │   ├── home/
│   │   │   └── home.component.html  ← Update Flex Layout + Material
│   │   └── users/
│   │       ├── user-form.component.html    ← Update Flex Layout + Material
│   │       ├── user-form.component.ts      ← Update Material imports
│   │       └── users-list.component.html   ← Update Flex Layout + Material
│   └── styles.scss                  ← Update Material theming
├── index.html                        ← No changes needed
├── angular.json                      ← May need build config updates
└── package.json                      ← Update all dependencies
```

### Files to Create

```
src/
└── styles/
    └── _layout.scss                  ← NEW: Layout utility classes
```

### Files to Delete After Migration

- None (all files remain, just updated)

---

## Emergency Contacts

If you get stuck:

- **Angular Discord**: https://discord.gg/angular
- **Stack Overflow**: Tag questions with `angular` and `angular-material`
- **GitHub Issues**:
  - Angular: https://github.com/angular/angular/issues
  - Material: https://github.com/angular/components/issues

---

## Final Pre-Migration Checklist

Before starting the migration:

- [ ] Full migration plan reviewed
- [ ] Current code committed to git
- [ ] Backup branch created
- [ ] Development environment ready
- [ ] Time allocated (19-26 hours)
- [ ] Team notified
- [ ] Screenshots taken of current UI
- [ ] package.json and package-lock.json backed up
- [ ] You understand the rollback procedure

**Ready to start?** Begin with Phase 1 in the [Full Migration Plan](./MIGRATION_PLAN.md).

---

*Quick Reference Version: 1.0*
*Last Updated: 2025-11-18*
