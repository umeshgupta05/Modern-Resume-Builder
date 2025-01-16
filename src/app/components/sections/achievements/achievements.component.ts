import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Achievement } from '../../../models/resume.model';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Achievements</h2>
      <div class="achievements-list">
        <div *ngFor="let achievement of achievements" class="achievement-item">
          <div class="achievement-header">
            <h3>{{ achievement.title }}</h3>
            <div class="actions">
              <button class="btn btn-sm" (click)="editAchievement(achievement)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="removeAchievement(achievement.id)">Remove</button>
            </div>
          </div>
          <p class="date">{{ achievement.date | date }}</p>
          <p class="description">{{ achievement.description }}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="achievement-form">
        <div class="form-group">
          <label for="title">Achievement Title</label>
          <input id="title" type="text" class="form-control" formControlName="title">
        </div>

        <div class="form-group">
          <label for="date">Date</label>
          <input id="date" type="date" class="form-control" formControlName="date">
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" class="form-control" formControlName="description" rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid">
            {{ editingId ? 'Update' : 'Add' }} Achievement
          </button>
          <button *ngIf="editingId" type="button" class="btn" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .achievement-item {
      border: 1px solid #e2e8f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
    }

    .achievement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .achievement-header h3 {
      margin: 0;
      color: #2d3748;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .date {
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
export class AchievementsComponent {
  @Input() set data(value: Achievement[] | undefined) {
    if (value) {
      this.achievements = value;
    }
  }
  @Output() update = new EventEmitter<Achievement[]>();

  achievements: Achievement[] = [];
  form: FormGroup;
  editingId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const achievement: Achievement = {
        id: this.editingId || crypto.randomUUID(),
        ...this.form.value
      };

      if (this.editingId) {
        this.achievements = this.achievements.map(a => 
          a.id === this.editingId ? achievement : a
        );
      } else {
        this.achievements = [...this.achievements, achievement];
      }

      this.update.emit(this.achievements);
      this.form.reset();
      this.editingId = null;
    }
  }

  editAchievement(achievement: Achievement) {
    this.editingId = achievement.id;
    this.form.patchValue(achievement);
  }

  removeAchievement(id: string) {
    this.achievements = this.achievements.filter(a => a.id !== id);
    this.update.emit(this.achievements);
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }
}