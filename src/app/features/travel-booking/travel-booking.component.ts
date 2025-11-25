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

  // Dynamic state variables updated by onChange events
  selectedDestinationCount: number = 0;
  selectedCoverTypeName: string = '';
  selectedRegionName: string = '';
  selectedCoverageName: string = '';
  totalPremium: number = 0;
  tripDurationDays: number = 0;
  selectedActivitiesCount: number = 0;

  // Destination options with grouped data
  destinations: AutocompleteGroup[] = [
    {
      name: 'Popular Destinations',
      options: [
        { value: 'CHN', text: 'China' },
        { value: 'IDN', text: 'Indonesia' },
        { value: 'JPN', text: 'Japan' },
        { value: 'MYS', text: 'Malaysia' }
      ]
    },
    {
      name: 'All Destinations',
      options: [
        { value: 'AUS', text: 'Australia' },
        { value: 'BES', text: 'Bonaire, Sint Eustatius and Saba' },
        { value: 'BRN', text: 'Brunei' },
        { value: 'KHM', text: 'Cambodia' },
        { value: 'FJI', text: 'Fiji' },
        { value: 'HKG', text: 'Hong Kong' },
        { value: 'IND', text: 'India' },
        { value: 'LAO', text: 'Laos' },
        { value: 'MAC', text: 'Macau' },
        { value: 'MDV', text: 'Maldives' },
        { value: 'MMR', text: 'Myanmar' },
        { value: 'NZL', text: 'New Zealand' },
        { value: 'PHL', text: 'Philippines' },
        { value: 'SGP', text: 'Singapore' },
        { value: 'SXM', text: 'Sint Maarten' },
        { value: 'KOR', text: 'South Korea' },
        { value: 'LKA', text: 'Sri Lanka' },
        { value: 'TWN', text: 'Taiwan' },
        { value: 'THA', text: 'Thailand' },
        { value: 'VNM', text: 'Vietnam' }
      ]
    }
  ];

  // Cover type options (using new select dropdown component)
  coverTypes: SelectOption[] = [
    { value: 'individual', text: 'Individual', default: true },
    { value: 'couple', text: 'Couple' },
    { value: 'family', text: 'Family' },
    { value: 'group', text: 'Group' }
  ];

  // Activity types for multi-select demo
  activityTypes: AutocompleteOption[] = [
    { value: 'adventure', text: 'Adventure Sports' },
    { value: 'beach', text: 'Beach Activities' },
    { value: 'cultural', text: 'Cultural Tours' },
    { value: 'diving', text: 'Scuba Diving' },
    { value: 'hiking', text: 'Hiking & Trekking' },
    { value: 'skiing', text: 'Skiing & Snowboarding' },
    { value: 'wildlife', text: 'Wildlife Safari' },
    { value: 'water', text: 'Water Sports' }
  ];

  // Region options (using new multiline-select-dropdown component)
  regions: MultilineSelectOption[] = [
    { value: 'region1', text: 'Region 1', description: 'Asia excluding Nepal, North Korea, Tibet, Region 3 and 4.' },
    { value: 'region2', text: 'Region 2', description: 'Australia, New Zealand, Maldives, Sri Lanka and Seychelles.' },
    { value: 'region3', text: 'Region 3', description: 'Worldwide including Nepal, North Korea, Tibet, Region 1 and 2 but excluding Cuba, USA and Canada.' },
    { value: 'region4', text: 'Region 4', description: 'Worldwide excluding Cuba.', default: true }
  ];

  // Coverage options (using new split-select-dropdown component)
  coverageOptions: SplitSelectOption[] = [
    { value: 'none', leftText: 'None', rightText: '' },
    { value: '2500', leftText: 'SGD 2,500 coverage', rightText: '+ SGD 3.92' },
    { value: '5000', leftText: 'SGD 5,000 coverage', rightText: '+ SGD 4.69', default: true },
    { value: '10000', leftText: 'SGD 10,000 coverage', rightText: '+ SGD 6.54' }
  ];

  // Nationality options (using new autocomplete input component)
  nationalities: AutocompleteInputOption[] = [
    { value: 'Singapore', text: 'Singapore' },
    { value: 'Afghanistan', text: 'Afghanistan' },
    { value: 'Aland Islands', text: 'Aland Islands' },
    { value: 'Albania', text: 'Albania' },
    { value: 'Algeria', text: 'Algeria' },
    { value: 'American Samoa', text: 'American Samoa' },
    { value: 'Andorra', text: 'Andorra' },
    { value: 'Angola', text: 'Angola' },
    { value: 'Anguilla', text: 'Anguilla' },
    { value: 'Antarctica', text: 'Antarctica' },
    { value: 'Antigua and Barbuda', text: 'Antigua and Barbuda' },
    { value: 'Argentina', text: 'Argentina' },
    { value: 'Armenia', text: 'Armenia' },
    { value: 'Aruba', text: 'Aruba' },
    { value: 'Australia', text: 'Australia' },
    { value: 'Austria', text: 'Austria' },
    { value: 'Azerbaijan', text: 'Azerbaijan' },
    { value: 'Bahamas', text: 'Bahamas' },
    { value: 'Bahrain', text: 'Bahrain' },
    { value: 'Bangladesh', text: 'Bangladesh' },
    { value: 'Barbados', text: 'Barbados' },
    { value: 'Belarus', text: 'Belarus' },
    { value: 'Belgium', text: 'Belgium' },
    { value: 'Belize', text: 'Belize' },
    { value: 'Benin', text: 'Benin' },
    { value: 'Bermuda', text: 'Bermuda' },
    { value: 'Bhutan', text: 'Bhutan' },
    { value: 'Bolivia', text: 'Bolivia' },
    { value: 'Bosnia and Herzegovina', text: 'Bosnia and Herzegovina' },
    { value: 'Botswana', text: 'Botswana' },
    { value: 'Brazil', text: 'Brazil' },
    { value: 'Brunei', text: 'Brunei' },
    { value: 'Bulgaria', text: 'Bulgaria' },
    { value: 'Burkina Faso', text: 'Burkina Faso' },
    { value: 'Burundi', text: 'Burundi' },
    { value: 'Cambodia', text: 'Cambodia' },
    { value: 'Cameroon', text: 'Cameroon' },
    { value: 'Canada', text: 'Canada' },
    { value: 'Cape Verde', text: 'Cape Verde' },
    { value: 'Cayman Islands', text: 'Cayman Islands' },
    { value: 'Central African Republic', text: 'Central African Republic' },
    { value: 'Chad', text: 'Chad' },
    { value: 'Chile', text: 'Chile' },
    { value: 'China', text: 'China' },
    { value: 'Colombia', text: 'Colombia' },
    { value: 'Comoros', text: 'Comoros' },
    { value: 'Congo', text: 'Congo' },
    { value: 'Costa Rica', text: 'Costa Rica' },
    { value: 'Croatia', text: 'Croatia' },
    { value: 'Cuba', text: 'Cuba' },
    { value: 'Cyprus', text: 'Cyprus' },
    { value: 'Czech Republic', text: 'Czech Republic' },
    { value: 'Denmark', text: 'Denmark' },
    { value: 'Djibouti', text: 'Djibouti' },
    { value: 'Dominica', text: 'Dominica' },
    { value: 'Dominican Republic', text: 'Dominican Republic' },
    { value: 'Ecuador', text: 'Ecuador' },
    { value: 'Egypt', text: 'Egypt' },
    { value: 'El Salvador', text: 'El Salvador' },
    { value: 'Equatorial Guinea', text: 'Equatorial Guinea' },
    { value: 'Eritrea', text: 'Eritrea' },
    { value: 'Estonia', text: 'Estonia' },
    { value: 'Ethiopia', text: 'Ethiopia' },
    { value: 'Fiji', text: 'Fiji' },
    { value: 'Finland', text: 'Finland' },
    { value: 'France', text: 'France' },
    { value: 'Gabon', text: 'Gabon' },
    { value: 'Gambia', text: 'Gambia' },
    { value: 'Georgia', text: 'Georgia' },
    { value: 'Germany', text: 'Germany' },
    { value: 'Ghana', text: 'Ghana' },
    { value: 'Greece', text: 'Greece' },
    { value: 'Grenada', text: 'Grenada' },
    { value: 'Guatemala', text: 'Guatemala' },
    { value: 'Guinea', text: 'Guinea' },
    { value: 'Guyana', text: 'Guyana' },
    { value: 'Haiti', text: 'Haiti' },
    { value: 'Honduras', text: 'Honduras' },
    { value: 'Hong Kong', text: 'Hong Kong' },
    { value: 'Hungary', text: 'Hungary' },
    { value: 'Iceland', text: 'Iceland' },
    { value: 'India', text: 'India' },
    { value: 'Indonesia', text: 'Indonesia' },
    { value: 'Iran', text: 'Iran' },
    { value: 'Iraq', text: 'Iraq' },
    { value: 'Ireland', text: 'Ireland' },
    { value: 'Israel', text: 'Israel' },
    { value: 'Italy', text: 'Italy' },
    { value: 'Jamaica', text: 'Jamaica' },
    { value: 'Japan', text: 'Japan' },
    { value: 'Jordan', text: 'Jordan' },
    { value: 'Kazakhstan', text: 'Kazakhstan' },
    { value: 'Kenya', text: 'Kenya' },
    { value: 'Kuwait', text: 'Kuwait' },
    { value: 'Laos', text: 'Laos' },
    { value: 'Latvia', text: 'Latvia' },
    { value: 'Lebanon', text: 'Lebanon' },
    { value: 'Liberia', text: 'Liberia' },
    { value: 'Libya', text: 'Libya' },
    { value: 'Lithuania', text: 'Lithuania' },
    { value: 'Luxembourg', text: 'Luxembourg' },
    { value: 'Macau', text: 'Macau' },
    { value: 'Madagascar', text: 'Madagascar' },
    { value: 'Malawi', text: 'Malawi' },
    { value: 'Malaysia', text: 'Malaysia' },
    { value: 'Maldives', text: 'Maldives' },
    { value: 'Mali', text: 'Mali' },
    { value: 'Malta', text: 'Malta' },
    { value: 'Mauritania', text: 'Mauritania' },
    { value: 'Mauritius', text: 'Mauritius' },
    { value: 'Mexico', text: 'Mexico' },
    { value: 'Moldova', text: 'Moldova' },
    { value: 'Monaco', text: 'Monaco' },
    { value: 'Mongolia', text: 'Mongolia' },
    { value: 'Montenegro', text: 'Montenegro' },
    { value: 'Morocco', text: 'Morocco' },
    { value: 'Mozambique', text: 'Mozambique' },
    { value: 'Myanmar', text: 'Myanmar' },
    { value: 'Namibia', text: 'Namibia' },
    { value: 'Nepal', text: 'Nepal' },
    { value: 'Netherlands', text: 'Netherlands' },
    { value: 'New Zealand', text: 'New Zealand' },
    { value: 'Nicaragua', text: 'Nicaragua' },
    { value: 'Niger', text: 'Niger' },
    { value: 'Nigeria', text: 'Nigeria' },
    { value: 'North Korea', text: 'North Korea' },
    { value: 'Norway', text: 'Norway' },
    { value: 'Oman', text: 'Oman' },
    { value: 'Pakistan', text: 'Pakistan' },
    { value: 'Palestine', text: 'Palestine' },
    { value: 'Panama', text: 'Panama' },
    { value: 'Papua New Guinea', text: 'Papua New Guinea' },
    { value: 'Paraguay', text: 'Paraguay' },
    { value: 'Peru', text: 'Peru' },
    { value: 'Philippines', text: 'Philippines' },
    { value: 'Poland', text: 'Poland' },
    { value: 'Portugal', text: 'Portugal' },
    { value: 'Qatar', text: 'Qatar' },
    { value: 'Romania', text: 'Romania' },
    { value: 'Russia', text: 'Russia' },
    { value: 'Rwanda', text: 'Rwanda' },
    { value: 'Saudi Arabia', text: 'Saudi Arabia' },
    { value: 'Senegal', text: 'Senegal' },
    { value: 'Serbia', text: 'Serbia' },
    { value: 'Seychelles', text: 'Seychelles' },
    { value: 'Sierra Leone', text: 'Sierra Leone' },
    { value: 'Slovakia', text: 'Slovakia' },
    { value: 'Slovenia', text: 'Slovenia' },
    { value: 'Somalia', text: 'Somalia' },
    { value: 'South Africa', text: 'South Africa' },
    { value: 'South Korea', text: 'South Korea' },
    { value: 'South Sudan', text: 'South Sudan' },
    { value: 'Spain', text: 'Spain' },
    { value: 'Sri Lanka', text: 'Sri Lanka' },
    { value: 'Sudan', text: 'Sudan' },
    { value: 'Suriname', text: 'Suriname' },
    { value: 'Sweden', text: 'Sweden' },
    { value: 'Switzerland', text: 'Switzerland' },
    { value: 'Syria', text: 'Syria' },
    { value: 'Taiwan', text: 'Taiwan' },
    { value: 'Tajikistan', text: 'Tajikistan' },
    { value: 'Tanzania', text: 'Tanzania' },
    { value: 'Thailand', text: 'Thailand' },
    { value: 'Togo', text: 'Togo' },
    { value: 'Trinidad and Tobago', text: 'Trinidad and Tobago' },
    { value: 'Tunisia', text: 'Tunisia' },
    { value: 'Turkey', text: 'Turkey' },
    { value: 'Turkmenistan', text: 'Turkmenistan' },
    { value: 'Uganda', text: 'Uganda' },
    { value: 'Ukraine', text: 'Ukraine' },
    { value: 'United Arab Emirates', text: 'United Arab Emirates' },
    { value: 'United Kingdom', text: 'United Kingdom' },
    { value: 'United States', text: 'United States' },
    { value: 'Uruguay', text: 'Uruguay' },
    { value: 'Uzbekistan', text: 'Uzbekistan' },
    { value: 'Venezuela', text: 'Venezuela' },
    { value: 'Vietnam', text: 'Vietnam' },
    { value: 'Yemen', text: 'Yemen' },
    { value: 'Zambia', text: 'Zambia' },
    { value: 'Zimbabwe', text: 'Zimbabwe' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.travelForm = this.fb.group({
      tripType: ['single'],
      destinations: [[], Validators.required],  // Always has required validator
      dateRange: [null, Validators.required],
      region: [null, Validators.required],  // Always has required validator
      coverage: [null],  // Will be set by isDefault
      coverType: [null],  // Will be set by isDefault
      nationality: ['', Validators.required],
      activities: [[]]
    });

    // DEMO: Conditional validation using enable/disable
    // Listen to trip type changes and enable/disable controls accordingly
    this.travelForm.get('tripType')?.valueChanges.subscribe(tripType => {
      console.log('Trip type changed:', tripType);
      this.updateFieldsBasedOnTripType(tripType);
    });

    // Initialize field states based on initial trip type
    this.updateFieldsBasedOnTripType(this.travelForm.get('tripType')?.value);

    // Subscribe to form changes to log values
    this.travelForm.valueChanges.subscribe(values => {
      console.log('Form values:', values);
      this.calculateTotalPremium();
    });

    // DEMO: Inter-component communication via onChange events
    // When destinations change, update destination count
    // Note: destinations is now an array of objects [{ value: 'CHN', text: 'China' }, ...]
    this.travelForm.get('destinations')?.valueChanges.subscribe(destinations => {
      console.log('Selected destinations (full objects):', destinations);
      this.selectedDestinationCount = destinations?.length || 0;
    });

    // When date range changes, calculate trip duration
    this.travelForm.get('dateRange')?.valueChanges.subscribe((dateRange: DateRange) => {
      console.log('Date range:', dateRange);
      if (dateRange?.departureDate && dateRange?.returnDate) {
        const departure = new Date(dateRange.departureDate);
        const returnDate = new Date(dateRange.returnDate);
        const diffTime = Math.abs(returnDate.getTime() - departure.getTime());
        this.tripDurationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        this.tripDurationDays = 0;
      }
      this.calculateTotalPremium();
    });

    // When cover type changes, update display name and recalculate premium
    this.travelForm.get('coverType')?.valueChanges.subscribe(coverType => {
      console.log('Cover type:', coverType);
      const selected = this.coverTypes.find(c => c.value === coverType?.value);
      this.selectedCoverTypeName = selected?.text || '';
      this.calculateTotalPremium();
    });

    // When nationality changes, log for demo
    this.travelForm.get('nationality')?.valueChanges.subscribe(nationality => {
      console.log('Nationality:', nationality);
    });

    // When activities change, update count
    // Note: activities is now an array of objects [{ value: 'diving', text: 'Scuba Diving' }, ...]
    this.travelForm.get('activities')?.valueChanges.subscribe(activities => {
      console.log('Selected activities (full objects):', activities);
      this.selectedActivitiesCount = activities?.length || 0;
      this.calculateTotalPremium();
    });

    // When region changes, update display name
    this.travelForm.get('region')?.valueChanges.subscribe(region => {
      console.log('Selected region:', region);
      const selected = this.regions.find(r => r.value === region?.value);
      this.selectedRegionName = selected?.text || '';
      this.calculateTotalPremium();
    });

    // When coverage changes, update display and recalculate premium
    this.travelForm.get('coverage')?.valueChanges.subscribe(coverage => {
      console.log('Selected coverage:', coverage);
      const selected = this.coverageOptions.find(c => c.value === coverage?.value);
      this.selectedCoverageName = selected?.leftText || '';
      this.calculateTotalPremium();
    });
  }

  onSubmit() {
    if (this.travelForm.invalid) {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.travelForm);
      return;
    }

    // Use getRawValue() to include disabled controls if needed
    const formValue = this.travelForm.value;  // Excludes disabled fields
    const rawValue = this.travelForm.getRawValue();  // Includes disabled fields

    console.log('Form submitted successfully!');
    console.log('Form value (excludes disabled):', formValue);
    console.log('Raw value (includes disabled):', rawValue);

    alert('Form submitted! Check console for values.');
  }

  onReset() {
    this.travelForm.reset({
      tripType: 'single',
      destinations: [],
      dateRange: null,
      region: null,
      coverage: null,
      coverType: null,
      nationality: '',
      activities: []
    });

    // Re-initialize field states after reset
    this.updateFieldsBasedOnTripType('single');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // DEMO: Conditional validation using enable/disable (cleaner than validator management)
  private updateFieldsBasedOnTripType(tripType: string): void {
    const destinationsControl = this.travelForm.get('destinations');
    const regionControl = this.travelForm.get('region');

    if (tripType === 'single') {
      // Single Trip: Enable destinations, disable region
      destinationsControl?.enable({ emitEvent: false });
      regionControl?.disable({ emitEvent: false });

      console.log('Single Trip Mode: Destinations enabled (required), Region disabled');
    } else if (tripType === 'annual') {
      // Annual Multi-Trip: Disable destinations, enable region
      destinationsControl?.disable({ emitEvent: false });
      regionControl?.enable({ emitEvent: false });

      console.log('Annual Multi-Trip Mode: Region enabled (required), Destinations disabled');
    }

    // Note: Disabled controls are automatically excluded from validation
    // No need to manage validators manually!
  }

  // DEMO: Calculate premium based on multiple component values (inter-component logic)
  private calculateTotalPremium(): void {
    let basePremium = 50; // Base price

    // Add premium based on destination count
    basePremium += this.selectedDestinationCount * 15;

    // Add premium based on trip duration
    basePremium += this.tripDurationDays * 2;

    // Multiply by cover type multiplier
    const coverType = this.travelForm.get('coverType')?.value;
    const coverTypeMultiplier: { [key: string]: number } = {
      'individual': 1,
      'couple': 1.8,
      'family': 2.5,
      'group': 2.2
    };
    basePremium *= coverTypeMultiplier[coverType?.value] || 1;

    // Add coverage amount premium
    const coverage = this.travelForm.get('coverage')?.value;
    const coverageValue = parseFloat(coverage?.value || '0');
    if (coverageValue > 0) {
      basePremium += coverageValue / 1000 * 2;
    }

    // Add premium for activities
    basePremium += this.selectedActivitiesCount * 10;

    this.totalPremium = Math.round(basePremium * 100) / 100;
  }

  getDestinationError(): string {
    const control = this.travelForm.get('destinations');
    const tripType = this.travelForm.get('tripType')?.value;
    if (tripType === 'single' && control?.hasError('required') && control.touched) {
      return 'Please select at least one destination';
    }
    return '';
  }

  getRegionError(): string {
    const control = this.travelForm.get('region');
    const tripType = this.travelForm.get('tripType')?.value;
    if (tripType === 'annual' && control?.hasError('required') && control.touched) {
      return 'Please select a region for annual multi-trip';
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

  getNationalityError(): string {
    const control = this.travelForm.get('nationality');
    if (control?.hasError('required') && control.touched) {
      return 'Please select your nationality';
    }
    return '';
  }

  // Helper method to check if trip type is single
  isSingleTrip(): boolean {
    return this.travelForm.get('tripType')?.value === 'single';
  }

  // Helper method to check if trip type is annual multi-trip
  isAnnualMultiTrip(): boolean {
    return this.travelForm.get('tripType')?.value === 'annual';
  }
}
