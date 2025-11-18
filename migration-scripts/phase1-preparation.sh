#!/bin/bash

################################################################################
# Phase 1: Preparation & Setup
# Angular 16 to 20 Migration
#
# This script:
# - Checks prerequisites
# - Creates inventory of components
# - Analyzes Flex Layout and Material Legacy usage
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Phase 1: Preparation & Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if we're in an Angular project
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

if ! grep -q "@angular/core" package.json; then
    print_error "This doesn't appear to be an Angular project"
    exit 1
fi

print_success "Detected Angular project"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js version check passed: $(node -v)"

# Check npm version
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 9 ]; then
    print_warning "npm 9+ is recommended. Current version: $(npm -v)"
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized"
    read -p "Initialize git repository? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        print_success "Git repository initialized"
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_warning "You have uncommitted changes"
    read -p "Commit all changes before proceeding? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        git commit -m "Pre-migration commit - Angular 16 state"
        print_success "Changes committed"
    fi
fi

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_info "Working on branch: $CURRENT_BRANCH"
print_warning "Migration will proceed on the current branch"
echo ""

# Create inventory
print_info "Creating migration inventory..."

cat > MIGRATION_INVENTORY.md << 'EOF'
# Migration Inventory

Generated: $(date)

## Current Versions

EOF

# Detect current versions
ANGULAR_VERSION=$(grep '"@angular/core"' package.json | sed 's/.*: *"\(.*\)".*/\1/')
MATERIAL_VERSION=$(grep '"@angular/material"' package.json | sed 's/.*: *"\(.*\)".*/\1/')
TYPESCRIPT_VERSION=$(grep '"typescript"' package.json | sed 's/.*: *"\(.*\)".*/\1/')

cat >> MIGRATION_INVENTORY.md << EOF
- Angular: $ANGULAR_VERSION
- Material: $MATERIAL_VERSION
- TypeScript: $TYPESCRIPT_VERSION

## Flex Layout Directives Found

EOF

# Search for Flex Layout directives
print_info "Scanning for Flex Layout directives..."

for directive in "fxLayout" "fxFlex" "fxLayoutAlign" "fxLayoutGap" "fxShow" "fxHide"; do
    COUNT=$(grep -r "$directive" src/ --include="*.html" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$COUNT" -gt 0 ]; then
        echo "- $directive: $COUNT occurrences" >> MIGRATION_INVENTORY.md
        print_info "Found $COUNT occurrences of $directive"
    fi
done

cat >> MIGRATION_INVENTORY.md << 'EOF'

## Material Legacy Components Found

EOF

# Search for Material Legacy components
print_info "Scanning for Material Legacy components..."

for component in "MatLegacyButton" "MatLegacyCard" "MatLegacyInput" "MatLegacyTable" "MatLegacyFormField" "MatLegacySelect" "MatLegacySnackBar" "MatLegacyTooltip" "MatLegacyList" "MatLegacyDialog" "MatLegacyCheckbox" "MatLegacyRadio"; do
    COUNT=$(grep -r "$component" src/ --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$COUNT" -gt 0 ]; then
        echo "- $component: $COUNT occurrences" >> MIGRATION_INVENTORY.md
        print_info "Found $COUNT occurrences of $component"
    fi
done

cat >> MIGRATION_INVENTORY.md << 'EOF'

## Files to Modify

### HTML Templates with Flex Layout:
EOF

grep -rl "fxLayout\|fxFlex\|fxShow\|fxHide" src/ --include="*.html" 2>/dev/null | while read file; do
    echo "- $file" >> MIGRATION_INVENTORY.md
done

cat >> MIGRATION_INVENTORY.md << 'EOF'

### TypeScript files with Material Legacy:
EOF

grep -rl "MatLegacy\|legacy-" src/ --include="*.ts" 2>/dev/null | while read file; do
    echo "- $file" >> MIGRATION_INVENTORY.md
done

cat >> MIGRATION_INVENTORY.md << 'EOF'

### SCSS files with Material Legacy classes:
EOF

grep -rl "\.mat-legacy-" src/ --include="*.scss" --include="*.css" 2>/dev/null | while read file; do
    echo "- $file" >> MIGRATION_INVENTORY.md
done

print_success "Migration inventory created: MIGRATION_INVENTORY.md"

# Commit changes
print_info "Committing Phase 1 changes..."
git add .gitignore MIGRATION_INVENTORY.md
git commit -m "Phase 1: Preparation and setup complete

- Created migration inventory
- Analyzed codebase for Flex Layout and Material Legacy usage

Ready to begin Phase 2: Flex Layout migration" || print_warning "Nothing to commit"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Phase 1 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_success "Migration inventory generated"
print_success "Working on branch: $CURRENT_BRANCH"
echo ""
print_info "Review MIGRATION_INVENTORY.md to see what will be migrated"
print_info "Next step: Run phase2-flex-layout-to-css.sh"
echo ""
