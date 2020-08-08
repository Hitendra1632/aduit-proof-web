import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../common/service/document.service';
import { DomSanitizer } from '@angular/platform-browser';
const { PDFDocument } = require('pdf-lib');

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
  public pdfArrayBuffer: any;
  public pdfBase64String = '';
  public privateKeyHex = '';
  public initiatedDocumentResponse = {};
  public signImage: any;
  public docURL = '';
  public docID = '';
  public isSigningInitialized = false;
  public isInitiatedAPI = false;

  public signedDocumentHash: any;
  public isFinalSubmit = false;
  public uploadedFileSize = '';

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

    //  ===> Trigger point to convert pdf to base64 and arraybuffer
    //  ===> Needs to call at correct location after completing the overall flow
    if (fileList.length) {
      //Convert PDF to base64
      this.convertPDFToBase64();
    }

    this.documentHash = hash256(this.uploadDocFile).toString();
    // this.uploadedFileSize = (fileList[0].size / (1024 * 1024)).toFixed(2);
    if (fileList[0].size >= 20 * 1024 * 1024) {
      return;
    }

    if (fileList[0].type !== 'application/pdf') {
      return;
    }

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
        this.step = 2; // land user to plugin
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

  /***************************************** Converts PDF to Base64 and Array Buffer **************************************/
  convertPDFToBase64() {
    // Select the very first file from list
    const fileToLoad = this.uploadDocFile;
    // FileReader function for read the file.
    const fileReader = new FileReader();
    let base64;
    // Onload of file read the file content
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target['result'];
      this.convertPDFtoBytes(base64);
    };
    // Convert data to base64
    fileReader.readAsDataURL(fileToLoad);
  }

  convertPDFtoBytes(pdfbase64) {
    this.pdfBase64String = pdfbase64;
    var len = pdfbase64.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = pdfbase64.charCodeAt(i);
    }
    this.pdfArrayBuffer = bytes.buffer;
  }
  /***************************************** Converts PDF to Base64 and Array Buffer **************************************/


  // Temp= downloads the actually uploaded pdf again
  downloadPDF() {
    const blob = new Blob([this.uploadDocFile], { type: '.pdf' });
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = this.uploadDocFile.name;
    downloadLink.target = '_blank';
    downloadLink.click();
    document.body.appendChild(downloadLink);
    downloadLink.parentNode.removeChild(downloadLink);
  }

  /***************************************** Sets PDF Properties and downloads PDF containing metadata **************************************/

  async setDocumentMetadata() {
    const arrayBuffer = await fetch(this.pdfBase64String).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

    // Set all available metadata fields on the PDFDocument. Note that these fields
    // are visible in the "Document Properties" section of most PDF readers.
    pdfDoc.setTitle('ASCII')
    pdfDoc.setAuthor('Humpty Dumpty')
    pdfDoc.setSubject('Jai Ho')
    pdfDoc.setKeywords(['audit', 'wall', 'fall', 'king', 'horses', 'men'])
    pdfDoc.setProducer('PDF App 9000 🤖')
    pdfDoc.setCreator('pdf-lib')
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // Trigger the browser to download the PDF document
    var blob = new Blob([pdfBytes], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = 'pdf-lib_creation_example.pdf';
    link.download = fileName;
    link.click();
  }

}
