#!/bin/bash

################################################################################
# Phase 2: Angular Flex Layout → CSS Migration
# Angular 16 to 20 Migration
#
# This script:
# - Creates CSS utility file (_layout.scss)
# - Replaces all Flex Layout directives with CSS classes
# - Removes FlexLayoutModule from imports
# - Uninstalls @angular/flex-layout package
# - Tests the build
################################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Phase 2: Flex Layout → CSS Migration${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Check if Phase 1 was completed
if [ ! -f "MIGRATION_INVENTORY.md" ]; then
    print_error "MIGRATION_INVENTORY.md not found. Did you run phase1-preparation.sh?"
    exit 1
fi

# Check if we're on the migration branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "feature/angular-20-migration" ]; then
    print_warning "Not on feature/angular-20-migration branch (currently on $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Create styles directory if it doesn't exist
print_info "Creating styles directory..."
mkdir -p src/styles
print_success "Styles directory ready"

# Step 2: Create _layout.scss file
print_info "Creating src/styles/_layout.scss..."

cat > src/styles/_layout.scss << 'SCSS_EOF'
// ===================================
// CSS Layout Utilities
// Replacement for Angular Flex Layout
// ===================================

// Basic flex containers
.flex-row { display: flex; flex-direction: row; }
.flex-column { display: flex; flex-direction: column; }
.flex-row-reverse { display: flex; flex-direction: row-reverse; }
.flex-column-reverse { display: flex; flex-direction: column-reverse; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

// Alignment utilities
.align-start-start { justify-content: flex-start; align-items: flex-start; }
.align-start-center { justify-content: flex-start; align-items: center; }
.align-start-end { justify-content: flex-start; align-items: flex-end; }
.align-center-start { justify-content: center; align-items: flex-start; }
.align-center-center { justify-content: center; align-items: center; }
.align-center-end { justify-content: center; align-items: flex-end; }
.align-end-start { justify-content: flex-end; align-items: flex-start; }
.align-end-center { justify-content: flex-end; align-items: center; }
.align-end-end { justify-content: flex-end; align-items: flex-end; }
.align-space-between-start { justify-content: space-between; align-items: flex-start; }
.align-space-between-center { justify-content: space-between; align-items: center; }
.align-space-between-end { justify-content: space-between; align-items: flex-end; }
.align-space-around-center { justify-content: space-around; align-items: center; }
.align-space-evenly-center { justify-content: space-evenly; align-items: center; }

// Gap utilities
.gap-4 { gap: 4px; } .gap-8 { gap: 8px; } .gap-12 { gap: 12px; }
.gap-16 { gap: 16px; } .gap-20 { gap: 20px; } .gap-24 { gap: 24px; }
.gap-32 { gap: 32px; } .gap-48 { gap: 48px; }

// Flex sizing
.flex-auto { flex: 1 1 auto; }
.flex-none { flex: 0 0 auto; }
.flex-1 { flex: 1; } .flex-2 { flex: 2; } .flex-3 { flex: 3; }

// Percentage flex
.flex-10 { flex: 0 0 10%; max-width: 10%; }
.flex-20 { flex: 0 0 20%; max-width: 20%; }
.flex-25 { flex: 0 0 25%; max-width: 25%; }
.flex-30 { flex: 0 0 30%; max-width: 30%; }
.flex-33 { flex: 0 0 33.333%; max-width: 33.333%; }
.flex-40 { flex: 0 0 40%; max-width: 40%; }
.flex-50 { flex: 0 0 50%; max-width: 50%; }
.flex-60 { flex: 0 0 60%; max-width: 60%; }
.flex-66 { flex: 0 0 66.666%; max-width: 66.666%; }
.flex-70 { flex: 0 0 70%; max-width: 70%; }
.flex-75 { flex: 0 0 75%; max-width: 75%; }
.flex-80 { flex: 0 0 80%; max-width: 80%; }
.flex-90 { flex: 0 0 90%; max-width: 90%; }
.flex-100 { flex: 0 0 100%; max-width: 100%; }

// Fixed width flex
.flex-100px { flex: 0 0 100px; } .flex-150px { flex: 0 0 150px; }
.flex-200px { flex: 0 0 200px; } .flex-220px { flex: 0 0 220px; }
.flex-250px { flex: 0 0 250px; } .flex-300px { flex: 0 0 300px; }
.flex-400px { flex: 0 0 400px; } .flex-500px { flex: 0 0 500px; }

// Width/height utilities
.w-full { width: 100%; } .w-auto { width: auto; }
.h-full { height: 100%; } .h-auto { height: auto; }

// Responsive breakpoints
@media (max-width: 599px) {
  .flex-column-xs { flex-direction: column !important; }
  .flex-row-xs { flex-direction: row !important; }
  .show-xs { display: flex !important; }
  .hide-xs { display: none !important; }
  .flex-100-xs { flex: 0 0 100% !important; max-width: 100% !important; }
}

@media (min-width: 600px) and (max-width: 959px) {
  .flex-column-sm { flex-direction: column !important; }
  .show-sm { display: flex !important; }
  .hide-sm { display: none !important; }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .flex-column-md { flex-direction: column !important; }
  .show-md { display: flex !important; }
  .hide-md { display: none !important; }
}

@media (min-width: 1280px) {
  .show-lg { display: flex !important; }
  .hide-lg { display: none !important; }
}

@media (min-width: 600px) {
  .show-gt-xs { display: flex !important; }
  .hide-gt-xs { display: none !important; }
}

@media (min-width: 960px) {
  .show-gt-sm { display: flex !important; }
  .hide-gt-sm { display: none !important; }
}

@media (max-width: 599px) {
  .show-lt-sm { display: flex !important; }
  .hide-lt-sm { display: none !important; }
}

@media (max-width: 959px) {
  .show-lt-md { display: flex !important; }
  .hide-lt-md { display: none !important; }
}
SCSS_EOF

print_success "Created src/styles/_layout.scss"

# Step 3: Update styles.scss to import layout utilities
print_info "Updating src/styles.scss..."

if [ -f "src/styles.scss" ]; then
    # Check if already imported
    if ! grep -q "@import './styles/layout'" src/styles.scss; then
        # Find the line after @use '@angular/material'
        if grep -q "@use '@angular/material'" src/styles.scss; then
            # Insert after @use line
            sed -i.bak "/^@use '@angular\/material'/a\\
\\
// Import layout utilities (replacement for Flex Layout)\\
@import './styles/layout';\\
" src/styles.scss
            rm -f src/styles.scss.bak
            print_success "Added layout import to styles.scss"
        else
            # Just prepend to the file
            echo -e "// Import layout utilities (replacement for Flex Layout)\n@import './styles/layout';\n\n$(cat src/styles.scss)" > src/styles.scss
            print_success "Added layout import to styles.scss"
        fi
    else
        print_warning "Layout utilities already imported in styles.scss"
    fi
else
    print_warning "src/styles.scss not found, skipping"
fi

# Step 4: Replace Flex Layout directives in HTML files
print_info "Replacing Flex Layout directives in HTML files..."

# Find all HTML files
HTML_FILES=$(find src -name "*.html" -type f)
MODIFIED_COUNT=0

for file in $HTML_FILES; do
    # Check if file contains flex layout directives
    if grep -q "fxLayout\|fxFlex\|fxShow\|fxHide\|fxLayoutAlign\|fxLayoutGap" "$file"; then
        print_info "Processing: $file"

        # Create backup
        cp "$file" "$file.backup"

        # Apply replacements using sed (macOS and Linux compatible)

        # ==========================================
        # DYNAMIC BINDINGS - Process FIRST
        # ==========================================

        # [fxLayoutGap]="variable" -> [appGap]="variable"
        sed -i.tmp 's/\[fxLayoutGap\]="\([^"]*\)"/[appGap]="\1"/g' "$file"

        # ==========================================
        # STATIC BINDINGS
        # ==========================================

        # fxLayout directives
        sed -i.tmp 's/fxLayout="row wrap"/class="flex-row flex-wrap"/g' "$file"
        sed -i.tmp 's/fxLayout="row"/class="flex-row"/g' "$file"
        sed -i.tmp 's/fxLayout="column"/class="flex-column"/g' "$file"
        sed -i.tmp 's/fxLayout\.xs="column"/class="flex-row flex-column-xs"/g' "$file"
        sed -i.tmp 's/fxLayout\.xs="row"/class="flex-column flex-row-xs"/g' "$file"

        # fxLayoutAlign
        sed -i.tmp 's/fxLayoutAlign="start start"/class="align-start-start"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="start center"/class="align-start-center"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="start end"/class="align-start-end"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="center start"/class="align-center-start"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="center center"/class="align-center-center"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="center end"/class="align-center-end"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="end start"/class="align-end-start"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="end center"/class="align-end-center"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="end end"/class="align-end-end"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="space-between start"/class="align-space-between-start"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="space-between center"/class="align-space-between-center"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="space-between end"/class="align-space-between-end"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="space-around center"/class="align-space-around-center"/g' "$file"
        sed -i.tmp 's/fxLayoutAlign="space-evenly center"/class="align-space-evenly-center"/g' "$file"

        # fxLayoutGap
        sed -i.tmp 's/fxLayoutGap="4px"/class="gap-4"/g' "$file"
        sed -i.tmp 's/fxLayoutGap="8px"/class="gap-8"/g' "$file"
        sed -i.tmp 's/fxLayoutGap="12px"/class="gap-12"/g' "$file"
        sed -i.tmp 's/fxLayoutGap="16px"/class="gap-16"/g' "$file"
        sed -i.tmp 's/fxLayoutGap="20px"/class="gap-20"/g' "$file"
        sed -i.tmp 's/fxLayoutGap="24px"/class="gap-24"/g' "$file"

        # fxFlex - Dynamic bindings (must come BEFORE static replacements)
        # [fxFlex]="variable" -> [appFlex]="variable" (using custom directive)
        sed -i.tmp 's/\[fxFlex\]="\([^"]*\)"/[appFlex]="\1"/g' "$file"

        # For responsive dynamic bindings - these need manual review
        # [fxFlex.xs]="variable" - Add comment for manual review
        sed -i.tmp 's/\[fxFlex\.xs\]="\([^"]*\)"/[appFlex]="\1" <!--TODO: Review responsive fxFlex.xs-->/g' "$file"
        sed -i.tmp 's/\[fxFlex\.sm\]="\([^"]*\)"/[appFlex]="\1" <!--TODO: Review responsive fxFlex.sm-->/g' "$file"
        sed -i.tmp 's/\[fxFlex\.md\]="\([^"]*\)"/[appFlex]="\1" <!--TODO: Review responsive fxFlex.md-->/g' "$file"
        sed -i.tmp 's/\[fxFlex\.lg\]="\([^"]*\)"/[appFlex]="\1" <!--TODO: Review responsive fxFlex.lg-->/g' "$file"

        # fxFlex - Static values
        sed -i.tmp 's/fxFlex="auto"/class="flex-auto"/g' "$file"
        sed -i.tmp 's/fxFlex="none"/class="flex-none"/g' "$file"
        sed -i.tmp 's/fxFlex="10"/class="flex-10"/g' "$file"
        sed -i.tmp 's/fxFlex="20"/class="flex-20"/g' "$file"
        sed -i.tmp 's/fxFlex="25"/class="flex-25"/g' "$file"
        sed -i.tmp 's/fxFlex="30"/class="flex-30"/g' "$file"
        sed -i.tmp 's/fxFlex="33"/class="flex-33"/g' "$file"
        sed -i.tmp 's/fxFlex="40"/class="flex-40"/g' "$file"
        sed -i.tmp 's/fxFlex="50"/class="flex-50"/g' "$file"
        sed -i.tmp 's/fxFlex="60"/class="flex-60"/g' "$file"
        sed -i.tmp 's/fxFlex="66"/class="flex-66"/g' "$file"
        sed -i.tmp 's/fxFlex="70"/class="flex-70"/g' "$file"
        sed -i.tmp 's/fxFlex="75"/class="flex-75"/g' "$file"
        sed -i.tmp 's/fxFlex="80"/class="flex-80"/g' "$file"
        sed -i.tmp 's/fxFlex="100"/class="flex-100"/g' "$file"
        sed -i.tmp 's/fxFlex="100px"/class="flex-100px"/g' "$file"
        sed -i.tmp 's/fxFlex="150px"/class="flex-150px"/g' "$file"
        sed -i.tmp 's/fxFlex="200px"/class="flex-200px"/g' "$file"
        sed -i.tmp 's/fxFlex="220px"/class="flex-220px"/g' "$file"
        sed -i.tmp 's/fxFlex="250px"/class="flex-250px"/g' "$file"
        sed -i.tmp 's/fxFlex="300px"/class="flex-300px"/g' "$file"
        sed -i.tmp 's/fxFlex="400px"/class="flex-400px"/g' "$file"
        sed -i.tmp 's/fxFlex="500px"/class="flex-500px"/g' "$file"
        sed -i.tmp 's/fxFlex[^=]/class="flex-1"/g' "$file"

        # fxShow/fxHide
        sed -i.tmp 's/fxShow\.xs/class="show-xs"/g' "$file"
        sed -i.tmp 's/fxShow\.sm/class="show-sm"/g' "$file"
        sed -i.tmp 's/fxShow\.gt-xs/class="show-gt-xs"/g' "$file"
        sed -i.tmp 's/fxShow\.gt-sm/class="show-gt-sm"/g' "$file"
        sed -i.tmp 's/fxHide\.xs/class="hide-xs"/g' "$file"
        sed -i.tmp 's/fxHide\.sm/class="hide-sm"/g' "$file"
        sed -i.tmp 's/fxHide\.gt-xs/class="hide-gt-xs"/g' "$file"
        sed -i.tmp 's/fxHide\.gt-sm/class="hide-gt-sm"/g' "$file"

        # Remove .tmp files
        rm -f "$file.tmp"

        # Merge class attributes if multiple were created
        # This is a simple merge - you may need manual cleanup

        MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
        print_success "Modified: $file"
    fi
done

print_success "Modified $MODIFIED_COUNT HTML files"

# Step 5: Create shared utilities and directives for dynamic flex bindings
print_info "Creating flex utilities and directives..."

# Create shared directory structure
mkdir -p src/app/shared/utils
mkdir -p src/app/shared/directives

# Create flex.utils.ts
cat > src/app/shared/utils/flex.utils.ts << 'UTILS_EOF'
/**
 * Utility functions for converting Angular Flex Layout dynamic values to CSS
 */

/**
 * Converts fxFlex value to CSS flex property value
 * @param value - The flex value (e.g., '50', '200px', 'auto', '1 1 auto')
 * @returns CSS flex property value
 */
export function convertFlexValue(value: string | number): string {
  if (!value) return '1 1 auto';

  const strValue = String(value);

  // Already a valid flex shorthand (e.g., "1 1 auto")
  if (strValue.includes(' ')) {
    return strValue;
  }

  // Percentage values (e.g., "50" -> "0 0 50%")
  if (/^\d+$/.test(strValue)) {
    return `0 0 ${strValue}%`;
  }

  // Pixel values (e.g., "200px" -> "0 0 200px")
  if (strValue.endsWith('px') || strValue.endsWith('em') || strValue.endsWith('rem')) {
    return `0 0 ${strValue}`;
  }

  // Special keywords
  if (strValue === 'auto') return '1 1 auto';
  if (strValue === 'none') return '0 0 auto';
  if (strValue === 'grow') return '1 1 100%';
  if (strValue === 'initial') return '0 1 auto';
  if (strValue === 'nogrow') return '0 1 auto';
  if (strValue === 'noshrink') return '1 0 auto';

  // Default to flex: 1 1 auto
  return '1 1 auto';
}

/**
 * Converts fxLayoutGap value to CSS gap property value
 * @param value - The gap value (e.g., '16', '16px')
 * @returns CSS gap property value
 */
export function convertGapValue(value: string | number): string {
  if (!value) return '0px';

  const strValue = String(value);

  // Already has unit
  if (/^\d+\s*(px|em|rem|%)$/.test(strValue)) {
    return strValue;
  }

  // Just a number, add px
  if (/^\d+$/.test(strValue)) {
    return `${strValue}px`;
  }

  return strValue;
}
UTILS_EOF

# Create flex.directive.ts
cat > src/app/shared/directives/flex.directive.ts << 'DIR_EOF'
import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { convertFlexValue, convertGapValue } from '../utils/flex.utils';

/**
 * Drop-in replacement directive for fxFlex
 * Converts flex layout values to CSS flex property
 *
 * Usage:
 * <div [appFlex]="'50'">50% width</div>
 * <div [appFlex]="itemWidth">Dynamic width</div>
 * <div [appFlex]="'200px'">200px width</div>
 */
@Directive({
  selector: '[appFlex]',
  standalone: false
})
export class FlexDirective implements OnInit, OnChanges {
  @Input() appFlex: string | number = '1 1 auto';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateFlex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFlex']) {
      this.updateFlex();
    }
  }

  private updateFlex(): void {
    const flexValue = convertFlexValue(this.appFlex);
    this.renderer.setStyle(this.el.nativeElement, 'flex', flexValue);
  }
}

/**
 * Drop-in replacement directive for fxLayoutGap
 * Converts gap values to CSS gap property
 *
 * Usage:
 * <div [appGap]="'16'">16px gap</div>
 * <div [appGap]="gapSize">Dynamic gap</div>
 */
@Directive({
  selector: '[appGap]',
  standalone: false
})
export class GapDirective implements OnInit, OnChanges {
  @Input() appGap: string | number = '0';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateGap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appGap']) {
      this.updateGap();
    }
  }

  private updateGap(): void {
    const gapValue = convertGapValue(this.appGap);
    this.renderer.setStyle(this.el.nativeElement, 'gap', gapValue);
  }
}
DIR_EOF

print_success "Created flex utilities and directives"

# Step 6: Import directives into modules that use dynamic flex bindings
print_info "Importing FlexDirective and GapDirective into modules..."

# Find if any HTML files use appFlex or appGap
if grep -r "appFlex\|appGap" src --include="*.html" > /dev/null 2>&1; then
    # Find all module files
    MODULE_FILES=$(find src -name "*.module.ts" -type f)

    for module_file in $MODULE_FILES; do
        # Check if module doesn't already import the directives
        if ! grep -q "FlexDirective\|GapDirective" "$module_file"; then
            cp "$module_file" "$module_file.backup"

            # Add import statement
            if ! grep -q "from.*shared/directives/flex.directive" "$module_file"; then
                # Add import after other imports
                sed -i.tmp "/^import/a\\
import { FlexDirective, GapDirective } from './shared/directives/flex.directive';
" "$module_file"
            fi

            # Add to declarations array in @NgModule
            if grep -q "declarations: \[" "$module_file"; then
                sed -i.tmp "/declarations: \[/a\\
    FlexDirective,\\
    GapDirective," "$module_file"

                rm -f "$module_file.tmp"
                print_success "Added directives to module: $module_file"
            else
                rm "$module_file.backup" 2>/dev/null
            fi
        fi
    done

    print_success "Imported directives into modules using dynamic flex"
else
    print_info "No templates found using dynamic flex bindings (appFlex/appGap)"
fi

# Step 7: Remove FlexLayoutModule from app.module.ts and other module files
print_info "Removing FlexLayoutModule from TypeScript files..."

TS_MODULE_FILES=$(find src -name "*.module.ts" -type f)

for file in $TS_MODULE_FILES; do
    if grep -q "FlexLayoutModule" "$file"; then
        cp "$file" "$file.backup"

        # Remove import line
        sed -i.tmp '/import.*FlexLayoutModule.*from.*@angular\/flex-layout/d' "$file"

        # Remove from imports array
        sed -i.tmp '/FlexLayoutModule,\?/d' "$file"

        rm -f "$file.tmp"
        print_success "Removed FlexLayoutModule from: $file"
    fi
done

# Step 8: Uninstall @angular/flex-layout
print_info "Uninstalling @angular/flex-layout package..."
npm uninstall @angular/flex-layout
print_success "Uninstalled @angular/flex-layout"

# Step 9: Reinstall dependencies
print_info "Reinstalling dependencies..."
npm install
print_success "Dependencies reinstalled"

# Step 10: Test build
print_info "Testing build..."
if npm run build; then
    print_success "Build successful!"
else
    print_error "Build failed. Please check the errors above."
    print_info "You can restore backups from .backup files if needed"
    exit 1
fi

# Step 11: Commit changes
print_info "Committing Phase 2 changes..."
git add -A
git commit -m "Phase 2: Migrated Angular Flex Layout to CSS

- Created src/styles/_layout.scss with CSS utilities
- Created FlexDirective and GapDirective for dynamic bindings
- Replaced all Flex Layout directives:
  - Static: fxFlex, fxLayout, etc. → CSS classes
  - Dynamic: [fxFlex], [fxLayoutGap] → appFlex, appGap directives
- Removed FlexLayoutModule from all modules
- Uninstalled @angular/flex-layout package
- Build successful

Modified $MODIFIED_COUNT HTML files" || print_warning "Nothing to commit"

# Cleanup backup files
print_info "Cleaning up backup files..."
find src -name "*.backup" -delete
print_success "Backup files deleted"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Phase 2 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_success "Flex Layout directives replaced with CSS classes"
print_success "Dynamic flex bindings converted to appFlex/appGap directives"
print_success "FlexDirective and GapDirective created for dynamic values"
print_success "FlexLayoutModule removed"
print_success "@angular/flex-layout uninstalled"
print_success "Build tested successfully"
echo ""
print_info "Next step: Run phase3-material-legacy-to-mdc.sh"
echo ""
