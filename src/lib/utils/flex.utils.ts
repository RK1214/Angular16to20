/**
 * Utility functions for converting Angular Flex Layout dynamic values to CSS
 */

/**
 * Converts fxFlex value to CSS flex property value
 * @param value - The flex value (e.g., '50', '200px', 'auto', '1 1 auto')
 * @returns CSS flex property value
 */
export function convertFlexValue(value: string | number): string {
  if (!value) return '1 1 auto';

  const strValue = String(value);

  // Already a valid flex shorthand (e.g., "1 1 auto")
  if (strValue.includes(' ')) {
    return strValue;
  }

  // Percentage values (e.g., "50" -> "0 0 50%")
  if (/^\d+$/.test(strValue)) {
    return `0 0 ${strValue}%`;
  }

  // Pixel values (e.g., "200px" -> "0 0 200px")
  if (strValue.endsWith('px') || strValue.endsWith('em') || strValue.endsWith('rem')) {
    return `0 0 ${strValue}`;
  }

  // Special keywords
  if (strValue === 'auto') return '1 1 auto';
  if (strValue === 'none') return '0 0 auto';
  if (strValue === 'grow') return '1 1 100%';
  if (strValue === 'initial') return '0 1 auto';
  if (strValue === 'nogrow') return '0 1 auto';
  if (strValue === 'noshrink') return '1 0 auto';

  // Default to flex: 1 1 auto
  return '1 1 auto';
}

/**
 * Converts fxLayoutGap value to CSS gap property value
 * @param value - The gap value (e.g., '16', '16px')
 * @returns CSS gap property value
 */
export function convertGapValue(value: string | number): string {
  if (!value) return '0px';

  const strValue = String(value);

  // Already has unit
  if (/^\d+\s*(px|em|rem|%)$/.test(strValue)) {
    return strValue;
  }

  // Just a number, add px
  if (/^\d+$/.test(strValue)) {
    return `${strValue}px`;
  }

  return strValue;
}
