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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// Import from library
import {
  // Components
  MultiSelectAutocompleteComponent,
  DateRangeComponent,
  SelectDropdownComponent,
  AutocompleteInputComponent,
  MultilineSelectDropdownComponent,
  SplitSelectDropdownComponent,
  InfoDialogComponent,
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
    InfoDialogComponent,
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
    MatSelectModule,
    MatDialogModule,
    MatButtonModule
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
