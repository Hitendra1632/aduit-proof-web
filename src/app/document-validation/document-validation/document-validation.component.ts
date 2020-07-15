import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-validation',
  templateUrl: './document-validation.component.html',
  styleUrls: ['./document-validation.component.scss']
})
export class DocumentValidationComponent implements OnInit {

  public showValidationPlugin = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  // Navigate to DAshoard
  public navigateToDashboard() {
    this.router.navigate(['/dashboard/']);
  }

  // Show Validation Plugin
  public displayValidationPlugin() {
    this.showValidationPlugin = true;
  }
}
