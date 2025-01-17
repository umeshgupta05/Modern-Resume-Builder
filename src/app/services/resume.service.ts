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

  // Adjust scale for higher quality and better fit
  const canvas = await html2canvas(element, {
    scale: 3, // Higher scale for better resolution
    useCORS: true,
    logging: false
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = imgProps.width;
  const imgHeight = imgProps.height;

  // Scale the image to fit the PDF dimensions, preserving aspect ratio
  const aspectRatio = imgWidth / imgHeight;
  let width, height;

  if (aspectRatio > pdfWidth / pdfHeight) {
    width = pdfWidth;
    height = width / aspectRatio;
  } else {
    height = pdfHeight;
    width = height * aspectRatio;
  }

  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save('resume.pdf');
}

  async exportAsDocx(): Promise<void> {
    // For DOCX export, we'll need to implement a more complex conversion
    // This is a placeholder for future implementation
    console.log('DOCX export not implemented yet');
  }
}
