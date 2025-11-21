#!/usr/bin/env node

/**
 * Robust Angular Flex Layout to CSS Migration Script (Node.js version)
 * Handles all flex directive patterns including dynamic bindings, responsive breakpoints,
 * and complex scenarios.
 *
 * IMPORTANT:
 * - No backup files are created (use git for rollback)
 * - Changes are applied directly to files
 * - Use dry-run mode (--dry-run) to preview changes first
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class FlexMigrator {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.srcDir = options.srcDir || 'src';
    this.filesModified = 0;
    this.totalReplacements = 0;
    this.warnings = new Set();
  }

  log(message, level = 'info') {
    const colors = {
      info: '\x1b[34m',    // Blue
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'
    };

    const prefix = {
      info: 'ℹ',
      success: '✓',
      warning: '⚠',
      error: '✗'
    };

    if (level === 'error' || level === 'warning' || this.verbose) {
      console.log(`${colors[level]}${prefix[level]} ${message}${colors.reset}`);
    }
  }

  /**
   * Extract all flex directives from an HTML tag
   */
  extractDirectives(tagContent) {
    const directives = {};

    // Patterns for all flex directives
    const patterns = [
      // Static directives
      { regex: /fxLayout(?:\.([a-z\-]+))?="([^"]*)"/g, name: 'fxLayout' },
      { regex: /fxLayoutAlign(?:\.([a-z\-]+))?="([^"]*)"/g, name: 'fxLayoutAlign' },
      { regex: /fxLayoutGap(?:\.([a-z\-]+))?="([^"]*)"/g, name: 'fxLayoutGap' },
      { regex: /fxFlex(?:\.([a-z\-]+))?="([^"]*)"/g, name: 'fxFlex' },
      { regex: /fxFlexOrder(?:\.([a-z\-]+))?="([^"]*)"/g, name: 'fxFlexOrder' },
      { regex: /fxFlexOffset(?:\.([a-z\-]+))?="([^"]*)"/g, name: 'fxFlexOffset' },
      { regex: /fxFlexAlign(?:\.([a-z\-]+))?="([^"]*)"/g, name: 'fxFlexAlign' },
      { regex: /fxShow(?:\.([a-z\-]+))?(?:="([^"]*)")?/g, name: 'fxShow' },
      { regex: /fxHide(?:\.([a-z\-]+))?(?:="([^"]*)")?/g, name: 'fxHide' },
      // Dynamic bindings
      { regex: /\[fxLayout(?:\.([a-z\-]+))?\]="([^"]*)"/g, name: 'fxLayout', dynamic: true },
      { regex: /\[fxLayoutAlign(?:\.([a-z\-]+))?\]="([^"]*)"/g, name: 'fxLayoutAlign', dynamic: true },
      { regex: /\[fxLayoutGap(?:\.([a-z\-]+))?\]="([^"]*)"/g, name: 'fxLayoutGap', dynamic: true },
      { regex: /\[fxFlex(?:\.([a-z\-]+))?\]="([^"]*)"/g, name: 'fxFlex', dynamic: true },
      { regex: /\[fxFlexOrder(?:\.([a-z\-]+))?\]="([^"]*)"/g, name: 'fxFlexOrder', dynamic: true },
      { regex: /\[fxShow(?:\.([a-z\-]+))?\]="([^"]*)"/g, name: 'fxShow', dynamic: true },
      { regex: /\[fxHide(?:\.([a-z\-]+))?\]="([^"]*)"/g, name: 'fxHide', dynamic: true },
      // Standalone fxFlex
      { regex: /fxFlex(?![\[\.\="a-zA-Z])/g, name: 'fxFlex', standalone: true },
    ];

    patterns.forEach(({ regex, name, dynamic = false, standalone = false }) => {
      let match;
      while ((match = regex.exec(tagContent)) !== null) {
        const breakpoint = match[1] || null;
        const value = standalone ? true : (match[2] || true);
        const key = breakpoint ? `${name}.${breakpoint}` : name;

        directives[key] = {
          value,
          isDynamic: dynamic,
          breakpoint,
          original: match[0]
        };
      }
    });

    // Extract existing class attribute
    const classMatch = /class="([^"]*)"/.exec(tagContent);
    if (classMatch) {
      directives._existingClass = classMatch[1];
    }

    return directives;
  }

  /**
   * Convert fxLayout to CSS classes
   */
  convertLayout(value, breakpoint = null) {
    const layoutMap = {
      'row': 'flex-row',
      'column': 'flex-column',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-column-reverse',
      'row wrap': 'flex-row flex-wrap',
      'column wrap': 'flex-column flex-wrap',
    };

    const classes = [];
    const baseClass = layoutMap[value] || 'flex-row';

    if (breakpoint) {
      if (breakpoint === 'xs') {
        if (value.includes('column')) {
          classes.push('flex-column-xs');
        } else if (value.includes('row')) {
          classes.push('flex-row-xs');
        }
      }
      // Add base layout
      if (value.includes('wrap')) {
        classes.push(value.includes('row') ? 'flex-row' : 'flex-column');
      } else if (value === 'row' || value === 'column') {
        classes.push(value === 'row' ? 'flex-column' : 'flex-row');
      }
    } else {
      classes.push(baseClass);
    }

    return classes;
  }

  /**
   * Convert fxLayoutAlign to CSS classes
   */
  convertLayoutAlign(value, breakpoint = null) {
    const alignMap = {
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
    };

    const cssClass = alignMap[value] || 'align-start-start';
    const suffix = breakpoint ? `-${breakpoint}` : '';
    return [cssClass + suffix];
  }

  /**
   * Convert fxFlex to CSS classes or directive
   */
  convertFlex(value, breakpoint = null) {
    if (value === true || value === '') {
      return { classes: ['flex-1'], directive: null };
    }

    const valueStr = String(value);

    // Check if dynamic (contains {{ }} or complex expressions)
    if (valueStr.includes('{{') || valueStr.includes('?') || valueStr.includes('||') || valueStr.includes('&&')) {
      // Convert template expression to property binding
      let cleanValue = valueStr.replace(/\{\{|\}\}/g, '').trim();
      if (breakpoint) {
        this.warnings.add(`Dynamic fxFlex with breakpoint '.${breakpoint}' needs manual review`);
        return { classes: [], directive: `[appFlex]="${cleanValue}"` };
      }
      return { classes: [], directive: `[appFlex]="${cleanValue}"` };
    }

    // Static value
    const flexMap = {
      'auto': 'flex-auto',
      'none': 'flex-none',
      'grow': 'flex-1',
      'initial': 'flex-initial',
      'nogrow': 'flex-nogrow',
      'noshrink': 'flex-noshrink',
    };

    if (flexMap[valueStr]) {
      const baseClass = flexMap[valueStr];
      const suffix = breakpoint ? `-${breakpoint}` : '';
      return { classes: [baseClass + suffix], directive: null };
    }

    // Percentage
    if (/^\d+$/.test(valueStr)) {
      const baseClass = `flex-${valueStr}`;
      const suffix = breakpoint ? `-${breakpoint}` : '';
      return { classes: [baseClass + suffix], directive: null };
    }

    // Pixel values
    if (valueStr.endsWith('px')) {
      const px = valueStr.replace('px', '');
      const baseClass = `flex-${px}px`;
      const suffix = breakpoint ? `-${breakpoint}` : '';
      return { classes: [baseClass + suffix], directive: null };
    }

    // Calc or complex
    if (valueStr.includes('calc')) {
      return { classes: [], directive: `[appFlex]="'${valueStr}'"` };
    }

    return { classes: ['flex-1'], directive: null };
  }

  /**
   * Convert fxShow/fxHide to CSS classes
   */
  convertShowHide(directive, value, breakpoint) {
    if (!breakpoint) return [];
    const prefix = directive.includes('Show') ? 'show' : 'hide';
    return [`${prefix}-${breakpoint}`];
  }

  /**
   * Convert fxLayoutGap to CSS class or directive
   */
  convertGap(value, breakpoint = null) {
    // Check if dynamic
    if (!value.match(/^\d+\s*px$/) && !/^\d+$/.test(value)) {
      return { classes: [], directive: `[appGap]="${value}"` };
    }

    const gapValue = value.replace('px', '').trim();
    if (/^\d+$/.test(gapValue)) {
      const suffix = breakpoint ? `-${breakpoint}` : '';
      return { classes: [`gap-${gapValue}${suffix}`], directive: null };
    }

    return { classes: [], directive: null };
  }

  /**
   * Convert fxFlexOrder to CSS class or directive
   */
  convertFlexOrder(value, breakpoint = null) {
    if (!/^\d+$/.test(value)) {
      return { classes: [], directive: `[appFlexOrder]="${value}"` };
    }

    const suffix = breakpoint ? `-${breakpoint}` : '';
    return { classes: [`order-${value}${suffix}`], directive: null };
  }

  /**
   * Migrate a single HTML tag
   */
  migrateTag(tagContent) {
    const directives = this.extractDirectives(tagContent);

    if (Object.keys(directives).length === 0 ||
        (Object.keys(directives).length === 1 && directives._existingClass)) {
      return tagContent;
    }

    const cssClasses = new Set();
    const directiveBindings = [];

    // Get existing classes
    if (directives._existingClass) {
      directives._existingClass.split(/\s+/).forEach(cls => {
        if (cls) cssClasses.add(cls);
      });
    }

    // Process each directive
    Object.entries(directives).forEach(([key, data]) => {
      if (key === '_existingClass') return;

      const directiveName = key.split('.')[0];
      const { breakpoint, value, isDynamic } = data;

      switch (directiveName) {
        case 'fxLayout':
          if (isDynamic) {
            directiveBindings.push(`[appLayout]="${value}"`);
            this.warnings.add(`Dynamic fxLayout needs custom directive: [appLayout]="${value}"`);
          } else {
            this.convertLayout(value, breakpoint).forEach(cls => cssClasses.add(cls));
          }
          break;

        case 'fxLayoutAlign':
          if (isDynamic) {
            directiveBindings.push(`[appLayoutAlign]="${value}"`);
            this.warnings.add('Dynamic fxLayoutAlign needs custom directive');
          } else {
            this.convertLayoutAlign(value, breakpoint).forEach(cls => cssClasses.add(cls));
          }
          break;

        case 'fxLayoutGap':
          const gap = this.convertGap(value, breakpoint);
          gap.classes.forEach(cls => cssClasses.add(cls));
          if (gap.directive) directiveBindings.push(gap.directive);
          break;

        case 'fxFlex':
          const flex = this.convertFlex(value, breakpoint);
          flex.classes.forEach(cls => cssClasses.add(cls));
          if (flex.directive) directiveBindings.push(flex.directive);
          break;

        case 'fxFlexOrder':
          const order = this.convertFlexOrder(value, breakpoint);
          order.classes.forEach(cls => cssClasses.add(cls));
          if (order.directive) directiveBindings.push(order.directive);
          break;

        case 'fxShow':
        case 'fxHide':
          this.convertShowHide(directiveName, value, breakpoint).forEach(cls => cssClasses.add(cls));
          break;
      }
    });

    // Remove all old flex directives
    let result = tagContent;
    Object.entries(directives).forEach(([key, data]) => {
      if (key !== '_existingClass') {
        result = result.replace(data.original, '');
      }
    });

    // Remove existing class attribute
    result = result.replace(/\s*class="[^"]*"/g, '');

    // Build new attributes
    const newAttrs = [];
    if (cssClasses.size > 0) {
      const classesStr = Array.from(cssClasses).sort().join(' ');
      newAttrs.push(`class="${classesStr}"`);
    }
    newAttrs.push(...directiveBindings);

    // Insert new attributes
    const tagMatch = /^<([a-zA-Z0-9\-]+)/.exec(result);
    if (tagMatch) {
      const tagName = tagMatch[1];
      const insertionPoint = tagName.length + 1;
      const attrsStr = newAttrs.length > 0 ? ' ' + newAttrs.join(' ') : '';
      result = result.substring(0, insertionPoint) + attrsStr + result.substring(insertionPoint);
    }

    this.totalReplacements++;
    return result.trim();
  }

  /**
   * Migrate a single HTML file
   */
  migrateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Find and replace all tags with flex directives
      const pattern = /<([a-zA-Z0-9\-]+)([^>]*(?:fx|appFlex|appGap)[^>]*)>/g;
      const newContent = content.replace(pattern, (match) => {
        const migrated = this.migrateTag(match);
        if (this.verbose && match !== migrated) {
          this.log(`  ${match}`, 'info');
          this.log(`  → ${migrated}`, 'success');
        }
        return migrated;
      });

      if (newContent !== originalContent) {
        if (!this.dryRun) {
          // Write migrated content (no backup files created)
          fs.writeFileSync(filePath, newContent, 'utf-8');
          this.log(`Migrated: ${filePath}`, 'success');
        } else {
          this.log(`Would migrate: ${filePath}`, 'info');
        }
        this.filesModified++;
        return true;
      }

      return false;
    } catch (error) {
      this.log(`Error processing ${filePath}: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Migrate all HTML files in directory
   */
  async migrateDirectory() {
    const htmlFiles = await glob(`${this.srcDir}/**/*.html`);
    this.log(`Found ${htmlFiles.length} HTML files`, 'info');

    htmlFiles.forEach(file => this.migrateFile(file));

    console.log();
    this.log(`${this.dryRun ? '[DRY RUN] ' : ''}Migration complete!`, 'success');
    this.log(`Files modified: ${this.filesModified}`, 'info');
    this.log(`Total replacements: ${this.totalReplacements}`, 'info');

    if (this.warnings.size > 0) {
      console.log();
      this.log(`Warnings (${this.warnings.size}):`, 'warning');
      Array.from(this.warnings).forEach(warning => {
        this.log(`  ${warning}`, 'warning');
      });
    }
  }

  /**
   * Generate _layout.scss file
   */
  generateLayoutScss(outputPath) {
    const scss = `// ===================================
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
`;

    if (!this.dryRun) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, scss, 'utf-8');
      this.log(`Generated: ${outputPath}`, 'success');
    } else {
      this.log(`Would generate: ${outputPath}`, 'info');
    }
  }

  /**
   * Generate TypeScript directives
   */
  generateDirectives(outputDir) {
    // Same content as Python version...
    // (TypeScript files are the same, so I'll keep them identical)

    const utilsContent = `/**
 * Utility functions for converting Angular Flex Layout dynamic values to CSS
 */

export function convertFlexValue(value: string | number): string {
  if (!value && value !== 0) return '1 1 auto';

  const strValue = String(value).trim();

  if (strValue.match(/^\\d+\\s+\\d+\\s+/)) {
    return strValue;
  }

  if (/^\\d+$/.test(strValue)) {
    return \`0 0 \${strValue}%\`;
  }

  if (/^\\d+\\s*(px|em|rem|vh|vw)$/.test(strValue)) {
    return \`0 0 \${strValue}\`;
  }

  if (strValue.startsWith('calc(')) {
    return \`0 0 \${strValue}\`;
  }

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

  return '1 1 auto';
}

export function convertGapValue(value: string | number): string {
  if (!value && value !== 0) return '0px';

  const strValue = String(value).trim();

  if (/^\\d+\\s*(px|em|rem|%)$/.test(strValue)) {
    return strValue;
  }

  if (/^\\d+$/.test(strValue)) {
    return \`\${strValue}px\`;
  }

  return strValue;
}

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

export function convertWrapValue(value: string): string {
  return value.includes('wrap') ? 'wrap' : 'nowrap';
}
`;

    const directivesContent = `import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { convertFlexValue, convertGapValue, convertLayoutValue, convertWrapValue } from '../utils/flex.utils';

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
`;

    if (!this.dryRun) {
      const utilsDir = path.join(outputDir, 'utils');
      const directivesDir = path.join(outputDir, 'directives');

      if (!fs.existsSync(utilsDir)) {
        fs.mkdirSync(utilsDir, { recursive: true });
      }
      if (!fs.existsSync(directivesDir)) {
        fs.mkdirSync(directivesDir, { recursive: true });
      }

      fs.writeFileSync(path.join(utilsDir, 'flex.utils.ts'), utilsContent, 'utf-8');
      fs.writeFileSync(path.join(directivesDir, 'flex.directive.ts'), directivesContent, 'utf-8');

      this.log(`Generated: ${path.join(utilsDir, 'flex.utils.ts')}`, 'success');
      this.log(`Generated: ${path.join(directivesDir, 'flex.directive.ts')}`, 'success');
    } else {
      this.log(`Would generate: ${path.join(outputDir, 'utils/flex.utils.ts')}`, 'info');
      this.log(`Would generate: ${path.join(outputDir, 'directives/flex.directive.ts')}`, 'info');
    }
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    srcDir: 'src',
    generateOnly: args.includes('--generate-only'),
  };

  const srcDirIndex = args.indexOf('--src-dir');
  if (srcDirIndex !== -1 && args[srcDirIndex + 1]) {
    options.srcDir = args[srcDirIndex + 1];
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node migrate-flex-to-css.js [options]

Options:
  --src-dir <dir>    Source directory to migrate (default: src)
  --dry-run          Preview changes without modifying files
  --verbose, -v      Show detailed migration steps
  --generate-only    Only generate SCSS and TypeScript files, skip HTML migration
  --help, -h         Show this help message

Examples:
  node migrate-flex-to-css.js --dry-run --verbose
  node migrate-flex-to-css.js --src-dir src
  node migrate-flex-to-css.js --generate-only
    `);
    process.exit(0);
  }

  const migrator = new FlexMigrator(options);

  console.log('Generating _layout.scss...');
  migrator.generateLayoutScss(path.join(options.srcDir, 'styles/_layout.scss'));

  console.log('\nGenerating TypeScript directives...');
  migrator.generateDirectives(path.join(options.srcDir, 'app/shared'));

  if (!options.generateOnly) {
    console.log(`\nMigrating HTML files in ${options.srcDir}...`);
    await migrator.migrateDirectory();

    console.log('\n' + '='.repeat(50));
    console.log('Next Steps:');
    console.log('='.repeat(50));
    console.log('1. Import _layout.scss in your styles.scss:');
    console.log("   @import './styles/layout';");
    console.log();
    console.log('2. Import and declare the directives in your modules');
    console.log('3. Review warnings above for manual fixes needed');
    console.log('4. Test your application thoroughly');
    console.log('5. Remove @angular/flex-layout from package.json');
    console.log('='.repeat(50));
  }
}

// Check if glob is available
try {
  require.resolve('glob');
  main().catch(console.error);
} catch (e) {
  console.error('Error: "glob" package is required. Install it with:');
  console.error('  npm install glob');
  process.exit(1);
}
