import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AutocompleteGroup,
  AutocompleteOption,
  SelectOption,
  AutocompleteInputOption,
  DateRange,
  MultilineSelectOption,
  SplitSelectOption
} from '../../../lib';

@Component({
  selector: 'app-travel-booking',
  templateUrl: './travel-booking.component.html',
  styleUrls: ['./travel-booking.component.css'],
  standalone: false
})
export class TravelBookingComponent implements OnInit {
  travelForm!: FormGroup;

  // Destination options with grouped data
  destinations: AutocompleteGroup[] = [
    {
      name: 'Popular Destinations',
      options: [
        { value: 'CHN', label: 'China' },
        { value: 'IDN', label: 'Indonesia' },
        { value: 'JPN', label: 'Japan' },
        { value: 'MYS', label: 'Malaysia' }
      ]
    },
    {
      name: 'All Destinations',
      options: [
        { value: 'AUS', label: 'Australia' },
        { value: 'BES', label: 'Bonaire, Sint Eustatius and Saba' },
        { value: 'BRN', label: 'Brunei' },
        { value: 'KHM', label: 'Cambodia' },
        { value: 'FJI', label: 'Fiji' },
        { value: 'HKG', label: 'Hong Kong' },
        { value: 'IND', label: 'India' },
        { value: 'LAO', label: 'Laos' },
        { value: 'MAC', label: 'Macau' },
        { value: 'MDV', label: 'Maldives' },
        { value: 'MMR', label: 'Myanmar' },
        { value: 'NZL', label: 'New Zealand' },
        { value: 'PHL', label: 'Philippines' },
        { value: 'SGP', label: 'Singapore' },
        { value: 'SXM', label: 'Sint Maarten' },
        { value: 'KOR', label: 'South Korea' },
        { value: 'LKA', label: 'Sri Lanka' },
        { value: 'TWN', label: 'Taiwan' },
        { value: 'THA', label: 'Thailand' },
        { value: 'VNM', label: 'Vietnam' }
      ]
    }
  ];

  // Cover type options (using new select dropdown component)
  coverTypes: SelectOption[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family' },
    { value: 'group', label: 'Group' }
  ];

  // Activity types for multi-select demo
  activityTypes: AutocompleteOption[] = [
    { value: 'adventure', label: 'Adventure Sports' },
    { value: 'beach', label: 'Beach Activities' },
    { value: 'cultural', label: 'Cultural Tours' },
    { value: 'diving', label: 'Scuba Diving' },
    { value: 'hiking', label: 'Hiking & Trekking' },
    { value: 'skiing', label: 'Skiing & Snowboarding' },
    { value: 'wildlife', label: 'Wildlife Safari' },
    { value: 'water', label: 'Water Sports' }
  ];

  // Region options (using new multiline-select-dropdown component)
  regions: MultilineSelectOption[] = [
    { value: 'region1', label: 'Region 1', description: 'Asia excluding Nepal, North Korea, Tibet, Region 3 and 4.' },
    { value: 'region2', label: 'Region 2', description: 'Australia, New Zealand, Maldives, Sri Lanka and Seychelles.' },
    { value: 'region3', label: 'Region 3', description: 'Worldwide including Nepal, North Korea, Tibet, Region 1 and 2 but excluding Cuba, USA and Canada.' },
    { value: 'region4', label: 'Region 4', description: 'Worldwide excluding Cuba.' }
  ];

  // Coverage options (using new split-select-dropdown component)
  coverageOptions: SplitSelectOption[] = [
    { value: 'none', leftLabel: 'None', rightLabel: '' },
    { value: '2500', leftLabel: 'SGD 2,500 coverage', rightLabel: '+ SGD 3.92' },
    { value: '5000', leftLabel: 'SGD 5,000 coverage', rightLabel: '+ SGD 4.69' },
    { value: '10000', leftLabel: 'SGD 10,000 coverage', rightLabel: '+ SGD 6.54' }
  ];

  // Nationality options (using new autocomplete input component)
  nationalities: AutocompleteInputOption[] = [
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Afghanistan', label: 'Afghanistan' },
    { value: 'Aland Islands', label: 'Aland Islands' },
    { value: 'Albania', label: 'Albania' },
    { value: 'Algeria', label: 'Algeria' },
    { value: 'American Samoa', label: 'American Samoa' },
    { value: 'Andorra', label: 'Andorra' },
    { value: 'Angola', label: 'Angola' },
    { value: 'Anguilla', label: 'Anguilla' },
    { value: 'Antarctica', label: 'Antarctica' },
    { value: 'Antigua and Barbuda', label: 'Antigua and Barbuda' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Armenia', label: 'Armenia' },
    { value: 'Aruba', label: 'Aruba' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Azerbaijan', label: 'Azerbaijan' },
    { value: 'Bahamas', label: 'Bahamas' },
    { value: 'Bahrain', label: 'Bahrain' },
    { value: 'Bangladesh', label: 'Bangladesh' },
    { value: 'Barbados', label: 'Barbados' },
    { value: 'Belarus', label: 'Belarus' },
    { value: 'Belgium', label: 'Belgium' },
    { value: 'Belize', label: 'Belize' },
    { value: 'Benin', label: 'Benin' },
    { value: 'Bermuda', label: 'Bermuda' },
    { value: 'Bhutan', label: 'Bhutan' },
    { value: 'Bolivia', label: 'Bolivia' },
    { value: 'Bosnia and Herzegovina', label: 'Bosnia and Herzegovina' },
    { value: 'Botswana', label: 'Botswana' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Brunei', label: 'Brunei' },
    { value: 'Bulgaria', label: 'Bulgaria' },
    { value: 'Burkina Faso', label: 'Burkina Faso' },
    { value: 'Burundi', label: 'Burundi' },
    { value: 'Cambodia', label: 'Cambodia' },
    { value: 'Cameroon', label: 'Cameroon' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Cape Verde', label: 'Cape Verde' },
    { value: 'Cayman Islands', label: 'Cayman Islands' },
    { value: 'Central African Republic', label: 'Central African Republic' },
    { value: 'Chad', label: 'Chad' },
    { value: 'Chile', label: 'Chile' },
    { value: 'China', label: 'China' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Comoros', label: 'Comoros' },
    { value: 'Congo', label: 'Congo' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Croatia', label: 'Croatia' },
    { value: 'Cuba', label: 'Cuba' },
    { value: 'Cyprus', label: 'Cyprus' },
    { value: 'Czech Republic', label: 'Czech Republic' },
    { value: 'Denmark', label: 'Denmark' },
    { value: 'Djibouti', label: 'Djibouti' },
    { value: 'Dominica', label: 'Dominica' },
    { value: 'Dominican Republic', label: 'Dominican Republic' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Egypt', label: 'Egypt' },
    { value: 'El Salvador', label: 'El Salvador' },
    { value: 'Equatorial Guinea', label: 'Equatorial Guinea' },
    { value: 'Eritrea', label: 'Eritrea' },
    { value: 'Estonia', label: 'Estonia' },
    { value: 'Ethiopia', label: 'Ethiopia' },
    { value: 'Fiji', label: 'Fiji' },
    { value: 'Finland', label: 'Finland' },
    { value: 'France', label: 'France' },
    { value: 'Gabon', label: 'Gabon' },
    { value: 'Gambia', label: 'Gambia' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Ghana', label: 'Ghana' },
    { value: 'Greece', label: 'Greece' },
    { value: 'Grenada', label: 'Grenada' },
    { value: 'Guatemala', label: 'Guatemala' },
    { value: 'Guinea', label: 'Guinea' },
    { value: 'Guyana', label: 'Guyana' },
    { value: 'Haiti', label: 'Haiti' },
    { value: 'Honduras', label: 'Honduras' },
    { value: 'Hong Kong', label: 'Hong Kong' },
    { value: 'Hungary', label: 'Hungary' },
    { value: 'Iceland', label: 'Iceland' },
    { value: 'India', label: 'India' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Iran', label: 'Iran' },
    { value: 'Iraq', label: 'Iraq' },
    { value: 'Ireland', label: 'Ireland' },
    { value: 'Israel', label: 'Israel' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Jamaica', label: 'Jamaica' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Jordan', label: 'Jordan' },
    { value: 'Kazakhstan', label: 'Kazakhstan' },
    { value: 'Kenya', label: 'Kenya' },
    { value: 'Kuwait', label: 'Kuwait' },
    { value: 'Laos', label: 'Laos' },
    { value: 'Latvia', label: 'Latvia' },
    { value: 'Lebanon', label: 'Lebanon' },
    { value: 'Liberia', label: 'Liberia' },
    { value: 'Libya', label: 'Libya' },
    { value: 'Lithuania', label: 'Lithuania' },
    { value: 'Luxembourg', label: 'Luxembourg' },
    { value: 'Macau', label: 'Macau' },
    { value: 'Madagascar', label: 'Madagascar' },
    { value: 'Malawi', label: 'Malawi' },
    { value: 'Malaysia', label: 'Malaysia' },
    { value: 'Maldives', label: 'Maldives' },
    { value: 'Mali', label: 'Mali' },
    { value: 'Malta', label: 'Malta' },
    { value: 'Mauritania', label: 'Mauritania' },
    { value: 'Mauritius', label: 'Mauritius' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'Moldova', label: 'Moldova' },
    { value: 'Monaco', label: 'Monaco' },
    { value: 'Mongolia', label: 'Mongolia' },
    { value: 'Montenegro', label: 'Montenegro' },
    { value: 'Morocco', label: 'Morocco' },
    { value: 'Mozambique', label: 'Mozambique' },
    { value: 'Myanmar', label: 'Myanmar' },
    { value: 'Namibia', label: 'Namibia' },
    { value: 'Nepal', label: 'Nepal' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'Nicaragua', label: 'Nicaragua' },
    { value: 'Niger', label: 'Niger' },
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'North Korea', label: 'North Korea' },
    { value: 'Norway', label: 'Norway' },
    { value: 'Oman', label: 'Oman' },
    { value: 'Pakistan', label: 'Pakistan' },
    { value: 'Palestine', label: 'Palestine' },
    { value: 'Panama', label: 'Panama' },
    { value: 'Papua New Guinea', label: 'Papua New Guinea' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Peru', label: 'Peru' },
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Poland', label: 'Poland' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Qatar', label: 'Qatar' },
    { value: 'Romania', label: 'Romania' },
    { value: 'Russia', label: 'Russia' },
    { value: 'Rwanda', label: 'Rwanda' },
    { value: 'Saudi Arabia', label: 'Saudi Arabia' },
    { value: 'Senegal', label: 'Senegal' },
    { value: 'Serbia', label: 'Serbia' },
    { value: 'Seychelles', label: 'Seychelles' },
    { value: 'Sierra Leone', label: 'Sierra Leone' },
    { value: 'Slovakia', label: 'Slovakia' },
    { value: 'Slovenia', label: 'Slovenia' },
    { value: 'Somalia', label: 'Somalia' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'South Korea', label: 'South Korea' },
    { value: 'South Sudan', label: 'South Sudan' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Sudan', label: 'Sudan' },
    { value: 'Suriname', label: 'Suriname' },
    { value: 'Sweden', label: 'Sweden' },
    { value: 'Switzerland', label: 'Switzerland' },
    { value: 'Syria', label: 'Syria' },
    { value: 'Taiwan', label: 'Taiwan' },
    { value: 'Tajikistan', label: 'Tajikistan' },
    { value: 'Tanzania', label: 'Tanzania' },
    { value: 'Thailand', label: 'Thailand' },
    { value: 'Togo', label: 'Togo' },
    { value: 'Trinidad and Tobago', label: 'Trinidad and Tobago' },
    { value: 'Tunisia', label: 'Tunisia' },
    { value: 'Turkey', label: 'Turkey' },
    { value: 'Turkmenistan', label: 'Turkmenistan' },
    { value: 'Uganda', label: 'Uganda' },
    { value: 'Ukraine', label: 'Ukraine' },
    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Uzbekistan', label: 'Uzbekistan' },
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Vietnam', label: 'Vietnam' },
    { value: 'Yemen', label: 'Yemen' },
    { value: 'Zambia', label: 'Zambia' },
    { value: 'Zimbabwe', label: 'Zimbabwe' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.travelForm = this.fb.group({
      tripType: ['single'],
      destinations: [[], Validators.required],
      dateRange: [null, Validators.required],
      region: ['region4'],
      coverage: ['5000'],
      coverType: ['individual'],
      nationality: [''],
      activities: [[]]
    });

    // Subscribe to form changes to log values
    this.travelForm.valueChanges.subscribe(values => {
      console.log('Form values:', values);
    });

    // Subscribe to specific field changes
    this.travelForm.get('destinations')?.valueChanges.subscribe(destinations => {
      console.log('Selected destinations:', destinations);
    });

    this.travelForm.get('dateRange')?.valueChanges.subscribe(dateRange => {
      console.log('Date range:', dateRange);
    });

    this.travelForm.get('coverType')?.valueChanges.subscribe(coverType => {
      console.log('Cover type:', coverType);
    });

    this.travelForm.get('nationality')?.valueChanges.subscribe(nationality => {
      console.log('Nationality:', nationality);
    });

    this.travelForm.get('activities')?.valueChanges.subscribe(activities => {
      console.log('Selected activities:', activities);
    });

    this.travelForm.get('region')?.valueChanges.subscribe(region => {
      console.log('Selected region:', region);
    });

    this.travelForm.get('coverage')?.valueChanges.subscribe(coverage => {
      console.log('Selected coverage:', coverage);
    });
  }

  onSubmit() {
    if (this.travelForm.invalid) {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.travelForm);
      return;
    }

    console.log('Form submitted successfully:', this.travelForm.value);
    alert('Form submitted! Check console for values.');
  }

  onReset() {
    this.travelForm.reset({
      tripType: 'single',
      destinations: [],
      dateRange: null,
      region: 'region4',
      coverage: '5000',
      coverType: 'individual',
      nationality: '',
      activities: []
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getDestinationError(): string {
    const control = this.travelForm.get('destinations');
    if (control?.hasError('required') && control.touched) {
      return 'Please select at least one destination';
    }
    return '';
  }

  getDateRangeError(): string {
    const control = this.travelForm.get('dateRange');
    if (control?.hasError('required') && control.touched) {
      return 'Please select travel dates';
    }
    return '';
  }
}
