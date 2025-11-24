import { Component, Input, OnInit, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';

export interface DateRange {
  departureDate: Date | null;
  returnDate: Date | null;
}

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true
    }
  ]
})
export class DateRangeComponent implements OnInit, ControlValueAccessor {
  @Input() departureLabel: string = 'Departure Date';
  @Input() returnLabel: string = 'Return Date';
  @Input() defaultRangeDays: number = 4;
  @Input() maxRangeDays: number = 80;
  @Input() minDate: Date = new Date();
  @Input() disabled: boolean = false;

  @ViewChild('departurePicker') departurePicker!: MatDatepicker<Date>;
  @ViewChild('returnPicker') returnPicker!: MatDatepicker<Date>;

  departureControl = new FormControl<Date | null>(null);
  returnControl = new FormControl<Date | null>(null);

  minReturnDate: Date | null = null;
  maxReturnDate: Date | null = null;

  private onChange: (value: DateRange | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    // Set default dates
    this.setDefaultDates();

    // Subscribe to departure date changes
    this.departureControl.valueChanges.subscribe(date => {
      this.onDepartureDateChange(date);
      this.emitValue();
    });

    // Subscribe to return date changes
    this.returnControl.valueChanges.subscribe(() => {
      this.emitValue();
    });
  }

  private setDefaultDates(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const defaultReturn = new Date(today);
    defaultReturn.setDate(today.getDate() + this.defaultRangeDays);

    this.departureControl.setValue(today);
    this.returnControl.setValue(defaultReturn);

    this.updateReturnDateConstraints(today);
  }

  private onDepartureDateChange(departureDate: Date | null): void {
    if (departureDate) {
      this.updateReturnDateConstraints(departureDate);

      const returnDate = this.returnControl.value;

      // If return date is before departure date or exceeds max range, adjust it
      if (returnDate) {
        if (returnDate < departureDate) {
          // Set return date to departure date + default range
          const newReturnDate = new Date(departureDate);
          newReturnDate.setDate(departureDate.getDate() + this.defaultRangeDays);
          this.returnControl.setValue(newReturnDate);
        } else if (this.maxReturnDate && returnDate > this.maxReturnDate) {
          // Set to max allowed return date
          this.returnControl.setValue(this.maxReturnDate);
        }
      } else {
        // If no return date, set default
        const defaultReturn = new Date(departureDate);
        defaultReturn.setDate(departureDate.getDate() + this.defaultRangeDays);
        this.returnControl.setValue(defaultReturn);
      }
    } else {
      this.minReturnDate = null;
      this.maxReturnDate = null;
    }
  }

  private updateReturnDateConstraints(departureDate: Date): void {
    // Minimum return date is the same as departure date
    this.minReturnDate = new Date(departureDate);
    this.minReturnDate.setHours(0, 0, 0, 0);

    // Maximum return date is departure date + maxRangeDays
    this.maxReturnDate = new Date(departureDate);
    this.maxReturnDate.setDate(departureDate.getDate() + this.maxRangeDays);
  }

  private emitValue(): void {
    const value: DateRange = {
      departureDate: this.departureControl.value,
      returnDate: this.returnControl.value
    };
    this.onChange(value);
    this.onTouched();
  }

  // Filter function for return date picker to disable dates
  returnDateFilter = (date: Date | null): boolean => {
    if (!date || !this.minReturnDate || !this.maxReturnDate) {
      return true;
    }

    const dateTime = date.getTime();
    return dateTime >= this.minReturnDate.getTime() && dateTime <= this.maxReturnDate.getTime();
  };

  // Filter function for departure date picker
  departureDateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }
    // Normalize both dates to midnight for date-only comparison
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const minDate = new Date(this.minDate);
    minDate.setHours(0, 0, 0, 0);

    return inputDate >= minDate;
  };

  // Custom date class to highlight the range
  dateClass = (date: Date): string => {
    const departureDate = this.departureControl.value;
    const returnDate = this.returnControl.value;

    if (!departureDate || !returnDate) {
      return '';
    }

    const dateTime = date.getTime();
    const departureTime = departureDate.getTime();
    const returnTime = returnDate.getTime();

    // Highlight range between departure and return
    if (dateTime > departureTime && dateTime < returnTime) {
      return 'date-range-between';
    }

    // Highlight start date
    if (dateTime === departureTime) {
      return 'date-range-start';
    }

    // Highlight end date
    if (dateTime === returnTime) {
      return 'date-range-end';
    }

    return '';
  };

  onDepartureOpened(): void {
    // Calendar will automatically show the month of the selected date
  }

  onReturnOpened(): void {
    // Calendar will automatically show the month of the selected date
  }

  // ControlValueAccessor implementation
  writeValue(value: DateRange | null): void {
    if (value) {
      this.departureControl.setValue(value.departureDate, { emitEvent: false });
      this.returnControl.setValue(value.returnDate, { emitEvent: false });

      if (value.departureDate) {
        this.updateReturnDateConstraints(value.departureDate);
      }
    } else {
      this.setDefaultDates();
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
      this.departureControl.disable({ emitEvent: false });
      this.returnControl.disable({ emitEvent: false });
    } else {
      this.departureControl.enable({ emitEvent: false });
      this.returnControl.enable({ emitEvent: false });
    }
  }

  onDepartureFocus(): void {
    this.onTouched();
  }

  onReturnFocus(): void {
    this.onTouched();
  }
}
