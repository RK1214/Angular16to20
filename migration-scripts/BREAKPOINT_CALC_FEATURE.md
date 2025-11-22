# Breakpoint-Specific calc() Feature

## Problem Solved

Previously, `fxFlex.sm="calc(100% - 40px)"` would convert to a directive `[appFlex]="'calc(100% - 40px)'"` which applied the calc() expression to **ALL screen sizes**, not just the `sm` breakpoint.

Now it generates a **breakpoint-specific CSS class** that only applies on the specified breakpoint!

---

## ✅ Solution: Breakpoint-Specific CSS Classes with Media Queries

### Example 1: calc() with sm breakpoint

**Input:**
```html
<div fxFlex="100" fxFlex.sm="calc(100% - 40px)" fxLayout="row wrap"></div>
```

**Output HTML:**
```html
<div class="flex-row flex-wrap flex-100 flex-calc-sm-calc1004"></div>
```

**Generated SCSS:**
```scss
// Custom Classes (Dynamically Generated)
.flex-100 { flex: 0 0 100%; max-width: 100%; }

@media (min-width: 600px) and (max-width: 959px) {
  .flex-calc-sm-calc1004 { flex: 0 0 calc(100% - 40px); max-width: calc(100% - 40px); }
}
```

**Behavior:**
- On `xs` (< 600px): Uses `flex-100` → 100% width
- On `sm` (600-959px): Uses `flex-calc-sm-calc1004` → calc(100% - 40px)
- On `md+` (>= 960px): Uses `flex-100` → 100% width

---

### Example 2: Multiple breakpoint-specific calc()

**Input:**
```html
<div fxFlex="calc(33.33% - 15px)" fxFlex.xs="100" fxFlex.sm="calc(50% - 20px)"></div>
```

**Output HTML:**
```html
<div class="flex-100-xs flex-calc-sm-calc5020" [appFlex]="'calc(33.33% - 15px)'"></div>
```

**Generated SCSS:**
```scss
.flex-100-xs { ... }  // Standard responsive class

@media (min-width: 600px) and (max-width: 959px) {
  .flex-calc-sm-calc5020 { flex: 0 0 calc(50% - 20px); max-width: calc(50% - 20px); }
}
```

**Behavior:**
- On `xs` (< 600px): Uses `flex-100-xs` → 100% width
- On `sm` (600-959px): Uses `flex-calc-sm-calc5020` → calc(50% - 20px)
- On `md+` (>= 960px): Uses directive `[appFlex]` → calc(33.33% - 15px)

---

### Example 3: calc() without breakpoint (uses directive)

**Input:**
```html
<div fxFlex="calc(33.33% - 15px)"></div>
```

**Output HTML:**
```html
<div [appFlex]="'calc(33.33% - 15px)'"></div>
```

**No CSS generated** - uses directive for all screen sizes since no specific breakpoint was requested.

---

## How It Works

### 1. Detection
When the script encounters `fxFlex.{breakpoint}="calc(...)"`, it:
- Extracts the breakpoint (e.g., `sm`, `xs`, `gt-xs`)
- Extracts the calc() expression
- Generates a unique class name: `flex-calc-{breakpoint}-{hash}`

### 2. Class Name Generation
```javascript
const hash = valueStr.replace(/[^a-z0-9]/gi, '');  // Remove special chars
const className = `flex-calc-${breakpoint}-${hash.substring(0, 8)}`;
// Example: flex-calc-sm-calc1004
```

### 3. CSS Generation
The class is added to a custom classes collection with metadata:
```javascript
this.customClasses.add({
  name: 'flex-calc-sm-calc1004',
  type: 'flex-calc',
  value: 'calc(100% - 40px)',
  breakpoint: 'sm'
});
```

### 4. SCSS Output
During `generateLayoutScss()`, breakpoint-specific classes are wrapped in media queries:
```scss
@media (min-width: 600px) and (max-width: 959px) {
  .flex-calc-sm-calc1004 { flex: 0 0 calc(100% - 40px); max-width: calc(100% - 40px); }
}
```

---

## Supported Breakpoints

| Breakpoint | Media Query | Description |
|------------|-------------|-------------|
| `xs` | `@media (max-width: 599px)` | Extra small screens |
| `sm` | `@media (min-width: 600px) and (max-width: 959px)` | Small screens |
| `md` | `@media (min-width: 960px) and (max-width: 1279px)` | Medium screens |
| `lg` | `@media (min-width: 1280px) and (max-width: 1919px)` | Large screens |
| `xl` | `@media (min-width: 1920px)` | Extra large screens |
| `lt-sm` | `@media (max-width: 599px)` | Less than small |
| `lt-md` | `@media (max-width: 959px)` | Less than medium |
| `lt-lg` | `@media (max-width: 1279px)` | Less than large |
| `lt-xl` | `@media (max-width: 1919px)` | Less than XL |
| `gt-xs` | `@media (min-width: 600px)` | Greater than XS |
| `gt-sm` | `@media (min-width: 960px)` | Greater than small |
| `gt-md` | `@media (min-width: 1280px)` | Greater than medium |
| `gt-lg` | `@media (min-width: 1920px)` | Greater than large |

---

## Benefits

✅ **Truly Responsive** - calc() applies only on the specified breakpoint
✅ **No Directives Needed** - Pure CSS solution, better performance
✅ **Automatic Generation** - CSS classes generated automatically in _layout.scss
✅ **Unique Class Names** - Hash-based naming prevents collisions
✅ **Clean HTML** - No complex directive syntax in templates

---

## Migration Behavior Summary

| Input | Output | SCSS Generated |
|-------|--------|----------------|
| `fxFlex="100"` | `class="flex-100"` | Standard class (already in template) |
| `fxFlex.sm="100"` | `class="flex-100-sm"` | Standard responsive class |
| `fxFlex="calc(...)"` | `[appFlex]="'calc(...)'"` | None (uses directive) |
| `fxFlex.sm="calc(...)"` | `class="flex-calc-sm-xxx"` | **Media query wrapped class** |
| `fxFlex="299px"` | `class="flex-299px"` | Custom fixed-width class |

---

## Testing

Run the test to verify breakpoint-specific calc() behavior:

```bash
node migration-scripts/test-breakpoint-calc.js
```

Expected output:
```
✅ Test 1: Correctly generates breakpoint-specific calc class
✅ Test 2: Correctly uses directive for calc without breakpoint
✅ Test 3: Has both directive (base) and calc class (sm)
```

---

## Complete Example

**Angular Template Before:**
```html
<div class="content-wrapper home"
     fxFlex="100"
     fxFlex.sm="calc(100% - 40px)"
     fxFlex.md="calc(100% - 60px)"
     fxLayout="row wrap"
     fxLayoutGap.gt-xs="24px">
</div>
```

**After Migration:**
```html
<div class="content-wrapper home flex-row flex-wrap gap-24-gt-xs flex-100 flex-calc-sm-calc1004 flex-calc-md-calc1006">
</div>
```

**Generated _layout.scss:**
```scss
// Custom Classes (Dynamically Generated)
@media (min-width: 600px) and (max-width: 959px) {
  .flex-calc-sm-calc1004 { flex: 0 0 calc(100% - 40px); max-width: calc(100% - 40px); }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .flex-calc-md-calc1006 { flex: 0 0 calc(100% - 60px); max-width: calc(100% - 60px); }
}
```

**Result:**
- Mobile (xs): 100% width
- Tablet (sm): calc(100% - 40px)
- Desktop (md): calc(100% - 60px)
- Large+ (lg/xl): 100% width

Perfect responsive behavior without any directives! 🎉
