import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../common/service/document.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public documentList = {};
  public isDocumentLoading = false;
  constructor(
    private router: Router,
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    this.loadAllDocuments();
  }

  public loadAllDocuments() {
    this.isDocumentLoading = true;
    this.documentService.getDocumentList().subscribe(documents => {
      this.documentList = documents;
      this.isDocumentLoading = false;
    }, error => {
      this.isDocumentLoading = false;
    });
  }
  // Navigate to Sign Doc
  public navigateToSignDoc() {
    this.router.navigate(['/sign-document/']);
  }

  // Navigate to Validate Doc
  public navigateToValidateDoc() {
    this.router.navigate(['/validate-document/']);
  }
}
