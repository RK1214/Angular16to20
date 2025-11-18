#!/bin/bash

################################################################################
# Phase 4: Angular Version Updates (16 → 17 → 18 → 19 → 20)
# Angular 16 to 20 Migration
#
# This script runs all four Angular version updates sequentially:
# - Angular 16 → 17
# - Angular 17 → 18
# - Angular 18 → 19
# - Angular 19 → 20
#
# Including Material and auxiliary package updates
#
# Post-migration steps:
# - Sets all components, directives, and pipes to standalone: false
#   (maintains NgModule compatibility for non-standalone projects)
################################################################################

set -e

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Phase 4: Angular Version Updates (16→17→18→19→20)${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Confirm before proceeding
print_warning "This will update Angular from 16 to 20 through all intermediate versions"
print_warning "This process will take 15-30 minutes and requires internet connection"
echo ""
read -p "Continue with Angular updates? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Migration cancelled"
    exit 0
fi

#
# Angular 16 → 17
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 1/4: Angular 16 → 17${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating Angular Core and CLI to 17..."
ng update @angular/core@17 @angular/cli@17 --force

print_info "Committing Angular Core 17 update..."
git add -A
git commit -m "Phase 4.1a: Updated Angular Core and CLI to 17

- @angular/core: 17.x
- @angular/cli: 17.x
- TypeScript: 5.4.x
- zone.js: 0.14.x" || true

print_info "Updating Angular Material to 17..."
ng update @angular/material@17 --force

print_info "Committing Material 17 update..."
git add -A
git commit -m "Phase 4.1b: Updated Angular Material to 17

- @angular/material: 17.x
- @angular/cdk: 17.x" || true

print_info "Testing Angular 17 build..."
npm run build

print_success "Angular 17 update complete!"

#
# Angular 17 → 18
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 2/4: Angular 17 → 18${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating Angular Core and CLI to 18..."
ng update @angular/core@18 @angular/cli@18 --force

print_info "Committing Angular Core 18 update..."
git add -A
git commit -m "Phase 4.2a: Updated Angular Core and CLI to 18

- @angular/core: 18.x
- @angular/cli: 18.x
- TypeScript: 5.5.x" || true

print_info "Updating Angular Material to 18..."
ng update @angular/material@18 --force

print_info "Committing Material 18 update..."
git add -A
git commit -m "Phase 4.2b: Updated Angular Material to 18

- @angular/material: 18.x
- @angular/cdk: 18.x
- Theme API updated to mat.m2-define-palette()" || true

print_info "Testing Angular 18 build..."
npm run build

print_success "Angular 18 update complete!"

#
# Angular 18 → 19
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 3/4: Angular 18 → 19${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating Angular Core and CLI to 19..."
ng update @angular/core@19 @angular/cli@19 --force

print_info "Committing Angular Core 19 update..."
git add -A
git commit -m "Phase 4.3a: Updated Angular Core and CLI to 19

- @angular/core: 19.x
- @angular/cli: 19.x
- TypeScript: 5.7.x
- zone.js: 0.15.x" || true

print_info "Updating Angular Material to 19..."
ng update @angular/material@19 --force

print_info "Committing Material 19 update..."
git add -A
git commit -m "Phase 4.3b: Updated Angular Material to 19

- @angular/material: 19.x
- @angular/cdk: 19.x" || true

print_info "Testing Angular 19 build..."
npm run build

print_success "Angular 19 update complete!"

#
# Angular 19 → 20
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 4/4: Angular 19 → 20${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating Angular Core and CLI to 20..."
ng update @angular/core@20 @angular/cli@20 --force

print_info "Committing Angular Core 20 update..."
git add -A
git commit -m "Phase 4.4a: Updated Angular Core and CLI to 20

- @angular/core: 20.x
- @angular/cli: 20.x
- TypeScript: 5.8.x
- tsconfig moduleResolution: bundler" || true

print_info "Updating Angular Material to 20..."
ng update @angular/material@20 --force

print_info "Committing Material 20 update..."
git add -A
git commit -m "Phase 4.4b: Updated Angular Material to 20

- @angular/material: 20.x
- @angular/cdk: 20.x" || true

# Step: Ensure all components, directives, and pipes are set to standalone: false
# This maintains NgModule compatibility for projects not migrating to standalone components
echo ""
print_info "Setting all components, directives, and pipes to standalone: false for NgModule compatibility..."

# Find all TypeScript files with @Component, @Directive, or @Pipe decorators
TS_FILES=$(find src -type f -name "*.ts")
MODIFIED_COUNT=0

for file in $TS_FILES; do
    # Check if file contains @Component, @Directive, or @Pipe decorator
    if grep -q "@Component\|@Directive\|@Pipe" "$file"; then
        NEEDS_UPDATE=false

        # Check if standalone: true exists
        if grep -q "standalone: *true" "$file"; then
            NEEDS_UPDATE=true
            ACTION="Changed standalone: true to false"
        # Check if file has decorator but no standalone property
        elif grep -q "@Component\|@Directive\|@Pipe" "$file" && ! grep -q "standalone:" "$file"; then
            NEEDS_UPDATE=true
            ACTION="Added standalone: false"
        fi

        if [ "$NEEDS_UPDATE" = true ]; then
            cp "$file" "$file.backup"

            # Case 1: Change standalone: true to standalone: false
            sed -i.tmp 's/standalone: *true/standalone: false/g' "$file"

            # Case 2: Add standalone: false to decorators that don't have it
            # For @Component decorator
            if grep -q "@Component" "$file" && ! grep -q "standalone:" "$file"; then
                # Add standalone: false after the opening brace of decorator metadata
                sed -i.tmp '/@Component({/a\
  standalone: false,' "$file"
            fi

            # For @Directive decorator
            if grep -q "@Directive" "$file" && ! grep -q "standalone:" "$file"; then
                sed -i.tmp '/@Directive({/a\
  standalone: false,' "$file"
            fi

            # For @Pipe decorator
            if grep -q "@Pipe" "$file" && ! grep -q "standalone:" "$file"; then
                sed -i.tmp '/@Pipe({/a\
  standalone: false,' "$file"
            fi

            rm -f "$file.tmp"
            MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
            print_success "$ACTION in: $file"
        fi
    fi
done

if [ $MODIFIED_COUNT -gt 0 ]; then
    print_success "Updated $MODIFIED_COUNT component(s)/directive(s)/pipe(s) to standalone: false"
else
    print_info "All components/directives/pipes already have standalone: false (or are using NgModules)"
fi

print_info "Testing Angular 20 build..."
npm run build

print_info "Committing standalone: false changes..."
git add -A
git commit -m "Phase 4.4c: Set all components/directives/pipes to standalone: false

- Ensures NgModule compatibility for non-standalone projects
- Modified $MODIFIED_COUNT component(s)/directive(s)/pipe(s)
- All @Component, @Directive, and @Pipe decorators now have standalone: false

🎉 Angular 20 migration complete!" || true

print_success "Angular 20 update complete!"

# Final verification
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Phase 4 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

print_success "All Angular version updates completed successfully!"
echo ""
print_info "Final versions:"
ANGULAR_VERSION=$(grep '"@angular/core"' package.json | sed 's/.*: *"\([^"]*\)".*/\1/')
MATERIAL_VERSION=$(grep '"@angular/material"' package.json | sed 's/.*: *"\([^"]*\)".*/\1/')
TS_VERSION=$(grep '"typescript"' package.json | sed 's/.*: *"\([^"]*\)".*/\1/')

echo "  - Angular: $ANGULAR_VERSION"
echo "  - Material: $MATERIAL_VERSION"
echo "  - TypeScript: $TS_VERSION"
echo ""
print_info "Next step: Run phase5-testing.sh"
echo ""
