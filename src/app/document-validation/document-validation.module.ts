import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentValidationRoutingModule } from './document-validation-routing.module';
import { DocumentValidationComponent } from './document-validation/document-validation.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@NgModule({
  declarations: [DocumentValidationComponent],
  imports: [
    CommonModule,
    DocumentValidationRoutingModule,
    NgxExtendedPdfViewerModule,

  ]
})
export class DocumentValidationModule { }
