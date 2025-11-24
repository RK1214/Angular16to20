import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface AutocompleteInputOption {
  value: string;
  label: string;
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
    }
  ]
})
export class AutocompleteInputComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Select or type';
  @Input() placeholder: string = '';
  @Input() options: AutocompleteInputOption[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hint: string = '';
  @Input() errorMessage: string = '';

  inputControl = new FormControl('');
  filteredOptions$!: Observable<AutocompleteInputOption[]>;
  selectedValue: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.setupFilteredOptions();

    // Subscribe to value changes
    this.inputControl.valueChanges.subscribe(value => {
      const stringValue = typeof value === 'string' ? value : (value as AutocompleteInputOption)?.label || '';
      this.selectedValue = stringValue;
      this.onChange(stringValue);
      this.onTouched();
    });
  }

  private setupFilteredOptions(): void {
    this.filteredOptions$ = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value as AutocompleteInputOption)?.label || '';
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
      option.label.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(option: AutocompleteInputOption): void {
    this.selectedValue = option.label;
    this.inputControl.setValue(option.label);
  }

  isSelected(option: AutocompleteInputOption): boolean {
    return this.selectedValue === option.label;
  }

  displayFn(value: string | AutocompleteInputOption): string {
    if (typeof value === 'string') {
      return value;
    }
    return value?.label || '';
  }

  onFocus(): void {
    this.onTouched();
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
}
