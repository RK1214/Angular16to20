import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    standalone: false
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User']
    });

    this.id = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    if (this.id) {
      this.http.get(`/api/users/${this.id}`).subscribe((u: any) => this.form.patchValue(u));
    }
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value;
    if (this.id) {
      this.http.put(`/api/users/${this.id}`, { id: this.id, ...payload })
        .subscribe(() => this.router.navigate(['/users']));
    } else {
      this.http.post('/api/users', payload)
        .subscribe(() => this.router.navigate(['/users']));
    }
  }
}
