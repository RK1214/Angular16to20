# Custom Gap Value Generation

The migration script now automatically generates CSS classes for custom gap values that aren't in the standard set!

## Standard Gap Values (Built-in)

These are already included in the `_layout.scss` template:
```scss
.gap-4 { gap: 4px; }
.gap-5 { gap: 5px; }
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }
.gap-20 { gap: 20px; }
.gap-24 { gap: 24px; }
.gap-32 { gap: 32px; }
.gap-48 { gap: 48px; }
```

## ✅ Custom Gap Values (Auto-Generated)

When you use a gap value that's **not** in the standard set, it's automatically added to the custom classes section!

### Example 1: Custom Gap (10px)

**Input:**
```html
<div fxLayout="row" fxLayoutGap="10px"></div>
```

**Output:**
```html
<div class="flex-row gap-10"></div>
```

**Generated SCSS:**
```scss
// Custom Classes (Dynamically Generated)
.gap-10 { gap: 10px; }
```

### Example 2: Custom Gap (15px)

**Input:**
```html
<div fxLayout="row" fxLayoutGap="15px"></div>
```

**Output:**
```html
<div class="flex-row gap-15"></div>
```

**Generated SCSS:**
```scss
.gap-15 { gap: 15px; }
```

### Example 3: Standard Gap (24px) - NOT Generated

**Input:**
```html
<div fxLayout="row" fxLayoutGap="24px"></div>
```

**Output:**
```html
<div class="flex-row gap-24"></div>
```

**SCSS:**
No custom class generated (`.gap-24` already exists in template)

---

## ✅ Breakpoint-Specific Gap Values

Breakpoint-specific gaps are **always** generated as custom classes with media queries!

### Example 4: Gap on gt-xs Breakpoint

**Input:**
```html
<div fxLayout="row" fxLayoutGap.gt-xs="30px"></div>
```

**Output:**
```html
<div class="flex-row gap-30-gt-xs"></div>
```

**Generated SCSS:**
```scss
@media (min-width: 600px) {
  .gap-30-gt-xs { gap: 30px; }
}
```

### Example 5: Gap on sm Breakpoint

**Input:**
```html
<div fxLayout="row" fxLayoutGap.sm="18px"></div>
```

**Output:**
```html
<div class="flex-row gap-18-sm"></div>
```

**Generated SCSS:**
```scss
@media (min-width: 600px) and (max-width: 959px) {
  .gap-18-sm { gap: 18px; }
}
```

---

## How It Works

### 1. Detection
The `convertGap()` function checks if the gap value is custom:

```javascript
const standardGaps = ['4', '5', '8', '12', '16', '20', '24', '32', '48'];
if (!breakpoint && !standardGaps.includes(gapValue)) {
  // Custom gap - add to custom classes
  this.customClasses.add({
    name: `gap-${gapValue}`,
    type: 'gap',
    value: `${gapValue}px`,
    breakpoint: null
  });
}
```

### 2. Breakpoint Handling
All breakpoint-specific gaps are tracked as custom:

```javascript
if (breakpoint) {
  this.customClasses.add({
    name: `gap-${gapValue}-${breakpoint}`,
    type: 'gap-breakpoint',
    value: `${gapValue}px`,
    breakpoint: breakpoint
  });
}
```

### 3. SCSS Generation
During `generateLayoutScss()`, custom gaps are added:

```javascript
if (type === 'gap') {
  finalScss += `.${name} { gap: ${value}; }\n`;
} else if (type === 'gap-breakpoint') {
  const mediaQuery = mediaQueries[breakpoint];
  finalScss += `${mediaQuery} {\n`;
  finalScss += `  .${name} { gap: ${value}; }\n`;
  finalScss += `}\n`;
}
```

---

## Complete Example

**HTML Template:**
```html
<div fxLayout="row" fxLayoutGap="10px"></div>
<div fxLayout="row" fxLayoutGap="15px"></div>
<div fxLayout="row" fxLayoutGap="24px"></div>
<div fxLayout="row" fxLayoutGap.sm="18px"></div>
<div fxLayout="row" fxLayoutGap.gt-xs="30px"></div>
```

**After Migration:**
```html
<div class="flex-row gap-10"></div>
<div class="flex-row gap-15"></div>
<div class="flex-row gap-24"></div>
<div class="flex-row gap-18-sm"></div>
<div class="flex-row gap-30-gt-xs"></div>
```

**Generated _layout.scss (Custom Classes Section):**
```scss
// Custom Classes (Dynamically Generated)
// ===================================

// Custom gap values
.gap-10 { gap: 10px; }
.gap-15 { gap: 15px; }

// Breakpoint-specific gaps
@media (min-width: 600px) and (max-width: 959px) {
  .gap-18-sm { gap: 18px; }
}

@media (min-width: 600px) {
  .gap-30-gt-xs { gap: 30px; }
}
```

---

## Benefits

✅ **No Manual CSS** - Custom gap values generated automatically
✅ **No Missing Classes** - All gaps used in your app will have corresponding CSS
✅ **Breakpoint Support** - Responsive gaps work correctly with media queries
✅ **Clean SCSS** - Organized in custom classes section
✅ **Standard Values Skipped** - Only generates what's needed (no duplicates)

---

## Summary

| Input | Output Class | Generated CSS |
|-------|--------------|---------------|
| `fxLayoutGap="24px"` | `gap-24` | ❌ No (standard) |
| `fxLayoutGap="10px"` | `gap-10` | ✅ `.gap-10 { gap: 10px; }` |
| `fxLayoutGap="15px"` | `gap-15` | ✅ `.gap-15 { gap: 15px; }` |
| `fxLayoutGap.sm="18px"` | `gap-18-sm` | ✅ With `@media (sm)` |
| `fxLayoutGap.gt-xs="30px"` | `gap-30-gt-xs` | ✅ With `@media (gt-xs)` |

Your migration script now handles all gap values automatically! 🎉
