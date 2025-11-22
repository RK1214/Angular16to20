# fxLayout Direction + Wrap Fix

## Issue

`fxLayout="column nowrap"` was being converted to `flex-row` instead of `flex-column flex-nowrap`.

## Root Cause

The `convertLayout()` function used a static map that only included specific hardcoded combinations:
- 'row': 'flex-row'
- 'column': 'flex-column'
- 'row wrap': 'flex-row flex-wrap'
- 'column wrap': 'flex-column flex-wrap'

When it encountered `"column nowrap"`, it didn't match any key in the map, so it defaulted to `'flex-row'`.

## Example of the Problem

**Before Fix:**
```html
<div class="test" fxFlex="100" fxLayout="column nowrap" fxLayoutGap="24px">
<!-- Became: -->
<div class="test flex-row gap-24 flex-100">
```

❌ **Issues:**
1. Lost the `column` direction → became `flex-row`
2. Lost the `nowrap` wrap value → no `flex-nowrap` class

## Solution

Rewrote `convertLayout()` to **dynamically parse** direction and wrap values:

```javascript
convertLayout(value, breakpoint = null) {
  const classes = [];
  const normalizedValue = value.trim();

  // Parse direction and wrap from the value
  const parts = normalizedValue.split(/\s+/);

  let direction = 'row'; // default
  let wrapValue = null;

  // First part is the direction
  if (parts[0]) {
    const directionPart = parts[0].toLowerCase();
    if (['row', 'column', 'row-reverse', 'column-reverse'].includes(directionPart)) {
      direction = directionPart;
    }
  }

  // Second part (if exists) is the wrap value
  if (parts[1]) {
    const wrapPart = parts[1].toLowerCase();
    if (['wrap', 'nowrap', 'wrap-reverse'].includes(wrapPart)) {
      wrapValue = wrapPart;
    }
  }

  // Generate direction class
  const directionClassMap = {
    'row': 'flex-row',
    'column': 'flex-column',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-column-reverse'
  };

  const directionClass = directionClassMap[direction] || 'flex-row';

  // Add direction class
  if (breakpoint) {
    // ... breakpoint logic
  } else {
    classes.push(directionClass);
  }

  // Add wrap class if specified
  if (wrapValue) {
    const wrapClassMap = {
      'wrap': 'flex-wrap',
      'nowrap': 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse'
    };

    const wrapClass = wrapClassMap[wrapValue];
    if (wrapClass) {
      const suffix = breakpoint ? `-${breakpoint}` : '';
      classes.push(wrapClass + suffix);
    }
  }

  return classes;
}
```

## After Fix

**After Fix:**
```html
<div class="test" fxFlex="100" fxLayout="column nowrap" fxLayoutGap="24px">
<!-- Becomes: -->
<div class="test flex-column flex-nowrap gap-24 flex-100">
```

✅ **Correct:**
1. Direction: `flex-column` ✓
2. Wrap: `flex-nowrap` ✓
3. Gap: `gap-24` ✓
4. Flex: `flex-100` ✓

## All Supported Combinations

| Input | Output Classes |
|-------|----------------|
| `fxLayout="row"` | `flex-row` |
| `fxLayout="column"` | `flex-column` |
| `fxLayout="row-reverse"` | `flex-row-reverse` |
| `fxLayout="column-reverse"` | `flex-column-reverse` |
| `fxLayout="row wrap"` | `flex-row flex-wrap` |
| `fxLayout="row nowrap"` | `flex-row flex-nowrap` |
| `fxLayout="row wrap-reverse"` | `flex-row flex-wrap-reverse` |
| `fxLayout="column wrap"` | `flex-column flex-wrap` |
| `fxLayout="column nowrap"` | `flex-column flex-nowrap` ✅ |
| `fxLayout="column wrap-reverse"` | `flex-column flex-wrap-reverse` |
| `fxLayout="row-reverse wrap"` | `flex-row-reverse flex-wrap` |
| `fxLayout="column-reverse nowrap"` | `flex-column-reverse flex-nowrap` |

## CSS Classes Added

Added to SCSS template (line 875):

```scss
.flex-wrap-reverse { flex-wrap: wrap-reverse; }
```

Other wrap classes were already present:
```scss
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
```

## Test Results

Created **test-layout-direction-wrap.js** with 13 test cases:

```bash
node migration-scripts/test-layout-direction-wrap.js
```

**Results: 13/13 PASS ✅**

```
✅ fxLayout="row" (basic row)
✅ fxLayout="column" (basic column)
✅ fxLayout="column nowrap" (user's issue) ← FIXED!
✅ fxLayout="row wrap"
✅ fxLayout="column wrap"
✅ fxLayout="row nowrap"
✅ fxLayout="row-reverse"
✅ fxLayout="column-reverse"
✅ fxLayout="row-reverse wrap"
✅ fxLayout="column-reverse nowrap"
✅ fxLayout="row wrap-reverse"
✅ fxLayout="column wrap-reverse"
✅ fxLayout="COLUMN NOWRAP" (uppercase)
```

## Files Modified

### migrate-flex-to-css.js

**Lines 137-205** - `convertLayout()` function completely rewritten:
- Dynamic parsing of direction and wrap values
- Supports all combinations
- Case-insensitive
- Handles breakpoints

**Line 875** - Added CSS class to SCSS template:
```scss
.flex-wrap-reverse { flex-wrap: wrap-reverse; }
```

## Impact

- ✅ **All direction values work**: row, column, row-reverse, column-reverse
- ✅ **All wrap values work**: wrap, nowrap, wrap-reverse
- ✅ **All combinations work**: Any direction + any wrap
- ✅ **Case-insensitive**: "COLUMN NOWRAP" works
- ✅ **Backward compatible**: All previous conversions still work

## Migration Instructions

After copying the updated script to your repository:

```bash
node migration-scripts/migrate-flex-to-css.js
```

Your HTML will now correctly convert:
```html
<!-- Before migration -->
<div fxLayout="column nowrap">Content</div>

<!-- After migration -->
<div class="flex-column flex-nowrap">Content</div>
```

The generated CSS in `_layout.scss` will include:
```scss
.flex-column { display: flex; flex-direction: column; }
.flex-nowrap { flex-wrap: nowrap; }
.flex-wrap-reverse { flex-wrap: wrap-reverse; }
```

## Summary

✅ **Issue Fixed**: `fxLayout="column nowrap"` now converts correctly
✅ **13/13 Tests Passing**: All direction + wrap combinations work
✅ **Backward Compatible**: Previous conversions still work
✅ **Future-Proof**: Dynamic parsing handles any valid combination
