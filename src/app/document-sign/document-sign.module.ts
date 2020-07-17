import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentSignRoutingModule } from './document-sign-routing.module';
import { DocumentSignComponent } from './document-sign/document-sign.component';


@NgModule({
  declarations: [DocumentSignComponent],
  imports: [
    CommonModule,
    FormsModule,
    DocumentSignRoutingModule
  ]
})
export class DocumentSignModule { }
