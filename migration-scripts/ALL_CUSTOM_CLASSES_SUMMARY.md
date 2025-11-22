# All Custom Classes Auto-Generation

The migration script now **automatically tracks and generates ALL custom CSS classes** used in your application!

## ✅ What Gets Auto-Generated

### 1. Custom Flex Percentages
**Any percentage NOT in the standard set:**

Standard: `10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 100`

**Examples:**
- `fxFlex="92"` → `.flex-92 { flex: 1 1 92%; max-width: 92%; }`
- `fxFlex="35"` → `.flex-35 { flex: 1 1 35%; max-width: 35%; }`
- `fxFlex="15"` → `.flex-15 { flex: 1 1 15%; max-width: 15%; }`

### 2. Custom Flex Pixels
**Any pixel value NOT in the standard set:**

Standard: `20px, 30px, 40px, 50px, 100px, 142px, 150px, 200px, 220px, 250px, 300px, 400px, 500px`

**Examples:**
- `fxFlex="650px"` → `.flex-650px { flex: 1 1 650px; max-width: 650px; }`
- `fxFlex="125px"` → `.flex-125px { flex: 1 1 125px; max-width: 125px; }`
- `fxFlex="299px"` → `.flex-299px { flex: 1 1 299px; max-width: 299px; }`

### 3. Breakpoint-Specific Flex
**ANY flex value WITH a breakpoint (always generated):**

**Examples:**
- `fxFlex.sm="85"` → Media query with `.flex-85-sm { flex: 1 1 85%; max-width: 85%; }`
- `fxFlex.xs="320px"` → Media query with `.flex-320px-xs { flex: 1 1 320px; max-width: 320px; }`
- `fxFlex.gt-xs="50"` → Media query with `.flex-50-gt-xs` (even though 50 is standard)

### 4. Breakpoint-Specific calc()
**calc() expressions WITH breakpoints:**

**Examples:**
- `fxFlex.sm="calc(100% - 40px)"` → Media query with `.flex-calc-sm-calc10040px`
- `fxFlex.xs="calc(50% - 20px)"` → Media query with `.flex-calc-xs-calc5020px`

### 5. Custom Gap Values
**Any gap NOT in the standard set:**

Standard: `4px, 5px, 8px, 12px, 16px, 20px, 24px, 32px, 48px`

**Examples:**
- `fxLayoutGap="10px"` → `.gap-10 { gap: 10px; }`
- `fxLayoutGap="15px"` → `.gap-15 { gap: 15px; }`
- `fxLayoutGap.sm="18px"` → Media query with `.gap-18-sm { gap: 18px; }`

---

## Complete Example

### Input HTML:
```html
<div fxFlex="92"></div>
<div fxFlex="650px"></div>
<div fxFlex="35"></div>
<div fxFlex="125px"></div>
<div fxFlex.sm="85"></div>
<div fxFlex.xs="320px"></div>
<div fxFlex.sm="calc(100% - 40px)"></div>
<div fxLayoutGap="10px"></div>
<div fxLayoutGap.sm="18px"></div>

<!-- Standard values (NOT generated as custom) -->
<div fxFlex="50"></div>
<div fxFlex="100px"></div>
<div fxLayoutGap="24px"></div>
```

### Output HTML:
```html
<div class="flex-92"></div>
<div class="flex-650px"></div>
<div class="flex-35"></div>
<div class="flex-125px"></div>
<div class="flex-85-sm"></div>
<div class="flex-320px-xs"></div>
<div class="flex-calc-sm-calc10040px"></div>
<div class="gap-10"></div>
<div class="gap-18-sm"></div>

<!-- Standard values use existing template classes -->
<div class="flex-50"></div>
<div class="flex-100px"></div>
<div class="gap-24"></div>
```

### Generated _layout.scss (Custom Section):
```scss
// Custom Classes (Dynamically Generated)
// ===================================

// Custom percentages
.flex-35 { flex: 1 1 35%; max-width: 35%; }
.flex-92 { flex: 1 1 92%; max-width: 92%; }

// Custom pixels
.flex-125px { flex: 1 1 125px; max-width: 125px; }
.flex-650px { flex: 1 1 650px; max-width: 650px; }

// Breakpoint-specific flex
@media (min-width: 600px) and (max-width: 959px) {
  .flex-85-sm { flex: 1 1 85%; max-width: 85%; }
}

@media (max-width: 599px) {
  .flex-320px-xs { flex: 1 1 320px; max-width: 320px; }
}

// Breakpoint-specific calc
@media (min-width: 600px) and (max-width: 959px) {
  .flex-calc-sm-calc10040px { flex: 1 1 calc(100% - 40px); max-width: calc(100% - 40px); }
}

// Custom gaps
.gap-10 { gap: 10px; }

@media (min-width: 600px) and (max-width: 959px) {
  .gap-18-sm { gap: 18px; }
}
```

---

## How It Works

### Smart Detection
```javascript
// Standard percentage values
const standardPercentages = ['10', '20', '25', '30', '33', '40', '50', '60', '66', '70', '75', '80', '90', '100'];

// Standard pixel values
const standardPixels = ['20', '30', '40', '50', '100', '142', '150', '200', '220', '250', '300', '400', '500'];

// Track custom values
if (!standardPercentages.includes(num) || breakpoint) {
  this.customClasses.add({ name, type, value, breakpoint });
}
```

### Automatic Generation
All tracked custom classes are automatically added to the `_layout.scss` file in a dedicated section.

---

## Benefits

✅ **Zero Manual Work** - All custom classes generated automatically
✅ **No Missing Classes** - Every value you use will have CSS
✅ **Optimized Output** - Standard values aren't duplicated
✅ **Breakpoint Support** - Media queries for responsive values
✅ **Clean Organization** - Custom classes in separate section
✅ **Alphabetically Sorted** - Easy to find and review

---

## What You Need to Do

**Nothing!** Just run the migration:

```bash
node migration-scripts/migrate-flex-to-css.js
```

The script will:
1. ✅ Scan all your HTML files
2. ✅ Detect custom flex/gap values
3. ✅ Track them in memory
4. ✅ Generate CSS in `_layout.scss`
5. ✅ Organize by type (flex, gaps, breakpoints)

---

## Verification

After migration, check your `src/styles/_layout.scss` file. At the bottom you'll see:

```scss
// ===================================
// Custom Classes (Dynamically Generated)
// ===================================

.flex-92 { flex: 1 1 92%; max-width: 92%; }
.flex-650px { flex: 1 1 650px; max-width: 650px; }
.gap-10 { gap: 10px; }
// ... all your custom values
```

---

## Test Results

```
✅ flex-92 generated
✅ flex-650px generated
✅ flex-35 generated
✅ flex-125px generated
✅ flex-85-sm with media query
✅ flex-320px-xs with media query
✅ gap-10 generated
✅ gap-18-sm with media query

✅ flex-50 NOT in custom (already in template)
✅ flex-100px NOT in custom (already in template)
✅ gap-24 NOT in custom (already in template)
```

---

## Summary

**Every custom class you use will be automatically added to `_layout.scss`!**

No more missing CSS classes. No more manual work. Just run the migration and everything is handled automatically! 🎉
