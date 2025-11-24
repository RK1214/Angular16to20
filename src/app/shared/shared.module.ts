import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

// Import from library
import {
  // Components
  MultiSelectAutocompleteComponent,
  DateRangeComponent,
  SelectDropdownComponent,
  AutocompleteInputComponent,
  MultilineSelectDropdownComponent,
  SplitSelectDropdownComponent,
  // Directives
  FlexDirective,
  GapDirective
} from '../../lib';

@NgModule({
  declarations: [
    MultiSelectAutocompleteComponent,
    DateRangeComponent,
    SelectDropdownComponent,
    AutocompleteInputComponent,
    MultilineSelectDropdownComponent,
    SplitSelectDropdownComponent,
    FlexDirective,
    GapDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  exports: [
    MultiSelectAutocompleteComponent,
    DateRangeComponent,
    SelectDropdownComponent,
    AutocompleteInputComponent,
    MultilineSelectDropdownComponent,
    SplitSelectDropdownComponent,
    FlexDirective,
    GapDirective
  ]
})
export class SharedModule {}
