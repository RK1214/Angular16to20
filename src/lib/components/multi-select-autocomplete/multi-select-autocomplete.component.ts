import { Component, Input, OnInit, OnDestroy, DoCheck, forwardRef, ViewChild, ElementRef, Optional, Self, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ValidationErrors, AbstractControl, FormGroupDirective, NgForm, NgControl, ValidatorFn } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

export interface AutocompleteOption {
  value: any;
  text: string;
  group?: string;
}

export interface AutocompleteGroup {
  name: string;
  options: AutocompleteOption[];
}

class MultiSelectErrorStateMatcher implements ErrorStateMatcher {
  constructor(private component: MultiSelectAutocompleteComponent) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    // Always show max selection error (informative, doesn't block form)
    if (this.component.showMaxSelectionError) {
      return true;
    }

    // Don't show validation errors while user is focused on the field
    if (this.component.isFocused || this.component.isInteractingWithPanel) {
      return false;
    }

    // Check if there are errors to display
    const hasErrors = this.component.shouldShowError();

    // Also check parent control state if available
    const parentControl = this.component.ngControl?.control;
    const parentHasErrors = !!(
      parentControl &&
      parentControl.invalid &&
      (parentControl.touched || parentControl.dirty)
    );

    return hasErrors || parentHasErrors;
  }
}

@Component({
  selector: 'app-multi-select-autocomplete',
  templateUrl: './multi-select-autocomplete.component.html',
  styleUrls: ['./multi-select-autocomplete.component.css'],
  standalone: false
})
export class MultiSelectAutocompleteComponent implements OnInit, OnDestroy, DoCheck, ControlValueAccessor {
  @Input() label: string = 'Select options';
  @Input() placeholder: string = '';
  @Input() set options(value: AutocompleteOption[]) {
    this._options = value;
    // When options change, re-match the current value with new options
    if (this.searchControl) {
      this.rematchValue();
      this.setupFilteredOptions();
    }
  }
  get options(): AutocompleteOption[] {
    return this._options;
  }
  private _options: AutocompleteOption[] = [];
  @Input() set groupedOptions(value: AutocompleteGroup[]) {
    this._groupedOptions = value;
    // When grouped options change, re-match the current value with new options
    if (this.searchControl) {
      this.rematchValue();
      this.setupFilteredOptions();
    }
  }
  get groupedOptions(): AutocompleteGroup[] {
    return this._groupedOptions;
  }
  private _groupedOptions: AutocompleteGroup[] = [];
  @Input() multiple: boolean = true;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() maxSelection?: number;
  @Input() maxSelectionError: string = 'Maximum selection limit reached';
  @Input() errorAutoHideTime: number = 3000; // Default 3 seconds
  @Input() openOnFocus: boolean = false; // Default: don't open dropdown on focus
  @Input() showInfoIcon: boolean = false;
  @Input() infoTitle: string = 'Information';
  @Input() infoMessage: string = '';
  @Input() showRequiredAsterisk: boolean = false;
  @Input() allowedPattern: string = '';  // Regex pattern for allowed characters (e.g., '^[a-zA-Z0-9]*$')
  @Input() disallowedPattern: string = '';  // Regex pattern for disallowed characters (e.g., '[^a-zA-Z0-9]')

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  searchControl = new FormControl('', (control: AbstractControl): ValidationErrors | null => {
    // Custom validator that checks if the multi-select is empty and required
    if (this.required && this.selectedItems.length === 0 && this.isTouched) {
      return { required: true };
    }
    return null;
  });
  selectedItems: AutocompleteOption[] = [];
  filteredOptions$!: Observable<AutocompleteOption[] | AutocompleteGroup[]>;
  maxSelectionReached: boolean = false;
  showMaxSelectionError: boolean = false; // For displaying error without affecting form validity
  isFocused: boolean = false;
  isTouched: boolean = false;
  errorStateMatcher: ErrorStateMatcher;
  isFieldEmpty: boolean = true;
  private shouldOpenPanel: boolean = false;
  private justFocused: boolean = false;
  private errorTimeout: any = null;
  private blurTimeout: any = null;
  isInteractingWithPanel: boolean = false;
  private currentValue: any = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    @Optional() @Self() public ngControl: NgControl
  ) {
    // Set the value accessor manually to avoid circular dependency
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Create error state matcher
    this.errorStateMatcher = new MultiSelectErrorStateMatcher(this);
  }

  ngOnInit(): void {
    this.setupFilteredOptions();

    // Subscribe to input changes to update isEmpty state
    this.searchControl.valueChanges.subscribe(() => {
      this.updateEmptyState();
    });

    // Initial empty state
    this.updateEmptyState();
  }

  ngDoCheck(): void {
    // Don't use ngDoCheck for error syncing - it causes too many updates
    // Errors are synced only on blur and when errorMessage changes
  }

  ngOnDestroy(): void {
    // Clear any pending timeouts
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
  }

  private setupFilteredOptions(): void {
    this.filteredOptions$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchTerm = typeof value === 'string' ? value : '';
        return this.filterOptions(searchTerm);
      })
    );
  }

  private filterOptions(searchTerm: string): AutocompleteOption[] | AutocompleteGroup[] {
    const term = searchTerm.toLowerCase().trim();

    if (this.groupedOptions.length > 0) {
      // Filter grouped options
      const filtered = this.groupedOptions.map(group => ({
        name: group.name,
        options: group.options.filter(option =>
          this.shouldShowOption(option, term)
        )
      })).filter(group => group.options.length > 0);

      return filtered;
    } else {
      // Filter flat options
      return this.options.filter(option => this.shouldShowOption(option, term));
    }
  }

  private shouldShowOption(option: AutocompleteOption, searchTerm: string): boolean {
    // Don't show already selected items in dropdown
    const isAlreadySelected = this.selectedItems.some(item =>
      this.compareOptions(item, option)
    );

    if (isAlreadySelected) {
      return false;
    }

    // Show all options even if max selection is reached
    // The selection will be prevented in onOptionSelected()

    // Filter by search term
    if (!searchTerm) {
      return true;
    }

    return option.text.toLowerCase().includes(searchTerm);
  }

  private checkMaxSelection(): void {
    if (this.maxSelection) {
      this.maxSelectionReached = this.selectedItems.length >= this.maxSelection;
      // Note: We don't set form control errors here to keep the form valid
      // The maxSelectionReached flag is used for informative display only
    }
  }

  private startErrorAutoHide(): void {
    // Clear any existing timeout
    this.clearErrorAutoHide();

    // Set new timeout to auto-hide the max selection error
    this.errorTimeout = setTimeout(() => {
      this.showMaxSelectionError = false;
    }, this.errorAutoHideTime);
  }

  private clearErrorAutoHide(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }

  private compareOptions(option1: AutocompleteOption, option2: AutocompleteOption): boolean {
    return JSON.stringify(option1.value) === JSON.stringify(option2.value);
  }

  onOptionMouseDown(event: MouseEvent): void {
    // Prevent input blur when clicking on option
    event.preventDefault();
    // Clear any pending blur timeout
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
  }

  onOptionTouchStart(event: TouchEvent): void {
    // For touch events, DON'T preventDefault to allow selection in responsive mode
    // But DO stop propagation to prevent ripple effects on parent elements
    event.stopPropagation();

    // Clear the blur timeout
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    // Clear any pending blur timeout when option is selected
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
    // Keep focused state to prevent error from showing immediately
    this.isFocused = true;

    const selectedOption = event.option.value as AutocompleteOption;

    if (this.multiple) {
      // Check max selection limit - don't add item, close dropdown, show error
      if (this.maxSelection && this.selectedItems.length >= this.maxSelection) {
        this.maxSelectionReached = true;
        // Clear input value first
        this.searchControl.setValue('', { emitEvent: false });
        if (this.input) {
          this.input.nativeElement.value = '';
        }
        // Show informative error (doesn't affect form validity)
        this.showMaxSelectionError = true;
        // Start auto-hide timer for the error
        this.startErrorAutoHide();
        // Close the dropdown
        if (this.autocompleteTrigger) {
          this.autocompleteTrigger.closePanel();
        }
        return;
      }

      // Add to selected items
      if (!this.selectedItems.some(item => this.compareOptions(item, selectedOption))) {
        this.selectedItems.push(selectedOption);
        this.checkMaxSelection();
        // Revalidate when item is selected
        this.searchControl.updateValueAndValidity();
        this.updateEmptyState();
        this.emitValue();
      }
    } else {
      // Single select - replace
      this.selectedItems = [selectedOption];
      // Revalidate when item is selected
      this.searchControl.updateValueAndValidity();
      this.updateEmptyState();
      this.emitValue();
    }

    // Clear input and reset autocomplete
    this.searchControl.setValue('');
    if (this.input) {
      this.input.nativeElement.value = '';
    }
  }

  removeItem(item: AutocompleteOption): void {
    const index = this.selectedItems.findIndex(selected =>
      this.compareOptions(selected, item)
    );

    if (index >= 0) {
      this.selectedItems.splice(index, 1);

      // Clear max selection error when item is removed
      if (this.maxSelection && this.selectedItems.length < this.maxSelection) {
        this.maxSelectionReached = false;
        // Clear the informative error display
        this.showMaxSelectionError = false;
        // Clear the auto-hide timeout since error is manually cleared
        this.clearErrorAutoHide();
      }

      // Revalidate if field becomes empty
      this.searchControl.updateValueAndValidity();

      this.checkMaxSelection();
      this.updateEmptyState();
      this.emitValue();
    }

    // Trigger filter update
    this.searchControl.updateValueAndValidity();
  }

  private emitValue(): void {
    if (this.multiple) {
      // Emit full objects (with value and label) instead of just values
      this.onChange(this.selectedItems);
    } else {
      // Single select - emit full object or null
      const selectedObject = this.selectedItems.length > 0 ? this.selectedItems[0] : null;
      this.onChange(selectedObject);
    }
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.currentValue = value;
    this.rematchValue();
  }

  private rematchValue(): void {
    if (this.currentValue) {
      if (this.multiple && Array.isArray(this.currentValue)) {
        // Handle both array of objects and array of values
        if (this.currentValue.length > 0 && typeof this.currentValue[0] === 'object' && this.currentValue[0].hasOwnProperty('value')) {
          // Already an array of objects
          this.selectedItems = this.currentValue;
        } else {
          // Array of primitive values - map to options
          this.selectedItems = this.findOptionsByValues(this.currentValue);
        }
      } else if (!this.multiple) {
        // Single select - handle both object and primitive value
        if (typeof this.currentValue === 'object' && this.currentValue.hasOwnProperty('value')) {
          // Already an object
          this.selectedItems = [this.currentValue];
        } else {
          // Primitive value - find the option
          const option = this.findOptionByValue(this.currentValue);
          this.selectedItems = option ? [option] : [];
        }
      }
    } else {
      this.selectedItems = [];
    }

    // Check max selection
    this.checkMaxSelection();

    // Trigger filter update
    if (this.searchControl) {
      this.searchControl.updateValueAndValidity();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  private findOptionsByValues(values: any[]): AutocompleteOption[] {
    const allOptions = this.getAllOptions();
    return values
      .map(value => allOptions.find(opt =>
        JSON.stringify(opt.value) === JSON.stringify(value)
      ))
      .filter(opt => opt !== undefined) as AutocompleteOption[];
  }

  private findOptionByValue(value: any): AutocompleteOption | undefined {
    const allOptions = this.getAllOptions();
    return allOptions.find(opt =>
      JSON.stringify(opt.value) === JSON.stringify(value)
    );
  }

  private getAllOptions(): AutocompleteOption[] {
    if (this.groupedOptions.length > 0) {
      return this.groupedOptions.flatMap(group => group.options);
    }
    return this.options;
  }

  isGrouped(filtered: any): filtered is AutocompleteGroup[] {
    return Array.isArray(filtered) &&
           filtered.length > 0 &&
           filtered[0].hasOwnProperty('name') &&
           filtered[0].hasOwnProperty('options');
  }

  getDisplayValue(): string {
    return '';
  }

  onInputFocus(): void {
    // Clear any pending blur timeout
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
    // Set focused state to hide error message
    this.isFocused = true;

    if (this.openOnFocus) {
      // If openOnFocus is enabled, open the dropdown
      this.shouldOpenPanel = true;
      if (this.autocompleteTrigger) {
        this.autocompleteTrigger.openPanel();
      }
    } else {
      // Track that focus just happened (used to prevent auto-opening)
      this.justFocused = true;
      // Reset the justFocused flag after a short delay
      setTimeout(() => {
        this.justFocused = false;
      }, 100);
    }
  }

  onInputBlur(): void {
    // Delay blur handling to prevent flickering when clicking dropdown options
    this.blurTimeout = setTimeout(() => {
      // Don't process blur if autocomplete panel is open
      if (this.autocompleteTrigger?.panelOpen) {
        return;
      }

      this.isFocused = false;
      this.isTouched = true;
      this.onTouched();

      // Trigger validation on searchControl
      this.searchControl.updateValueAndValidity();
      this.searchControl.markAsTouched();
    }, 200);
  }

  updateEmptyState(): void {
    // Field is empty if there are no selected chips AND no text typed in the input
    const hasSelectedItems = this.selectedItems.length > 0;
    // Check both FormControl value AND actual DOM input value
    const hasSearchControlText = this.searchControl.value && String(this.searchControl.value).trim().length > 0;
    const hasInputElementText = this.input?.nativeElement?.value && this.input.nativeElement.value.trim().length > 0;

    this.isFieldEmpty = !hasSelectedItems && !hasSearchControlText && !hasInputElementText;
  }

  shouldShowError(): boolean {
    // Only show validation error when not focused and not interacting with panel
    if (this.isFocused || this.isInteractingWithPanel) {
      return false;
    }

    // Show validation error if required, empty, and has been touched
    if (this.required && this.selectedItems.length === 0 && this.isTouched) {
      return true;
    }

    return false;
  }

  getErrorMessage(): string {
    // Don't show required error when showing max selection error
    if (this.showMaxSelectionError) {
      return '';
    }

    // Return required error message from internal validation
    if (this.required && this.selectedItems.length === 0 && this.isTouched) {
      return `${this.label} is required`;
    }

    return '';
  }

  openInfoDialog(): void {
    if (this.showInfoIcon && this.infoMessage) {
      // Clear any pending blur timeout to prevent error from showing
      if (this.blurTimeout) {
        clearTimeout(this.blurTimeout);
        this.blurTimeout = null;
      }
      // Keep focused state to prevent error display
      this.isFocused = true;

      this.dialog.open(InfoDialogComponent, {
        width: '500px',
        data: {
          title: this.infoTitle,
          message: this.infoMessage
        }
      });
    }
  }

  onInputClick(): void {
    // Prevent panel from opening on click if openOnFocus is disabled
    if (!this.openOnFocus && this.autocompleteTrigger?.panelOpen && !this.shouldOpenPanel) {
      this.autocompleteTrigger.closePanel();
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    // Skip validation for special keys
    const specialKeys = ['Escape', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Home', 'End'];

    if (specialKeys.includes(event.key)) {
      // Open panel on ArrowDown key press
      if (event.key === 'ArrowDown' && this.autocompleteTrigger) {
        event.preventDefault();
        this.shouldOpenPanel = true;
        this.autocompleteTrigger.openPanel();
      }
      return;
    }

    // Validate input character against patterns
    if (this.allowedPattern || this.disallowedPattern) {
      const char = event.key;

      // Check allowed pattern - if specified, only these characters are allowed
      if (this.allowedPattern && char.length === 1) {
        const allowedRegex = new RegExp(this.allowedPattern);
        if (!allowedRegex.test(char)) {
          event.preventDefault();
          return;
        }
      }

      // Check disallowed pattern - if specified, these characters are blocked
      if (this.disallowedPattern && char.length === 1) {
        const disallowedRegex = new RegExp(this.disallowedPattern);
        if (disallowedRegex.test(char)) {
          event.preventDefault();
          return;
        }
      }
    }

    // Allow panel to open when user types
    this.shouldOpenPanel = true;
  }

  onPanelOpened(): void {
    // Clear any pending blur timeout immediately when panel opens
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }

    // Mark that we're interacting with the panel
    this.isInteractingWithPanel = true;
    // Ensure focused state is maintained
    this.isFocused = true;

    // Close panel if it opened without explicit user action (only when openOnFocus is disabled)
    if (!this.openOnFocus && this.justFocused && !this.shouldOpenPanel) {
      this.autocompleteTrigger?.closePanel();
    }
  }

  onArrowMouseDown(event: MouseEvent): void {
    // Prevent input blur when clicking arrow
    event.preventDefault();
    event.stopPropagation();

    // Clear any pending blur timeout
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
    // Maintain focused state
    this.isFocused = true;
  }

  toggleDropdown(): void {
    // Clear any pending blur timeout
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
    // Maintain focused state
    this.isFocused = true;

    // Toggle autocomplete panel when arrow icon is clicked
    if (this.autocompleteTrigger && !this.disabled) {
      if (this.autocompleteTrigger.panelOpen) {
        this.autocompleteTrigger.closePanel();
      } else {
        this.shouldOpenPanel = true;
        this.autocompleteTrigger.openPanel();
      }
    }
  }

  onPanelClosed(): void {
    // Reset the flag when panel closes
    this.shouldOpenPanel = false;
    // Panel closed, allow blur to process
    this.isInteractingWithPanel = false;
    // Ensure blur is processed after panel closes
    setTimeout(() => {
      if (!this.isFocused && !this.autocompleteTrigger?.panelOpen) {
        this.onTouched();
      }
    }, 100);
  }

  private updateSearchControlErrors(): void {
    // Trigger revalidation
    this.searchControl.updateValueAndValidity();
  }
}
