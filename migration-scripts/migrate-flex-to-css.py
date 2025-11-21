#!/usr/bin/env python3
"""
Robust Angular Flex Layout to CSS Migration Script
Handles all flex directive patterns including dynamic bindings, responsive breakpoints,
and complex scenarios.
"""

import re
import sys
import os
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
import argparse

class FlexMigrator:
    """Migrates Angular Flex Layout directives to CSS classes and custom directives."""

    def __init__(self, dry_run=False, verbose=False):
        self.dry_run = dry_run
        self.verbose = verbose
        self.files_modified = 0
        self.total_replacements = 0
        self.warnings = []

    def log(self, message, level='info'):
        """Log messages based on verbosity."""
        if level == 'error' or level == 'warning' or self.verbose:
            prefix = {'info': 'ℹ', 'warning': '⚠', 'error': '✗', 'success': '✓'}
            print(f"{prefix.get(level, 'ℹ')} {message}")

    def extract_directives(self, tag_content: str) -> Dict[str, any]:
        """
        Extract all flex-related directives from an HTML tag.
        Returns a dict of directive names to their values.
        """
        directives = {}

        # Pattern for all flex directives (including responsive variants)
        patterns = [
            # Static directives
            (r'fxLayout(?:\.([a-z\-]+))?="([^"]*)"', 'fxLayout'),
            (r'fxLayoutAlign(?:\.([a-z\-]+))?="([^"]*)"', 'fxLayoutAlign'),
            (r'fxLayoutGap(?:\.([a-z\-]+))?="([^"]*)"', 'fxLayoutGap'),
            (r'fxFlex(?:\.([a-z\-]+))?="([^"]*)"', 'fxFlex'),
            (r'fxFlexOrder(?:\.([a-z\-]+))?="([^"]*)"', 'fxFlexOrder'),
            (r'fxFlexOffset(?:\.([a-z\-]+))?="([^"]*)"', 'fxFlexOffset'),
            (r'fxFlexAlign(?:\.([a-z\-]+))?="([^"]*)"', 'fxFlexAlign'),
            (r'fxShow(?:\.([a-z\-]+))?(?:="([^"]*)")?', 'fxShow'),
            (r'fxHide(?:\.([a-z\-]+))?(?:="([^"]*)")?', 'fxHide'),
            # Dynamic bindings
            (r'\[fxLayout(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxLayout'),
            (r'\[fxLayoutAlign(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxLayoutAlign'),
            (r'\[fxLayoutGap(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxLayoutGap'),
            (r'\[fxFlex(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxFlex'),
            (r'\[fxFlexOrder(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxFlexOrder'),
            (r'\[fxFlexOffset(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxFlexOffset'),
            (r'\[fxFlexAlign(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxFlexAlign'),
            (r'\[fxShow(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxShow'),
            (r'\[fxHide(?:\.([a-z\-]+))?\]="([^"]*)"', 'fxHide'),
            # Standalone directives (no value)
            (r'fxFlex(?![\[\.="a-zA-Z])', 'fxFlex'),
        ]

        for pattern, directive_name in patterns:
            matches = re.finditer(pattern, tag_content)
            for match in matches:
                is_dynamic = '[' in match.group(0)
                breakpoint = match.group(1) if match.lastindex >= 1 and match.group(1) else None
                value = match.group(2) if match.lastindex >= 2 else True

                key = f"{directive_name}"
                if breakpoint:
                    key += f".{breakpoint}"

                directives[key] = {
                    'value': value,
                    'is_dynamic': is_dynamic,
                    'breakpoint': breakpoint,
                    'original': match.group(0)
                }

        # Extract existing class attribute
        class_match = re.search(r'class="([^"]*)"', tag_content)
        if class_match:
            directives['_existing_class'] = class_match.group(1)

        return directives

    def convert_layout(self, value: str, breakpoint: Optional[str] = None) -> List[str]:
        """Convert fxLayout value to CSS classes."""
        classes = []

        layout_map = {
            'row': 'flex-row',
            'column': 'flex-column',
            'row-reverse': 'flex-row-reverse',
            'column-reverse': 'flex-column-reverse',
            'row wrap': 'flex-row flex-wrap',
            'column wrap': 'flex-column flex-wrap',
        }

        base_class = layout_map.get(value, 'flex-row')

        if breakpoint:
            # For responsive layouts
            if breakpoint == 'xs':
                if 'column' in value:
                    classes.append('flex-column-xs')
                elif 'row' in value:
                    classes.append('flex-row-xs')
            elif breakpoint == 'sm':
                classes.append(f'flex-{value.replace(" ", "-")}-sm')
            # Add base layout without breakpoint
            if 'row wrap' in value or 'column wrap' in value:
                classes.append('flex-row' if 'row' in value else 'flex-column')
            elif value in ['row', 'column']:
                # Default to opposite for responsive
                classes.append('flex-column' if value == 'row' else 'flex-row')
        else:
            classes.append(base_class)

        return classes

    def convert_layout_align(self, value: str, breakpoint: Optional[str] = None) -> List[str]:
        """Convert fxLayoutAlign value to CSS classes."""
        align_map = {
            'start start': 'align-start-start',
            'start center': 'align-start-center',
            'start end': 'align-start-end',
            'center start': 'align-center-start',
            'center center': 'align-center-center',
            'center end': 'align-center-end',
            'end start': 'align-end-start',
            'end center': 'align-end-center',
            'end end': 'align-end-end',
            'space-between start': 'align-space-between-start',
            'space-between center': 'align-space-between-center',
            'space-between end': 'align-space-between-end',
            'space-around center': 'align-space-around-center',
            'space-evenly center': 'align-space-evenly-center',
        }

        css_class = align_map.get(value, 'align-start-start')
        suffix = f'-{breakpoint}' if breakpoint else ''

        return [css_class + suffix]

    def convert_flex(self, value: any, breakpoint: Optional[str] = None) -> Tuple[List[str], Optional[str]]:
        """
        Convert fxFlex value to CSS classes or directive.
        Returns (classes, directive_binding) tuple.
        """
        if value is True or value == '':
            # fxFlex with no value
            return (['flex-1'], None)

        value_str = str(value)

        # Check if it's a template expression or variable (dynamic)
        if '{{' in value_str or not re.match(r'^[\d\w\s\-\(\)%px]+$', value_str):
            # Dynamic binding - use directive
            if breakpoint:
                self.warnings.append(f"Dynamic fxFlex with breakpoint '.{breakpoint}' needs manual review")
                return ([], f'[appFlex]="{value_str}" [appFlexBreakpoint]="\\"{breakpoint}\\""')
            return ([], f'[appFlex]="{value_str}"')

        # Static value - convert to class
        flex_map = {
            'auto': 'flex-auto',
            'none': 'flex-none',
            'grow': 'flex-1',
            'initial': 'flex-initial',
            'nogrow': 'flex-nogrow',
            'noshrink': 'flex-noshrink',
        }

        # Check for keyword
        if value_str in flex_map:
            base_class = flex_map[value_str]
            suffix = f'-{breakpoint}' if breakpoint else ''
            return ([base_class + suffix], None)

        # Check for percentage
        if value_str.isdigit():
            num = int(value_str)
            base_class = f'flex-{num}'
            suffix = f'-{breakpoint}' if breakpoint else ''
            return ([base_class + suffix], None)

        # Check for pixel values
        if value_str.endswith('px'):
            px_value = value_str.replace('px', '')
            base_class = f'flex-{px_value}px'
            suffix = f'-{breakpoint}' if breakpoint else ''
            return ([base_class + suffix], None)

        # Check for calc() or complex expressions
        if 'calc' in value_str:
            # Use directive for calc expressions
            return ([], f'[appFlex]="\'{value_str}\'"')

        # Default
        return (['flex-1'], None)

    def convert_show_hide(self, directive: str, value: any, breakpoint: Optional[str]) -> List[str]:
        """Convert fxShow/fxHide to CSS classes."""
        if not breakpoint:
            return []  # No class for non-responsive show/hide

        prefix = 'show' if 'Show' in directive else 'hide'
        return [f'{prefix}-{breakpoint}']

    def convert_gap(self, value: str, breakpoint: Optional[str] = None) -> Tuple[List[str], Optional[str]]:
        """Convert fxLayoutGap to CSS class or directive."""
        # Check if dynamic
        if not re.match(r'^\d+\s*px$', value) and not value.isdigit():
            # Dynamic - use directive
            return ([], f'[appGap]="{value}"')

        # Static value
        gap_value = value.replace('px', '').strip()
        if gap_value.isdigit():
            suffix = f'-{breakpoint}' if breakpoint else ''
            return ([f'gap-{gap_value}' + suffix], None)

        return ([], None)

    def convert_flex_order(self, value: str, breakpoint: Optional[str] = None) -> Tuple[List[str], Optional[str]]:
        """Convert fxFlexOrder to CSS class or directive."""
        # Check if dynamic
        if not value.isdigit():
            return ([], f'[appFlexOrder]="{value}"')

        # Static value - use inline style or class
        suffix = f'-{breakpoint}' if breakpoint else ''
        return ([f'order-{value}' + suffix], None)

    def migrate_tag(self, tag_content: str) -> str:
        """
        Migrate a single HTML tag by extracting directives and converting them.
        """
        directives = self.extract_directives(tag_content)

        if not directives or (len(directives) == 1 and '_existing_class' in directives):
            # No flex directives found
            return tag_content

        # Collect all classes and directive bindings
        css_classes = set()
        directive_bindings = []

        # Get existing classes
        if '_existing_class' in directives:
            css_classes.update(directives['_existing_class'].split())

        # Process each directive
        for key, data in directives.items():
            if key == '_existing_class':
                continue

            directive_name = key.split('.')[0]
            breakpoint = data.get('breakpoint')
            value = data['value']
            is_dynamic = data['is_dynamic']

            if directive_name == 'fxLayout':
                if is_dynamic:
                    directive_bindings.append(f'[appLayout]="{value}"')
                    self.warnings.append(f"Dynamic fxLayout needs custom directive: [appLayout]=\"{value}\"")
                else:
                    classes = self.convert_layout(value, breakpoint)
                    css_classes.update(classes)

            elif directive_name == 'fxLayoutAlign':
                if is_dynamic:
                    directive_bindings.append(f'[appLayoutAlign]="{value}"')
                    self.warnings.append(f"Dynamic fxLayoutAlign needs custom directive")
                else:
                    classes = self.convert_layout_align(value, breakpoint)
                    css_classes.update(classes)

            elif directive_name == 'fxLayoutGap':
                classes, directive = self.convert_gap(value, breakpoint)
                if classes:
                    css_classes.update(classes)
                if directive:
                    directive_bindings.append(directive)

            elif directive_name == 'fxFlex':
                classes, directive = self.convert_flex(value, breakpoint)
                if classes:
                    css_classes.update(classes)
                if directive:
                    directive_bindings.append(directive)

            elif directive_name == 'fxFlexOrder':
                classes, directive = self.convert_flex_order(value, breakpoint)
                if classes:
                    css_classes.update(classes)
                if directive:
                    directive_bindings.append(directive)

            elif directive_name in ['fxShow', 'fxHide']:
                classes = self.convert_show_hide(directive_name, value, breakpoint)
                css_classes.update(classes)

        # Remove all old flex directives
        result = tag_content
        for key, data in directives.items():
            if key != '_existing_class':
                result = result.replace(data['original'], '')

        # Remove existing class attribute
        result = re.sub(r'\s*class="[^"]*"', '', result)

        # Build new attributes
        new_attrs = []
        if css_classes:
            classes_str = ' '.join(sorted(css_classes))
            new_attrs.append(f'class="{classes_str}"')

        new_attrs.extend(directive_bindings)

        # Insert new attributes at the beginning of the tag
        # Find the tag name
        tag_match = re.match(r'<([a-zA-Z0-9\-]+)', result)
        if tag_match:
            tag_name = tag_match.group(1)
            # Insert after tag name
            insertion_point = len(tag_name) + 1
            attrs_str = ' ' + ' '.join(new_attrs) if new_attrs else ''
            result = result[:insertion_point] + attrs_str + result[insertion_point:]

        self.total_replacements += 1
        return result.strip()

    def migrate_file(self, file_path: Path) -> bool:
        """
        Migrate a single HTML file.
        Returns True if file was modified.
        """
        try:
            content = file_path.read_text(encoding='utf-8')
            original_content = content

            # Find all HTML tags with flex directives
            # Match opening tags that contain fx directives
            pattern = r'<([a-zA-Z0-9\-]+)([^>]*(?:fx|appFlex|appGap)[^>]*)>'

            def replace_tag(match):
                full_tag = match.group(0)
                migrated = self.migrate_tag(full_tag)
                if self.verbose:
                    if full_tag != migrated:
                        self.log(f"  {full_tag}", 'info')
                        self.log(f"  → {migrated}", 'success')
                return migrated

            content = re.sub(pattern, replace_tag, content)

            # Check if content changed
            if content != original_content:
                if not self.dry_run:
                    # Create backup
                    backup_path = file_path.with_suffix(file_path.suffix + '.backup')
                    backup_path.write_text(original_content, encoding='utf-8')

                    # Write migrated content
                    file_path.write_text(content, encoding='utf-8')
                    self.log(f"Migrated: {file_path}", 'success')
                else:
                    self.log(f"Would migrate: {file_path}", 'info')

                self.files_modified += 1
                return True

            return False

        except Exception as e:
            self.log(f"Error processing {file_path}: {str(e)}", 'error')
            return False

    def migrate_directory(self, src_dir: Path) -> None:
        """Migrate all HTML files in a directory recursively."""
        html_files = list(src_dir.rglob('*.html'))

        self.log(f"Found {len(html_files)} HTML files", 'info')

        for html_file in html_files:
            self.migrate_file(html_file)

        # Print summary
        print()
        self.log(f"{'[DRY RUN] ' if self.dry_run else ''}Migration complete!", 'success')
        self.log(f"Files modified: {self.files_modified}", 'info')
        self.log(f"Total replacements: {self.total_replacements}", 'info')

        if self.warnings:
            print()
            self.log(f"Warnings ({len(self.warnings)}):", 'warning')
            for warning in set(self.warnings):  # Remove duplicates
                self.log(f"  {warning}", 'warning')

    def generate_layout_scss(self, output_path: Path) -> None:
        """Generate comprehensive _layout.scss file."""
        scss_content = '''// ===================================
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
.align-start-start { display: flex; justify-content: flex-start; align-items: flex-start; }
.align-start-center { display: flex; justify-content: flex-start; align-items: center; }
.align-start-end { display: flex; justify-content: flex-start; align-items: flex-end; }
.align-center-start { display: flex; justify-content: center; align-items: flex-start; }
.align-center-center { display: flex; justify-content: center; align-items: center; }
.align-center-end { display: flex; justify-content: center; align-items: flex-end; }
.align-end-start { display: flex; justify-content: flex-end; align-items: flex-start; }
.align-end-center { display: flex; justify-content: flex-end; align-items: center; }
.align-end-end { display: flex; justify-content: flex-end; align-items: flex-end; }
.align-space-between-start { display: flex; justify-content: space-between; align-items: flex-start; }
.align-space-between-center { display: flex; justify-content: space-between; align-items: center; }
.align-space-between-end { display: flex; justify-content: space-between; align-items: flex-end; }
.align-space-around-center { display: flex; justify-content: space-around; align-items: center; }
.align-space-evenly-center { display: flex; justify-content: space-evenly; align-items: center; }

// Gap utilities
.gap-4 { gap: 4px; }
.gap-5 { gap: 5px; }
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }
.gap-20 { gap: 20px; }
.gap-24 { gap: 24px; }
.gap-32 { gap: 32px; }
.gap-48 { gap: 48px; }

// Flex sizing
.flex-auto { flex: 1 1 auto; }
.flex-none { flex: 0 0 auto; }
.flex-initial { flex: 0 1 auto; }
.flex-nogrow { flex: 0 1 auto; }
.flex-noshrink { flex: 1 0 auto; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.flex-3 { flex: 3; }

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
.flex-20px { flex: 0 0 20px; max-width: 20px; }
.flex-30px { flex: 0 0 30px; max-width: 30px; }
.flex-40px { flex: 0 0 40px; max-width: 40px; }
.flex-50px { flex: 0 0 50px; max-width: 50px; }
.flex-100px { flex: 0 0 100px; max-width: 100px; }
.flex-142px { flex: 0 0 142px; max-width: 142px; }
.flex-150px { flex: 0 0 150px; max-width: 150px; }
.flex-200px { flex: 0 0 200px; max-width: 200px; }
.flex-220px { flex: 0 0 220px; max-width: 220px; }
.flex-250px { flex: 0 0 250px; max-width: 250px; }
.flex-300px { flex: 0 0 300px; max-width: 300px; }
.flex-400px { flex: 0 0 400px; max-width: 400px; }
.flex-500px { flex: 0 0 500px; max-width: 500px; }

// Order utilities
.order-1 { order: 1; }
.order-2 { order: 2; }
.order-3 { order: 3; }
.order-4 { order: 4; }

// Width/height utilities
.w-full { width: 100%; }
.w-auto { width: auto; }
.h-full { height: 100%; }
.h-auto { height: auto; }

// ===================================
// Responsive Breakpoints
// ===================================

// XS: < 600px
@media (max-width: 599px) {
  .flex-column-xs { flex-direction: column !important; }
  .flex-row-xs { flex-direction: row !important; }
  .show-xs { display: flex !important; }
  .hide-xs { display: none !important; }
  .flex-100-xs { flex: 0 0 100% !important; max-width: 100% !important; }
  .flex-1-xs { flex: 1 !important; }
  .order-1-xs { order: 1; }
  .order-2-xs { order: 2; }
}

// SM: 600px - 959px
@media (min-width: 600px) and (max-width: 959px) {
  .flex-column-sm { flex-direction: column !important; }
  .flex-row-sm { flex-direction: row !important; }
  .show-sm { display: flex !important; }
  .hide-sm { display: none !important; }

  // SM flex sizes
  .flex-100-sm { flex: 0 0 100% !important; max-width: 100% !important; }
}

// MD: 960px - 1279px
@media (min-width: 960px) and (max-width: 1279px) {
  .flex-column-md { flex-direction: column !important; }
  .show-md { display: flex !important; }
  .hide-md { display: none !important; }
}

// LG: >= 1280px
@media (min-width: 1280px) {
  .show-lg { display: flex !important; }
  .hide-lg { display: none !important; }
}

// GT-XS: >= 600px
@media (min-width: 600px) {
  .show-gt-xs { display: flex !important; }
  .hide-gt-xs { display: none !important; }
  .gap-24-gt-xs { gap: 24px; }
}

// GT-SM: >= 960px
@media (min-width: 960px) {
  .show-gt-sm { display: flex !important; }
  .hide-gt-sm { display: none !important; }
}

// LT-SM: < 600px
@media (max-width: 599px) {
  .show-lt-sm { display: flex !important; }
  .hide-lt-sm { display: none !important; }
}

// LT-MD: < 960px
@media (max-width: 959px) {
  .show-lt-md { display: flex !important; }
  .hide-lt-md { display: none !important; }
}
'''

        if not self.dry_run:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(scss_content, encoding='utf-8')
            self.log(f"Generated: {output_path}", 'success')
        else:
            self.log(f"Would generate: {output_path}", 'info')

    def generate_directives(self, output_dir: Path) -> None:
        """Generate TypeScript directives for dynamic flex bindings."""

        # Create utils file
        utils_content = '''/**
 * Utility functions for converting Angular Flex Layout dynamic values to CSS
 */

/**
 * Converts fxFlex value to CSS flex property value
 * Supports: percentages, pixels, calc(), keywords (auto, none, grow, etc.)
 */
export function convertFlexValue(value: string | number): string {
  if (!value && value !== 0) return '1 1 auto';

  const strValue = String(value).trim();

  // Already a valid flex shorthand (e.g., "1 1 auto")
  if (strValue.match(/^\\d+\\s+\\d+\\s+/)) {
    return strValue;
  }

  // Percentage values (e.g., "50" -> "0 0 50%")
  if (/^\\d+$/.test(strValue)) {
    return `0 0 ${strValue}%`;
  }

  // Pixel values (e.g., "200px" -> "0 0 200px")
  if (/^\\d+\\s*(px|em|rem|vh|vw)$/.test(strValue)) {
    return `0 0 ${strValue}`;
  }

  // Calc expressions
  if (strValue.startsWith('calc(')) {
    return `0 0 ${strValue}`;
  }

  // Special keywords
  const keywordMap: { [key: string]: string } = {
    'auto': '1 1 auto',
    'none': '0 0 auto',
    'grow': '1 1 100%',
    'initial': '0 1 auto',
    'nogrow': '0 1 auto',
    'noshrink': '1 0 auto',
  };

  if (keywordMap[strValue]) {
    return keywordMap[strValue];
  }

  // Default to flex: 1 1 auto
  return '1 1 auto';
}

/**
 * Converts fxLayoutGap value to CSS gap property value
 */
export function convertGapValue(value: string | number): string {
  if (!value && value !== 0) return '0px';

  const strValue = String(value).trim();

  // Already has unit
  if (/^\\d+\\s*(px|em|rem|%)$/.test(strValue)) {
    return strValue;
  }

  // Just a number, add px
  if (/^\\d+$/.test(strValue)) {
    return `${strValue}px`;
  }

  return strValue;
}

/**
 * Converts fxLayout value to CSS flex-direction
 */
export function convertLayoutValue(value: string): string {
  const layoutMap: { [key: string]: string } = {
    'row': 'row',
    'column': 'column',
    'row-reverse': 'row-reverse',
    'column-reverse': 'column-reverse',
    'row wrap': 'row',
    'column wrap': 'column',
  };

  return layoutMap[value] || 'row';
}

/**
 * Converts fxLayout value to flex-wrap
 */
export function convertWrapValue(value: string): string {
  return value.includes('wrap') ? 'wrap' : 'nowrap';
}
'''

        # Create directives file
        directives_content = '''import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { convertFlexValue, convertGapValue, convertLayoutValue, convertWrapValue } from '../utils/flex.utils';

/**
 * Drop-in replacement directive for dynamic [fxFlex]
 * Handles all flex values including calc(), percentages, pixels, and keywords
 *
 * Usage:
 * <div [appFlex]="'50'">50% width</div>
 * <div [appFlex]="itemWidth">Dynamic width</div>
 * <div [appFlex]="'calc(100% - 40px)'">Calculated width</div>
 * <div [appFlex]="isExpanded ? '20px' : ''">Conditional width</div>
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

    // Also ensure the element has display: flex parent context
    const parent = this.el.nativeElement.parentElement;
    if (parent) {
      const parentDisplay = window.getComputedStyle(parent).display;
      if (parentDisplay !== 'flex' && parentDisplay !== 'inline-flex') {
        console.warn('[appFlex] Parent element should have display: flex or display: inline-flex');
      }
    }
  }
}

/**
 * Drop-in replacement directive for dynamic [fxLayoutGap]
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

/**
 * Drop-in replacement directive for dynamic [fxLayout]
 *
 * Usage:
 * <div [appLayout]="layoutDirection">Dynamic layout</div>
 * <div [appLayout]="isHorizontal ? 'row' : 'column'">Conditional layout</div>
 */
@Directive({
  selector: '[appLayout]',
  standalone: false
})
export class LayoutDirective implements OnInit, OnChanges {
  @Input() appLayout: string = 'row';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appLayout']) {
      this.updateLayout();
    }
  }

  private updateLayout(): void {
    const direction = convertLayoutValue(this.appLayout);
    const wrap = convertWrapValue(this.appLayout);

    this.renderer.setStyle(this.el.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.el.nativeElement, 'flex-direction', direction);
    this.renderer.setStyle(this.el.nativeElement, 'flex-wrap', wrap);
  }
}

/**
 * Drop-in replacement directive for dynamic [fxLayoutAlign]
 *
 * Usage:
 * <div [appLayoutAlign]="'center center'">Centered content</div>
 * <div [appLayoutAlign]="alignmentValue">Dynamic alignment</div>
 */
@Directive({
  selector: '[appLayoutAlign]',
  standalone: false
})
export class LayoutAlignDirective implements OnInit, OnChanges {
  @Input() appLayoutAlign: string = 'start start';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateAlign();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appLayoutAlign']) {
      this.updateAlign();
    }
  }

  private updateAlign(): void {
    const [mainAxis, crossAxis] = this.appLayoutAlign.split(' ');

    const justifyMap: { [key: string]: string } = {
      'start': 'flex-start',
      'center': 'center',
      'end': 'flex-end',
      'space-between': 'space-between',
      'space-around': 'space-around',
      'space-evenly': 'space-evenly',
    };

    const alignMap: { [key: string]: string } = {
      'start': 'flex-start',
      'center': 'center',
      'end': 'flex-end',
      'stretch': 'stretch',
      'baseline': 'baseline',
    };

    this.renderer.setStyle(this.el.nativeElement, 'justify-content', justifyMap[mainAxis] || 'flex-start');
    this.renderer.setStyle(this.el.nativeElement, 'align-items', alignMap[crossAxis || 'stretch'] || 'stretch');
  }
}

/**
 * Directive for handling flex order
 *
 * Usage:
 * <div [appFlexOrder]="2">Order 2</div>
 * <div [appFlexOrder]="orderValue">Dynamic order</div>
 */
@Directive({
  selector: '[appFlexOrder]',
  standalone: false
})
export class FlexOrderDirective implements OnInit, OnChanges {
  @Input() appFlexOrder: number | string = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateOrder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFlexOrder']) {
      this.updateOrder();
    }
  }

  private updateOrder(): void {
    this.renderer.setStyle(this.el.nativeElement, 'order', String(this.appFlexOrder));
  }
}
'''

        if not self.dry_run:
            utils_dir = output_dir / 'utils'
            directives_dir = output_dir / 'directives'
            utils_dir.mkdir(parents=True, exist_ok=True)
            directives_dir.mkdir(parents=True, exist_ok=True)

            (utils_dir / 'flex.utils.ts').write_text(utils_content, encoding='utf-8')
            (directives_dir / 'flex.directive.ts').write_text(directives_content, encoding='utf-8')

            self.log(f"Generated: {utils_dir / 'flex.utils.ts'}", 'success')
            self.log(f"Generated: {directives_dir / 'flex.directive.ts'}", 'success')
        else:
            self.log(f"Would generate: {output_dir / 'utils' / 'flex.utils.ts'}", 'info')
            self.log(f"Would generate: {output_dir / 'directives' / 'flex.directive.ts'}", 'info')


def main():
    parser = argparse.ArgumentParser(
        description='Migrate Angular Flex Layout to CSS',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  # Dry run (preview changes)
  python migrate-flex-to-css.py --dry-run --verbose

  # Migrate src directory
  python migrate-flex-to-css.py

  # Generate only SCSS and directives
  python migrate-flex-to-css.py --generate-only
        '''
    )

    parser.add_argument('--src-dir', type=str, default='src',
                        help='Source directory to migrate (default: src)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview changes without modifying files')
    parser.add_argument('--verbose', '-v', action='store_true',
                        help='Show detailed migration steps')
    parser.add_argument('--generate-only', action='store_true',
                        help='Only generate SCSS and TypeScript files, skip HTML migration')

    args = parser.parse_args()

    # Initialize migrator
    migrator = FlexMigrator(dry_run=args.dry_run, verbose=args.verbose)

    # Get source directory
    src_dir = Path(args.src_dir)
    if not src_dir.exists():
        print(f"✗ Error: Source directory '{src_dir}' not found")
        sys.exit(1)

    # Generate SCSS file
    print("Generating _layout.scss...")
    layout_scss = src_dir / 'styles' / '_layout.scss'
    migrator.generate_layout_scss(layout_scss)

    # Generate TypeScript directives
    print("\nGenerating TypeScript directives...")
    shared_dir = src_dir / 'app' / 'shared'
    migrator.generate_directives(shared_dir)

    if not args.generate_only:
        # Migrate HTML files
        print(f"\nMigrating HTML files in {src_dir}...")
        migrator.migrate_directory(src_dir)

        # Print next steps
        print("\n" + "="*50)
        print("Next Steps:")
        print("="*50)
        print("1. Import _layout.scss in your styles.scss:")
        print("   @import './styles/layout';")
        print()
        print("2. Import and declare the directives in your modules:")
        print("   import { FlexDirective, GapDirective, LayoutDirective, ")
        print("            LayoutAlignDirective, FlexOrderDirective } from './shared/directives/flex.directive';")
        print()
        print("   declarations: [")
        print("     FlexDirective,")
        print("     GapDirective,")
        print("     LayoutDirective,")
        print("     LayoutAlignDirective,")
        print("     FlexOrderDirective,")
        print("     // ... other components")
        print("   ]")
        print()
        print("3. Review warnings above for manual fixes needed")
        print("4. Test your application thoroughly")
        print("5. Remove @angular/flex-layout from package.json")
        print("="*50)


if __name__ == '__main__':
    main()
