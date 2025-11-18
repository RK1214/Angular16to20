#!/bin/bash

################################################################################
# Phase 3: Material Legacy → MDC Migration
# Angular 16 to 20 Migration
#
# This script:
# - Runs Angular Material's automatic MDC migration
# - Migrates all legacy components to MDC equivalents
# - Configures global MAT_FORM_FIELD_DEFAULT_OPTIONS
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

# Step 1: Run Angular Material MDC migration
print_info "Running Angular Material MDC migration..."
print_warning "This will automatically migrate all Material Legacy components to MDC"
echo ""

ng generate @angular/material:mdc-migration

print_success "Material MDC migration completed"

# Step 2: Configure global form field appearance
print_info "Configuring global MAT_FORM_FIELD_DEFAULT_OPTIONS..."

# Find all module files that import MatFormFieldModule
MODULE_FILES=$(find src -name "*.module.ts" -type f)

for module_file in $MODULE_FILES; do
    if grep -q "MatFormFieldModule" "$module_file"; then
        # Check if already has MAT_FORM_FIELD_DEFAULT_OPTIONS
        if ! grep -q "MAT_FORM_FIELD_DEFAULT_OPTIONS" "$module_file"; then
            # Add import for MAT_FORM_FIELD_DEFAULT_OPTIONS
            if grep -q "from '@angular/material/form-field'" "$module_file"; then
                # Add the import
                sed -i.tmp "/MatFormFieldModule.*from '@angular\/material\/form-field'/a\\
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
" "$module_file"
            fi

            # Add provider if providers array exists
            if grep -q "providers: \[" "$module_file"; then
                # Add to existing providers
                sed -i.tmp "/providers: \[/a\\
    {\\
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,\\
      useValue: { appearance: 'outline' }\\
    }," "$module_file"
            else
                # Add new providers array before closing brace
                sed -i.tmp "/imports: \[/,/\]/a\\
  ],\\
  providers: [\\
    {\\
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,\\
      useValue: { appearance: 'outline' }\\
    }\\
  " "$module_file"
            fi

            rm -f "$module_file.tmp"
            print_success "Configured global form field appearance in: $module_file"
        fi
    fi
done

print_success "Global form field configuration complete"

# Step 3: Remove redundant appearance attributes from templates
print_info "Removing redundant appearance attributes from templates..."

HTML_FILES=$(find src -name "*.html" -type f)
CLEANED_COUNT=0

for file in $HTML_FILES; do
    if grep -q 'mat-form-field.*appearance=' "$file"; then
        sed -i.tmp 's/ appearance="[^"]*"//g' "$file"
        sed -i.tmp "s/ appearance='[^']*'//g" "$file"
        rm -f "$file.tmp"
        CLEANED_COUNT=$((CLEANED_COUNT + 1))
        print_success "Cleaned: $file"
    fi
done

print_success "Cleaned $CLEANED_COUNT template(s)"

# Step 4: Test build
print_info "Testing build..."
if npm run build; then
    print_success "Build successful!"
else
    print_error "Build failed. Check errors above."
    exit 1
fi

# Step 5: Commit changes
print_info "Committing Phase 3 changes..."
git add -A
git commit -m "Phase 3: Material Legacy to MDC migration complete

- Ran Angular Material MDC migration (ng generate @angular/material:mdc-migration)
- Configured global MAT_FORM_FIELD_DEFAULT_OPTIONS (appearance: outline)
- Removed redundant appearance attributes from $CLEANED_COUNT template(s)
- Build successful" || print_warning "Nothing to commit"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Phase 3 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_success "Material Legacy components migrated to MDC"
print_success "Global form field appearance configured"
print_success "Templates cleaned"
print_success "Build tested successfully"
echo ""
print_info "Next step: Run phase4-angular-updates.sh"
echo ""
