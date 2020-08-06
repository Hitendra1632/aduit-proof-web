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
        onmove: function(event){
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
            event.dy * event.dy)|0) + 'px');
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

  private async showPDFPreview(pdfFile): Promise<void> {
    pdfjsLib.getDocument(pdfFile).promise.then((pdf: PDFDocumentProxy) => {
      console.log('PDF loaded');
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

  // function showCoordinates(){
  //   var validi = [];
  //   var nonValidi = [];
  //
  //
  //   //  var maxHTMLx = $('#the-canvas').width();
  //   // var maxHTMLy = $('#the-canvas').height();
  //   var canvasOffset=$("#the-canvas").offset();
  //   var pageContainer=$("#pageContainer").offset();
  //   var offsetX=canvasOffset.left;
  //   var offsetY=canvasOffset.top;
  //
  //   var maxHTMLx = $('#the-canvas').width();
  //   var maxHTMLy = $('#the-canvas').height();
  //   var paramContainerWidth = $('#parametriContainer').width();
  //
  //   //recupera tutti i placholder validi
  //   $('.drag-drop.can-drop').each(function( index ) {
  //     var x = parseFloat($(this).data("mx"));
  //     var y = parseFloat($(this).data("my"));
  //     var valore = $(this).data("valore");
  //     var descrizione = $(this).find(".descrizione").text();
  //     var id = $(this).data("id");
  //
  //     var x = parseFloat($(this).data("x"));
  //     var y = parseFloat($(this).data("y"));
  //
  //     // var pdfY = y * maxPDFy / maxHTMLy;
  //     var posizioneY = y - 21;
  //     var posizioneX =  x - paramContainerWidth;
  //
  //     // var posizioneY = maxPDFy - y;
  //     // var posizioneX = maxPDFx - x;
  //     var val = {"descrizione": descrizione, "posizioneX": posizioneX, "posizioneY": posizioneY, "valore": valore, "value": id};
  //     validi.push(val);
  //
  //   });
  //   document.querySelector('#imageContainer').innerHTML = '';
  //   pdfcanvas = document.getElementById('the-canvas');
  //   context = pdfcanvas.getContext('2d');
  //   validi.forEach(im => {
  //     var imgObj = new Image();
  //
  //     imgObj.src = "data:image/png;base64,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";
  //     imgObj.onload = function()
  //     {
  //       // test that the image was loaded
  //       context.drawImage(imgObj, im.posizioneX, im.posizioneY,
  //         100,100);
  //     }
  //
  //     // Or at whatever offset you like 
  //   });
  //   document.querySelector('#imageContainer').innerHTML  = '';
  //   setTimeout(function(){
  //     let data = pdfcanvas.toDataURL('png');
  //     let image = new Image()
  //     image.src = data;
  //     document.querySelector('#imageContainer').innerHTML = image.outerHTML;
  //   }, 500);
  //
  //   // // load image from local file
  //   // pdf.imageLoadFromUrl(pdfcanvas.toDataURL('png'));
  //   // // place this mage at given X, Y coordinates on the page
  //   // pdf.imagePlace(20, 40);
  //   // //Usage example:
  //   // urltoFile(pdfcanvas.toDataURL('png'), 'a.png')
  //   // .then(function(file){
  //   //     console.log(file);
  //   // })
  //   if(validi.length == 0){
  //     alert('No placeholder dragged into document');
  //   }
  //   else{
  //     console.log(JSON.stringify(validi));
  //   }
  // }

}


