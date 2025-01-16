import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Education } from '../../../models/resume.model';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Education</h2>
      <div class="education-list">
        <div *ngFor="let edu of education" class="education-item">
          <div class="education-header">
            <h3>{{ edu.degree }} in {{ edu.field }}</h3>
            <div class="actions">
              <button class="btn btn-sm" (click)="editEducation(edu)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="removeEducation(edu.id)">Remove</button>
            </div>
          </div>
          <p class="institution">{{ edu.institution }}</p>
          <p class="dates">{{ edu.startDate | date }} - {{ edu.endDate | date }}</p>
          <p class="description">{{ edu.description }}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="education-form">
        <div class="form-group">
          <label for="institution">Institution</label>
          <input id="institution" type="text" class="form-control" formControlName="institution">
        </div>

        <div class="form-group">
          <label for="degree">Degree</label>
          <input id="degree" type="text" class="form-control" formControlName="degree">
        </div>

        <div class="form-group">
          <label for="field">Field of Study</label>
          <input id="field" type="text" class="form-control" formControlName="field">
        </div>

        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input id="startDate" type="date" class="form-control" formControlName="startDate">
        </div>

        <div class="form-group">
          <label for="endDate">End Date</label>
          <input id="endDate" type="date" class="form-control" formControlName="endDate">
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" class="form-control" formControlName="description" rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid">
            {{ editingId ? 'Update' : 'Add' }} Education
          </button>
          <button *ngIf="editingId" type="button" class="btn" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .education-item {
      border: 1px solid #e2e8f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
    }

    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .education-header h3 {
      margin: 0;
      color: #2d3748;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .institution {
      color: #4a5568;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .dates {
      color: #718096;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .description {
      color: #4a5568;
      white-space: pre-line;
    }
  `]
})
export class EducationComponent {
  @Input() set data(value: Education[] | undefined) {
    if (value) {
      this.education = value;
    }
  }
  @Output() update = new EventEmitter<Education[]>();

  education: Education[] = [];
  form: FormGroup;
  editingId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      field: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const education: Education = {
        id: this.editingId || crypto.randomUUID(),
        ...this.form.value
      };

      if (this.editingId) {
        this.education = this.education.map(e => 
          e.id === this.editingId ? education : e
        );
      } else {
        this.education = [...this.education, education];
      }

      this.update.emit(this.education);
      this.form.reset();
      this.editingId = null;
    }
  }

  editEducation(edu: Education) {
    this.editingId = edu.id;
    this.form.patchValue(edu);
  }

  removeEducation(id: string) {
    this.education = this.education.filter(e => e.id !== id);
    this.update.emit(this.education);
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }
}