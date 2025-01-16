import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Skill } from '../../../models/resume.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Skills</h2>
      <div class="skills-grid">
        <div *ngFor="let skill of skills" class="skill-item">
          <div class="skill-header">
            <span class="skill-name">{{ skill.name }}</span>
            <div class="actions">
              <button class="btn btn-sm" (click)="editSkill(skill)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="removeSkill(skill.id)">Remove</button>
            </div>
          </div>
          <div class="skill-level">
            <div class="level-bar" [style.width.%]="skill.level * 20"></div>
          </div>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="skill-form">
        <div class="form-group">
          <label for="name">Skill Name</label>
          <input id="name" type="text" class="form-control" formControlName="name">
        </div>

        <div class="form-group">
          <label for="level">Proficiency Level (1-5)</label>
          <input id="level" type="range" min="1" max="5" class="form-control" formControlName="level">
          <div class="level-indicator">{{ form.get('level')?.value || 3 }}</div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid">
            {{ editingId ? 'Update' : 'Add' }} Skill
          </button>
          <button *ngIf="editingId" type="button" class="btn" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .skill-item {
      border: 1px solid #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .skill-name {
      font-weight: 500;
      color: #2d3748;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .skill-level {
      height: 0.5rem;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
    }

    .level-bar {
      height: 100%;
      background: #4299e1;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    .level-indicator {
      text-align: center;
      color: #718096;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    input[type="range"] {
      width: 100%;
      margin: 0.5rem 0;
    }
  `]
})
export class SkillsComponent {
  @Input() set data(value: Skill[] | undefined) {
    if (value) {
      this.skills = value;
    }
  }
  @Output() update = new EventEmitter<Skill[]>();

  skills: Skill[] = [];
  form: FormGroup;
  editingId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      level: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const skill: Skill = {
        id: this.editingId || crypto.randomUUID(),
        ...this.form.value
      };

      if (this.editingId) {
        this.skills = this.skills.map(s => 
          s.id === this.editingId ? skill : s
        );
      } else {
        this.skills = [...this.skills, skill];
      }

      this.update.emit(this.skills);
      this.form.reset({level: 3});
      this.editingId = null;
    }
  }

  editSkill(skill: Skill) {
    this.editingId = skill.id;
    this.form.patchValue(skill);
  }

  removeSkill(id: string) {
    this.skills = this.skills.filter(s => s.id !== id);
    this.update.emit(this.skills);
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({level: 3});
  }
}