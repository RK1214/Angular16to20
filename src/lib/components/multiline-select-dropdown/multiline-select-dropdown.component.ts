import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

export interface MultilineSelectOption {
  value: any;
  label: string;
  description: string;
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
  @Input() defaultValue: any = null;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() showInfoIcon: boolean = false;
  @Input() infoTitle: string = 'Information';
  @Input() infoMessage: string = '';

  selectedValue: any = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private dialog: MatDialog) {}

  onSelectionChange(value: any): void {
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }

  isSelected(value: any): boolean {
    return this.selectedValue === value;
  }

  onFocus(): void {
    this.onTouched();
  }

  getSelectedLabel(): string {
    const selectedOption = this.options.find(opt => opt.value === this.selectedValue);
    return selectedOption ? selectedOption.label : '';
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
    this.selectedValue = value !== null && value !== undefined ? value : this.defaultValue;
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
