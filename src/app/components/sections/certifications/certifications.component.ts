import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Certification } from '../../../models/resume.model';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Certifications</h2>
      <div class="certifications-list">
        <div *ngFor="let cert of certifications" class="certification-item">
          <div class="certification-header">
            <h3>{{ cert.name }}</h3>
            <div class="actions">
              <button class="btn btn-sm" (click)="editCertification(cert)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="removeCertification(cert.id)">Remove</button>
            </div>
          </div>
          <p class="issuer">{{ cert.issuer }}</p>
          <p class="dates">Issued: {{ cert.issueDate | date }}
            <span *ngIf="cert.expiryDate"> - Expires: {{ cert.expiryDate | date }}</span>
          </p>
          <p *ngIf="cert.credentialId" class="credential-id">Credential ID: {{ cert.credentialId }}</p>
          <a *ngIf="cert.url" [href]="cert.url" target="_blank" class="cert-link">View Certificate</a>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="certification-form">
        <div class="form-group">
          <label for="name">Certification Name</label>
          <input id="name" type="text" class="form-control" formControlName="name">
        </div>

        <div class="form-group">
          <label for="issuer">Issuing Organization</label>
          <input id="issuer" type="text" class="form-control" formControlName="issuer">
        </div>

        <div class="form-group">
          <label for="issueDate">Issue Date</label>
          <input id="issueDate" type="date" class="form-control" formControlName="issueDate">
        </div>

        <div class="form-group">
          <label for="expiryDate">Expiry Date (Optional)</label>
          <input id="expiryDate" type="date" class="form-control" formControlName="expiryDate">
        </div>

        <div class="form-group">
          <label for="credentialId">Credential ID (Optional)</label>
          <input id="credentialId" type="text" class="form-control" formControlName="credentialId">
        </div>

        <div class="form-group">
          <label for="url">Certificate URL (Optional)</label>
          <input id="url" type="url" class="form-control" formControlName="url">
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!form.valid">
            {{ editingId ? 'Update' : 'Add' }} Certification
          </button>
          <button *ngIf="editingId" type="button" class="btn" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .certification-item {
      border: 1px solid #e2e8f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
    }

    .certification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .certification-header h3 {
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .issuer {
      color: #4a5568;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .dates {
      color: #718096;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .credential-id {
      font-family: monospace;
      background: #f7fafc;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .cert-link {
      display: inline-block;
      margin-top: 0.5rem;
      color: #4299e1;
      text-decoration: none;
    }

    .cert-link:hover {
      text-decoration: underline;
    }
  `]
})
export class CertificationsComponent {
  @Input() set data(value: Certification[] | undefined) {
    if (value) {
      this.certifications = value;
    }
  }
  @Output() update = new EventEmitter<Certification[]>();

  certifications: Certification[] = [];
  form: FormGroup;
  editingId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      issuer: ['', Validators.required],
      issueDate: ['', Validators.required],
      expiryDate: [''],
      credentialId: [''],
      url: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const certification: Certification = {
        id: this.editingId || crypto.randomUUID(),
        ...this.form.value
      };

      if (this.editingId) {
        this.certifications = this.certifications.map(c => 
          c.id === this.editingId ? certification : c
        );
      } else {
        this.certifications = [...this.certifications, certification];
      }

      this.update.emit(this.certifications);
      this.form.reset();
      this.editingId = null;
    }
  }

  editCertification(cert: Certification) {
    this.editingId = cert.id;
    this.form.patchValue(cert);
  }

  removeCertification(id: string) {
    this.certifications = this.certifications.filter(c => c.id !== id);
    this.update.emit(this.certifications);
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }
}