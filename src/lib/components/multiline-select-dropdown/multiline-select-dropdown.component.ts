import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

export interface MultilineSelectOption {
  value: any;
  text: string;
  description: string;
  default?: boolean;
}

@Component({
  selector: 'app-multiline-select-dropdown',
  templateUrl: './multiline-select-dropdown.component.html',
  styleUrls: ['./multiline-select-dropdown.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultilineSelectDropdownComponent),
      multi: true
    }
  ]
})
export class MultilineSelectDropdownComponent implements ControlValueAccessor {
  @Input() label: string = 'Select option';
  @Input() options: MultilineSelectOption[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() showInfoIcon: boolean = false;
  @Input() infoTitle: string = 'Information';
  @Input() infoMessage: string = '';
  @Input() showRequiredAsterisk: boolean = false;

  selectedValue: MultilineSelectOption | null = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private dialog: MatDialog) {}

  onSelectionChange(option: MultilineSelectOption): void {
    this.selectedValue = option;
    this.onChange(option);
    this.onTouched();
  }

  isSelected(option: MultilineSelectOption): boolean {
    return this.selectedValue?.value === option.value;
  }

  onFocus(): void {
    this.onTouched();
  }

  getSelectedLabel(): string {
    return this.selectedValue ? this.selectedValue.text : '';
  }

  openInfoDialog(): void {
    if (this.showInfoIcon && this.infoMessage) {
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
  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      // If value is already an object, use it directly
      if (typeof value === 'object' && value.hasOwnProperty('value')) {
        this.selectedValue = value;
      } else {
        // Otherwise, find the option by value
        this.selectedValue = this.options.find(opt => opt.value === value) || null;
      }
    } else {
      // Look for a default option in the options array
      const defaultOption = this.options.find(opt => opt.default === true);
      this.selectedValue = defaultOption || null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    // Notify parent form of the initial/default value
    if (this.selectedValue !== null && this.selectedValue !== undefined) {
      setTimeout(() => fn(this.selectedValue), 0);
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
