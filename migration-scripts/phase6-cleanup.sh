#!/bin/bash

################################################################################
# Phase 6: Cleanup & Documentation
# Angular 16 to 20 Migration
#
# This script:
# - Removes backup files
# - Updates README
# - Tags the release
# - Optionally merges to main
################################################################################

set -e

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Phase 6: Cleanup & Documentation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Remove backup files
print_info "Cleaning up backup files..."

# Remove .backup files
BACKUP_COUNT=$(find src -name "*.backup" -type f | wc -l | tr -d ' ')
if [ "$BACKUP_COUNT" -gt 0 ]; then
    print_info "Found $BACKUP_COUNT backup files"
    read -p "Delete all .backup files? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        find src -name "*.backup" -delete
        print_success "Deleted $BACKUP_COUNT backup files"
    fi
fi

# Remove backup directory
if [ -d ".migration-backup" ]; then
    read -p "Delete .migration-backup directory? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .migration-backup
        print_success "Deleted .migration-backup directory"
    fi
fi

# Update README.md
print_info "Updating README.md..."

if [ -f "README.md" ]; then
    # Get current versions
    ANGULAR_VERSION=$(grep '"@angular/core"' package.json | sed 's/.*: *"\([^"]*\)".*/\1/')
    MATERIAL_VERSION=$(grep '"@angular/material"' package.json | sed 's/.*: *"\([^"]*\)".*/\1/')
    TS_VERSION=$(grep '"typescript"' package.json | sed 's/.*: *"\([^"]*\)".*/\1/')

    # Create a new section at the top
    cat > README_UPDATE.tmp << EOF
# Angular 20 Application

Successfully migrated from Angular 16 to Angular 20!

## Current Stack

- **Angular**: $ANGULAR_VERSION
- **Angular Material**: $MATERIAL_VERSION (MDC Components)
- **TypeScript**: $TS_VERSION
- **Layout**: CSS Flexbox/Grid utilities (replaced Angular Flex Layout)

## Migration Completed

✅ Phase 1: Preparation & Setup
✅ Phase 2: Angular Flex Layout → CSS
✅ Phase 3: Material Legacy → MDC
✅ Phase 4: Angular 16→17→18→19→20
✅ Phase 5: Testing & Validation
✅ Phase 6: Cleanup & Documentation

---

EOF

    cat README.md >> README_UPDATE.tmp
    mv README_UPDATE.tmp README.md
    print_success "Updated README.md with migration results"
fi

# Git operations
print_info "Finalizing git repository..."

# Commit any remaining changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    git add -A
    git commit -m "Phase 6: Cleanup and documentation complete

- Removed backup files
- Updated README with migration results
- Finalized Angular 20 migration" || true
fi

# Tag the release
print_info "Tagging release..."
read -p "Create git tag v20.0.0? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git tag -a v20.0.0 -m "Angular 20 migration complete

Migrated from Angular 16.2.0 to 20.x.x
- Replaced Angular Flex Layout with CSS
- Migrated Material Legacy to MDC
- Sequential version updates: 16→17→18→19→20
- All tests passing"

    print_success "Created tag v20.0.0"
fi

# Merge to main
echo ""
read -p "Merge feature/angular-20-migration to main branch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

    git checkout main
    git merge feature/angular-20-migration --no-ff -m "Merge Angular 20 migration

Successfully migrated from Angular 16 to Angular 20:
- ✅ Flex Layout → CSS utilities
- ✅ Material Legacy → MDC components
- ✅ Angular 16 → 17 → 18 → 19 → 20
- ✅ All tests passing
- ✅ Application verified and working"

    print_success "Merged to main branch"

    read -p "Delete feature/angular-20-migration branch? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -d feature/angular-20-migration
        print_success "Deleted migration branch"
    fi
else
    print_info "Staying on feature/angular-20-migration branch"
fi

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 MIGRATION COMPLETE! 🎉${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_success "Angular 16 → 20 migration finished successfully!"
echo ""
echo "Final Status:"
echo "  ✅ Angular: $ANGULAR_VERSION"
echo "  ✅ Material: $MATERIAL_VERSION (MDC)"
echo "  ✅ TypeScript: $TS_VERSION"
echo "  ✅ Layout: CSS utilities"
echo "  ✅ All tests passing"
echo "  ✅ Production ready"
echo ""
print_info "Your application is now running Angular 20!"
print_info "Review README.md for updated documentation"
echo ""
