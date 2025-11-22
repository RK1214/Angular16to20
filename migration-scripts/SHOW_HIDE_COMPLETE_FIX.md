# Complete fxShow/fxHide Fix - All Inverse Cases

## Overview

Fixed the `convertShowHideGroup()` function to handle **ALL inverse cases**, including:
- ✅ Same-type combinations (fxShow + fxShow.xs)
- ✅ Mixed-type combinations (fxShow + fxHide.xs) ← **NEW!**

---

## All Supported Cases

### 1. Same-Type: fxShow + fxShow

| Input | Base | Breakpoint | Output Classes | Behavior |
|-------|------|------------|----------------|----------|
| `fxShow fxShow.xs` | show | show | `show show-xs` | Show everywhere (redundant) |
| `fxShow fxShow.xs="false"` | show | hide | `show hide-xs show-gt-xs` | ✅ **INVERSE** - Show except xs |
| `fxShow="false" fxShow.xs` | hide | show | `hide show-xs hide-gt-xs` | ✅ **INVERSE** - Show only on xs |
| `fxShow="false" fxShow.xs="false"` | hide | hide | `hide hide-xs` | Hide everywhere (redundant) |

### 2. Same-Type: fxHide + fxHide

| Input | Base | Breakpoint | Output Classes | Behavior |
|-------|------|------------|----------------|----------|
| `fxHide fxHide.xs` | hide | hide | `hide hide-xs` | Hide everywhere (redundant) |
| `fxHide fxHide.xs="false"` | hide | show | `hide show-xs hide-gt-xs` | ✅ **INVERSE** - Hide except xs |
| `fxHide="false" fxHide.xs` | show | hide | `show hide-xs show-gt-xs` | ✅ **INVERSE** - Hide only on xs |
| `fxHide="false" fxHide.xs="false"` | show | show | `show show-xs` | Show everywhere (redundant) |

### 3. Mixed-Type: fxShow + fxHide ← **NEW!**

| Input | Base | Breakpoint | Output Classes | Behavior |
|-------|------|------------|----------------|----------|
| `fxShow fxHide.xs` | show | hide | `show hide-xs show-gt-xs` | ✅ **INVERSE** - Show except xs |
| `fxShow fxHide.xs="false"` | show | show | `show show-xs` | Show everywhere (redundant) |
| `fxShow="false" fxHide.xs` | hide | hide | `hide hide-xs` | Hide everywhere (redundant) |
| `fxShow="false" fxHide.xs="false"` | hide | show | `hide show-xs hide-gt-xs` | ✅ **INVERSE** - Show only on xs |

### 4. Mixed-Type: fxHide + fxShow ← **NEW!**

| Input | Base | Breakpoint | Output Classes | Behavior |
|-------|------|------------|----------------|----------|
| `fxHide fxShow.xs` | hide | show | `hide show-xs hide-gt-xs` | ✅ **INVERSE** - Show only on xs |
| `fxHide fxShow.xs="false"` | hide | hide | `hide hide-xs` | Hide everywhere (redundant) |
| `fxHide="false" fxShow.xs` | show | show | `show show-xs` | Show everywhere (redundant) |
| `fxHide="false" fxShow.xs="false"` | show | hide | `show hide-xs show-gt-xs` | ✅ **INVERSE** - Hide only on xs |

---

## How the New Logic Works

### Old Approach (BROKEN)

The old code processed `fxShow` and `fxHide` directives **separately**:

```javascript
// Process fxShow directives
if (showDirectives.length > 0) {
  // Handle fxShow cases...
}

// Process fxHide directives separately
if (hideDirectives.length > 0) {
  // Handle fxHide cases...
}
```

**Problem:** Couldn't detect mixed combinations like `fxShow + fxHide.xs`

### New Approach (FIXED)

The new code determines **effective visibility** for both base and breakpoints:

```javascript
/**
 * Step 1: Determine base visibility
 */
const getEffectiveVisibility = (directiveName, value) => {
  const isShowDirective = directiveName.includes('Show');

  if (isTrue(value)) {
    return isShowDirective ? 'show' : 'hide';
  } else if (isFalse(value)) {
    // false inverts: fxShow="false" → hide, fxHide="false" → show
    return isShowDirective ? 'hide' : 'show';
  }
  return null;
};

// Example: fxShow → 'show', fxHide → 'hide'
//          fxShow="false" → 'hide', fxHide="false" → 'show'
const baseVisibility = getEffectiveVisibility('fxShow', true); // 'show'

/**
 * Step 2: Collect breakpoint visibilities
 */
const breakpointVisibilities = {
  xs: getEffectiveVisibility('fxHide', true), // 'hide'
  sm: getEffectiveVisibility('fxShow', true), // 'show'
};

/**
 * Step 3: Generate classes and detect inverse cases
 */
Object.entries(breakpointVisibilities).forEach(([bp, bpVisibility]) => {
  classes.push(`${bpVisibility}-${bp}`); // Always add breakpoint class

  // Check for inverse (base !== breakpoint)
  if (baseVisibility && bpVisibility !== baseVisibility) {
    // INVERSE! Add complement
    const complement = getComplementBreakpoint(bp); // xs → gt-xs
    classes.push(`${baseVisibility}-${complement}`);
  }
});
```

---

## Examples

### Example 1: fxHide + fxShow.xs (User's Case)

**Input:**
```html
<div fxHide fxShow.xs>Hide everywhere, show on xs only</div>
```

**Processing:**
```javascript
baseVisibility = getEffectiveVisibility('fxHide', true) // 'hide'
breakpointVisibilities = {
  xs: getEffectiveVisibility('fxShow', true) // 'show'
}

// Generate classes:
classes.push('hide')                    // base visibility
classes.push('show-xs')                 // breakpoint visibility

// Check inverse: 'hide' !== 'show' → INVERSE!
complement = getComplementBreakpoint('xs') // 'gt-xs'
classes.push('hide-gt-xs')              // complement class
```

**Output:**
```html
<div class="hide show-xs hide-gt-xs">Hide everywhere, show on xs only</div>
```

**CSS Behavior:**
- Base: `hide` → `display: none`
- On xs: `show-xs` → `display: flex` (overrides hide)
- On gt-xs: `hide-gt-xs` → `display: none` (ensures hidden on larger screens)

### Example 2: fxShow + fxHide.xs

**Input:**
```html
<div fxShow fxHide.xs>Show everywhere, hide on xs only</div>
```

**Processing:**
```javascript
baseVisibility = 'show'
breakpointVisibilities = { xs: 'hide' }

// Inverse: 'show' !== 'hide' → Add complement
classes = ['show', 'hide-xs', 'show-gt-xs']
```

**Output:**
```html
<div class="show hide-xs show-gt-xs">Show everywhere, hide on xs only</div>
```

### Example 3: fxShow="false" + fxHide.xs="false"

**Input:**
```html
<div fxShow="false" fxHide.xs="false">Complex inverse</div>
```

**Processing:**
```javascript
baseVisibility = getEffectiveVisibility('fxShow', false) // 'hide' (inverted!)
breakpointVisibilities = {
  xs: getEffectiveVisibility('fxHide', false) // 'show' (inverted!)
}

// Inverse detected
classes = ['hide', 'show-xs', 'hide-gt-xs']
```

**Output:**
```html
<div class="hide show-xs hide-gt-xs">Complex inverse</div>
```

### Example 4: Multiple Breakpoints

**Input:**
```html
<div fxHide fxShow.xs fxShow.sm>Hide except on xs and sm</div>
```

**Processing:**
```javascript
baseVisibility = 'hide'
breakpointVisibilities = {
  xs: 'show',  // Inverse!
  sm: 'show'   // Inverse!
}

// Generate classes for both breakpoints with complements
classes = [
  'hide',
  'show-xs', 'hide-gt-xs',  // xs inverse
  'show-sm', 'hide-gt-sm'   // sm inverse
]
```

**Output:**
```html
<div class="hide show-xs hide-gt-xs show-sm hide-gt-sm">Hide except on xs and sm</div>
```

---

## Test Results

### Test 1: Same-Type (Original)

```bash
node migration-scripts/test-show-hide.js
```

```
✅ 8/8 tests passing
```

### Test 2: Mixed-Type (New)

```bash
node migration-scripts/test-show-hide-mixed.js
```

```
✅ 9/9 tests passing

Including:
✅ fxHide + fxShow.xs → hide show-xs hide-gt-xs
✅ fxShow + fxHide.xs → show hide-xs show-gt-xs
✅ fxShow="false" + fxHide.xs="false" → hide show-xs hide-gt-xs
✅ fxHide="false" + fxShow.xs="false" → show hide-xs show-gt-xs
```

---

## Complete Matrix of All Combinations

### Legend
- ✅ = Inverse case (adds complement)
- ⚪ = Non-inverse (redundant but harmless)

| Base Directive | Breakpoint Directive | Result | Type |
|---------------|---------------------|--------|------|
| `fxShow` | `fxShow.xs` | `show show-xs` | ⚪ Redundant |
| `fxShow` | `fxShow.xs="false"` | `show hide-xs show-gt-xs` | ✅ Inverse |
| `fxShow` | `fxHide.xs` | `show hide-xs show-gt-xs` | ✅ Inverse (NEW!) |
| `fxShow` | `fxHide.xs="false"` | `show show-xs` | ⚪ Redundant |
| `fxShow="false"` | `fxShow.xs` | `hide show-xs hide-gt-xs` | ✅ Inverse |
| `fxShow="false"` | `fxShow.xs="false"` | `hide hide-xs` | ⚪ Redundant |
| `fxShow="false"` | `fxHide.xs` | `hide hide-xs` | ⚪ Redundant |
| `fxShow="false"` | `fxHide.xs="false"` | `hide show-xs hide-gt-xs` | ✅ Inverse (NEW!) |
| `fxHide` | `fxHide.xs` | `hide hide-xs` | ⚪ Redundant |
| `fxHide` | `fxHide.xs="false"` | `hide show-xs hide-gt-xs` | ✅ Inverse |
| `fxHide` | `fxShow.xs` | `hide show-xs hide-gt-xs` | ✅ Inverse (NEW!) |
| `fxHide` | `fxShow.xs="false"` | `hide hide-xs` | ⚪ Redundant |
| `fxHide="false"` | `fxHide.xs` | `show hide-xs show-gt-xs` | ✅ Inverse |
| `fxHide="false"` | `fxHide.xs="false"` | `show show-xs` | ⚪ Redundant |
| `fxHide="false"` | `fxShow.xs` | `show show-xs` | ⚪ Redundant |
| `fxHide="false"` | `fxShow.xs="false"` | `show hide-xs show-gt-xs` | ✅ Inverse (NEW!) |

**Total:** 16 combinations, 8 inverse cases (4 new!)

---

## Migration Impact

### Before Fix

```html
<!-- WRONG! Missing complement -->
<div fxHide fxShow.xs>Content</div>
<!-- Became: class="hide show-xs" ❌ Doesn't hide on gt-xs! -->
```

### After Fix

```html
<!-- CORRECT! With complement -->
<div fxHide fxShow.xs>Content</div>
<!-- Becomes: class="hide show-xs hide-gt-xs" ✅ Proper inverse logic! -->
```

---

## Summary

✅ **All 16 combinations** handled correctly

✅ **8 inverse cases** detected and fixed with complements

✅ **4 new mixed-type combinations** now work

✅ **Backward compatible** - all original tests still pass

✅ **Cleaner code** - single unified approach for all cases

The fxShow/fxHide migration is now **complete and production-ready**! 🎉
