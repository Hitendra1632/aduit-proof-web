import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../common/service/document.service';
import { DomSanitizer } from '@angular/platform-browser';
import interact from 'interactjs';
import {
  PDFJSStatic,
  PDFPageViewport,
  PDFRenderTask,
  PDFDocumentProxy,
  PDFPageProxy
} from 'pdfjs-dist';
const Web3 = require('web3');
const { PDFDocument } = require('pdf-lib');

const hash256 = require('crypto-js/sha256');
const CryptoJS = require('crypto-js');

const PDFJS: PDFJSStatic = require('pdfjs-dist');
declare var jQuery: any;
const wThree = new Web3();

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js';

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

  public pdfSRC = 'assets/ASCII.pdf';
  public previewPDFFile;
  public showPreviewModal = false;
  imgSrc: string;
  imgWidth: number;
  imgHeight: number;
  errorMessage: string;

  /*  *  costanti per i placaholder  */
  public maxPDFx = 595;
  public maxPDFy = 842;
  public offsetY = 7;
  public context: CanvasRenderingContext2D;

  public ethDocumentHash: any;
  public ethSign: any;
  public ethResponseSignature: any;
  public publicKeyHex: any;

  constructor(
    private router: Router,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit() { }

  /********************************** PDF Side ***********************************************************/

  async loadSignaturePlugin(): Promise<void> {
    PDFJS.disableWorker = true;
    try {
      await this.showPDF(this.pdfBase64String);
    } catch (error) {
      this.errorMessage = error;
      // console.log(error);
    }
    interact('.draggable')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
          interact.modifiers.restrict({
            restriction: "#pageContainer",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          })
        ],
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: function (event) {
          var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          // translate the element
          target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

          var mouse_position_x = target.getBoundingClientRect().left;
          var mouse_position_y = target.getBoundingClientRect().top;

          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
          target.setAttribute('data-tx', event.clientX);
          target.setAttribute('data-ty', event.clientY);
          target.setAttribute('data-mx', mouse_position_x);
          target.setAttribute('data-my', mouse_position_y);
        },
        // call this function on every dragend event
        onend: function (event) {
          var textEl = event.target.querySelector('p');

          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(event.dx * event.dx +
              event.dy * event.dy) | 0) + 'px');
        }
      });

    // enable draggables to be dropped into this
    interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      accept: '#yes-drop',
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
          dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        // draggableElement.textContent = 'Dragged in';
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        // event.relatedTarget.textContent = 'Dragged out';
      },
      ondrop: function (event) {
        // event.relatedTarget.textContent = 'Dropped';
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });
  }

  private async showPDF(pdfFile): Promise<void> {
    pdfjsLib.getDocument(pdfFile).promise.then((pdf: PDFDocumentProxy) => {
      // console.log('PDF loaded');
      // Fetch the first page 
      pdf.getPage(1).then(page => {
        // console.log('Page loaded');
        const scale = 1;
        const viewport = page.getViewport({ scale: 2 });
        // Prepare canvas using PDF page dimensions        
        const canvas: HTMLCanvasElement = this.getCanvas(viewport);
        // Render PDF page into canvas context       
        this.createRenderTask(page, canvas, viewport);
        this.setDisplayValues(canvas);
      });
    }, (error) => {
      // PDF loading error 
      // console.error(error);
      this.errorMessage = error;
    });
  }

  private async showPDFPreview(pdfFile): Promise<void> {
    pdfjsLib.getDocument(pdfFile).promise.then((pdf: PDFDocumentProxy) => {
      // console.log('PDF loaded');
      // Fetch the first page 
      pdf.getPage(1).then(page => {
        const scale = 1;
        const viewport = page.getViewport({ scale: 1 });
        // Prepare canvas using PDF page dimensions        
        const canvas: HTMLCanvasElement = this.getCanvas(viewport);
        // Render PDF page into canvas context       
        this.createRenderTask(page, canvas, viewport);
        this.setDisplayValues(canvas);
      });
    }, (error) => {
      // PDF loading error 
      // console.error(error);
      this.errorMessage = error;
    });
  }


  private async getPage(): Promise<PDFPageProxy> {
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument('');
    return await pdf.getPage(1);
  }

  private getCanvas(viewport: PDFPageViewport): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.getElementById('the-canvas') as HTMLCanvasElement;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    return canvas;
  }

  private createRenderTask(page: PDFPageProxy, canvas: HTMLCanvasElement, viewport: PDFPageViewport): PDFRenderTask {
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const task: PDFRenderTask = page.render({
      canvasContext: context,
      viewport: viewport,
    });
    return task;
  }

  private setDisplayValues(canvas: HTMLCanvasElement): void {
    this.imgWidth = canvas.width;
    this.imgHeight = canvas.height;
    this.imgSrc = canvas.toDataURL();
  }

  /*** Step 1 : Document Upload ******/

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
        if (this.pdfBase64String) {
          this.loadSignaturePlugin();
        }
      }, error => {
        this.isSigningInitialized = false;
        this.isInitiatedAPI = false;
      });
    }
  }

  /***  Document Upload ******/

  public previousStep(stepNumber) {

    if (stepNumber === 3) {
      // Going back to Plugin Screen on step2
      if (this.pdfBase64String) {
        this.loadSignaturePlugin();
      }
    }

    if (stepNumber > 1) {
      this.step--;
    } else {
      this.step = 1;
    }
  }

  public nextStep(stepNumber) {
    if (stepNumber === 4) {
      // Get Public Key
      const pKey = wThree.eth.accounts.privateKeyToAccount(this.privateKeyHex);
      this.publicKeyHex = pKey.address;
      // Sign the data
      this.ethSign = wThree.eth.accounts.sign(this.ethDocumentHash, this.privateKeyHex);
      console.log('Create Sign', this.ethSign);
      const eSignature = this.ethSign.signature;
      this.ethResponseSignature = eSignature.substring(2);
      console.log('Response Sign', this.ethResponseSignature);
      this.step++;

    } else {
      if (stepNumber >= 1 && stepNumber < 5) {
        this.step++;
      } else {
        this.step = 1;
      }
    }

  }

  // Final Submit
  public getFinalSubmitParams() {
    return {
      documentHash: this.ethDocumentHash.substring(2),
      documentID: this.docID,
      pubKeyHex: this.publicKeyHex,
      signatureHex: this.ethResponseSignature
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

  hideModal() {
    this.showPreviewModal = false;
  }

  public preview() {
    var validi = [];
    var nonValidi = [];

    debugger;
    //  var maxHTMLx = jQuery('#the-canvas').width();
    // var maxHTMLy = jQuery('#the-canvas').height();
    var canvasOffset = jQuery("#the-canvas").offset();
    var pageContainer = jQuery("#pageContainer").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;

    var maxHTMLx = jQuery('#the-canvas').width();
    var maxHTMLy = jQuery('#the-canvas').height();
    var paramContainerWidth = jQuery('#parametriContainer').width();

    //recupera tutti i placholder validi
    jQuery('.drag-drop.can-drop').each(function (index) {
      var x = parseFloat(jQuery(this).data("mx"));
      var y = parseFloat(jQuery(this).data("my"));
      var valore = jQuery(this).data("valore");
      var descrizione = jQuery(this).find(".descrizione").text();
      var id = jQuery(this).data("id");

      var x = parseFloat(jQuery(this).data("x"));
      var y = parseFloat(jQuery(this).data("y"));

      var data_set = this.dataset

      // var pdfY = y * maxPDFy / maxHTMLy;
      var posizioneY = data_set.y;
      var posizioneX = data_set.x - paramContainerWidth;

      // var posizioneY = maxPDFy - y;
      // var posizioneX = maxPDFx - x;
      var val = { "descrizione": descrizione, "posizioneX": posizioneX, "posizioneY": posizioneY, "valore": valore, "value": id };
      validi.push(val);

    });
    if (validi.length == 0) {
      alert('No placeholder dragged into document');
    }
    else {
      const originalCanvas: HTMLCanvasElement = document.getElementById('the-canvas') as HTMLCanvasElement;

      const previewCanvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
      previewCanvas.width = originalCanvas.width;
      previewCanvas.height = originalCanvas.height;
      const previewContext: CanvasRenderingContext2D = previewCanvas.getContext('2d');
      previewContext.drawImage(originalCanvas, 0, 0);

      validi.forEach(im => {
        var imgObj = new Image();
        // this is sign
        imgObj.src = 'data:image/png;base64,' + this.initiatedDocumentResponse['sigBase64Image'];
        imgObj.onload = function () {
          // test that the image was loaded
          previewContext.drawImage(imgObj, im.posizioneX, im.posizioneY,
            150, 150);
        }
      });

      setTimeout(() => {
        // console.log(previewCanvas.toDataURL('png'));
        this.previewPDFFile = previewCanvas.toDataURL('png');

        if (this.previewPDFFile) {
          this.showPreviewModal = true;
          this.createPDFDocHash();
        }
      }, 1000);

    }
  }

  //0x4ad35a6bf5b857d69a877dd820af2062040322d665be695045d6da8daadbfb28 == priv
  // 0x131EE29Ca685105a6038D35190F1786f7Eef2718 == pub
  // 4edf3fbfbeef74f0eb14e7fd2c5eff94fe885b310fc1e18e97ae758b001e7e1e ==doc
  public createPDFDocHash() {
    const docHash = wThree.utils.keccak256(this.previewPDFFile);
    this.ethDocumentHash = docHash;
  }

  /***************************************** Sets PDF Properties and downloads PDF containing metadata **************************************/

  async setDocumentMetadata() {

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // Embed the PNG image bytes
    const pngImage = await pdfDoc.embedPng(this.previewPDFFile)
    const user = JSON.parse(localStorage.getItem('currentUserDetails'));
    // Set all available metadata fields on the PDFDocument. Note that these fields
    // are visible in the "Document Properties" section of most PDF readers.
    pdfDoc.setTitle(this.docID);
    pdfDoc.setAuthor(user.email);
    pdfDoc.setSubject('AuditProof');
    pdfDoc.setKeywords(['audit', 'AuditProof']);
    pdfDoc.setProducer('AuditProof');
    pdfDoc.setCreator('AuditProof');
    pdfDoc.setCreationDate(new Date());
    pdfDoc.setModificationDate(new Date());

    // Get the width/height of the PNG image scaled original size
    const pngDims = pngImage.scale(1);
    // Add a blank page to the document
    const page = pdfDoc.addPage()
    // Draw the PNG image near the lower right corner of the JPG image
    page.drawImage(pngImage, {
      x: page.getWidth() / 2 - pngDims.width / 2,
      y: page.getHeight() / 2 - pngDims.height / 2,
      width: pngDims.width,
      height: pngDims.height,
    })
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    var blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = this.uploadDocFile.name;
    downloadLink.target = '_blank';
    downloadLink.click();
    document.body.appendChild(downloadLink);
    downloadLink.parentNode.removeChild(downloadLink);
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
