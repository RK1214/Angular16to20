# Flex: 1 1 Update

All flex classes now use `flex: 1 1 <value>` instead of `flex: 0 0 <value>` to match Angular Flex Layout behavior.

## What Changed

### ❌ Before (flex: 0 0)
```scss
.flex-20px { flex: 0 0 20px; max-width: 20px; }
.flex-50 { flex: 0 0 50%; max-width: 50%; }
.flex-calc-sm-calc10040px { flex: 0 0 calc(100% - 40px); max-width: calc(100% - 40px); }
```

### ✅ After (flex: 1 1)
```scss
.flex-20px { flex: 1 1 20px; max-width: 20px; }
.flex-50 { flex: 1 1 50%; max-width: 50%; }
.flex-calc-sm-calc10040px { flex: 1 1 calc(100% - 40px); max-width: calc(100% - 40px); }
```

## Why This Change?

### Angular Flex Layout Behavior
Angular Flex Layout uses **`flex-grow: 1` and `flex-shrink: 1`** by default, which means:
- ✅ Elements **can grow** to fill available space
- ✅ Elements **can shrink** when space is limited
- ✅ More responsive and adaptive layouts

### flex: 0 0 (old) vs flex: 1 1 (new)

| Property | `flex: 0 0 <value>` | `flex: 1 1 <value>` |
|----------|---------------------|---------------------|
| **flex-grow** | 0 (won't grow) | 1 (will grow) |
| **flex-shrink** | 0 (won't shrink) | 1 (will shrink) |
| **flex-basis** | `<value>` | `<value>` |
| **Behavior** | Fixed size, rigid | Flexible, responsive |
| **Matches Flex Layout** | ❌ No | ✅ Yes |

## What Was Updated

### 1. Static SCSS Template (all built-in classes)
```scss
// Percentage flex classes
.flex-10 { flex: 1 1 10%; max-width: 10%; }
.flex-20 { flex: 1 1 20%; max-width: 20%; }
.flex-50 { flex: 1 1 50%; max-width: 50%; }
.flex-100 { flex: 1 1 100%; max-width: 100%; }

// Pixel flex classes
.flex-20px { flex: 1 1 20px; max-width: 20px; }
.flex-30px { flex: 1 1 30px; max-width: 30px; }
.flex-100px { flex: 1 1 100px; max-width: 100px; }
```

### 2. Custom Class Generation (dynamically generated)
```javascript
// For custom pixel/percentage values
if (type === 'flex') {
  finalScss += `.${name} { flex: 1 1 ${value}; max-width: ${value}; }\n`;
}

// For breakpoint-specific calc()
if (type === 'flex-calc') {
  finalScss += `  .${name} { flex: 1 1 ${value}; max-width: ${value}; }\n`;
}
```

### 3. TypeScript convertFlexValue Function
```typescript
// Percentage values
if (/^\d+%?$/.test(strValue)) {
  const num = strValue.replace('%', '');
  return `1 1 ${num}%`;  // Changed from 0 0
}

// Pixel/unit values
if (/^\d+\s*(px|em|rem|vh|vw)$/.test(strValue)) {
  return `1 1 ${strValue}`;  // Changed from 0 0
}

// calc() expressions
if (strValue.startsWith('calc(')) {
  return `1 1 ${strValue}`;  // Changed from 0 0
}
```

## Examples

### Example 1: Pixel Values
```html
<div fxFlex="299px"></div>
```

**Generated Class:**
```scss
.flex-299px { flex: 1 1 299px; max-width: 299px; }
```

**Behavior:**
- Base width: 299px
- Will grow if extra space available
- Will shrink if space is limited
- Max width: 299px

### Example 2: Percentage Values
```html
<div fxFlex="50"></div>
```

**Uses Class:**
```scss
.flex-50 { flex: 1 1 50%; max-width: 50%; }
```

**Behavior:**
- Base width: 50%
- Will grow/shrink proportionally
- Max width: 50%

### Example 3: Breakpoint-Specific calc()
```html
<div fxFlex.sm="calc(100% - 40px)"></div>
```

**Generated Class:**
```scss
@media (min-width: 600px) and (max-width: 959px) {
  .flex-calc-sm-calc10040px { flex: 1 1 calc(100% - 40px); max-width: calc(100% - 40px); }
}
```

**Behavior:**
- Only applies on `sm` breakpoint
- Base width: calc(100% - 40px)
- Will grow/shrink as needed
- Max width: calc(100% - 40px)

## Impact

### ✅ Positive
- **Better matches Angular Flex Layout** - Elements behave the same way
- **More responsive** - Elements adapt to available space
- **Handles content overflow better** - Elements can shrink when needed

### ⚠️ Potential Issues (if any)
If your layout relied on rigid sizing (`flex: 0 0`), you might see:
- Elements growing more than expected
- Elements shrinking when content is large

**Solution:** Add `flex-shrink: 0` or `flex-grow: 0` explicitly to specific elements if needed.

## Testing

Run the test to verify all classes use `flex: 1 1`:

```bash
node migration-scripts/test-flex-1-1.js
```

Expected output:
```
✅ CORRECT: Uses flex: 1 1 50%
✅ CORRECT: Uses flex: 1 1 30px
✅ CORRECT: Uses flex: 1 1 299px
✅ CORRECT: Uses flex: 1 1 calc(100% - 40px)
```

## Summary

**All flex values now use `flex: 1 1 <value>`** which:
- ✅ Matches Angular Flex Layout behavior
- ✅ Allows elements to grow and shrink
- ✅ Creates more responsive layouts
- ✅ Works with percentages, pixels, and calc() expressions
- ✅ Applies to both static and dynamically generated classes

This change ensures your migrated application behaves exactly like it did with Angular Flex Layout! 🎉
