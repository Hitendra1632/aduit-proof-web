import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../common/service/user.service';
import { DocumentService } from '../../common/service/document.service';
import { DomSanitizer } from '@angular/platform-browser';
import interact from 'interactjs';
import { PDFDocument } from 'pdf-lib';
const Web3 = require('web3');
const wThree = new Web3();

@Component({
  selector: 'app-document-validation',
  templateUrl: './document-validation.component.html',
  styleUrls: ['./document-validation.component.scss']
})
export class DocumentValidationComponent implements OnInit {
  @ViewChild(
    'docUploadEle'
  ) docUploadEle: ElementRef | null = null;

  public step = 1;
  public documentID = null;
  public isLoadingDocument = false;
  public signImage: any;
  public signerName = null;

  public uploadDocFile: File;
  public pdfBase64String: any;
  public pdfArrayBuffer: any;
  public metaDataTitle = '';
  public metaDataUser = '';
  public metaDataDate: any;

  public pdfDocHash: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.documentID = params['document-id'];
      if (!this.documentID) {
        // New Record  attempt .. so user will land on first screen
        this.isLoadingDocument = false;
        this.step = 1;
      } else {
        // this.fetchPartialDocument();
      }
    });
  }

  // "NOT IN USE" :: Function to fetch the partially completed document and land the user to plugin screen
  public fetchPartialDocument() {
    this.isLoadingDocument = true;
    this.documentService.getPartialDocument(
      {
        documentID: this.documentID,
        userID: this.userService.currentUserValue.email
      }).subscribe(doc => {
        this.isLoadingDocument = false;
        this.signImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + doc.sigBase64Image);
        this.signerName = doc.signerName;
        this.step = 2; // Directly load the plugin
      }, error => {
        this.isLoadingDocument = false;
        this.step = 1;
      })
  }


  onUploadDocChange(event) {
    const fileList: FileList = event.target.files;
    this.uploadDocFile = fileList[0];
    // this.uploadedFileSize = (fileList[0].size / (1024 * 1024)).toFixed(2);

    if (fileList.length) {
      //Convert PDF to base64
      this.convertPDFToBase64();
    }

    if (fileList[0].size >= 20 * 1024 * 1024) {
      return;
    }

    if (fileList[0].type !== 'application/pdf') {
      return;
    }

    // if (this.uploadDocFile) {
    //   this.step = 2;
    // }
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
    const dHAsh = wThree.utils.keccak256(pdfbase64);
    this.pdfDocHash = dHAsh.substring(2);
    var len = pdfbase64.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = pdfbase64.charCodeAt(i);
    }
    this.pdfArrayBuffer = bytes.buffer;

    setTimeout(() => {
      this.readFileMetaData();
    }, 1000);
  }

  async readFileMetaData() {
    const arrayBuffer = await fetch(this.pdfBase64String).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true, updateMetadata: false });

    this.metaDataTitle = pdfDoc.getTitle();
    this.metaDataUser = pdfDoc.getAuthor();
    this.metaDataDate = pdfDoc.getModificationDate();
    // Print all available metadata fields
    console.log('Title:', pdfDoc.getTitle())
    console.log('Author:', pdfDoc.getAuthor())
    console.log('Subject:', pdfDoc.getSubject())
    console.log('Creator:', pdfDoc.getCreator())
    console.log('Keywords:', pdfDoc.getKeywords())
    console.log('Producer:', pdfDoc.getProducer())
    console.log('Creation Date:', pdfDoc.getCreationDate())
    console.log('Modification Date:', pdfDoc.getModificationDate())
  }
  /***************************************** Converts PDF to Base64 and Array Buffer **************************************/

  // Final Submit
  public getParams() {
    return {
      documentHash: this.pdfDocHash,
      documentID: this.metaDataTitle,
      userID: this.metaDataUser,
    }
  }

  public validateDocument() {
    this.step = 2;
    this.documentService.validateSignedDocument(this.getParams()).subscribe(response => {
      console.log(response);
    }, error => {
    })
  }

  // Navigate to DAshoard
  public navigateToDashboard() {
    this.router.navigate(['/dashboard/']);
  }

  public navigateToDefaultScreen() {
    if (localStorage.getItem('currentUserDetails')) {
      // User is already logged in .. send to dashboard
      this.router.navigate(['/dashboard/']);
    } else {
      // User is not logged in .. send to WElcome Screen
      this.router.navigate(['welcome']);
    }
  }
}
