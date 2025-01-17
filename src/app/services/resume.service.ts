import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resume } from '../models/resume.model';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private currentResume = new BehaviorSubject<Resume | null>(null);
  private autoSaveInterval: any;

  constructor() {
    this.initAutoSave(); // Start auto-save process
    this.loadFromLocalStorage(); // Load existing data from local storage
  }

  /**
   * Initializes auto-save by setting an interval to periodically save to local storage.
   */
  private initAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.saveToLocalStorage();
    }, 30000); // Auto-save every 30 seconds
  }

  /**
   * Loads the resume data from local storage or initializes a default empty resume.
   */
  private loadFromLocalStorage() {
    const savedResume = localStorage.getItem('currentResume');
    if (savedResume) {
      this.currentResume.next(JSON.parse(savedResume));
    } else {
      this.initializeEmptyResume();
    }
  }

  /**
   * Saves the current resume data to local storage.
   */
  private saveToLocalStorage() {
    const current = this.currentResume.getValue();
    if (current) {
      localStorage.setItem('currentResume', JSON.stringify(current));
    }
  }

  /**
   * Initializes a default empty resume object.
   */
  private initializeEmptyResume() {
    this.currentResume.next({
      id: crypto.randomUUID(),
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
      },
      education: [],
      experience: [],
      skills: [],
      certifications: [],
      achievements: [],
      selectedTemplate: 'modern',
    });
  }

  /**
   * Returns an observable of the current resume for use in components.
   */
  getCurrentResume(): Observable<Resume | null> {
    return this.currentResume.asObservable();
  }

  /**
   * Updates the resume with new data and triggers a save to local storage.
   * @param resume - The updated resume data.
   */
  updateResume(resume: Resume) {
    this.currentResume.next(resume);
    this.saveToLocalStorage();
  }

  /**
   * Exports the current resume preview as a high-quality PDF.
   */
  async exportAsPDF(): Promise<void> {
    const element = document.querySelector('.resume-preview') as HTMLElement;
    if (!element) return;

    // Render the preview element as a canvas
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for better quality
      useCORS: true, // To handle cross-origin images
      logging: false, // Disable logging for cleaner output
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions while maintaining aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const aspectRatio = imgWidth / imgHeight;
    let width, height;

    if (aspectRatio > pdfWidth / pdfHeight) {
      width = pdfWidth;
      height = width / aspectRatio;
    } else {
      height = pdfHeight;
      width = height * aspectRatio;
    }

    // Add the image to the PDF and save it
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('resume.pdf');
  }

  /**
   * Placeholder function for exporting the resume as a DOCX file.
   */
  async exportAsDocx(): Promise<void> {
    // Implement DOCX export logic here using a library like `docx` in the future
    console.log('DOCX export not implemented yet');
  }
}
