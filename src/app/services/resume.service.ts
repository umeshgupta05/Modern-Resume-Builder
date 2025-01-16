import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resume } from '../models/resume.model';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private currentResume = new BehaviorSubject<Resume | null>(null);
  private autoSaveInterval: any;

  constructor() {
    this.initAutoSave();
    this.loadFromLocalStorage();
  }

  private initAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.saveToLocalStorage();
    }, 30000); // Auto-save every 30 seconds
  }

  private loadFromLocalStorage() {
    const saved = localStorage.getItem('currentResume');
    if (saved) {
      this.currentResume.next(JSON.parse(saved));
    } else {
      // Initialize with empty resume
      this.currentResume.next({
        id: crypto.randomUUID(),
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: ''
        },
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        achievements: [],
        selectedTemplate: 'modern'
      });
    }
  }

  private saveToLocalStorage() {
    const current = this.currentResume.getValue();
    if (current) {
      localStorage.setItem('currentResume', JSON.stringify(current));
    }
  }

  getCurrentResume(): Observable<Resume | null> {
    return this.currentResume.asObservable();
  }

  updateResume(resume: Resume) {
    this.currentResume.next(resume);
    this.saveToLocalStorage();
  }

  async exportAsPDF(): Promise<void> {
    const element = document.querySelector('.resume-preview') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('resume.pdf');
  }

  async exportAsDocx(): Promise<void> {
    // For DOCX export, we'll need to implement a more complex conversion
    // This is a placeholder for future implementation
    console.log('DOCX export not implemented yet');
  }
}