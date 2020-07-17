import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../common/service/document.service';
import { DomSanitizer } from '@angular/platform-browser';

const hash256 = require('crypto-js/sha256');
const CryptoJS = require('crypto-js');

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
  public documentHash: any; // initial document hash
  public privateKeyHex = '';
  public initiatedDocumentResponse = {};
  public signImage: any;
  public docURL = '';
  public docID = '';
  public isSigningInitialized = false;
  public isInitiatedAPI = false;

  public signedDocumentHash: any;
  public isFinalSubmit = false;

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
    
    // let hexhash = hash256(this.uploadDocFile).toString(CryptoJS.enc.hex).toUpperCase();
    // hexhash = hexhash.replace(/(\S{2})/g, "$1-");
    // hexhash = hexhash.replace(/-$/, "");
    // console.log(hexhash);
    // console.log(this.documentHash);

    this.signedDocumentHash = this.documentHash; // temporary assigned initial doc has
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


  // Final Submit
  public getFinalSubmitParams() {
    return {
      documentHash: this.signedDocumentHash,
      documentID: this.docID,
      pubKeyHex: this.privateKeyHex,
      signatureHex: this.initiatedDocumentResponse['sigBase64Image']
    }
  }

  public submitSignatureDoc() {
    this.isFinalSubmit = true;
    this.documentService.submitSignedDocument(this.getFinalSubmitParams()).subscribe(response => {
      this.step = 5;
      this.isFinalSubmit = false;
    }, error => {
      this.isFinalSubmit = false;
    })
  }


  // Navigate to DAshoard
  public navigateToDashboard() {
    this.router.navigate(['/dashboard/']);
  }


}
