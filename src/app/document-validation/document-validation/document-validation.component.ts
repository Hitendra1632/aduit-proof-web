import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-document-validation',
  templateUrl: './document-validation.component.html',
  styleUrls: ['./document-validation.component.scss']
})
export class DocumentValidationComponent implements OnInit {

  public showValidationPlugin = false;
  public documentID = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.documentID = params['document-id'];
    });
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
