import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentSignRoutingModule } from './document-sign-routing.module';
import { DocumentSignComponent } from './document-sign/document-sign.component';


@NgModule({
  declarations: [DocumentSignComponent],
  imports: [
    CommonModule,
    DocumentSignRoutingModule
  ]
})
export class DocumentSignModule { }
