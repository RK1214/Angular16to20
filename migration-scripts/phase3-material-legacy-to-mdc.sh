#!/bin/bash

################################################################################
# Phase 3: Material Legacy → MDC Migration
# Angular 16 to 20 Migration
#
# This script:
# - Replaces all Material Legacy imports with MDC
# - Updates component TypeScript files
# - Updates SCSS files (legacy CSS classes)
# - Removes legacy theme from styles.scss
# - Adds appearance attributes to form fields
# - Tests the build
################################################################################

set -e

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Phase 3: Material Legacy → MDC${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Step 1: Replace Material Legacy imports in TypeScript files
print_info "Replacing Material Legacy imports in TypeScript files..."

TS_FILES=$(find src -name "*.ts" -type f)
MODIFIED_TS=0

for file in $TS_FILES; do
    if grep -q "MatLegacy\|legacy-" "$file"; then
        cp "$file" "$file.backup"

        # Replace all legacy imports with MDC
        sed -i.tmp "s/import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular\/material\/legacy-autocomplete';/import { MatAutocompleteModule } from '@angular\/material\/autocomplete';/g" "$file"
        sed -i.tmp "s/import { MatLegacyAutocompleteModule } from '@angular\/material\/legacy-autocomplete';/import { MatAutocompleteModule } from '@angular\/material\/autocomplete';/g" "$file"

        sed -i.tmp "s/import { MatLegacyButtonModule as MatButtonModule } from '@angular\/material\/legacy-button';/import { MatButtonModule } from '@angular\/material\/button';/g" "$file"
        sed -i.tmp "s/import { MatLegacyButtonModule } from '@angular\/material\/legacy-button';/import { MatButtonModule } from '@angular\/material\/button';/g" "$file"

        sed -i.tmp "s/import { MatLegacyCardModule as MatCardModule } from '@angular\/material\/legacy-card';/import { MatCardModule } from '@angular\/material\/card';/g" "$file"
        sed -i.tmp "s/import { MatLegacyCardModule } from '@angular\/material\/legacy-card';/import { MatCardModule } from '@angular\/material\/card';/g" "$file"

        sed -i.tmp "s/import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular\/material\/legacy-checkbox';/import { MatCheckboxModule } from '@angular\/material\/checkbox';/g" "$file"
        sed -i.tmp "s/import { MatLegacyCheckboxModule } from '@angular\/material\/legacy-checkbox';/import { MatCheckboxModule } from '@angular\/material\/checkbox';/g" "$file"

        sed -i.tmp "s/import { MatLegacyChipsModule as MatChipsModule } from '@angular\/material\/legacy-chips';/import { MatChipsModule } from '@angular\/material\/chips';/g" "$file"
        sed -i.tmp "s/import { MatLegacyChipsModule } from '@angular\/material\/legacy-chips';/import { MatChipsModule } from '@angular\/material\/chips';/g" "$file"

        sed -i.tmp "s/import { MatLegacyDialogModule as MatDialogModule } from '@angular\/material\/legacy-dialog';/import { MatDialogModule } from '@angular\/material\/dialog';/g" "$file"
        sed -i.tmp "s/import { MatLegacyDialogModule } from '@angular\/material\/legacy-dialog';/import { MatDialogModule } from '@angular\/material\/dialog';/g" "$file"
        sed -i.tmp "s/import { MatLegacyDialog as MatDialog } from '@angular\/material\/legacy-dialog';/import { MatDialog } from '@angular\/material\/dialog';/g" "$file"

        sed -i.tmp "s/import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular\/material\/legacy-form-field';/import { MatFormFieldModule } from '@angular\/material\/form-field';/g" "$file"
        sed -i.tmp "s/import { MatLegacyFormFieldModule } from '@angular\/material\/legacy-form-field';/import { MatFormFieldModule } from '@angular\/material\/form-field';/g" "$file"

        sed -i.tmp "s/import { MatLegacyInputModule as MatInputModule } from '@angular\/material\/legacy-input';/import { MatInputModule } from '@angular\/material\/input';/g" "$file"
        sed -i.tmp "s/import { MatLegacyInputModule } from '@angular\/material\/legacy-input';/import { MatInputModule } from '@angular\/material\/input';/g" "$file"

        sed -i.tmp "s/import { MatLegacyListModule as MatListModule } from '@angular\/material\/legacy-list';/import { MatListModule } from '@angular\/material\/list';/g" "$file"
        sed -i.tmp "s/import { MatLegacyListModule } from '@angular\/material\/legacy-list';/import { MatListModule } from '@angular\/material\/list';/g" "$file"

        sed -i.tmp "s/import { MatLegacyMenuModule as MatMenuModule } from '@angular\/material\/legacy-menu';/import { MatMenuModule } from '@angular\/material\/menu';/g" "$file"
        sed -i.tmp "s/import { MatLegacyMenuModule } from '@angular\/material\/legacy-menu';/import { MatMenuModule } from '@angular\/material\/menu';/g" "$file"

        sed -i.tmp "s/import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular\/material\/legacy-paginator';/import { MatPaginatorModule } from '@angular\/material\/paginator';/g" "$file"
        sed -i.tmp "s/import { MatLegacyPaginatorModule } from '@angular\/material\/legacy-paginator';/import { MatPaginatorModule } from '@angular\/material\/paginator';/g" "$file"

        sed -i.tmp "s/import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular\/material\/legacy-progress-bar';/import { MatProgressBarModule } from '@angular\/material\/progress-bar';/g" "$file"
        sed -i.tmp "s/import { MatLegacyProgressBarModule } from '@angular\/material\/legacy-progress-bar';/import { MatProgressBarModule } from '@angular\/material\/progress-bar';/g" "$file"

        sed -i.tmp "s/import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular\/material\/legacy-progress-spinner';/import { MatProgressSpinnerModule } from '@angular\/material\/progress-spinner';/g" "$file"
        sed -i.tmp "s/import { MatLegacyProgressSpinnerModule } from '@angular\/material\/legacy-progress-spinner';/import { MatProgressSpinnerModule } from '@angular\/material\/progress-spinner';/g" "$file"

        sed -i.tmp "s/import { MatLegacyRadioModule as MatRadioModule } from '@angular\/material\/legacy-radio';/import { MatRadioModule } from '@angular\/material\/radio';/g" "$file"
        sed -i.tmp "s/import { MatLegacyRadioModule } from '@angular\/material\/legacy-radio';/import { MatRadioModule } from '@angular\/material\/radio';/g" "$file"

        sed -i.tmp "s/import { MatLegacySelectModule as MatSelectModule } from '@angular\/material\/legacy-select';/import { MatSelectModule } from '@angular\/material\/select';/g" "$file"
        sed -i.tmp "s/import { MatLegacySelectModule } from '@angular\/material\/legacy-select';/import { MatSelectModule } from '@angular\/material\/select';/g" "$file"

        sed -i.tmp "s/import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular\/material\/legacy-slide-toggle';/import { MatSlideToggleModule } from '@angular\/material\/slide-toggle';/g" "$file"
        sed -i.tmp "s/import { MatLegacySlideToggleModule } from '@angular\/material\/legacy-slide-toggle';/import { MatSlideToggleModule } from '@angular\/material\/slide-toggle';/g" "$file"

        sed -i.tmp "s/import { MatLegacySliderModule as MatSliderModule } from '@angular\/material\/legacy-slider';/import { MatSliderModule } from '@angular\/material\/slider';/g" "$file"
        sed -i.tmp "s/import { MatLegacySliderModule } from '@angular\/material\/legacy-slider';/import { MatSliderModule } from '@angular\/material\/slider';/g" "$file"

        sed -i.tmp "s/import { MatLegacySnackBar as MatSnackBar } from '@angular\/material\/legacy-snack-bar';/import { MatSnackBar } from '@angular\/material\/snack-bar';/g" "$file"
        sed -i.tmp "s/import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular\/material\/legacy-snack-bar';/import { MatSnackBarModule } from '@angular\/material\/snack-bar';/g" "$file"
        sed -i.tmp "s/import { MatLegacySnackBarModule } from '@angular\/material\/legacy-snack-bar';/import { MatSnackBarModule } from '@angular\/material\/snack-bar';/g" "$file"

        sed -i.tmp "s/import { MatLegacyTableModule as MatTableModule } from '@angular\/material\/legacy-table';/import { MatTableModule } from '@angular\/material\/table';/g" "$file"
        sed -i.tmp "s/import { MatLegacyTableModule } from '@angular\/material\/legacy-table';/import { MatTableModule } from '@angular\/material\/table';/g" "$file"

        sed -i.tmp "s/import { MatLegacyTabsModule as MatTabsModule } from '@angular\/material\/legacy-tabs';/import { MatTabsModule } from '@angular\/material\/tabs';/g" "$file"
        sed -i.tmp "s/import { MatLegacyTabsModule } from '@angular\/material\/legacy-tabs';/import { MatTabsModule } from '@angular\/material\/tabs';/g" "$file"

        sed -i.tmp "s/import { MatLegacyTooltipModule as MatTooltipModule } from '@angular\/material\/legacy-tooltip';/import { MatTooltipModule } from '@angular\/material\/tooltip';/g" "$file"
        sed -i.tmp "s/import { MatLegacyTooltipModule } from '@angular\/material\/legacy-tooltip';/import { MatTooltipModule } from '@angular\/material\/tooltip';/g" "$file"

        rm -f "$file.tmp"
        MODIFIED_TS=$((MODIFIED_TS + 1))
        print_success "Updated: $file"
    fi
done

print_success "Modified $MODIFIED_TS TypeScript files"

# Step 2: Update SCSS files - replace legacy CSS classes
print_info "Updating SCSS files to use MDC class names..."

SCSS_FILES=$(find src -name "*.scss" -o -name "*.css" -type f)
MODIFIED_SCSS=0

for file in $SCSS_FILES; do
    if grep -q "\.mat-legacy-" "$file"; then
        cp "$file" "$file.backup"

        # Replace legacy CSS classes with MDC equivalents
        sed -i.tmp 's/\.mat-legacy-button/\.mat-mdc-button/g' "$file"
        sed -i.tmp 's/\.mat-legacy-raised-button/\.mat-mdc-raised-button/g' "$file"
        sed -i.tmp 's/\.mat-legacy-icon-button/\.mat-mdc-icon-button/g' "$file"
        sed -i.tmp 's/\.mat-legacy-fab/\.mat-mdc-fab/g' "$file"
        sed -i.tmp 's/\.mat-legacy-mini-fab/\.mat-mdc-mini-fab/g' "$file"
        sed -i.tmp 's/\.mat-legacy-card/\.mat-mdc-card/g' "$file"
        sed -i.tmp 's/\.mat-legacy-checkbox/\.mat-mdc-checkbox/g' "$file"
        sed -i.tmp 's/\.mat-legacy-chip/\.mat-mdc-chip/g' "$file"
        sed -i.tmp 's/\.mat-legacy-form-field/\.mat-mdc-form-field/g' "$file"
        sed -i.tmp 's/\.mat-legacy-input/\.mat-mdc-input/g' "$file"
        sed -i.tmp 's/\.mat-legacy-list/\.mat-mdc-list/g' "$file"
        sed -i.tmp 's/\.mat-legacy-menu/\.mat-mdc-menu/g' "$file"
        sed -i.tmp 's/\.mat-legacy-paginator/\.mat-mdc-paginator/g' "$file"
        sed -i.tmp 's/\.mat-legacy-progress-bar/\.mat-mdc-progress-bar/g' "$file"
        sed -i.tmp 's/\.mat-legacy-progress-spinner/\.mat-mdc-progress-spinner/g' "$file"
        sed -i.tmp 's/\.mat-legacy-radio/\.mat-mdc-radio/g' "$file"
        sed -i.tmp 's/\.mat-legacy-select/\.mat-mdc-select/g' "$file"
        sed -i.tmp 's/\.mat-legacy-slide-toggle/\.mat-mdc-slide-toggle/g' "$file"
        sed -i.tmp 's/\.mat-legacy-slider/\.mat-mdc-slider/g' "$file"
        sed -i.tmp 's/\.mat-legacy-snack-bar/\.mat-mdc-snack-bar/g' "$file"
        sed -i.tmp 's/\.mat-legacy-table/\.mat-mdc-table/g' "$file"
        sed -i.tmp 's/\.mat-legacy-tab/\.mat-mdc-tab/g' "$file"
        sed -i.tmp 's/\.mat-legacy-tooltip/\.mat-mdc-tooltip/g' "$file"

        # Special cases for nested classes
        sed -i.tmp 's/\.mat-legacy-toolbar/\.mat-toolbar/g' "$file"

        rm -f "$file.tmp"
        MODIFIED_SCSS=$((MODIFIED_SCSS + 1))
        print_success "Updated: $file"
    fi
done

print_success "Modified $MODIFIED_SCSS SCSS/CSS files"

# Step 3: Remove legacy theme from styles.scss
print_info "Updating styles.scss to remove legacy theme..."

if [ -f "src/styles.scss" ]; then
    if grep -q "all-legacy-component-themes" src/styles.scss; then
        cp src/styles.scss src/styles.scss.backup

        # Remove the legacy theme line
        sed -i.tmp '/@include mat\.all-legacy-component-themes/d' src/styles.scss

        rm -f src/styles.scss.tmp
        print_success "Removed legacy theme from styles.scss"
    else
        print_info "No legacy theme found in styles.scss"
    fi
else
    print_warning "src/styles.scss not found"
fi

# Step 4: Add appearance="outline" to mat-form-field in HTML files
print_info "Adding appearance='outline' to mat-form-field elements..."

HTML_FILES=$(find src -name "*.html" -type f)
MODIFIED_HTML=0

for file in $HTML_FILES; do
    if grep -q "<mat-form-field" "$file"; then
        # Check if any mat-form-field is missing appearance
        if grep -q '<mat-form-field[^>]*>' "$file" && ! grep -q '<mat-form-field[^>]*appearance=' "$file"; then
            cp "$file" "$file.backup"

            # Add appearance="outline" to mat-form-field tags that don't have it
            sed -i.tmp 's/<mat-form-field\([^>]*\)>/<mat-form-field appearance="outline"\1>/g' "$file"

            # Clean up if appearance was already there (avoid duplicates)
            sed -i.tmp 's/appearance="outline" appearance="[^"]*"/appearance="outline"/g' "$file"

            rm -f "$file.tmp"
            MODIFIED_HTML=$((MODIFIED_HTML + 1))
            print_success "Added appearance to: $file"
        fi
    fi
done

print_success "Modified $MODIFIED_HTML HTML files"

# Step 5: Test build
print_info "Testing build..."
if npm run build; then
    print_success "Build successful!"
else
    print_error "Build failed. Check errors above."
    print_info "You can restore from .backup files if needed"
    exit 1
fi

# Step 6: Commit changes
print_info "Committing Phase 3 changes..."
git add -A
git commit -m "Phase 3: Material Legacy to MDC migration complete

- Updated all Material Legacy imports to MDC equivalents
- Updated $MODIFIED_TS TypeScript files
- Updated $MODIFIED_SCSS SCSS/CSS files (mat-legacy-* → mat-mdc-*)
- Removed legacy theme from styles.scss
- Added appearance='outline' to form fields ($MODIFIED_HTML files)
- Build successful" || print_warning "Nothing to commit"

# Cleanup backups
read -p "Delete .backup files? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    find src -name "*.backup" -delete
    print_success "Backup files deleted"
fi

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Phase 3 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_success "Material Legacy components migrated to MDC"
print_success "All imports updated"
print_success "All CSS classes updated"
print_success "Form fields updated with appearance attribute"
print_success "Build tested successfully"
echo ""
print_info "Next step: Run phase4-angular-updates.sh"
echo ""
