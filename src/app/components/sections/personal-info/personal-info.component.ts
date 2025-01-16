import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalInfo } from '../../../models/resume.model';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Personal Information</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input id="fullName" type="text" class="form-control" formControlName="fullName">
          <div class="error" *ngIf="form.get('fullName')?.errors?.['required'] && form.get('fullName')?.touched">
            Full name is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" class="form-control" formControlName="email">
          <div class="error" *ngIf="form.get('email')?.errors?.['email'] && form.get('email')?.touched">
            Please enter a valid email
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input id="phone" type="tel" class="form-control" formControlName="phone">
        </div>

        <div class="form-group">
          <label for="location">Location</label>
          <input id="location" type="text" class="form-control" formControlName="location">
        </div>

        <div class="form-group">
          <label for="summary">Professional Summary</label>
          <textarea id="summary" class="form-control" formControlName="summary" rows="4"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Save</button>
      </form>
    </div>
  `,
  styles: [`
    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    textarea {
      resize: vertical;
    }
  `]
})
export class PersonalInfoComponent {
  @Input() set data(value: PersonalInfo | undefined) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  @Output() update = new EventEmitter<PersonalInfo>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      summary: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}