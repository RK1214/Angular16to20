# Gap Tracking Fix - Map vs Set

## The Problem

Custom gap classes (and some flex classes) were missing from the generated `_layout.scss` file due to duplicate entries in the tracking system.

### Root Cause

The migration script was using a JavaScript `Set` to track custom classes:

```javascript
this.customClasses = new Set();
```

**The Issue:** JavaScript Sets deduplicate by object **reference**, not by object **content**. This meant:

```javascript
// These are TWO different objects (different references)
this.customClasses.add({ name: 'gap-10', type: 'gap', value: '10px' });
this.customClasses.add({ name: 'gap-10', type: 'gap', value: '10px' });

// Result: Set contains BOTH objects (duplicates!)
console.log(this.customClasses.size); // 2 (should be 1)
```

## The Solution

Changed from `Set` to `Map` using the **class name as the key** for proper deduplication:

```javascript
this.customClasses = new Map();
```

### How Map Fixes It

Maps deduplicate by **key**, so:

```javascript
// These use the SAME key ('gap-10')
this.customClasses.set('gap-10', { name: 'gap-10', type: 'gap', value: '10px' });
this.customClasses.set('gap-10', { name: 'gap-10', type: 'gap', value: '10px' });

// Result: Map contains ONE entry (properly deduplicated!)
console.log(this.customClasses.size); // 1 (correct!)
```

## Changes Made

### 1. Constructor (Line 40)
```javascript
// Before
this.customClasses = new Set();

// After
this.customClasses = new Map(); // Track custom CSS classes to generate (using Map for deduplication by key)
```

### 2. Percentage Tracking (Line 263)
```javascript
// Before
this.customClasses.add({
  name: className,
  type: breakpoint ? 'flex-breakpoint' : 'flex',
  value: `${num}%`,
  breakpoint: breakpoint || null
});

// After
this.customClasses.set(className, {
  name: className,
  type: breakpoint ? 'flex-breakpoint' : 'flex',
  value: `${num}%`,
  breakpoint: breakpoint || null
});
```

### 3. Pixel Tracking (Line 285)
```javascript
// Before
this.customClasses.add({...});

// After
this.customClasses.set(className, {...});
```

### 4. Calc Tracking (Line 302)
```javascript
// Before
this.customClasses.add({...});

// After
this.customClasses.set(className, {...});
```

### 5. Gap Tracking - Custom (Line 404)
```javascript
// Before
this.customClasses.add({
  name: className,
  type: 'gap',
  value: `${gapValue}px`,
  breakpoint: null
});

// After
this.customClasses.set(className, {
  name: className,
  type: 'gap',
  value: `${gapValue}px`,
  breakpoint: null
});
```

### 6. Gap Tracking - Breakpoint (Line 412)
```javascript
// Before
this.customClasses.add({...});

// After
this.customClasses.set(className, {...});
```

### 7. SCSS Generation (Line 880)
```javascript
// Before
const sortedClasses = Array.from(this.customClasses).sort((a, b) =>
  a.name.localeCompare(b.name)
);

// After
const sortedClasses = Array.from(this.customClasses.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);
```

## Test Results

### Before Fix
```
Total custom classes: 17 (with duplicates!)
gap-10 appears twice in Set
gap-15 appears twice in Set
Missing classes in SCSS output
```

### After Fix
```
Total custom classes: 13 (properly deduplicated!)
✅ .flex-92 { flex: 1 1 92%; max-width: 92%; }
✅ .flex-35 { flex: 1 1 35%; max-width: 35%; }
✅ .flex-650px { flex: 1 1 650px; max-width: 650px; }
✅ .flex-125px { flex: 1 1 125px; max-width: 125px; }
✅ .gap-10 { gap: 10px; }
✅ .gap-15 { gap: 15px; }
✅ All breakpoint-specific classes with media queries
✅ No duplicates
```

## Summary

**Problem:** Set doesn't deduplicate objects by content → Duplicates and missing classes

**Solution:** Map deduplicates by key (class name) → Proper tracking and generation

**Result:** All custom flex and gap classes are now correctly tracked and generated in `_layout.scss`!

---

## Verification

Run the test to verify all custom classes are tracked:

```bash
node migration-scripts/test-all-custom-classes.js
```

Expected output:
- ✅ 13 unique custom classes tracked
- ✅ No duplicates in output
- ✅ All custom flex percentages (92%, 35%)
- ✅ All custom flex pixels (650px, 125px)
- ✅ All breakpoint-specific values
- ✅ All custom gaps (10px, 15px)
- ✅ All breakpoint-specific gaps with media queries
