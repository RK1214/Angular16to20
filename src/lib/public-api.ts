/*
 * Public API Surface of custom-components-lib
 * This file exports all public interfaces, components, directives, and modules
 */

// ============================================================================
// COMPONENTS
// ============================================================================

// Select Dropdown
export { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
export { SelectOption } from './components/select-dropdown/select-dropdown.component';

// Multiline Select Dropdown
export { MultilineSelectDropdownComponent } from './components/multiline-select-dropdown/multiline-select-dropdown.component';
export { MultilineSelectOption } from './components/multiline-select-dropdown/multiline-select-dropdown.component';

// Split Select Dropdown
export { SplitSelectDropdownComponent } from './components/split-select-dropdown/split-select-dropdown.component';
export { SplitSelectOption } from './components/split-select-dropdown/split-select-dropdown.component';

// Date Range
export { DateRangeComponent } from './components/date-range/date-range.component';
export { DateRange } from './components/date-range/date-range.component';

// Autocomplete Input
export { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
export { AutocompleteInputOption } from './components/autocomplete-input/autocomplete-input.component';

// Multi-Select Autocomplete
export { MultiSelectAutocompleteComponent } from './components/multi-select-autocomplete/multi-select-autocomplete.component';
export { AutocompleteOption, AutocompleteGroup } from './components/multi-select-autocomplete/multi-select-autocomplete.component';

// ============================================================================
// DIRECTIVES
// ============================================================================

export { FlexDirective, GapDirective } from './directives/flex.directive';

// ============================================================================
// MODULE (if keeping SharedModule approach)
// ============================================================================

// Note: SharedModule is still in app/shared folder
// This library exports individual components that can be imported directly
// or through the SharedModule
