# Migration Fixes Summary

All 6 cases from `issues_new.txt` have been successfully fixed!

## ✅ Case 1 & 3: Template Expression in Class with Static fxFlex

**Before:**
```html
<div fxFlex="30px" class="{{content.sub_content.length === 0 ? 'accordion-caret-hide' : 'accordion-caret'}}"></div>
```

**After:**
```html
<div class="{{content.sub_content.length === 0 ? 'accordion-caret-hide' : 'accordion-caret'}} flex-30px"></div>
```

**What was fixed:**
- Template expressions in class attributes are now preserved correctly
- Static fxFlex values are converted to CSS classes and appended to existing classes

---

## ✅ Case 2: Multiple Directives with Dynamic fxFlex and Responsive

**Before:**
```html
<div *ngIf="isShowMore" class="flex-container header-content" fxLayout="row wrap" [fxFlex]="reverseWidth" fxFlex.xs>
```

**After:**
```html
<div class="flex-container header-content flex-row flex-wrap flex-1-xs" [appFlex]="reverseWidth" *ngIf="isShowMore">
```

**What was fixed:**
- Dynamic property bindings `[fxFlex]="variable"` now convert to `[appFlex]="variable"`
- Static fxLayout values convert to CSS classes (flex-row flex-wrap)
- Responsive fxFlex directives convert to responsive CSS classes (flex-1-xs)
- Existing classes are preserved and merged correctly

---

## ✅ Case 4: Template Expression with Dynamic fxLayout

**Before:**
```html
<div class="flex-container {{isSmall ? 'green-small' : 'green'}}" id="{{itemID}}" fxLayout="{{isVertical ? 'column' : 'row wrap'}}">
```

**After:**
```html
<div class="flex-container {{isSmall ? 'green-small' : 'green'}}" [appLayout]="isVertical ? 'column' : 'row wrap'" id="{{itemID}}">
```

**What was fixed:**
- Template string interpolations in directives (e.g., `fxLayout="{{expr}}"`) now convert to property bindings `[appLayout]="expr"`
- Template expressions in class attributes are preserved
- No CSS classes are added for dynamic layout values

---

## ✅ Case 5 & 6: Complex Template Expression in Class with fxFlex Percentage

**Before:**
```html
<div id="{{itemID}}" *ngIf="isVisible" class="flex-item {{ (error_required && isRequired) || error_invalid ? 'field-has-error' : '' }}" fxFlex="100%">
```

**After:**
```html
<div class="flex-item {{ (error_required && isRequired) || error_invalid ? 'field-has-error' : '' }} flex-100" id="{{itemID}}" *ngIf="isVisible">
```

**What was fixed:**
- Complex template expressions with operators (&& || ?) in class attributes are now preserved correctly
- Static fxFlex percentage values convert to CSS classes (flex-100)
- Existing classes with template expressions are not corrupted

---

## Technical Improvements Made

### 1. Enhanced Class Attribute Regex
```javascript
// Old (broken):
const classRegex = /class="([^"]*)"/;

// New (working):
const classRegex = /class="([^"]*(?:\{\{(?:[^}]|\}(?!\}))*\}\}[^"]*)*)"/;
```

This regex properly handles nested `{{}}` template expressions within class attributes.

### 2. Pattern Matching Order
```javascript
const patterns = [
  // 1. Template string bindings (MUST come first)
  { regex: /fxLayout="\{\{([^}]+)\}\}"/g, name: 'fxLayout', templateString: true },

  // 2. Dynamic property bindings
  { regex: /\[fxLayout\]="([^"]*)"/g, name: 'fxLayout', dynamic: true },

  // 3. Static directives (with negative lookahead to exclude {{...}})
  { regex: /fxLayout="((?:(?!\{\{)[^"])*)"/g, name: 'fxLayout' },

  // 4. Standalone directives (with word boundary)
  { regex: /\sfxFlex(?![\[\.\="a-zA-Z])/g, name: 'fxFlex', standalone: true },
];
```

Order matters! Template strings must be checked before static patterns.

### 3. Static Directive Negative Lookahead
```javascript
// Prevents matching template strings like fxLayout="{{expr}}"
/fxLayout="((?:(?!\{\{)[^"])*)"/g
```

The `(?:(?!\{\{)[^"])*` pattern ensures static directive patterns don't match template strings.

### 4. Standalone Pattern Word Boundaries
```javascript
// Old (broken):
/fxFlex\.([a-z\-]+)(?!\s*=)/g

// New (working):
/\sfxFlex\.([a-z\-]+)(?!\s*=)/g
```

Adding `\s` at the start prevents matching inside `[fxFlex]` brackets.

### 5. Proper isDynamic Handling
All conversion functions now check for `isDynamic` or `isTemplateString` flags and convert to directives instead of CSS classes when appropriate.

---

## Running the Migration

```bash
cd migration-scripts
node migrate-flex-to-css.js ../src
```

No backups are created, no automatic commits are made. Review all changes before committing.
