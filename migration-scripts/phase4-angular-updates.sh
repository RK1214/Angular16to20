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

# Check if using angular-in-memory-web-api
USING_INMEMORY_API=false
if grep -q "angular-in-memory-web-api" package.json; then
    USING_INMEMORY_API=true
    print_info "Detected angular-in-memory-web-api - will update versions accordingly"
fi

#
# Angular 16 → 17
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 1/4: Angular 16 → 17${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating to Angular 17..."
ng update @angular/core@17 @angular/cli@17 --force

print_info "Updating Material to 17..."
ng update @angular/material@17 --force

if [ "$USING_INMEMORY_API" = true ]; then
    print_info "Updating angular-in-memory-web-api to 0.17.0..."
    npm install angular-in-memory-web-api@0.17.0 --save --legacy-peer-deps
fi

print_info "Testing Angular 17 build..."
npm run build

git add -A
git commit -m "Phase 4.1: Updated to Angular 17

- Angular core: 17.3.x
- Material: 17.3.x
- TypeScript: 5.4.x
- zone.js: 0.14.x
$([ "$USING_INMEMORY_API" = true ] && echo "- angular-in-memory-web-api: 0.17.0")" || true

print_success "Angular 17 update complete!"

#
# Angular 17 → 18
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 2/4: Angular 17 → 18${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating to Angular 18..."
ng update @angular/core@18 @angular/cli@18 --force

print_warning "Angular 18 may convert HttpClientModule to provideHttpClient()"
print_warning "If using angular-in-memory-web-api, you'll need to revert this"

print_info "Updating Material to 18..."
ng update @angular/material@18 --force

if [ "$USING_INMEMORY_API" = true ]; then
    print_info "Updating angular-in-memory-web-api to 0.18.0..."
    npm install angular-in-memory-web-api@0.18.0 --save --legacy-peer-deps

    # Check if HttpClientModule was converted
    if grep -q "provideHttpClient" src/app/app.module.ts; then
        print_warning "Detected provideHttpClient conversion - reverting for InMemoryWebApi compatibility"

        # Backup
        cp src/app/app.module.ts src/app/app.module.ts.backup

        # Revert to HttpClientModule
        sed -i.tmp "s/import { provideHttpClient, withInterceptorsFromDi } from '@angular\/common\/http';/import { HttpClientModule } from '@angular\/common\/http';/g" src/app/app.module.ts
        sed -i.tmp 's/, providers:.*provideHttpClient.*$/]/g' src/app/app.module.ts

        # Add HttpClientModule to imports if not present
        if ! grep -q "HttpClientModule," src/app/app.module.ts; then
            sed -i.tmp '/imports: \[/a\    HttpClientModule,' src/app/app.module.ts
        fi

        rm -f src/app/app.module.ts.tmp
        print_success "Reverted to HttpClientModule for InMemoryWebApi compatibility"
    fi
fi

print_info "Testing Angular 18 build..."
npm run build

git add -A
git commit -m "Phase 4.2: Updated to Angular 18

- Angular core: 18.2.x
- Material: 18.2.x (M2 theme API)
- Theme API updated to mat.m2-define-palette()
$([ "$USING_INMEMORY_API" = true ] && echo "- angular-in-memory-web-api: 0.18.0")
$([ "$USING_INMEMORY_API" = true ] && echo "- Reverted to HttpClientModule for compatibility")" || true

print_success "Angular 18 update complete!"

#
# Angular 18 → 19
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 3/4: Angular 18 → 19${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating to Angular 19..."
ng update @angular/core@19 @angular/cli@19 --force

print_info "Updating Material to 19..."
ng update @angular/material@19 --force

if [ "$USING_INMEMORY_API" = true ]; then
    print_info "Updating angular-in-memory-web-api to 0.19.0..."
    npm install angular-in-memory-web-api@0.19.0 --save --legacy-peer-deps
fi

print_info "Testing Angular 19 build..."
npm run build

git add -A
git commit -m "Phase 4.3: Updated to Angular 19

- Angular core: 19.2.x
- Material: 19.2.x
- TypeScript: 5.8.x
- zone.js: 0.15.x
- Added 'standalone: false' to all components
- Added elevation and background mixins to styles
$([ "$USING_INMEMORY_API" = true ] && echo "- angular-in-memory-web-api: 0.19.0")" || true

print_success "Angular 19 update complete!"

#
# Angular 19 → 20
#
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 4/4: Angular 19 → 20${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_info "Updating to Angular 20..."
ng update @angular/core@20 @angular/cli@20 --force

print_info "Updating Material to 20..."
ng update @angular/material@20 --force

if [ "$USING_INMEMORY_API" = true ]; then
    print_info "Updating angular-in-memory-web-api to 0.20.0..."
    npm install angular-in-memory-web-api@0.20.0 --save --legacy-peer-deps
fi

print_info "Testing Angular 20 build..."
npm run build

git add -A
git commit -m "Phase 4.4: Updated to Angular 20 - FINAL VERSION!

- Angular core: 20.3.x
- Material: 20.2.x
- TypeScript: 5.8.x
- tsconfig moduleResolution: bundler
$([ "$USING_INMEMORY_API" = true ] && echo "- angular-in-memory-web-api: 0.20.0")

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
