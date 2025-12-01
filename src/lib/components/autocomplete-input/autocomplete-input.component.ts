import { Component, Input, OnInit, OnDestroy, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validator, NG_VALIDATORS, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

export interface AutocompleteInputOption {
  value: string;
  text: string;
}

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutocompleteInputComponent),
      multi: true
    }
  ]
})
export class AutocompleteInputComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() label: string = 'Select or type';
  @Input() placeholder: string = '';
  @Input() options: AutocompleteInputOption[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() autoSelectExactMatch: boolean = true;
  @Input() openOnFocus: boolean = false;
  @Input() showInfoIcon: boolean = false;
  @Input() infoTitle: string = 'Information';
  @Input() infoMessage: string = '';
  @Input() showRequiredAsterisk: boolean = false;
  @Input() allowedPattern: string = '';  // Regex pattern for allowed characters (e.g., '^[a-zA-Z0-9]*$')
  @Input() disallowedPattern: string = '';  // Regex pattern for disallowed characters (e.g., '[^a-zA-Z0-9]')

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  inputControl = new FormControl('');
  filteredOptions$!: Observable<AutocompleteInputOption[]>;
  selectedValue: string = '';
  isFocused: boolean = false;
  isTouched: boolean = false;
  private blurTimeout: any = null;
  private isInteractingWithPanel: boolean = false;
  private shouldOpenPanel: boolean = false;
  private justFocused: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.setupFilteredOptions();

    // Subscribe to value changes
    this.inputControl.valueChanges.subscribe(value => {
      const stringValue = typeof value === 'string' ? value : (value as AutocompleteInputOption)?.text || '';

      // Auto-select if enabled and there's an exact case-insensitive match
      if (this.autoSelectExactMatch && typeof value === 'string' && value.trim()) {
        const exactMatch = this.findExactMatch(value);
        if (exactMatch && this.selectedValue !== exactMatch.text) {
          // Found exact match, auto-select it
          this.selectedValue = exactMatch.text;
          this.inputControl.setValue(exactMatch.text, { emitEvent: false });
          this.onChange(exactMatch.text);
          this.onTouched();
          return;
        }
      }

      this.selectedValue = stringValue;
      this.onChange(stringValue);
      this.onTouched();
      // Trigger validation change
      this.onValidatorChange();
    });
  }

  private findExactMatch(searchValue: string): AutocompleteInputOption | null {
    const searchLower = searchValue.trim().toLowerCase();
    return this.options.find(option =>
      option.text.toLowerCase() === searchLower
    ) || null;
  }

  ngOnDestroy(): void {
    // Clear any pending timeout
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
  }

  private setupFilteredOptions(): void {
    this.filteredOptions$ = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value as AutocompleteInputOption)?.text || '';
        return this.filterOptions(filterValue);
      })
    );
  }

  private filterOptions(value: string): AutocompleteInputOption[] {
    if (!value) {
      return this.options;
    }

    const filterValue = value.toLowerCase().trim();
    return this.options.filter(option =>
      option.text.toLowerCase().includes(filterValue)
    );
  }

  onOptionMouseDown(event: MouseEvent): void {
    // Prevent input blur when clicking option
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

  onOptionSelected(option: AutocompleteInputOption): void {
    // Clear any pending blur timeout when option is selected
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
    this.selectedValue = option.text;
    this.inputControl.setValue(option.text);
    // Keep focused state to prevent error from showing immediately
    this.isFocused = true;
  }

  isSelected(option: AutocompleteInputOption): boolean {
    return this.selectedValue === option.text;
  }

  displayFn(value: string | AutocompleteInputOption): string {
    if (typeof value === 'string') {
      return value;
    }
    return value?.text || '';
  }

  onFocus(): void {
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

  onBlur(): void {
    // Delay blur handling to prevent flickering when clicking dropdown options or arrow icon
    this.blurTimeout = setTimeout(() => {
      // Don't process blur if autocomplete panel is open
      if (this.autocomplete?.isOpen) {
        return;
      }
      this.isFocused = false;
      this.isTouched = true;
      this.onTouched();
    }, 150);
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

  onPanelClosed(): void {
    // Reset the flag when panel closes
    this.shouldOpenPanel = false;
    // Panel closed, allow blur to process
    this.isInteractingWithPanel = false;
    // Ensure blur is processed after panel closes
    setTimeout(() => {
      if (!this.isFocused && !this.autocomplete?.isOpen) {
        this.onTouched();
      }
    }, 100);
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

  shouldShowError(): boolean {
    // Only show validation error when not focused and not interacting with panel
    if (this.isFocused || this.isInteractingWithPanel) {
      return false;
    }

    // Show custom error message if provided (assumes parent is handling touched state)
    if (this.errorMessage) {
      return true;
    }

    // Show validation error if required, empty, and has been touched
    if (this.required && !this.selectedValue.trim() && this.isTouched) {
      return true;
    }

    return false;
  }

  getErrorMessage(): string {
    // Return custom error message if provided
    if (this.errorMessage) {
      return this.errorMessage;
    }

    // Return required error message
    if (this.required && !this.selectedValue.trim()) {
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

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    const displayValue = value || '';
    this.selectedValue = displayValue;
    this.inputControl.setValue(displayValue, { emitEvent: false });
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
      this.inputControl.disable({ emitEvent: false });
    } else {
      this.inputControl.enable({ emitEvent: false });
    }
  }

  // Validator implementation
  validate(control: AbstractControl): ValidationErrors | null {
    // If required and no value, return validation error
    if (this.required && !this.selectedValue.trim()) {
      return { required: true };
    }

    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
