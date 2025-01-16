import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ResumeBuilderComponent } from './app/components/resume-builder/resume-builder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ResumeBuilderComponent],
  template: `
    <app-resume-builder></app-resume-builder>
  `
})
export class App {}

bootstrapApplication(App);