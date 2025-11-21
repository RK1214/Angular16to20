/**
 * Utility functions for converting Angular Flex Layout dynamic values to CSS
 */

export function convertFlexValue(value: string | number): string {
  if (!value && value !== 0) return '1 1 auto';

  const strValue = String(value).trim();

  if (strValue.match(/^\d+\s+\d+\s+/)) {
    return strValue;
  }

  if (/^\d+$/.test(strValue)) {
    return `0 0 ${strValue}%`;
  }

  if (/^\d+\s*(px|em|rem|vh|vw)$/.test(strValue)) {
    return `0 0 ${strValue}`;
  }

  if (strValue.startsWith('calc(')) {
    return `0 0 ${strValue}`;
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

  if (/^\d+\s*(px|em|rem|%)$/.test(strValue)) {
    return strValue;
  }

  if (/^\d+$/.test(strValue)) {
    return `${strValue}px`;
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
