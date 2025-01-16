import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Experience } from '../../../models/resume.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Work Experience</h2>
      <div class="experience-list">
        <div *ngFor="let exp of experience" class="experience-item">
          <div class="experience-header">
            <h3>{{ exp.position }}</h3>
            <div class="actions">
              <button class="btn btn-sm" (click)="editExperience(exp)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="removeExperience(exp.id)">Remove</button>
            </div>
          </div>
          <p class="company">{{ exp.company }}</p>
          <p class="dates">{{ exp.startDate | date }} - {{ exp.endDate | date }}</p>
          <p class="description">{{ exp.description }}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="experience-form">
        <div class="form-group">
          <label for="company">Company</label>
          <input id="company" type="text" class="form-control" formControlName="company">
        </div>

        <div class="form-group">
          <label for="position">Position</label>
          <input id="position" type="text" class="form-control" formControlName="position">
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
          <textarea id="description" class="form-control" formControlName="description" rows="4"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid">
            {{ editingId ? 'Update' : 'Add' }} Experience
          </button>
          <button *ngIf="editingId" type="button" class="btn" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .experience-item {
      border: 1px solid #e2e8f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .experience-header h3 {
      margin: 0;
      color: #2d3748;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .company {
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
export class ExperienceComponent {
  @Input() set data(value: Experience[] | undefined) {
    if (value) {
      this.experience = value;
    }
  }
  @Output() update = new EventEmitter<Experience[]>();

  experience: Experience[] = [];
  form: FormGroup;
  editingId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const experience: Experience = {
        id: this.editingId || crypto.randomUUID(),
        ...this.form.value
      };

      if (this.editingId) {
        this.experience = this.experience.map(e => 
          e.id === this.editingId ? experience : e
        );
      } else {
        this.experience = [...this.experience, experience];
      }

      this.update.emit(this.experience);
      this.form.reset();
      this.editingId = null;
    }
  }

  editExperience(exp: Experience) {
    this.editingId = exp.id;
    this.form.patchValue(exp);
  }

  removeExperience(id: string) {
    this.experience = this.experience.filter(e => e.id !== id);
    this.update.emit(this.experience);
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }
}