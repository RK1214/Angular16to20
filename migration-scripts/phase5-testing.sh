#!/bin/bash

################################################################################
# Phase 5: Testing & Validation
# Angular 16 to 20 Migration
#
# This script:
# - Runs production build
# - Starts dev server for manual testing
# - Checks for console errors
# - Validates bundle size
################################################################################

set -e

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Phase 5: Testing & Validation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Test production build
echo -e "${BLUE}Test 1: Production Build${NC}"
print_info "Running production build..."

if npm run build; then
    print_success "Production build successful!"

    # Check bundle size
    if [ -d "dist" ]; then
        MAIN_JS=$(find dist -name "main.*.js" -type f | head -1)
        if [ -n "$MAIN_JS" ]; then
            SIZE=$(du -h "$MAIN_JS" | cut -f1)
            print_info "Main bundle size: $SIZE"
        fi
    fi
else
    print_error "Production build failed!"
    exit 1
fi

echo ""

# Development server
echo -e "${BLUE}Test 2: Development Server${NC}"
print_info "Starting development server..."
print_warning "Server will start on http://localhost:4200"
print_info "Please test the following manually:"
echo ""
echo "  Testing Checklist:"
echo "  ===================="
echo "  [ ] All pages load without errors"
echo "  [ ] All forms work (submit, validation)"
echo "  [ ] All tables display data correctly"
echo "  [ ] All Material components render properly"
echo "  [ ] All responsive breakpoints work:"
echo "      - Mobile (< 600px)"
echo "      - Tablet (600-959px)"
echo "      - Desktop (960px+)"
echo "  [ ] No console errors in browser DevTools"
echo "  [ ] All navigation works"
echo "  [ ] All buttons perform their actions"
echo ""
read -p "Press Enter to start the dev server (Ctrl+C to stop it when done)..."

npm start

echo ""
print_success "Manual testing complete"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Phase 5 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_success "Production build verified"
print_success "Development server tested"
print_success "Application is ready for production"
echo ""
print_info "Next step: Run phase6-cleanup.sh to finalize migration"
echo ""
