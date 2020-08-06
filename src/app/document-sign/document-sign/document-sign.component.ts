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

const hash256 = require('crypto-js/sha256');
const CryptoJS = require('crypto-js');

const PDFJS: PDFJSStatic = require('pdfjs-dist');
declare var jQuery: any;
declare const window: any;
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
  public step = 2;
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
  public uploadedFileSize = '';

  public pdfSRC = 'assets/ASCII.pdf';
  imgSrc: string;
  imgWidth: number;
  imgHeight: number;
  errorMessage: string;

  /*  *  costanti per i placaholder  */
  public maxPDFx = 595;
  public maxPDFy = 842;
  public offsetY = 7;
  public context: CanvasRenderingContext2D;

  constructor(
    private router: Router,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer

  ) { }

  async ngOnInit(): Promise<void> {
    PDFJS.disableWorker = true;
    try {
      await this.showPDF(this.pdfSRC);
    } catch (error) {
      this.errorMessage = error;
      console.log(error);
    }
    window.dragMoveListener = dragMoveListener;
  }

  /********************************** PDF Side ***********************************************************/
  private async showPDF(pdfFile): Promise<void> {
    pdfjsLib.getDocument(pdfFile).promise.then((pdf: PDFDocumentProxy) => {
      console.log('PDF loaded');
      // Fetch the first page 
      pdf.getPage(1).then(page => {
        console.log('Page loaded');
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
      console.error(error);
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

  /******************************************   Draggable  **************************************************************************/
  function dragMoveListener (event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.setAttribute('data-tx', event.x0);
    target.setAttribute('data-ty', event.y0);
  }


  dragMoveListener(event) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes  
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element  
    target.style.webkitTransform =
      target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    // update the posiion attributes 
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  showCoordinates() {
    const validi = [];
    const nonValidi = [];
    const dCanvas: HTMLCanvasElement = document.getElementById('the-canvas') as HTMLCanvasElement;
    const maxHTMLx = dCanvas.width;
    const maxHTMLy = dCanvas.height;
    const paramContainerWidth = jQuery('#parametriContainer').width();
    const $this = this;
    console.log(jQuery('.drag-drop.can-drop').length);
    // recupera tutti i placholder validi  
    jQuery('.drag-drop.can-drop').each((index) => {
      console.log(jQuery($this).data('x'));
      const x = parseFloat(jQuery($this).data('x'));
      const y = parseFloat(jQuery($this).data('y'));
      const valore = jQuery($this).data('valore');
      const descrizione = jQuery($this).find('.descrizione').text();
      const pdfY = y * $this.maxPDFy / maxHTMLy;
      const posizioneY = $this.maxPDFy - $this.offsetY - pdfY;
      const posizioneX = (x * $this.maxPDFx / maxHTMLx) - paramContainerWidth;
      const val = {
        'descrizione': descrizione,
        'posizioneX': posizioneX,
        'posizioneY': posizioneY,
        'valore': valore
      };
      validi.push(val);
    });

    if (validi.length === 0) {
      alert('No placeholder dragged into document');
    } else {
      // alert(JSON.stringify(validi));     
      const pdfcanvas: HTMLCanvasElement = document.getElementById('the-canvas') as HTMLCanvasElement;
      $this.context = pdfcanvas.getContext('2d');
      const img = new Image();
      img.onload = (event) => {
        const loadedImage = event.currentTarget;
        validi.forEach(im => {
          $this.context.drawImage(im.descrizione, im.posizioneX, im.posizioneY,
            loadedImage['width'], loadedImage['height']);
          // Or at whatever offset you like 
        });
      };
      console.log(pdfcanvas.toDataURL('png'));
    }
  }

  /******************************************   Draggable  **************************************************************************/

  onUploadDocChange(event) {
    const fileList: FileList = event.target.files;
    this.uploadDocFile = fileList[0];
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

}
