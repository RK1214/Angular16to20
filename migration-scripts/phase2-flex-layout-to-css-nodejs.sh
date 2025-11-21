#!/bin/bash

################################################################################
# Phase 2: Angular Flex Layout → CSS Migration (Node.js VERSION)
# Angular 16 to 20 Migration
#
# This script:
# - Uses Node.js-based migrator (no Python required!)
# - Handles all flex directive patterns (static, dynamic, responsive)
# - Properly merges CSS classes (no duplicate class attributes)
# - Preserves HTML structure
# - Creates CSS utility file (_layout.scss)
# - Creates TypeScript directives for dynamic bindings
# - Removes FlexLayoutModule from imports
# - Uninstalls @angular/flex-layout package
# - Tests the build
#
# IMPORTANT:
# - No backup files are created (use git for rollback)
# - No automatic commits (you control when to commit)
# - Review changes with 'git diff' before committing
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
echo -e "${BLUE}(Node.js-based Migration)${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not found"
    print_info "Node.js should already be installed for Angular projects"
    print_info "If not, install from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version 18+ recommended (found: $(node --version))"
else
    print_success "Node.js found: $(node --version)"
fi

# Check if glob package is available
print_info "Checking dependencies..."
if ! node -e "require.resolve('glob')" 2>/dev/null; then
    print_warning "Installing 'glob' package (required for migration)..."
    npm install --no-save glob 2>/dev/null || {
        print_error "Failed to install glob package"
        print_info "Try running: npm install glob"
        exit 1
    }
    print_success "Dependencies installed"
else
    print_success "Dependencies available"
fi

# Check if Phase 1 was completed
if [ ! -f "MIGRATION_INVENTORY.md" ]; then
    print_warning "MIGRATION_INVENTORY.md not found. Did you run phase1-preparation.sh?"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
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

# Ask for dry-run or actual migration
echo ""
print_info "Migration mode:"
echo "  1) Dry-run (preview changes without modifying files)"
echo "  2) Full migration (modify files)"
echo ""
read -p "Select mode (1 or 2): " -n 1 -r
echo ""

DRY_RUN_FLAG=""
if [[ $REPLY == "1" ]]; then
    DRY_RUN_FLAG="--dry-run"
    print_warning "Running in DRY-RUN mode (no files will be modified)"
else
    print_info "Running in FULL MIGRATION mode"
fi

# Step 1: Run Node.js migration script
print_info "Running Node.js-based flex migrator..."
echo ""

if node migration-scripts/migrate-flex-to-css.js --src-dir src $DRY_RUN_FLAG --verbose; then
    print_success "Node.js migration completed"
else
    print_error "Node.js migration failed"
    exit 1
fi

# If dry-run, exit here
if [[ -n "$DRY_RUN_FLAG" ]]; then
    echo ""
    print_warning "Dry-run completed. Review the changes above."
    print_info "Run again without dry-run to apply changes."
    exit 0
fi

# Step 2: Update styles.scss to import layout utilities
print_info "Updating src/styles.scss..."

if [ -f "src/styles.scss" ]; then
    # Check if already imported
    if ! grep -q "@import './styles/layout'" src/styles.scss; then
        # Check if @use or @import exists
        if grep -q "^@use\|^@import" src/styles.scss; then
            # Add after the last @use or @import line
            awk '
                /@use|@import/ { last_import = NR }
                { lines[NR] = $0 }
                END {
                    for (i = 1; i <= NR; i++) {
                        print lines[i]
                        if (i == last_import) {
                            print ""
                            print "// Layout utilities (replacement for Angular Flex Layout)"
                            print "@import '\''./styles/layout'\'';"
                        }
                    }
                }
            ' src/styles.scss > src/styles.scss.tmp
            mv src/styles.scss.tmp src/styles.scss
            print_success "Added layout import to styles.scss"
        else
            # Just prepend to the file
            {
                echo "// Layout utilities (replacement for Angular Flex Layout)"
                echo "@import './styles/layout';"
                echo ""
                cat src/styles.scss
            } > src/styles.scss.tmp
            mv src/styles.scss.tmp src/styles.scss
            print_success "Added layout import to styles.scss"
        fi
    else
        print_warning "Layout utilities already imported in styles.scss"
    fi
else
    print_warning "src/styles.scss not found, skipping"
fi

# Step 3: Create a shared module for flex directives (if it doesn't exist)
print_info "Setting up shared module for flex directives..."

SHARED_MODULE="src/app/shared/shared.module.ts"

if [ ! -f "$SHARED_MODULE" ]; then
    print_info "Creating shared module..."

    mkdir -p src/app/shared

    cat > "$SHARED_MODULE" << 'EOF'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexDirective, GapDirective, LayoutDirective, LayoutAlignDirective, FlexOrderDirective } from './directives/flex.directive';

/**
 * Shared module containing flex layout directives
 * Import this module in any feature module that uses dynamic flex bindings
 */
@NgModule({
  declarations: [
    FlexDirective,
    GapDirective,
    LayoutDirective,
    LayoutAlignDirective,
    FlexOrderDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FlexDirective,
    GapDirective,
    LayoutDirective,
    LayoutAlignDirective,
    FlexOrderDirective,
  ]
})
export class SharedModule { }
EOF

    print_success "Created shared module: $SHARED_MODULE"
else
    print_warning "Shared module already exists: $SHARED_MODULE"
    print_info "Please manually add the flex directives to this module"
fi

# Step 4: Remove FlexLayoutModule from all TypeScript files
print_info "Removing FlexLayoutModule from TypeScript files..."

TS_MODULE_FILES=$(find src -name "*.module.ts" -type f)
REMOVED_COUNT=0

for file in $TS_MODULE_FILES; do
    if grep -q "FlexLayoutModule" "$file"; then
        # Remove import line (no backup created)
        sed -i.tmp '/import.*FlexLayoutModule.*from.*@angular\/flex-layout/d' "$file"

        # Remove from imports array (handle both trailing comma and no comma)
        sed -i.tmp '/FlexLayoutModule,/d' "$file"
        sed -i.tmp '/FlexLayoutModule$/d' "$file"

        rm -f "$file.tmp"
        print_success "Removed FlexLayoutModule from: $file"
        REMOVED_COUNT=$((REMOVED_COUNT + 1))
    fi
done

if [ $REMOVED_COUNT -eq 0 ]; then
    print_warning "No FlexLayoutModule imports found"
else
    print_success "Removed FlexLayoutModule from $REMOVED_COUNT files"
fi

# Step 5: Check if any HTML files use dynamic directives
print_info "Checking for dynamic flex directive usage..."

DYNAMIC_USAGE=$(grep -r "\[appFlex\]\|\[appGap\]\|\[appLayout\]" src --include="*.html" 2>/dev/null | wc -l | xargs)

if [ "$DYNAMIC_USAGE" -gt 0 ]; then
    print_warning "Found $DYNAMIC_USAGE dynamic directive usages"
    print_info "You need to import SharedModule in modules that use these directives"
    print_info ""
    print_info "Add this to your feature modules:"
    print_info "  import { SharedModule } from './shared/shared.module';"
    print_info "  imports: [ SharedModule, ... ]"
else
    print_success "No dynamic directive usage found"
fi

# Step 6: Uninstall @angular/flex-layout
print_info "Checking if @angular/flex-layout is installed..."

if grep -q "@angular/flex-layout" package.json; then
    print_info "Uninstalling @angular/flex-layout package..."
    npm uninstall @angular/flex-layout
    print_success "Uninstalled @angular/flex-layout"
else
    print_warning "@angular/flex-layout not found in package.json"
fi

# Step 7: Reinstall dependencies
print_info "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Step 8: Test build
print_info "Testing build..."
if npm run build; then
    print_success "Build successful!"
else
    print_error "Build failed. Please check the errors above."
    print_warning "Review the changes and fix any errors"
    exit 1
fi

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Phase 2 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_success "✓ Flex Layout directives migrated"
print_success "✓ CSS classes properly merged (no duplicates)"
print_success "✓ Dynamic bindings converted to custom directives"
print_success "✓ HTML structure preserved"
print_success "✓ TypeScript directives created"
print_success "✓ FlexLayoutModule removed"
print_success "✓ @angular/flex-layout uninstalled"
print_success "✓ Build tested successfully"
print_success "✓ No Python required!"
echo ""
print_info "Important:"
print_info "1. Review the changes with: git diff"
print_info "2. If you use dynamic directives ([appFlex], [appGap], etc.),"
print_info "   make sure to import SharedModule in your feature modules"
print_info "3. Commit the changes when ready: git add . && git commit -m 'Phase 2: Flex migration'"
echo ""
print_info "Next step: Run phase3-material-legacy-to-mdc.sh"
echo ""
