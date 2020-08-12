import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentSignRoutingModule } from './document-sign-routing.module';
import { DocumentSignComponent } from './document-sign/document-sign.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedModule } from '../common/shared/shared.module';


@NgModule({
  declarations: [DocumentSignComponent],
  imports: [
    CommonModule,
    FormsModule,
    DocumentSignRoutingModule,
    NgxExtendedPdfViewerModule,
    SharedModule,
  ]
})
export class DocumentSignModule { }
