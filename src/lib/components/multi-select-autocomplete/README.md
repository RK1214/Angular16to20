# Multi-Select Autocomplete Component

A reusable Angular Material 20 component for multi-select and single-select autocomplete dropdowns with search/filter functionality, grouped options, and chip-based selection display.

## Features

- **Multi-select or Single-select**: Configurable selection mode
- **Search & Filter**: Real-time filtering of options as you type
- **Grouped Options**: Support for categorizing options into groups
- **Chip Display**: Selected items displayed as removable chips
- **Reactive Forms Compatible**: Implements ControlValueAccessor for seamless form integration
- **Customizable**: Configurable labels, placeholders, hints, and appearance
- **Validation Support**: Works with Angular form validation
- **Accessible**: Built with Material Design best practices

## Installation

The component is already included in the SharedModule. Make sure SharedModule is imported in your module:

```typescript
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [SharedModule]
})
export class YourModule { }
```

## Basic Usage

### Example 1: Simple Multi-Select with Flat Options

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutocompleteOption } from './shared/components/multi-select-autocomplete/multi-select-autocomplete.component';

@Component({
  selector: 'app-example',
  template: `
    <form [formGroup]="form">
      <app-multi-select-autocomplete
        label="Select Countries"
        placeholder="Search countries..."
        [options]="countries"
        formControlName="selectedCountries">
      </app-multi-select-autocomplete>
    </form>
  `
})
export class ExampleComponent implements OnInit {
  form!: FormGroup;
  countries: AutocompleteOption[] = [
    { value: 'china', label: 'China' },
    { value: 'indonesia', label: 'Indonesia' },
    { value: 'japan', label: 'Japan' },
    { value: 'malaysia', label: 'Malaysia' },
    { value: 'singapore', label: 'Singapore' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      selectedCountries: [[]] // Initialize with empty array for multi-select
    });
  }
}
```

### Example 2: Grouped Options (Like the Destination Dropdown)

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutocompleteGroup } from './shared/components/multi-select-autocomplete/multi-select-autocomplete.component';

@Component({
  selector: 'app-destination-form',
  template: `
    <form [formGroup]="tripForm">
      <app-multi-select-autocomplete
        label="Destination(s)"
        placeholder="Select destination(s)"
        [groupedOptions]="destinations"
        [required]="true"
        formControlName="destinations">
      </app-multi-select-autocomplete>
    </form>
  `
})
export class DestinationFormComponent implements OnInit {
  tripForm!: FormGroup;

  destinations: AutocompleteGroup[] = [
    {
      name: 'Popular Destinations',
      options: [
        { value: 'CHN', label: 'China' },
        { value: 'IDN', label: 'Indonesia' },
        { value: 'JPN', label: 'Japan' }
      ]
    },
    {
      name: 'All Destinations',
      options: [
        { value: 'BES', label: 'Bonaire, Sint Eustatius and Saba' },
        { value: 'SXM', label: 'Sint Maarten' },
        { value: 'MYS', label: 'Malaysia' },
        { value: 'THA', label: 'Thailand' },
        { value: 'SGP', label: 'Singapore' }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tripForm = this.fb.group({
      destinations: [[], Validators.required]
    });

    // Subscribe to value changes
    this.tripForm.get('destinations')?.valueChanges.subscribe(values => {
      console.log('Selected destinations:', values);
    });
  }
}
```

### Example 3: Single-Select Mode

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutocompleteOption } from './shared/components/multi-select-autocomplete/multi-select-autocomplete.component';

@Component({
  selector: 'app-single-select-example',
  template: `
    <form [formGroup]="form">
      <app-multi-select-autocomplete
        label="Cover Type"
        placeholder="Select cover type"
        [options]="coverTypes"
        [multiple]="false"
        formControlName="coverType">
      </app-multi-select-autocomplete>
    </form>
  `
})
export class SingleSelectExampleComponent implements OnInit {
  form!: FormGroup;
  coverTypes: AutocompleteOption[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'family', label: 'Family' },
    { value: 'group', label: 'Group' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      coverType: [null] // Initialize with null for single-select
    });
  }
}
```

### Example 4: Multi-Select with Maximum Selection Limit

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutocompleteOption } from './shared/components/multi-select-autocomplete/multi-select-autocomplete.component';

@Component({
  selector: 'app-max-selection-example',
  template: `
    <form [formGroup]="form">
      <app-multi-select-autocomplete
        label="Select up to 3 countries"
        placeholder="Search countries..."
        [options]="countries"
        [maxSelection]="3"
        maxSelectionError="You can only select up to 3 countries"
        hint="Select your preferred countries (maximum 3)"
        formControlName="selectedCountries">
      </app-multi-select-autocomplete>
    </form>
  `
})
export class MaxSelectionExampleComponent implements OnInit {
  form!: FormGroup;
  countries: AutocompleteOption[] = [
    { value: 'china', label: 'China' },
    { value: 'indonesia', label: 'Indonesia' },
    { value: 'japan', label: 'Japan' },
    { value: 'malaysia', label: 'Malaysia' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'thailand', label: 'Thailand' },
    { value: 'vietnam', label: 'Vietnam' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      selectedCountries: [[]]
    });

    // Listen to changes
    this.form.get('selectedCountries')?.valueChanges.subscribe(values => {
      console.log('Selected countries:', values);
      console.log('Count:', values.length);
    });
  }
}
```

**Key Features:**
- When the user selects 3 items, the input is automatically disabled
- An inline error message is displayed: "You can only select up to 3 countries (3/3)"
- Users can still remove items using the X button on chips
- Once an item is removed, the input is re-enabled for further selection
- The dropdown options are hidden when the max limit is reached

### Example 5: Complete Travel Form (Matching the Requirements)

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteGroup, AutocompleteOption } from './shared/components/multi-select-autocomplete/multi-select-autocomplete.component';

@Component({
  selector: 'app-travel-form',
  templateUrl: './travel-form.component.html'
})
export class TravelFormComponent implements OnInit {
  travelForm!: FormGroup;

  destinations: AutocompleteGroup[] = [
    {
      name: 'Popular Destinations',
      options: [
        { value: 'CHN', label: 'China' },
        { value: 'IDN', label: 'Indonesia' },
        { value: 'JPN', label: 'Japan' }
      ]
    },
    {
      name: 'All Destinations',
      options: [
        { value: 'BES', label: 'Bonaire, Sint Eustatius and Saba' },
        { value: 'SXM', label: 'Sint Maarten' },
        { value: 'MYS', label: 'Malaysia' },
        { value: 'THA', label: 'Thailand' },
        { value: 'SGP', label: 'Singapore' },
        { value: 'VNM', label: 'Vietnam' },
        { value: 'KOR', label: 'South Korea' }
      ]
    }
  ];

  coverTypes: AutocompleteOption[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'family', label: 'Family' },
    { value: 'group', label: 'Group' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.travelForm = this.fb.group({
      tripType: ['single'],
      destinations: [[], Validators.required],
      departureDate: [null, Validators.required],
      returnDate: [null, Validators.required],
      coverType: ['individual']
    });
  }

  onSubmit() {
    if (this.travelForm.valid) {
      console.log('Form submitted:', this.travelForm.value);
    }
  }
}
```

**Template (travel-form.component.html):**

```html
<form [formGroup]="travelForm" (ngSubmit)="onSubmit()">
  <!-- Trip Type Radio Buttons -->
  <mat-radio-group formControlName="tripType">
    <mat-radio-button value="single">Single Trip</mat-radio-button>
    <mat-radio-button value="annual">Annual Multi-Trip</mat-radio-button>
  </mat-radio-group>

  <!-- Destination Multi-Select Autocomplete -->
  <app-multi-select-autocomplete
    label="Destination(s)"
    placeholder="Select destination(s)"
    [groupedOptions]="destinations"
    [required]="true"
    hint="You can select multiple destinations"
    formControlName="destinations">
  </app-multi-select-autocomplete>

  <!-- Departure Date -->
  <mat-form-field>
    <mat-label>Departure Date</mat-label>
    <input matInput [matDatepicker]="departurePicker" formControlName="departureDate">
    <mat-datepicker-toggle matSuffix [for]="departurePicker"></mat-datepicker-toggle>
    <mat-datepicker #departurePicker></mat-datepicker>
  </mat-form-field>

  <!-- Return Date -->
  <mat-form-field>
    <mat-label>Return Date</mat-label>
    <input matInput [matDatepicker]="returnPicker" formControlName="returnDate">
    <mat-datepicker-toggle matSuffix [for]="returnPicker"></mat-datepicker-toggle>
    <mat-datepicker #returnPicker></mat-datepicker>
  </mat-form-field>

  <!-- Cover Type Single-Select Autocomplete -->
  <app-multi-select-autocomplete
    label="Cover Type"
    placeholder="Select cover type"
    [options]="coverTypes"
    [multiple]="false"
    formControlName="coverType">
  </app-multi-select-autocomplete>

  <button mat-raised-button color="primary" type="submit">Submit</button>
</form>
```

## API Reference

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | string | 'Select options' | The label for the form field |
| `placeholder` | string | 'Type to search...' | Placeholder text for the input |
| `options` | AutocompleteOption[] | [] | Flat array of options |
| `groupedOptions` | AutocompleteGroup[] | [] | Grouped options (takes precedence over `options`) |
| `multiple` | boolean | true | Enable multi-select mode |
| `required` | boolean | false | Mark field as required |
| `disabled` | boolean | false | Disable the component |
| `appearance` | 'fill' \| 'outline' | 'outline' | Material form field appearance |
| `hint` | string | '' | Hint text displayed below the field |
| `errorMessage` | string | '' | Error message to display |
| `maxSelection` | number \| undefined | undefined | Maximum number of items that can be selected (multi-select only) |
| `maxSelectionError` | string | 'Maximum selection limit reached' | Error message shown when max selection is reached |

### Types

```typescript
export interface AutocompleteOption {
  value: any;        // The value to be stored in form control
  label: string;     // Display text for the option
  group?: string;    // Optional group name
}

export interface AutocompleteGroup {
  name: string;                    // Group label
  options: AutocompleteOption[];   // Options in this group
}
```

### Form Control Value

- **Multi-select mode**: Returns an array of values: `['CHN', 'IDN', 'JPN']`
- **Single-select mode**: Returns a single value: `'individual'` or `null`

## Customization

### Styling

You can customize the component's appearance by overriding CSS classes in your component's stylesheet:

```css
/* Custom chip colors */
::ng-deep .multi-select-autocomplete .selected-chip {
  background-color: #2196F3;
}

/* Custom option styling */
::ng-deep .multi-select-panel .autocomplete-option {
  font-weight: 500;
}

/* Custom group header */
::ng-deep .multi-select-panel .mat-mdc-optgroup-label {
  background-color: #e3f2fd;
  color: #1976D2;
}
```

### Validation

The component works seamlessly with Angular's built-in validators:

```typescript
this.form = this.fb.group({
  destinations: [[], [Validators.required, Validators.minLength(1)]],
  coverType: [null, Validators.required]
});
```

Display validation errors:

```html
<app-multi-select-autocomplete
  label="Destination(s)"
  [groupedOptions]="destinations"
  formControlName="destinations"
  [errorMessage]="getErrorMessage('destinations')">
</app-multi-select-autocomplete>
```

```typescript
getErrorMessage(fieldName: string): string {
  const control = this.form.get(fieldName);
  if (control?.hasError('required')) {
    return 'This field is required';
  }
  if (control?.hasError('minlength')) {
    return 'Please select at least one option';
  }
  return '';
}
```

## Advanced Usage

### Programmatically Set Values

```typescript
// Set values programmatically
this.form.patchValue({
  destinations: ['CHN', 'JPN']
});

// Clear selection
this.form.patchValue({
  destinations: []
});
```

### Listen to Changes

```typescript
this.form.get('destinations')?.valueChanges.subscribe(values => {
  console.log('Selected:', values);
  // Perform actions based on selection
});
```

### Dynamic Options

```typescript
// Load options from API
ngOnInit() {
  this.http.get<any[]>('/api/destinations').subscribe(data => {
    this.destinations = [{
      name: 'All Destinations',
      options: data.map(d => ({
        value: d.id,
        label: d.name
      }))
    }];
  });
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 20.x
- Angular Material 20.x
- RxJS 7.x

## License

Part of the application's shared components library.
