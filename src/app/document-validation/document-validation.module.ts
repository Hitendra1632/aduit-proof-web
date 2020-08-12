import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentValidationRoutingModule } from './document-validation-routing.module';
import { DocumentValidationComponent } from './document-validation/document-validation.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedModule } from '../common/shared/shared.module';


@NgModule({
  declarations: [DocumentValidationComponent],
  imports: [
    CommonModule,
    DocumentValidationRoutingModule,
    NgxExtendedPdfViewerModule,
    SharedModule,
  ]
})
export class DocumentValidationModule { }
