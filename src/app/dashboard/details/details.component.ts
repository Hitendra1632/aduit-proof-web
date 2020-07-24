import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../common/service/document.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public document = {
    documentID: null,
    status: null,
    documentName: null,
    signerName: null
  };
  constructor(
    private router: Router,
    private documentService: DocumentService

  ) { }

  ngOnInit(): void {
    this.loadDocumentData();
  }

  loadDocumentData() {
    if (this.documentService.getDocumentDetails()) {
      const doc = this.documentService.getDocumentDetails();
      this.document = {
        documentID: doc['documentID'],
        status: doc['status'],
        documentName: doc['documentName'],
        signerName: doc['signerName']
      };
    } else {
      this.document = {
        documentID: null,
        status: null,
        documentName: null,
        signerName: null
      };
    }
  }
  // Navigate to DAshoard
  public navigateToDashboard() {
    this.router.navigate(['/dashboard/']);
  }
}
