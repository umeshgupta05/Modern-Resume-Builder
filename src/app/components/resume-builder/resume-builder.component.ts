import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from '../sections/personal-info/personal-info.component';
import { EducationComponent } from '../sections/education/education.component';
import { ExperienceComponent } from '../sections/experience/experience.component';
import { SkillsComponent } from '../sections/skills/skills.component';
import { CertificationsComponent } from '../sections/certifications/certifications.component';
import { AchievementsComponent } from '../sections/achievements/achievements.component';
import { ResumePreviewComponent } from '../resume-preview/resume-preview.component';
import { ResumeService } from '../../services/resume.service';
import { Resume } from '../../models/resume.model';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    PersonalInfoComponent,
    EducationComponent,
    ExperienceComponent,
    SkillsComponent,
    CertificationsComponent,
    AchievementsComponent,
    ResumePreviewComponent
  ],
  template: `
    <div class="resume-builder">
      <div class="sidebar">
        <div class="templates">
          <h2>Templates</h2>
          <div class="template-grid">
            <div *ngFor="let template of templates"
                 class="template-preview"
                 [class.selected]="currentTemplate === template.id"
                 (click)="selectTemplate(template.id)">
              <div class="template-icon">
                <i [class]="template.icon"></i>
              </div>
              <p>{{ template.name }}</p>
            </div>
          </div>
        </div>

        <div class="sections-nav">
          <button *ngFor="let section of sections"
                  class="btn"
                  [class.active]="currentSection === section.id"
                  (click)="navigateToSection(section.id)">
            <i [class]="section.icon"></i>
            {{ section.name }}
          </button>
        </div>

        <div class="preview-actions">
          <button class="btn btn-primary" (click)="exportPDF()">
            <i class="bi bi-file-pdf"></i>
            Export PDF
          </button>
          <button class="btn" (click)="exportDOCX()">
            <i class="bi bi-file-word"></i>
            Export DOCX
          </button>
        </div>
      </div>

      <div class="main-content">
        <div class="section-content" [ngSwitch]="currentSection">
          <app-personal-info
            *ngSwitchCase="'personal'"
            [data]="resume?.personalInfo"
            (update)="updatePersonalInfo($event)">
          </app-personal-info>

          <app-education
            *ngSwitchCase="'education'"
            [data]="resume?.education"
            (update)="updateEducation($event)">
          </app-education>

          <app-experience
            *ngSwitchCase="'experience'"
            [data]="resume?.experience"
            (update)="updateExperience($event)">
          </app-experience>

          <app-skills
            *ngSwitchCase="'skills'"
            [data]="resume?.skills"
            (update)="updateSkills($event)">
          </app-skills>

          <app-certifications
            *ngSwitchCase="'certifications'"
            [data]="resume?.certifications"
            (update)="updateCertifications($event)">
          </app-certifications>

          <app-achievements
            *ngSwitchCase="'achievements'"
            [data]="resume?.achievements"
            (update)="updateAchievements($event)">
          </app-achievements>
        </div>

        <app-resume-preview
          [resume]="resume"
          [template]="currentTemplate">
        </app-resume-preview>
      </div>
    </div>
  `,
  styles: [`
    .resume-builder {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      padding: 2rem;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 2rem;
      overflow-y: auto;
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      overflow-y: auto;
    }

    .section-content {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
    }

    .template-preview {
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: all 0.2s;
      padding: 1rem;
      text-align: center;
    }

    .template-preview.selected {
      border-color: var(--primary-color);
      background-color: var(--secondary-color);
    }

    .template-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }

    .template-preview p {
      margin: 0.5rem 0;
      text-align: center;
    }

    .sections-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .sections-nav .btn {
      text-align: left;
      justify-content: flex-start;
    }

    .sections-nav .btn.active {
      background-color: var(--secondary-color);
      color: var(--primary-color);
    }

    .preview-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
  `]
})
export class ResumeBuilderComponent {
  resume: Resume | null = null;
  currentTemplate = 'modern';
  currentSection = 'personal';
  
  templates = [
    { id: 'modern', name: 'Modern', icon: 'bi bi-grid-3x3-gap' },
    { id: 'professional', name: 'Professional', icon: 'bi bi-briefcase' },
    { id: 'creative', name: 'Creative', icon: 'bi bi-palette' },
  ];

  sections = [
    { id: 'personal', name: 'Personal Information', icon: 'bi bi-person' },
    { id: 'education', name: 'Education', icon: 'bi bi-mortarboard' },
    { id: 'experience', name: 'Experience', icon: 'bi bi-briefcase' },
    { id: 'skills', name: 'Skills', icon: 'bi bi-stars' },
    { id: 'certifications', name: 'Certifications', icon: 'bi bi-award' },
    { id: 'achievements', name: 'Achievements', icon: 'bi bi-trophy' }
  ];

  constructor(private resumeService: ResumeService) {
    this.resumeService.getCurrentResume().subscribe(resume => {
      this.resume = resume;
    });
  }

  selectTemplate(templateId: string) {
    this.currentTemplate = templateId;
    if (this.resume) {
      this.resume.selectedTemplate = templateId;
      this.resumeService.updateResume(this.resume);
    }
  }

  navigateToSection(sectionId: string) {
    this.currentSection = sectionId;
  }

  updatePersonalInfo(personalInfo: Resume['personalInfo']) {
    if (this.resume) {
      this.resume = { ...this.resume, personalInfo };
      this.resumeService.updateResume(this.resume);
    }
  }

  updateEducation(education: Resume['education']) {
    if (this.resume) {
      this.resume = { ...this.resume, education };
      this.resumeService.updateResume(this.resume);
    }
  }

  updateExperience(experience: Resume['experience']) {
    if (this.resume) {
      this.resume = { ...this.resume, experience };
      this.resumeService.updateResume(this.resume);
    }
  }

  updateSkills(skills: Resume['skills']) {
    if (this.resume) {
      this.resume = { ...this.resume, skills };
      this.resumeService.updateResume(this.resume);
    }
  }

  updateCertifications(certifications: Resume['certifications']) {
    if (this.resume) {
      this.resume = { ...this.resume, certifications };
      this.resumeService.updateResume(this.resume);
    }
  }

  updateAchievements(achievements: Resume['achievements']) {
    if (this.resume) {
      this.resume = { ...this.resume, achievements };
      this.resumeService.updateResume(this.resume);
    }
  }

  async exportPDF() {
    await this.resumeService.exportAsPDF();
  }

  async exportDOCX() {
    await this.resumeService.exportAsDocx();
  }
}