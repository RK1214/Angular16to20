# Custom Components Library

This folder contains all reusable shared components, directives, and utilities organized as a library structure.

## Structure

```
src/lib/
├── components/           # All shared UI components
│   ├── select-dropdown/
│   ├── multiline-select-dropdown/
│   ├── split-select-dropdown/
│   ├── date-range/
│   ├── autocomplete-input/
│   └── multi-select-autocomplete/
├── directives/          # Shared directives
│   └── flex.directive.ts
├── utils/              # Utility functions
│   └── flex.utils.ts
├── styles/             # Shared styles
│   └── _dropdown-common.css
├── public-api.ts       # Public API exports
└── index.ts            # Main entry point

```

## Usage

### Importing Components

Import components and interfaces from the library barrel export:

```typescript
import {
  SelectOption,
  MultilineSelectOption,
  SplitSelectOption,
  DateRange,
  AutocompleteOption,
  AutocompleteGroup,
  AutocompleteInputOption
} from '../../../lib';
```

### Available Components

#### 1. SelectDropdownComponent
Basic single-line dropdown for simple selections.

**Interface:** `SelectOption`
```typescript
{
  value: any;
  label: string;
}
```

#### 2. MultilineSelectDropdownComponent
Dropdown with multiline options (label + description).

**Interface:** `MultilineSelectOption`
```typescript
{
  value: any;
  label: string;
  description: string;
}
```

#### 3. SplitSelectDropdownComponent
Dropdown with left-right split layout (e.g., for pricing).

**Interface:** `SplitSelectOption`
```typescript
{
  value: any;
  leftLabel: string;
  rightLabel: string;
}
```

#### 4. DateRangeComponent
Date range picker with visual highlighting.

**Interface:** `DateRange`
```typescript
{
  departureDate: Date | null;
  returnDate: Date | null;
}
```

#### 5. AutocompleteInputComponent
Single-select autocomplete with filtering.

**Interface:** `AutocompleteInputOption`
```typescript
{
  value: string;
  label: string;
}
```

#### 6. MultiSelectAutocompleteComponent
Multi-select autocomplete with chips and optional grouping.

**Interfaces:**
```typescript
AutocompleteOption {
  value: any;
  label: string;
  group?: string;
}

AutocompleteGroup {
  name: string;
  options: AutocompleteOption[];
}
```

### Available Directives

#### FlexDirective & GapDirective
Custom flex layout directives (replacement for Angular Flex Layout).

```html
<div appFlex="row" appGap="16px">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Shared Styles

Common dropdown styles are automatically loaded from `lib/styles/_dropdown-common.css` via `angular.json`.

This includes:
- Form field base styles
- Label and trigger styling
- Check icon positioning
- Hover/selection states
- Material Design overrides

## Future: Extract as NPM Package

This library structure is designed to be easily extracted as a standalone NPM package:

1. Create `package.json` in `src/lib/`
2. Configure `ng-packagr` for building
3. Publish to NPM or private registry
4. Install via `npm install @your-org/custom-components`

## Development

When adding new components:

1. Create component in `lib/components/[component-name]/`
2. Export from `lib/public-api.ts`
3. Add to `SharedModule` declarations and exports
4. Update this README

## TypeScript Configuration

The library is included in TypeScript compilation via `tsconfig.app.json`:

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts"
  ]
}
```
