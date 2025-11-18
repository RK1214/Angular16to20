# Angular 20 Migration - Progress Checklist

Use this checklist to track your progress through the migration.

**Started:** _______________
**Completed:** _______________
**Team Member:** _______________

---

## PHASE 1: Preparation & Setup (2-3 hours)

### Setup
- [ ] Create migration branch: `feature/angular-20-migration`
- [ ] Commit current code state
- [ ] Take screenshots of all pages (Home, Users List, User Form)
- [ ] Document current functionality
- [ ] Backup `package.json` and `package-lock.json`
- [ ] Install Angular CLI 20 globally (optional)

### Documentation
- [ ] Review full migration plan
- [ ] Review quick reference guide
- [ ] Understand rollback procedure
- [ ] Note current Angular version: 16.2.0
- [ ] Note current Material version: 16.2.0

**Phase 1 Commit:**
```bash
git add .
git commit -m "Phase 1: Preparation complete - ready for Flex Layout migration"
```

---

## PHASE 2: Migrate Angular Flex Layout (3-4 hours)

### Create Layout Utilities
- [ ] Create `src/styles/_layout.scss` file
- [ ] Add flex row/column utilities
- [ ] Add alignment utilities
- [ ] Add gap utilities
- [ ] Add flex sizing utilities
- [ ] Add responsive utilities
- [ ] Import layout utilities in `src/styles.scss`

### Update Templates
- [ ] Update `src/app/app.component.html`
  - [ ] Replace `fxLayout` directives
  - [ ] Replace `fxLayoutAlign` directives
  - [ ] Replace `fxLayoutGap` directives
  - [ ] Replace `fxFlex` directives
  - [ ] Replace responsive directives (`fxShow.xs`, etc.)
  - [ ] Test toolbar layout
  - [ ] Test navigation buttons

- [ ] Update `src/app/features/home/home.component.html`
  - [ ] Replace layout directives
  - [ ] Replace alignment directives
  - [ ] Replace responsive directives
  - [ ] Test card layouts
  - [ ] Test responsive breakpoints

- [ ] Update `src/app/features/users/user-form.component.html`
  - [ ] Replace layout directives
  - [ ] Replace alignment directives
  - [ ] Replace flex sizing
  - [ ] Test form layout
  - [ ] Test responsive form layout

- [ ] Update `src/app/features/users/users-list.component.html`
  - [ ] Replace layout directives
  - [ ] Replace alignment directives
  - [ ] Replace responsive directives
  - [ ] Test table layout
  - [ ] Test card list layout (mobile)
  - [ ] Test responsive switching

### Remove Flex Layout
- [ ] Remove `@angular/flex-layout` from `package.json` dependencies
- [ ] Remove `FlexLayoutModule` import from `app.module.ts`
- [ ] Remove `FlexLayoutModule` from imports array
- [ ] Run `npm install` to update dependencies

### Testing
- [ ] Build application: `npm run build`
- [ ] Start application: `npm start`
- [ ] Test on mobile (375px, 414px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1280px, 1920px)
- [ ] Verify no layout issues
- [ ] Verify responsive behavior

**Phase 2 Commit:**
```bash
git add .
git commit -m "Phase 2: Flex Layout migration complete - replaced with CSS"
```

---

## PHASE 3: Migrate Material Legacy to MDC (4-5 hours)

### Update Module Imports
- [ ] Update `src/app/app.module.ts`
  - [ ] Replace `MatLegacyButtonModule` → `MatButtonModule`
  - [ ] Replace `MatLegacyCardModule` → `MatCardModule`
  - [ ] Replace `MatLegacyFormFieldModule` → `MatFormFieldModule`
  - [ ] Replace `MatLegacyInputModule` → `MatInputModule`
  - [ ] Replace `MatLegacyTableModule` → `MatTableModule`
  - [ ] Replace `MatLegacyListModule` → `MatListModule`
  - [ ] Replace `MatLegacySelectModule` → `MatSelectModule`
  - [ ] Replace `MatLegacySnackBarModule` → `MatSnackBarModule`
  - [ ] Replace `MatLegacyTooltipModule` → `MatTooltipModule`

### Update Component Imports
- [ ] Update `src/app/features/users/users-list.component.ts`
  - [ ] Replace `MatLegacySnackBar` → `MatSnackBar` import

### Update Templates for MDC
- [ ] Update `src/app/features/home/home.component.html`
  - [ ] Verify buttons work
  - [ ] Verify cards work
  - [ ] Update list structure if needed

- [ ] Update `src/app/features/users/user-form.component.html`
  - [ ] Add `appearance="outline"` to form fields
  - [ ] Verify form field labels
  - [ ] Verify input fields
  - [ ] Verify buttons work
  - [ ] Test form validation

- [ ] Update `src/app/features/users/users-list.component.html`
  - [ ] Verify table works
  - [ ] Verify buttons work
  - [ ] Update list structure for cards if needed
  - [ ] Test responsive card layout

### Update Styles
- [ ] Update `src/styles.scss`
  - [ ] Remove `@include mat.all-legacy-component-themes($theme)`
  - [ ] Keep only `@include mat.all-component-themes($theme)`
  - [ ] Remove `.mat-legacy-*` custom styles
  - [ ] Add `.mat-mdc-*` custom styles
  - [ ] Update toolbar styles
  - [ ] Update button styles
  - [ ] Update table styles

### Testing
- [ ] Build application: `npm run build`
- [ ] Start application: `npm start`
- [ ] Test all buttons (flat, raised, icon)
- [ ] Test all cards
- [ ] Test all form fields
- [ ] Test table display
- [ ] Test lists
- [ ] Test select dropdowns
- [ ] Test tooltips
- [ ] Test snackbar notifications
- [ ] Verify no console errors

**Phase 3 Commit:**
```bash
git add .
git commit -m "Phase 3: Material MDC migration complete"
```

---

## PHASE 4: Incremental Angular Version Updates (6-8 hours)

### Angular 16 → 17

#### Update Commands
- [ ] Run: `ng update @angular/cli@17 @angular/core@17`
- [ ] Run: `ng update @angular/material@17`
- [ ] Run: `npm install`
- [ ] Review migration warnings/errors
- [ ] Fix any breaking changes

#### Update Dependencies
- [ ] Update TypeScript to ~5.2.0 if needed
- [ ] Update `@angular/compiler-cli@17`
- [ ] Update `@angular-devkit/build-angular@17`
- [ ] Update all `@angular/*` packages to 17

#### Testing
- [ ] Build: `npm run build`
- [ ] Start: `npm start`
- [ ] Test home page
- [ ] Test users list page
- [ ] Test user form page
- [ ] Test create user flow
- [ ] Test edit user flow
- [ ] Test delete user flow
- [ ] Verify no console errors

**Angular 17 Commit:**
```bash
git add .
git commit -m "Phase 4.1: Updated to Angular 17"
```

### Angular 17 → 18

#### Update Commands
- [ ] Run: `ng update @angular/cli@18 @angular/core@18`
- [ ] Run: `ng update @angular/material@18`
- [ ] Run: `npm install`
- [ ] Review migration warnings/errors
- [ ] Fix any breaking changes

#### Testing
- [ ] Build: `npm run build`
- [ ] Start: `npm start`
- [ ] Test all functionality
- [ ] Verify no console errors

**Angular 18 Commit:**
```bash
git add .
git commit -m "Phase 4.2: Updated to Angular 18"
```

### Angular 18 → 19

#### Update Commands
- [ ] Run: `ng update @angular/cli@19 @angular/core@19`
- [ ] Run: `ng update @angular/material@19`
- [ ] Run: `npm install`
- [ ] Review migration warnings/errors
- [ ] Fix any breaking changes

#### Testing
- [ ] Build: `npm run build`
- [ ] Start: `npm start`
- [ ] Test all functionality
- [ ] Verify no console errors

**Angular 19 Commit:**
```bash
git add .
git commit -m "Phase 4.3: Updated to Angular 19"
```

### Angular 19 → 20

#### Update Commands
- [ ] Run: `ng update @angular/cli@20 @angular/core@20`
- [ ] Run: `ng update @angular/material@20`
- [ ] Run: `npm install`
- [ ] Review migration warnings/errors
- [ ] Fix any breaking changes

#### Update Other Dependencies
- [ ] Update TypeScript to latest compatible version
- [ ] Update RxJS if needed
- [ ] Update zone.js if needed
- [ ] Review `package.json` for other outdated packages

#### Testing
- [ ] Build: `npm run build`
- [ ] Start: `npm start`
- [ ] Test all functionality
- [ ] Verify no console errors

**Angular 20 Commit:**
```bash
git add .
git commit -m "Phase 4.4: Updated to Angular 20 - migration complete!"
```

---

## PHASE 5: Testing & Validation (3-4 hours)

### Build Testing
- [ ] Production build: `npm run build`
- [ ] Verify no build errors
- [ ] Verify no build warnings (or document acceptable warnings)
- [ ] Check bundle sizes (should be similar or smaller)

### Functional Testing

#### Home Page
- [ ] Page loads without errors
- [ ] Layout renders correctly
- [ ] Welcome card displays
- [ ] Quick links card displays (desktop)
- [ ] Quick links card hidden on mobile
- [ ] Navigation links work

#### Users List Page
- [ ] Page loads without errors
- [ ] Table displays users (desktop)
- [ ] Card list displays users (mobile)
- [ ] "Create user" button visible
- [ ] "Create user" button works
- [ ] Edit button works for each user
- [ ] Delete button works
- [ ] Snackbar appears after delete
- [ ] Table refreshes after delete
- [ ] Responsive switching works

#### User Form Page (Create)
- [ ] Page loads without errors
- [ ] Form displays correctly
- [ ] Form fields render properly
- [ ] Name field validation works
- [ ] Email field validation works
- [ ] Role field works
- [ ] Save button works
- [ ] Cancel button works
- [ ] Success message appears
- [ ] Redirects to users list

#### User Form Page (Edit)
- [ ] Page loads with user data
- [ ] Form pre-filled correctly
- [ ] Can modify fields
- [ ] Save updates user
- [ ] Cancel returns to list

### Cross-Browser Testing
- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)

### Responsive Testing
- [ ] Mobile portrait (375px)
- [ ] Mobile landscape (667px)
- [ ] Tablet portrait (768px)
- [ ] Tablet landscape (1024px)
- [ ] Desktop small (1280px)
- [ ] Desktop large (1920px)

### Performance Testing
- [ ] Run Lighthouse audit
- [ ] Performance score: _____ (target: 90+)
- [ ] Accessibility score: _____ (target: 90+)
- [ ] Best practices score: _____ (target: 90+)
- [ ] SEO score: _____ (target: 90+)
- [ ] Bundle size acceptable
- [ ] Initial load time acceptable

### Console Checks
- [ ] No console errors
- [ ] No console warnings (or documented)
- [ ] No network errors
- [ ] No 404 errors

---

## PHASE 6: Cleanup & Documentation (1-2 hours)

### Code Cleanup
- [ ] Remove all commented-out code
- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Remove debug console.logs
- [ ] Format code consistently

### Documentation
- [ ] Update `README.md` with:
  - [ ] Current Angular version (20.x)
  - [ ] Current Material version (20.x)
  - [ ] Current TypeScript version
  - [ ] Updated setup instructions
  - [ ] Updated build instructions
- [ ] Mark this checklist as complete
- [ ] Update `MIGRATION_PLAN.md` status to "Completed"

### Final Review
- [ ] Code review completed
- [ ] All tests passing
- [ ] No known issues
- [ ] Performance acceptable
- [ ] Ready for deployment

### Git Finalization
```bash
# Final commit
git add .
git commit -m "Phase 6: Cleanup and documentation complete - Angular 20 migration finalized"

# Merge to main (or create PR)
git checkout main
git merge feature/angular-20-migration
git push origin main

# Tag the release
git tag -a v20.0.0 -m "Angular 20 migration complete"
git push origin v20.0.0
```

- [ ] Final commit made
- [ ] Merged to main branch
- [ ] Tagged release
- [ ] Pushed to remote

---

## Post-Migration Tasks

### Deployment
- [ ] Deploy to staging environment
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Verify production metrics

### Team Communication
- [ ] Notify team of completion
- [ ] Share migration learnings
- [ ] Update team documentation
- [ ] Conduct knowledge transfer if needed

### Future Enhancements (Optional)
- [ ] Convert to standalone components
- [ ] Adopt new control flow syntax (`@if`, `@for`)
- [ ] Implement signals where appropriate
- [ ] Optimize bundle size further
- [ ] Implement lazy loading
- [ ] Enhance accessibility

---

## Troubleshooting Log

Use this section to document any issues encountered and their solutions:

### Issue 1
**Date:** _______________
**Phase:** _______________
**Description:**

**Solution:**

---

### Issue 2
**Date:** _______________
**Phase:** _______________
**Description:**

**Solution:**

---

### Issue 3
**Date:** _______________
**Phase:** _______________
**Description:**

**Solution:**

---

## Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Phase 1: Preparation | 2-3 hours | _____ | |
| Phase 2: Flex Layout | 3-4 hours | _____ | |
| Phase 3: Material MDC | 4-5 hours | _____ | |
| Phase 4: Version Updates | 6-8 hours | _____ | |
| Phase 5: Testing | 3-4 hours | _____ | |
| Phase 6: Cleanup | 1-2 hours | _____ | |
| **Total** | **19-26 hours** | **_____** | |

---

## Sign-off

### Developer
**Name:** _______________
**Date:** _______________
**Signature:** _______________

### Reviewer
**Name:** _______________
**Date:** _______________
**Signature:** _______________

### Product Owner (if applicable)
**Name:** _______________
**Date:** _______________
**Signature:** _______________

---

## Migration Status

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Completed
**Success:** ⬜ Yes | ⬜ No | ⬜ Partial
**Production Deployed:** ⬜ Yes | ⬜ No
**Date Completed:** _______________

---

*Checklist Version: 1.0*
*Last Updated: 2025-11-18*
