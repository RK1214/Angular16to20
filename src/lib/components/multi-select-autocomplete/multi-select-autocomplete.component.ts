import { Component, Input, OnInit, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface AutocompleteOption {
  value: any;
  label: string;
  group?: string;
}

export interface AutocompleteGroup {
  name: string;
  options: AutocompleteOption[];
}

@Component({
  selector: 'app-multi-select-autocomplete',
  templateUrl: './multi-select-autocomplete.component.html',
  styleUrls: ['./multi-select-autocomplete.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectAutocompleteComponent),
      multi: true
    }
  ]
})
export class MultiSelectAutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Select options';
  @Input() placeholder: string = 'Type to search...';
  @Input() options: AutocompleteOption[] = [];
  @Input() groupedOptions: AutocompleteGroup[] = [];
  @Input() multiple: boolean = true;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() maxSelection?: number;
  @Input() maxSelectionError: string = 'Maximum selection limit reached';

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  searchControl = new FormControl('');
  selectedItems: AutocompleteOption[] = [];
  filteredOptions$!: Observable<AutocompleteOption[] | AutocompleteGroup[]>;
  maxSelectionReached: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.setupFilteredOptions();
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

    // Don't show any options if max selection is reached
    if (this.maxSelection && this.selectedItems.length >= this.maxSelection) {
      return false;
    }

    // Filter by search term
    if (!searchTerm) {
      return true;
    }

    return option.label.toLowerCase().includes(searchTerm);
  }

  private checkMaxSelection(): void {
    if (this.maxSelection) {
      this.maxSelectionReached = this.selectedItems.length >= this.maxSelection;

      // Disable or enable input based on max selection
      if (this.maxSelectionReached) {
        this.searchControl.disable({ emitEvent: false });
      } else {
        if (!this.disabled) {
          this.searchControl.enable({ emitEvent: false });
        }
      }
    }
  }

  private compareOptions(option1: AutocompleteOption, option2: AutocompleteOption): boolean {
    return JSON.stringify(option1.value) === JSON.stringify(option2.value);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedOption = event.option.value as AutocompleteOption;

    if (this.multiple) {
      // Check max selection limit
      if (this.maxSelection && this.selectedItems.length >= this.maxSelection) {
        this.maxSelectionReached = true;
        this.searchControl.setValue('');
        if (this.input) {
          this.input.nativeElement.value = '';
        }
        return;
      }

      // Add to selected items
      if (!this.selectedItems.some(item => this.compareOptions(item, selectedOption))) {
        this.selectedItems.push(selectedOption);
        this.checkMaxSelection();
        this.emitValue();
      }
    } else {
      // Single select - replace
      this.selectedItems = [selectedOption];
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
      this.checkMaxSelection();
      this.emitValue();
    }

    // Trigger filter update
    this.searchControl.updateValueAndValidity();
  }

  private emitValue(): void {
    if (this.multiple) {
      const values = this.selectedItems.map(item => item.value);
      this.onChange(values);
    } else {
      const value = this.selectedItems.length > 0 ? this.selectedItems[0].value : null;
      this.onChange(value);
    }
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      if (this.multiple && Array.isArray(value)) {
        // Map values to options
        this.selectedItems = this.findOptionsByValues(value);
      } else if (!this.multiple) {
        const option = this.findOptionByValue(value);
        this.selectedItems = option ? [option] : [];
      }
    } else {
      this.selectedItems = [];
    }

    // Check max selection
    this.checkMaxSelection();

    // Trigger filter update
    this.searchControl.updateValueAndValidity();
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
    this.onTouched();
  }
}
