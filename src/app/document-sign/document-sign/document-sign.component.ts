import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../common/service/document.service';
import { DomSanitizer } from '@angular/platform-browser';

const hash256 = require('crypto-js/sha256');

@Component({
  selector: 'app-document-sign',
  templateUrl: './document-sign.component.html',
  styleUrls: ['./document-sign.component.scss']
})
export class DocumentSignComponent implements OnInit {
  @ViewChild(
    'docUploadEle'
  ) docUploadEle: ElementRef | null = null;
  public step = 1;
  public uploadDocFile: File;
  public documentHash: any;

  public initiatedDocumentResponse = {};
  public signImage: any;
  public docURL = '';
  public docID = '';
  public isSigningInitialized = false;
  public isInitiatedAPI = false;

  constructor(
    private router: Router,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {
  }

  onUploadDocChange(event) {
    const fileList: FileList = event.target.files;
    this.uploadDocFile = fileList[0];
    this.documentHash = hash256(this.uploadDocFile).toString();
    if (this.uploadDocFile) {
      this.isInitiatedAPI = true;
      this.documentService.startDocumentSigning({
        documentHash: this.documentHash,
        documentName: this.uploadDocFile.name
      }).subscribe(uploadedDoc => {
        this.initiatedDocumentResponse = uploadedDoc;
        this.signImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.initiatedDocumentResponse['sigBase64Image']);
        this.docURL = this.initiatedDocumentResponse['url'];
        this.docID = this.initiatedDocumentResponse['documentID'];
        this.isSigningInitialized = true;
        this.isInitiatedAPI = false;
      }, error => {
        this.isSigningInitialized = false;
        this.isInitiatedAPI = false;
      });
    }
  }

  public previousStep(stepNumber) {
    if (stepNumber > 1) {
      this.step--;
    } else {
      this.step = 1;
    }
  }

  public nextStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber < 5) {
      this.step++;
    } else {
      this.step = 1;
    }
  }


  public submitSignatureDoc() {
    this.step = 5;
  }


  // Navigate to DAshoard
  public navigateToDashboard() {
    this.router.navigate(['/dashboard/']);
  }


}
