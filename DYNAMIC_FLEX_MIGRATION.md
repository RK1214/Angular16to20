# Dynamic Flex Layout Migration Guide

## Overview

This guide explains how to migrate **dynamic** Angular Flex Layout bindings (property bindings with variables) to modern CSS-based approaches.

---

## Understanding the Difference

### Static Bindings (Simple)
```html
<!-- These use fixed string values -->
<div fxFlex="50">Static 50%</div>
<div fxLayoutGap="16px">Static gap</div>
```
**Migration:** Replace with CSS classes (`.flex-50`, `.gap-16`)

### Dynamic Bindings (Complex)
```html
<!-- These use component properties/variables -->
<div [fxFlex]="itemWidth">Dynamic width</div>
<div [fxLayoutGap]="gapSize">Dynamic gap</div>
```
**Migration:** Use custom directives or style bindings

---

## Migration Approaches

### Approach 1: Custom Directives (Recommended by Script)

The migration script automatically creates and uses custom directives:

#### Before:
```html
<div [fxFlex]="itemWidth">Content</div>
<div [fxLayoutGap]="gapSize">Content</div>
```

#### After (Automated):
```html
<div [appFlex]="itemWidth">Content</div>
<div [appGap]="gapSize">Content</div>
```

**How it works:**
- `FlexDirective` (`appFlex`) - Converts values to CSS flex property
- `GapDirective` (`appGap`) - Converts values to CSS gap property
- Both directives handle common value formats:
  - Numbers: `50` → `0 0 50%`
  - Pixels: `200px` → `0 0 200px`
  - Keywords: `auto` → `1 1 auto`

**Files created by script:**
- `src/app/shared/utils/flex.utils.ts` - Conversion utilities
- `src/app/shared/directives/flex.directive.ts` - FlexDirective and GapDirective

---

### Approach 2: Direct Style Binding (Manual Alternative)

You can also use Angular's style binding directly:

```html
<!-- Before -->
<div [fxFlex]="itemWidth">Content</div>

<!-- After -->
<div [style.flex]="convertFlex(itemWidth)">Content</div>
```

**Component:**
```typescript
import { convertFlexValue } from '../shared/utils/flex.utils';

export class MyComponent {
  itemWidth = '50'; // or '200px', 'auto', etc.

  convertFlex(value: string): string {
    return convertFlexValue(value);
  }
}
```

---

### Approach 3: NgStyle for Complex Cases

For more complex dynamic styling:

```html
<!-- Before -->
<div [fxFlex]="itemWidth" [fxLayoutGap]="gapSize">Content</div>

<!-- After -->
<div [ngStyle]="{
  'flex': convertFlex(itemWidth),
  'gap': convertGap(gapSize)
}">Content</div>
```

---

## Value Conversion Reference

### fxFlex Value Conversions

| Input Value | Output CSS Flex | Description |
|-------------|-----------------|-------------|
| `"50"` | `0 0 50%` | Percentage width |
| `"200px"` | `0 0 200px` | Fixed pixel width |
| `"auto"` | `1 1 auto` | Flexible, grows/shrinks |
| `"none"` | `0 0 auto` | Fixed size, no flex |
| `"1 1 auto"` | `1 1 auto` | Passthrough (already valid) |

### fxLayoutGap Value Conversions

| Input Value | Output CSS Gap | Description |
|-------------|----------------|-------------|
| `"16"` | `16px` | Number → pixels |
| `"16px"` | `16px` | Already has unit |
| `"1em"` | `1em` | Other units preserved |

---

## Component Examples

### Example 1: Card Grid with Dynamic Widths

**Component:**
```typescript
@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html'
})
export class CardGridComponent {
  @Input() cardWidth: string = '33'; // 33%
  @Input() gap: string = '16'; // 16px
}
```

**Template (Before):**
```html
<div fxLayout="row" [fxLayoutGap]="gap + 'px'">
  <div *ngFor="let item of items" [fxFlex]="cardWidth">
    <mat-card>{{ item.name }}</mat-card>
  </div>
</div>
```

**Template (After - Using Directives):**
```html
<div class="flex-row" [appGap]="gap">
  <div *ngFor="let item of items" [appFlex]="cardWidth">
    <mat-card>{{ item.name }}</mat-card>
  </div>
</div>
```

---

### Example 2: Responsive Sidebar

**Component:**
```typescript
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  sidebarWidth = '250px';
  contentWidth = 'auto';
}
```

**Template (Before):**
```html
<div fxLayout="row">
  <aside [fxFlex]="sidebarWidth">Sidebar</aside>
  <main [fxFlex]="contentWidth">Content</main>
</div>
```

**Template (After):**
```html
<div class="flex-row">
  <aside [appFlex]="sidebarWidth">Sidebar</aside>
  <main [appFlex]="contentWidth">Content</main>
</div>
```

---

## Migration Script Behavior

When you run `phase2-flex-layout-to-css.sh`, it will:

### 1. **Detect Dynamic Bindings**
Finds patterns like `[fxFlex]="..."` and `[fxLayoutGap]="..."`

### 2. **Create Utilities and Directives**
Generates:
- `flex.utils.ts` - Conversion functions
- `flex.directive.ts` - FlexDirective and GapDirective

### 3. **Replace Bindings**
- `[fxFlex]="value"` → `[appFlex]="value"`
- `[fxLayoutGap]="value"` → `[appGap]="value"`

### 4. **Import Directives**
For standalone components, automatically adds imports

---

## Manual Steps Required

### For Non-Standalone Components

If your components are **not standalone**, manually import directives in your module:

```typescript
import { FlexDirective, GapDirective } from './shared/directives/flex.directive';

@NgModule({
  declarations: [YourComponent],
  imports: [
    FlexDirective,
    GapDirective
  ]
})
export class YourModule { }
```

### For Responsive Dynamic Bindings

Responsive dynamic bindings like `[fxFlex.xs]="value"` need manual review:

**Before:**
```html
<div [fxFlex.xs]="mobileWidth" [fxFlex]="desktopWidth">Content</div>
```

**After (Manual Fix):**
```html
<div [appFlex]="isMobile ? mobileWidth : desktopWidth">Content</div>
```

**Component:**
```typescript
export class MyComponent {
  isMobile = window.innerWidth < 600;
  mobileWidth = '100';
  desktopWidth = '50';
}
```

Or use CSS media queries with CSS variables:

```typescript
// Component
@HostBinding('style.--item-width')
get itemWidth() {
  return this.isMobile ? '100%' : '50%';
}
```

```html
<!-- Template -->
<div [style.flex]="'0 0 var(--item-width)'">Content</div>
```

---

## Troubleshooting

### Issue: Directive not found

**Error:** `Can't bind to 'appFlex' since it isn't a known property`

**Solution:** Import `FlexDirective` in your component or module:
```typescript
import { FlexDirective } from './shared/directives/flex.directive';
```

### Issue: Unexpected flex behavior

**Problem:** Elements don't size correctly

**Solution:** Check value format. Use conversion utility:
```typescript
import { convertFlexValue } from './shared/utils/flex.utils';
console.log(convertFlexValue(yourValue)); // Debug output
```

### Issue: Responsive bindings not working

**Problem:** `[fxFlex.xs]` was replaced but doesn't work

**Solution:** Responsive dynamic bindings require manual conversion using media queries or component logic (see examples above).

---

## Best Practices

1. **Use Static Classes When Possible**
   - If value rarely changes, use CSS classes instead
   - More performant than dynamic bindings

2. **Consider CSS Variables**
   - For theme-based sizing
   - Better browser support than dynamic bindings

3. **Test Responsive Behavior**
   - Dynamic bindings for responsive layouts need extra attention
   - Consider using `BreakpointObserver` service

4. **Keep Conversion Functions**
   - Don't delete `flex.utils.ts` even after migration
   - Useful for future dynamic layout needs

---

## Further Reading

- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Angular Style Binding](https://angular.io/guide/attribute-binding#binding-to-the-style-attribute)
- [Angular Directives](https://angular.io/guide/attribute-directives)
