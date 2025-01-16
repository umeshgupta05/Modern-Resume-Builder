import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume } from '../../models/resume.model';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-preview" [ngClass]="template">
      <!-- Modern Template -->
      <div *ngIf="template === 'modern'" class="modern-layout">
        <header>
          <h1>{{ resume?.personalInfo?.fullName || 'Your Name' }}</h1>
          <div class="contact-info">
            <span><i class="bi bi-envelope"></i>{{ resume?.personalInfo?.email }}</span>
            <span><i class="bi bi-telephone"></i>{{ resume?.personalInfo?.phone }}</span>
            <span><i class="bi bi-geo-alt"></i>{{ resume?.personalInfo?.location }}</span>
          </div>
          <div class="summary">{{ resume?.personalInfo?.summary }}</div>
        </header>

        <main>
          <section *ngIf="resume?.experience?.length" class="experience">
            <h2>Professional Experience</h2>
            <div *ngFor="let exp of resume?.experience" class="item">
              <div class="header">
                <div class="title-group">
                  <h3>{{ exp.position }}</h3>
                  <div class="company">{{ exp.company }}</div>
                </div>
                <div class="date">{{ exp.startDate | date:'MMM yyyy' }} - {{ exp.endDate | date:'MMM yyyy' }}</div>
              </div>
              <p class="description">{{ exp.description }}</p>
            </div>
          </section>

          <section *ngIf="resume?.education?.length" class="education">
            <h2>Education</h2>
            <div *ngFor="let edu of resume?.education" class="item">
              <div class="header">
                <div class="title-group">
                  <h3>{{ edu.degree }} in {{ edu.field }}</h3>
                  <div class="institution">{{ edu.institution }}</div>
                </div>
                <div class="date">{{ edu.startDate | date:'MMM yyyy' }} - {{ edu.endDate | date:'MMM yyyy' }}</div>
              </div>
              <p class="description">{{ edu.description }}</p>
            </div>
          </section>

          <div class="two-column">
            <section *ngIf="resume?.skills?.length" class="skills">
              <h2>Skills</h2>
              <div class="skills-grid">
                <div *ngFor="let skill of resume?.skills" class="skill-item">
                  <span class="skill-name">{{ skill.name }}</span>
                  <div class="skill-level">
                    <div class="level-bar" [style.width.%]="skill.level * 20"></div>
                  </div>
                </div>
              </div>
            </section>

            <section *ngIf="resume?.certifications?.length" class="certifications">
              <h2>Certifications</h2>
              <div *ngFor="let cert of resume?.certifications" class="item">
                <h3>{{ cert.name }}</h3>
                <div class="issuer">{{ cert.issuer }}</div>
                <div class="date">
                  Issued: {{ cert.issueDate | date:'MMM yyyy' }}
                  <span *ngIf="cert.expiryDate">
                    - Expires: {{ cert.expiryDate | date:'MMM yyyy' }}
                  </span>
                </div>
                <div *ngIf="cert.credentialId" class="credential-id">
                  ID: {{ cert.credentialId }}
                </div>
              </div>
            </section>
          </div>

          <section *ngIf="resume?.achievements?.length" class="achievements">
            <h2>Achievements</h2>
            <div *ngFor="let achievement of resume?.achievements" class="item">
              <div class="header">
                <h3>{{ achievement.title }}</h3>
                <div class="date">{{ achievement.date | date:'MMM yyyy' }}</div>
              </div>
              <p class="description">{{ achievement.description }}</p>
            </div>
          </section>
        </main>
      </div>

      <!-- Professional Template -->
      <div *ngIf="template === 'professional'" class="professional-layout">
        <div class="header">
          <div class="name-title">
            <h1>{{ resume?.personalInfo?.fullName || 'Your Name' }}</h1>
          </div>
          <div class="contact-info">
            <div class="contact-item">
              <i class="bi bi-envelope"></i>
              <span>{{ resume?.personalInfo?.email }}</span>
            </div>
            <div class="contact-item">
              <i class="bi bi-telephone"></i>
              <span>{{ resume?.personalInfo?.phone }}</span>
            </div>
            <div class="contact-item">
              <i class="bi bi-geo-alt"></i>
              <span>{{ resume?.personalInfo?.location }}</span>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="main-column">
            <div class="summary-section">
              <p>{{ resume?.personalInfo?.summary }}</p>
            </div>

            <section *ngIf="resume?.experience?.length" class="experience-section">
              <h2>Experience</h2>
              <div *ngFor="let exp of resume?.experience" class="experience-item">
                <div class="experience-header">
                  <h3>{{ exp.position }}</h3>
                  <span class="company">{{ exp.company }}</span>
                  <span class="date">{{ exp.startDate | date:'MMM yyyy' }} - {{ exp.endDate | date:'MMM yyyy' }}</span>
                </div>
                <p>{{ exp.description }}</p>
              </div>
            </section>

            <section *ngIf="resume?.education?.length" class="education-section">
              <h2>Education</h2>
              <div *ngFor="let edu of resume?.education" class="education-item">
                <div class="education-header">
                  <h3>{{ edu.degree }} in {{ edu.field }}</h3>
                  <span class="institution">{{ edu.institution }}</span>
                  <span class="date">{{ edu.startDate | date:'MMM yyyy' }} - {{ edu.endDate | date:'MMM yyyy' }}</span>
                </div>
                <p>{{ edu.description }}</p>
              </div>
            </section>
          </div>

          <div class="side-column">
            <section *ngIf="resume?.skills?.length" class="skills-section">
              <h2>Skills</h2>
              <div class="skills-list">
                <div *ngFor="let skill of resume?.skills" class="skill-item">
                  <span class="skill-name">{{ skill.name }}</span>
                  <div class="skill-dots">
                    <span *ngFor="let dot of [1,2,3,4,5]" 
                          class="dot"
                          [class.filled]="dot <= skill.level">
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section *ngIf="resume?.certifications?.length" class="certifications-section">
              <h2>Certifications</h2>
              <div *ngFor="let cert of resume?.certifications" class="certification-item">
                <h3>{{ cert.name }}</h3>
                <div class="cert-details">
                  <span class="issuer">{{ cert.issuer }}</span>
                  <span class="date">{{ cert.issueDate | date:'MMM yyyy' }}</span>
                </div>
              </div>
            </section>

            <section *ngIf="resume?.achievements?.length" class="achievements-section">
              <h2>Achievements</h2>
              <div *ngFor="let achievement of resume?.achievements" class="achievement-item">
                <h3>{{ achievement.title }}</h3>
                <span class="date">{{ achievement.date | date:'MMM yyyy' }}</span>
                <p>{{ achievement.description }}</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Creative Template -->
      <div *ngIf="template === 'creative'" class="creative-layout">
        <div class="sidebar">
          <div class="profile">
            <div class="name-container">
              <h1>{{ resume?.personalInfo?.fullName || 'Your Name' }}</h1>
            </div>
            <div class="contact-info">
              <div class="contact-item">
                <i class="bi bi-envelope"></i>
                <span>{{ resume?.personalInfo?.email }}</span>
              </div>
              <div class="contact-item">
                <i class="bi bi-telephone"></i>
                <span>{{ resume?.personalInfo?.phone }}</span>
              </div>
              <div class="contact-item">
                <i class="bi bi-geo-alt"></i>
                <span>{{ resume?.personalInfo?.location }}</span>
              </div>
            </div>
          </div>

          <section *ngIf="resume?.skills?.length" class="skills-section">
            <h2>Skills</h2>
            <div class="skills-list">
              <div *ngFor="let skill of resume?.skills" class="skill-item">
                <div class="skill-header">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}/5</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-progress" [style.width.%]="skill.level * 20"></div>
                </div>
              </div>
            </div>
          </section>

          <section *ngIf="resume?.certifications?.length" class="certifications-section">
            <h2>Certifications</h2>
            <div *ngFor="let cert of resume?.certifications" class="certification-item">
              <h3>{{ cert.name }}</h3>
              <span class="issuer">{{ cert.issuer }}</span>
              <span class="date">{{ cert.issueDate | date:'MMM yyyy' }}</span>
            </div>
          </section>
        </div>

        <div class="main-content">
          <section class="summary-section">
            <h2>Professional Summary</h2>
            <p>{{ resume?.personalInfo?.summary }}</p>
          </section>

          <section *ngIf="resume?.experience?.length" class="experience-section">
            <h2>Experience</h2>
            <div class="timeline">
              <div *ngFor="let exp of resume?.experience" class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h3>{{ exp.position }}</h3>
                  <div class="timeline-header">
                    <span class="company">{{ exp.company }}</span>
                    <span class="date">{{ exp.startDate | date:'MMM yyyy' }} - {{ exp.endDate | date:'MMM yyyy' }}</span>
                  </div>
                  <p>{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section *ngIf="resume?.education?.length" class="education-section">
            <h2>Education</h2>
            <div class="timeline">
              <div *ngFor="let edu of resume?.education" class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h3>{{ edu.degree }} in {{ edu.field }}</h3>
                  <div class="timeline-header">
                    <span class="institution">{{ edu.institution }}</span>
                    <span class="date">{{ edu.startDate | date:'MMM yyyy' }} - {{ edu.endDate | date:'MMM yyyy' }}</span>
                  </div>
                  <p>{{ edu.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section *ngIf="resume?.achievements?.length" class="achievements-section">
            <h2>Achievements</h2>
            <div class="achievements-grid">
              <div *ngFor="let achievement of resume?.achievements" class="achievement-item">
                <div class="achievement-icon">
                  <i class="bi bi-trophy"></i>
                </div>
                <div class="achievement-content">
                  <h3>{{ achievement.title }}</h3>
                  <span class="date">{{ achievement.date | date:'MMM yyyy' }}</span>
                  <p>{{ achievement.description }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resume-preview {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      font-family: 'Computer Modern Serif', Georgia, serif;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0 auto;
    }

    /* Modern Template Styles */
    .modern-layout {
      /* Previous modern layout styles remain the same */
    }

    /* Professional Template Styles */
    .professional-layout {
      .header {
        border-bottom: 2px solid #2d3748;
        margin-bottom: 2rem;
        padding-bottom: 1rem;

        .name-title {
          margin-bottom: 1rem;

          h1 {
            font-size: 2.5rem;
            color: #2d3748;
            margin: 0;
            font-weight: normal;
            letter-spacing: 0.05em;
          }
        }

        .contact-info {
          display: flex;
          gap: 2rem;
          color: #4a5568;
          font-size: 0.9rem;

          .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            i {
              color: #2d3748;
            }
          }
        }
      }

      .content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;

        .main-column {
          section {
            margin-bottom: 2rem;
          }

          h2 {
            font-size: 1.5rem;
            color: #2d3748;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            font-weight: normal;
            letter-spacing: 0.05em;
          }

          .experience-item, .education-item {
            margin-bottom: 1.5rem;

            h3 {
              font-size: 1.2rem;
              color: #2d3748;
              margin: 0;
              font-weight: normal;
            }

            .company, .institution {
              color: #4a5568;
              font-style: italic;
            }

            .date {
              color: #718096;
              font-size: 0.875rem;
            }

            p {
              margin: 0.5rem 0 0;
              color: #4a5568;
            }
          }
        }

        .side-column {
          section {
            margin-bottom: 2rem;
          }

          h2 {
            font-size: 1.25rem;
            color: #2d3748;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            font-weight: normal;
            letter-spacing: 0.05em;
          }

          .skills-list {
            .skill-item {
              margin-bottom: 0.75rem;

              .skill-name {
                display: block;
                color: #2d3748;
                margin-bottom: 0.25rem;
              }

              .skill-dots {
                display: flex;
                gap: 0.25rem;

                .dot {
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: #e2e8f0;

                  &.filled {
                    background: #2d3748;
                  }
                }
              }
            }
          }
        }
      }
    }

    /* Creative Template Styles */
    .creative-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      padding: 0;
      background: linear-gradient(to right, #f7fafc 300px, white 300px);

      .sidebar {
        background: #f7fafc;
        padding: 2rem;

        .profile {
          text-align: center;
          margin-bottom: 2rem;

          h1 {
            font-size: 1.75rem;
            color: #2d3748;
            margin: 0 0 1rem;
            font-weight: normal;
          }

          .contact-info {
            .contact-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-bottom: 0.5rem;
              color: #4a5568;
              font-size: 0.9rem;

              i {
                color: var(--primary-color);
              }
            }
          }
        }

        .skills-section {
          .skill-item {
            margin-bottom: 1rem;

            .skill-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.25rem;
              color: #2d3748;
            }

            .skill-bar {
              height: 4px;
              background: #e2e8f0;
              border-radius: 2px;
              overflow: hidden;

              .skill-progress {
                height: 100%;
                background: var(--primary-color);
                border-radius: 2px;
                transition: width 0.3s ease;
              }
            }
          }
        }
      }

      .main-content {
        padding: 2rem;

        section {
          margin-bottom: 2.5rem;

          h2 {
            font-size: 1.5rem;
            color: #2d3748;
            margin-bottom: 1.5rem;
            font-weight: normal;
            position: relative;
            padding-bottom: 0.5rem;

            &:after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 50px;
              height: 2px;
              background: var(--primary-color);
            }
          }
        }

        .timeline {
          position: relative;

          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e2e8f0;
          }

          .timeline-item {
            position: relative;
            padding-left: 2rem;
            margin-bottom: 2rem;

            .timeline-marker {
              position: absolute;
              left: -4px;
              top: 0;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: var(--primary-color);
              border: 2px solid white;
            }

            .timeline-content {
              h3 {
                font-size: 1.2rem;
                color: #2d3748;
                margin: 0;
                font-weight: normal;
              }

              .timeline-header {
                color: #4a5568;
                font-size: 0.9rem;
                margin: 0.25rem 0 0.5rem;

                .company, .institution {
                  font-style: italic;
                }

                .date {
                  margin-left: 1rem;
                  color: #718096;
                }
              }
            }
          }
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;

          .achievement-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            background: #f7fafc;
            border-radius: 0.5rem;

            .achievement-icon {
              font-size: 1.5rem;
              color: var(--primary-color);
            }

            .achievement-content {
              h3 {
                font-size: 1.1rem;
                color: #2d3748;
                margin: 0;
                font-weight: normal;
              }

              .date {
                font-size: 0.875rem;
                color: #718096;
              }

              p {
                margin: 0.5rem 0 0;
                color: #4a5568;
                font-size: 0.9rem;
              }
            }
          }
        }
      }
    }
  `]
})
export class ResumePreviewComponent {
  @Input() resume: Resume | null = null;
  @Input() template: string = 'modern';
}